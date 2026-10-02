import { describe, it, expect, jest, beforeAll, beforeEach } from '@jest/globals'

const findUnique = jest.fn()
const create = jest.fn()
const update = jest.fn()
const previewJournalResolution = jest.fn()

jest.unstable_mockModule('#prisma/client', () => ({
  __esModule: true,
  default: {
    chatbot_journal_names: { findUnique, create, update }
  }
}))

jest.unstable_mockModule('#services/ai/openAlex.service', () => ({
  __esModule: true,
  OpenAlexService: { previewJournalResolution }
}))

let CreateJournalNameService
let UpdateJournalNameService

beforeAll(async () => {
  ;({ CreateJournalNameService } = await import('#services/chatbot/admin/createJournalNameService'))
  ;({ UpdateJournalNameService } = await import('#services/chatbot/admin/updateJournalNameService'))
})

describe('CreateJournalNameService', () => {
  beforeEach(() => jest.clearAllMocks())

  it('throws if the name is blank', async () => {
    await expect(CreateJournalNameService.call({ name: '   ' })).rejects.toThrow('Journal name is required')
    expect(create).not.toHaveBeenCalled()
  })

  it('throws if the journal name already exists', async () => {
    findUnique.mockResolvedValue({ id: 1, name: 'MDPI' })

    await expect(CreateJournalNameService.call({ name: 'MDPI' })).rejects.toThrow('Journal name already exists')
  })

  it('creates the journal and surfaces an OpenAlex warning for a bad entry like "MDPI"', async () => {
    findUnique.mockResolvedValue(null)
    create.mockResolvedValue({ id: 1, name: 'MDPI', is_active: true })
    previewJournalResolution.mockResolvedValue({
      resolved: false,
      warning: 'Nama "MDPI" tidak cocok dengan jurnal/konferensi apa pun di OpenAlex.'
    })

    const result = await CreateJournalNameService.call({ name: 'MDPI' })

    expect(create).toHaveBeenCalledWith({ data: { name: 'MDPI' } })
    expect(previewJournalResolution).toHaveBeenCalledWith('MDPI')
    expect(result.resolution.resolved).toBe(false)
    expect(result.resolution.warning).toMatch(/MDPI/)
  })

  it('creates the journal with no warning for a real, resolvable journal name', async () => {
    findUnique.mockResolvedValue(null)
    create.mockResolvedValue({ id: 2, name: 'Nutrients', is_active: true })
    previewJournalResolution.mockResolvedValue({
      resolved: true, matchedName: 'Nutrients', sourceType: 'journal', worksCount: 500, warning: null
    })

    const result = await CreateJournalNameService.call({ name: 'Nutrients' })

    expect(result.resolution.resolved).toBe(true)
    expect(result.resolution.warning).toBeNull()
  })

  it('still creates the journal if the OpenAlex preview call itself throws', async () => {
    findUnique.mockResolvedValue(null)
    create.mockResolvedValue({ id: 3, name: 'Nutrients', is_active: true })
    previewJournalResolution.mockRejectedValue(new Error('network down'))

    const result = await CreateJournalNameService.call({ name: 'Nutrients' })

    expect(result.name).toBe('Nutrients')
    expect(result.resolution).toBeNull()
  })
})

describe('UpdateJournalNameService', () => {
  beforeEach(() => jest.clearAllMocks())

  it('throws if the journal does not exist', async () => {
    findUnique.mockResolvedValue(null)

    await expect(UpdateJournalNameService.call({ id: 1, name: 'X' })).rejects.toThrow('Journal not found')
  })

  it('re-previews resolution when the name is changed', async () => {
    findUnique.mockResolvedValue({ id: 1, name: 'Old Name' })
    update.mockResolvedValue({ id: 1, name: 'MDPI' })
    previewJournalResolution.mockResolvedValue({ resolved: false, warning: 'no match' })

    const result = await UpdateJournalNameService.call({ id: 1, name: 'MDPI' })

    expect(previewJournalResolution).toHaveBeenCalledWith('MDPI')
    expect(result.resolution.resolved).toBe(false)
  })

  it('does not call OpenAlex when only is_active is toggled (name unchanged)', async () => {
    findUnique.mockResolvedValue({ id: 1, name: 'Nutrients' })
    update.mockResolvedValue({ id: 1, name: 'Nutrients', is_active: false })

    const result = await UpdateJournalNameService.call({ id: 1, is_active: false })

    expect(previewJournalResolution).not.toHaveBeenCalled()
    expect(result.resolution).toBeNull()
  })
})
