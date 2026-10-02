import { describe, it, expect, jest, beforeAll, beforeEach } from '@jest/globals'

const findUnique = jest.fn()
const create = jest.fn()
const update = jest.fn()
const previewJournalResolution = jest.fn()

jest.unstable_mockModule('#prisma/client', () => ({
  __esModule: true,
  default: {
    skripsi_journal_names: { findUnique, create, update }
  }
}))

jest.unstable_mockModule('#services/ai/openAlex.service', () => ({
  __esModule: true,
  OpenAlexService: { previewJournalResolution }
}))

let CreateSkripsiJournalNameService
let UpdateSkripsiJournalNameService

beforeAll(async () => {
  ;({ CreateSkripsiJournalNameService } = await import('#services/skripsi/admin/createSkripsiJournalNameService'))
  ;({ UpdateSkripsiJournalNameService } = await import('#services/skripsi/admin/updateSkripsiJournalNameService'))
})

describe('CreateSkripsiJournalNameService', () => {
  beforeEach(() => jest.clearAllMocks())

  it('throws if the name is blank', async () => {
    await expect(CreateSkripsiJournalNameService.call({ name: '   ' })).rejects.toThrow('Journal name is required')
    expect(create).not.toHaveBeenCalled()
  })

  it('throws if the journal name already exists', async () => {
    findUnique.mockResolvedValue({ id: 1, name: 'MDPI' })

    await expect(CreateSkripsiJournalNameService.call({ name: 'MDPI' })).rejects.toThrow('Journal name already exists')
  })

  it('creates the journal and surfaces an OpenAlex warning for a bad entry like "MDPI"', async () => {
    findUnique.mockResolvedValue(null)
    create.mockResolvedValue({ id: 1, name: 'MDPI', is_active: true })
    previewJournalResolution.mockResolvedValue({
      resolved: false,
      warning: 'Nama "MDPI" tidak cocok dengan jurnal/konferensi apa pun di OpenAlex.'
    })

    const result = await CreateSkripsiJournalNameService.call({ name: 'MDPI' })

    expect(create).toHaveBeenCalledWith({ data: { name: 'MDPI' } })
    expect(previewJournalResolution).toHaveBeenCalledWith('MDPI')
    expect(result.resolution.resolved).toBe(false)
    expect(result.resolution.warning).toMatch(/MDPI/)
  })

  it('still creates the journal if the OpenAlex preview call itself throws', async () => {
    findUnique.mockResolvedValue(null)
    create.mockResolvedValue({ id: 3, name: 'Nutrients', is_active: true })
    previewJournalResolution.mockRejectedValue(new Error('network down'))

    const result = await CreateSkripsiJournalNameService.call({ name: 'Nutrients' })

    expect(result.name).toBe('Nutrients')
    expect(result.resolution).toBeNull()
  })
})

describe('UpdateSkripsiJournalNameService', () => {
  beforeEach(() => jest.clearAllMocks())

  it('throws if the journal does not exist', async () => {
    findUnique.mockResolvedValue(null)

    await expect(UpdateSkripsiJournalNameService.call({ id: 1, name: 'X' })).rejects.toThrow('Journal not found')
  })

  it('re-previews resolution when the name is changed', async () => {
    findUnique.mockResolvedValue({ id: 1, name: 'Old Name' })
    update.mockResolvedValue({ id: 1, name: 'MDPI' })
    previewJournalResolution.mockResolvedValue({ resolved: false, warning: 'no match' })

    const result = await UpdateSkripsiJournalNameService.call({ id: 1, name: 'MDPI' })

    expect(previewJournalResolution).toHaveBeenCalledWith('MDPI')
    expect(result.resolution.resolved).toBe(false)
  })

  it('does not call OpenAlex when only is_active is toggled (name unchanged)', async () => {
    findUnique.mockResolvedValue({ id: 1, name: 'Nutrients' })
    update.mockResolvedValue({ id: 1, name: 'Nutrients', is_active: false })

    const result = await UpdateSkripsiJournalNameService.call({ id: 1, is_active: false })

    expect(previewJournalResolution).not.toHaveBeenCalled()
    expect(result.resolution).toBeNull()
  })
})
