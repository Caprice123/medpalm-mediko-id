import { CreateSkripsiCitationV2Service } from '#services/skripsi/v2/citations/createSkripsiCitationV2Service'
import { GetSkripsiCitationsV2Service } from '#services/skripsi/v2/citations/getSkripsiCitationsV2Service'
import { UpdateSkripsiCitationV2Service } from '#services/skripsi/v2/citations/updateSkripsiCitationV2Service'
import { DeleteSkripsiCitationV2Service } from '#services/skripsi/v2/citations/deleteSkripsiCitationV2Service'
import { GenerateSkripsiBibliographyV2Service } from '#services/skripsi/v2/citations/generateSkripsiBibliographyV2Service'
import { SkripsiCitationV2Serializer } from '#serializers/api/v2/skripsiCitationSerializer'
import { SkripsiSectionV2Serializer } from '#serializers/api/v2/skripsiSectionSerializer'
import { CITATION_STYLES, CITATION_STYLE_LABELS } from '#services/skripsi/v2/citations/citationFormats'

class SkripsiCitationsV2Controller {
  // The kept sources, the style the report generates in, and the styles the
  // dropdown offers — the panel is built from one read.
  async index(req, res) {
    const { citations, style } = await GetSkripsiCitationsV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
    })

    return res.status(200).json({
      data: SkripsiCitationV2Serializer.serialize(citations, style),
      meta: {
        style,
        styles: CITATION_STYLES.map(value => ({ value, label: CITATION_STYLE_LABELS[value] })),
      },
    })
  }

  async create(req, res) {
    const { title, url, date } = req.body

    const citation = await CreateSkripsiCitationV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      title,
      url,
      date,
    })

    return res.status(201).json({ data: SkripsiCitationV2Serializer.serializeOne(citation) })
  }

  async update(req, res) {
    const citation = await UpdateSkripsiCitationV2Service.call({
      citationId: req.params.citationId,
      userId: req.user.id,
      ...req.body,
    })

    return res.status(200).json({ data: SkripsiCitationV2Serializer.serializeOne(citation) })
  }

  async destroy(req, res) {
    await DeleteSkripsiCitationV2Service.call({
      citationId: req.params.citationId,
      userId: req.user.id,
    })

    return res.status(200).json({ data: { success: true } })
  }

  // The updated section comes back with the response so the editor can swap
  // the reference section's content without re-reading the whole document.
  async generate(req, res) {
    const { style, append } = req.body

    const result = await GenerateSkripsiBibliographyV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      style,
      append: Boolean(append),
    })

    return res.status(200).json({
      data: {
        section: SkripsiSectionV2Serializer.serializeOne(result.section),
        style: result.style,
        count: result.count,
      },
    })
  }
}

export default new SkripsiCitationsV2Controller()
