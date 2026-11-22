import { GetSkripsiSectionsV2Service } from '#services/skripsi/v2/getSkripsiSectionsV2Service'
import { CreateSkripsiSectionV2Service } from '#services/skripsi/v2/createSkripsiSectionV2Service'
import { UpdateSkripsiSectionV2Service } from '#services/skripsi/v2/updateSkripsiSectionV2Service'
import { DeleteSkripsiSectionV2Service } from '#services/skripsi/v2/deleteSkripsiSectionV2Service'
import { ReorderSkripsiSectionsV2Service } from '#services/skripsi/v2/reorderSkripsiSectionsV2Service'
import { EditSectionTextV2Service } from '#services/skripsi/v2/editSectionTextV2Service'
import { SectionAssistantV2Service } from '#services/skripsi/v2/sectionAssistantV2Service'
import { SkripsiSectionV2Serializer } from '#serializers/api/v2/skripsiSectionSerializer'

class SkripsiSectionsV2Controller {
  async index(req, res) {
    const sections = await GetSkripsiSectionsV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
    })

    return res.status(200).json({ data: SkripsiSectionV2Serializer.serialize(sections) })
  }

  async create(req, res) {
    const { title, afterPosition } = req.body

    const section = await CreateSkripsiSectionV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      title,
      afterPosition,
    })

    return res.status(201).json({ data: SkripsiSectionV2Serializer.serializeOne(section) })
  }

  // The editor autosaves each section on its own, so this is the hottest write
  // in the feature.
  async update(req, res) {
    const { title, content } = req.body

    const section = await UpdateSkripsiSectionV2Service.call({
      sectionId: req.params.sectionId,
      userId: req.user.id,
      title,
      content,
    })

    return res.status(200).json({ data: SkripsiSectionV2Serializer.serializeOne(section) })
  }

  async destroy(req, res) {
    await DeleteSkripsiSectionV2Service.call({
      sectionId: req.params.sectionId,
      userId: req.user.id,
    })

    return res.status(200).json({ data: { success: true } })
  }

  // "Edit dengan AI" on a selection inside one section's editor. The revision
  // is returned, never saved: replacing the text is the student's click.
  async aiEdit(req, res) {
    const { selectedText, instruction } = req.body

    const result = await EditSectionTextV2Service.call({
      sectionId: req.params.sectionId,
      userId: req.user.id,
      selectedText,
      instruction,
    })

    return res.status(200).json({ data: result })
  }

  // The section assistant: the same one-result-at-a-time contract as aiEdit,
  // but it also takes a mode (rewrite an existing selection, or draft a
  // section that is still empty) and the context the student attached. Like
  // aiEdit it returns the text and saves nothing.
  async assist(req, res) {
    const { mode, selectedText, instruction, context } = req.body

    const result = await SectionAssistantV2Service.call({
      sectionId: req.params.sectionId,
      userId: req.user.id,
      mode,
      selectedText,
      instruction,
      context,
    })

    return res.status(200).json({ data: result })
  }

  async reorder(req, res) {
    const sections = await ReorderSkripsiSectionsV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      sectionIds: req.body.sectionIds,
    })

    return res.status(200).json({ data: SkripsiSectionV2Serializer.serialize(sections) })
  }
}

export default new SkripsiSectionsV2Controller()
