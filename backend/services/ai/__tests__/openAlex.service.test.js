import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'

describe('OpenAlexService', () => {
  let OpenAlexService
  let fetchMock

  beforeEach(async () => {
    jest.resetModules()
    fetchMock = jest.fn()
    global.fetch = fetchMock
    ;({ OpenAlexService } = await import('#services/ai/openAlex.service'))
  })

  afterEach(() => {
    delete global.fetch
  })

  describe('resolveSourceCandidate', () => {
    it('rejects a publisher name (e.g. "MDPI") whose top matches are an ebook platform and a repository', async () => {
      // Real shape of the OpenAlex response for the "MDPI" query — neither
      // match is a journal, so no work in OpenAlex is actually indexed
      // under either source as an article.
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { id: 'https://openalex.org/S4306463611', display_name: 'MDPI eBooks', type: 'ebook platform', works_count: 50000 },
            { id: 'https://openalex.org/S4306400947', display_name: 'MDPI (MDPI AG)', type: 'repository', works_count: 20000 }
          ]
        })
      })

      const candidate = await OpenAlexService.resolveSourceCandidate('MDPI')

      expect(candidate).toBeNull()
      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('resolves a real journal name to its OpenAlex source id', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { id: 'https://openalex.org/S137773608', display_name: 'The Lancet', type: 'journal', works_count: 100000 }
          ]
        })
      })

      const candidate = await OpenAlexService.resolveSourceCandidate('The Lancet')

      expect(candidate).toEqual({ id: 'S137773608', displayName: 'The Lancet', type: 'journal', worksCount: 100000 })
    })

    it('ignores a higher-ranked non-journal match and picks the journal-type candidate instead', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { id: 'https://openalex.org/S1', display_name: 'Some Repository', type: 'repository', works_count: 999999 },
            { id: 'https://openalex.org/S2', display_name: 'Nutrients', type: 'journal', works_count: 500 }
          ]
        })
      })

      const candidate = await OpenAlexService.resolveSourceCandidate('Nutrients')

      expect(candidate.id).toBe('S2')
      expect(candidate.type).toBe('journal')
    })

    it('picks the highest-works_count journal when multiple journal-type matches are returned', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { id: 'https://openalex.org/S1', display_name: 'Small Journal', type: 'journal', works_count: 10 },
            { id: 'https://openalex.org/S2', display_name: 'Big Journal', type: 'journal', works_count: 9999 }
          ]
        })
      })

      const candidate = await OpenAlexService.resolveSourceCandidate('Journal')

      expect(candidate.id).toBe('S2')
    })

    it('returns null without throwing when the Sources API call fails', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 })

      const candidate = await OpenAlexService.resolveSourceCandidate('Broken')

      expect(candidate).toBeNull()
    })

    it('returns null without throwing when fetch itself rejects', async () => {
      fetchMock.mockRejectedValueOnce(new Error('network down'))

      const candidate = await OpenAlexService.resolveSourceCandidate('Unreachable')

      expect(candidate).toBeNull()
    })

    it('caches a resolved candidate so a repeated (case-insensitive) lookup skips the API', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 'https://openalex.org/S1', display_name: 'Cached Journal', type: 'journal', works_count: 5 }]
        })
      })

      await OpenAlexService.resolveSourceCandidate('Cached Journal')
      await OpenAlexService.resolveSourceCandidate('cached journal')

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('caches a rejection (no filterable match) so it does not retry every call', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 'https://openalex.org/S1', display_name: 'MDPI eBooks', type: 'ebook platform', works_count: 1 }]
        })
      })

      await OpenAlexService.resolveSourceCandidate('MDPI')
      await OpenAlexService.resolveSourceCandidate('MDPI')

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('resolveSourceIds', () => {
    it('drops names with no filterable match while keeping names that resolve', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [{ id: 'https://openalex.org/S1', display_name: 'MDPI eBooks', type: 'ebook platform', works_count: 1 }]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            results: [{ id: 'https://openalex.org/S2', display_name: 'Nutrients', type: 'journal', works_count: 500 }]
          })
        })

      const ids = await OpenAlexService.resolveSourceIds(['MDPI', 'Nutrients'])

      expect(ids).toEqual(['S2'])
    })

    it('returns an empty array without calling fetch for empty input', async () => {
      const ids = await OpenAlexService.resolveSourceIds([])

      expect(ids).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  describe('previewJournalResolution', () => {
    it('returns an Indonesian warning naming the publisher when nothing filterable resolves (regression test for the MDPI bug)', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 'https://openalex.org/S1', display_name: 'MDPI eBooks', type: 'ebook platform', works_count: 1 }]
        })
      })

      const preview = await OpenAlexService.previewJournalResolution('MDPI')

      expect(preview.resolved).toBe(false)
      expect(preview.warning).toContain('MDPI')
    })

    it('reports a clean resolution for a real journal with indexed works', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 'https://openalex.org/S1', display_name: 'Nutrients', type: 'journal', works_count: 500 }]
        })
      })

      const preview = await OpenAlexService.previewJournalResolution('Nutrients')

      expect(preview).toEqual({
        resolved: true,
        matchedName: 'Nutrients',
        sourceType: 'journal',
        worksCount: 500,
        warning: null
      })
    })

    it('warns when the matched journal has zero indexed works', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ id: 'https://openalex.org/S1', display_name: 'Empty Journal', type: 'journal', works_count: 0 }]
        })
      })

      const preview = await OpenAlexService.previewJournalResolution('Empty Journal')

      expect(preview.resolved).toBe(true)
      expect(preview.warning).toContain('Empty Journal')
    })
  })

  describe('listJournals', () => {
    it('browses alphabetically when no query is given, applying the journal/conference type filter', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            { id: 'https://openalex.org/S1', display_name: 'Acta Scientiarum', type: 'journal', works_count: 100000, host_organization_name: 'Elsevier' },
            { id: 'https://openalex.org/S2', display_name: 'Nature', type: 'journal', works_count: 90000, host_organization_name: 'Springer Nature' }
          ]
        })
      })

      const result = await OpenAlexService.listJournals({ page: 1, perPage: 10 })

      const calledUrl = fetchMock.mock.calls[0][0]
      expect(calledUrl).toContain('filter=type%3Ajournal%7Cconference')
      expect(calledUrl).toContain('sort=display_name')
      expect(result.data).toEqual([
        { id: 'S1', name: 'Acta Scientiarum', type: 'journal', worksCount: 100000, publisher: 'Elsevier' },
        { id: 'S2', name: 'Nature', type: 'journal', worksCount: 90000, publisher: 'Springer Nature' }
      ])
      expect(result.pagination).toEqual({ page: 1, perPage: 10, isLastPage: true })
    })

    it('combines the type filter with a name search and does not force a sort', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) })

      await OpenAlexService.listJournals({ query: 'Dentistry', page: 1, perPage: 10 })

      const calledUrl = fetchMock.mock.calls[0][0]
      expect(calledUrl).toContain('filter=type%3Ajournal%7Cconference%2Cdisplay_name.search%3ADentistry')
      expect(calledUrl).not.toContain('sort=')
    })

    it('derives isLastPage from the perPage+1 over-fetch, without ever returning the extra item', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: Array.from({ length: 3 }, (_, i) => ({
            id: `https://openalex.org/S${i}`, display_name: `Journal ${i}`, type: 'journal', works_count: 10 - i
          }))
        })
      })

      const result = await OpenAlexService.listJournals({ page: 1, perPage: 2 })

      expect(result.data).toHaveLength(2)
      expect(result.pagination.isLastPage).toBe(false)
    })

    it('returns an empty, last-page result without throwing when the API call fails', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 })

      const result = await OpenAlexService.listJournals({ query: 'anything' })

      expect(result).toEqual({ data: [], pagination: { page: 1, perPage: 10, isLastPage: true } })
    })
  })

  describe('search', () => {
    it('filters works by type:article and the resolved source id', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      })

      await OpenAlexService.search('oral mucosa', { sourceIds: ['S2'], limit: 5 })

      const calledUrl = fetchMock.mock.calls[0][0]
      expect(calledUrl).toContain('type%3Aarticle')
      expect(calledUrl).toContain('primary_location.source.id%3AS2')
    })

    it('throws a descriptive error when the Works API call fails', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'rate limited' })

      await expect(OpenAlexService.search('x')).rejects.toThrow('OpenAlex API error 429')
    })
  })
})
