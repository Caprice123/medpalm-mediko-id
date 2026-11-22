import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { V2_TAB_TYPES, V2_TAB_TITLES, sortV2Tabs } from '#services/skripsi/v2/skripsiTabsV2'

const DEFAULT_TITLE = 'Laporan PBL Baru'
const MAX_MEMBERS = 30

// Which section the case text is dropped into. A PBL outline almost always
// opens with one, under one of these names; when none matches, the case still
// gets a section of its own so it is never only stored out of sight.
const CASE_SECTION_PATTERN = /skenario|kasus/i
const CASE_SECTION_TITLE = 'Skenario'

// Every report opens with a cover and closes with the bibliography, whatever
// outline is in between — a template only describes the body. A template that
// already names one of the two keeps its own wording rather than getting a
// second copy.
const COVER_SECTION_PATTERN = /cover|sampul|halaman judul/i
const COVER_SECTION_TITLE = 'Cover'
const REFERENCE_SECTION_PATTERN = /referensi|daftar pustaka|pustaka/i
const REFERENCE_SECTION_TITLE = 'Referensi'

const escapeHtml = (text) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

// The case text is typed into a plain textarea, so it is turned into paragraphs
// before it reaches an editor that reads HTML.
const caseToHtml = (caseText) => caseText
  .split(/\n{2,}/)
  .map(block => `<p>${escapeHtml(block.trim()).replace(/\n/g, '<br />')}</p>`)
  .join('')

// The cover is written as ordinary editor content rather than generated at
// export time, so a student can lay it out however their faculty wants it —
// add a logo, a supervisor, a date — instead of being stuck with one format.
const coverToHtml = (title, members) => [
  `<h1>${escapeHtml(title)}</h1>`,
  members.length > 0 ? '<p><strong>Disusun oleh:</strong></p>' : '',
  ...members.map(member => (
    `<p>${escapeHtml(member.name)}${member.studentNumber ? ` — ${escapeHtml(member.studentNumber)}` : ''}</p>`
  )),
].filter(Boolean).join('')

// V2 creates a report from a template rather than from a title+description
// form: the chosen template's outline is stamped onto the new report as its
// sections, the PBL case is written into the section that holds it, and the
// group is recorded for the cover.
//
// The report is built here rather than through V1's create service because the
// two no longer agree on what a report is made of: V1 builds a tab per enabled
// constant (three researchers plus a paraphraser), V2 always builds the same
// three panels. V1's service is untouched and still serves /api/v1/skripsi.
export class CreateSkripsiSetV2Service extends BaseService {
  static async call({
    userId,
    title,
    description,
    templateId = null,
    workMode = 'manual',
    caseText = '',
    members = [],
  }) {
    if (!['manual', 'generate'].includes(workMode)) {
      throw new ValidationError('Cara mengerjakan tidak valid')
    }

    if (members && members.length > MAX_MEMBERS) {
      throw new ValidationError(`Anggota kelompok maksimal ${MAX_MEMBERS} orang`)
    }

    // A student's own template is theirs alone; an admin template (no owner)
    // is available to everyone.
    const template = templateId
      ? await prisma.skripsi_templates.findFirst({
        where: {
          id: parseInt(templateId),
          is_active: true,
          OR: [{ owner_user_id: null }, { owner_user_id: userId }],
        },
        include: { sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } },
      })
      : null

    if (templateId && !template) {
      throw new ValidationError('Template tidak ditemukan')
    }

    const trimmedCase = caseText?.trim() || ''

    const set = await prisma.skripsi_sets.create({
      data: {
        user_id: userId,
        title: title?.trim() || template?.name || DEFAULT_TITLE,
        description: description?.trim() || null,
        case_text: trimmedCase || null,
        template_id: template?.id ?? null,
        work_mode: workMode,
        editor_content: '',
        tabs: {
          create: V2_TAB_TYPES.map(type => ({
            tab_type: type,
            title: V2_TAB_TITLES[type],
            content: '',
          })),
        },
      },
    })

    // The cover needs the kelompok, so the list is cleaned once and used by
    // both writes.
    const cleanMembers = this.cleanMembers(members)

    await this.createSections({ setId: set.id, template, caseText: trimmedCase, title: set.title, members: cleanMembers })
    await this.createMembers({ setId: set.id, members: cleanMembers })

    const full = await prisma.skripsi_sets.findUnique({
      where: { id: set.id },
      include: {
        tabs: true,
        sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
        members: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
      },
    })

    return { ...full, tabs: sortV2Tabs(full.tabs) }
  }

  // The outline a new report starts with: a cover, the template's body (with
  // the PBL case written into whichever section holds it), and the reference
  // section last.
  static async createSections({ setId, template, caseText, title, members }) {
    const outline = template?.sections?.map(section => ({
      title: section.title,
      content: '',
    })) ?? []

    if (caseText) {
      const caseHtml = caseToHtml(caseText)
      const target = outline.find(section => CASE_SECTION_PATTERN.test(section.title))

      // No template (or a template with no scenario section) still gets one, so
      // the case is never only stored out of sight.
      if (target) target.content = caseHtml
      else outline.unshift({ title: CASE_SECTION_TITLE, content: caseHtml })
    }

    const cover = outline.find(section => COVER_SECTION_PATTERN.test(section.title))
    const coverHtml = coverToHtml(title, members)

    if (cover) cover.content = coverHtml
    else outline.unshift({ title: COVER_SECTION_TITLE, content: coverHtml })

    // The daftar pustaka is always the last section: it is written at the end
    // of the report, so a template that named one mid-outline has it moved down
    // rather than left where it sat, and a template that named none gets one
    // appended. No section is marked as the reference slot by hand any more —
    // closing the report is what makes it one.
    const named = outline.find(section => REFERENCE_SECTION_PATTERN.test(section.title))
    if (named) outline.splice(outline.indexOf(named), 1)

    outline.push({
      title: named?.title ?? REFERENCE_SECTION_TITLE,
      content: named?.content ?? '',
      isReferenceSlot: true,
    })

    await prisma.skripsi_sections.createMany({
      data: outline.map((section, index) => ({
        set_id: setId,
        title: section.title,
        content: section.content,
        position: index,
        is_reference_slot: Boolean(section.isReferenceSlot),
      })),
    })
  }

  static cleanMembers(members) {
    return (members || [])
      .map(member => ({
        name: member.name?.trim(),
        studentNumber: member.studentNumber?.trim() || null,
      }))
      .filter(member => member.name)
  }

  static async createMembers({ setId, members: clean }) {
    if (clean.length === 0) return

    await prisma.skripsi_set_members.createMany({
      data: clean.map((member, index) => ({
        set_id: setId,
        name: member.name,
        student_number: member.studentNumber,
        position: index,
      })),
    })
  }
}
