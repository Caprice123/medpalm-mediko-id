import { toJakartaISO } from '#utils/dateUtils'

export class DiagnosticCaseSerializer {
  // Lightweight shape for the case list table — only what the columns actually render.
  static serializeListItem(diagnosticCase) {
    return {
      id: diagnosticCase.id,
      vignette: diagnosticCase.vignette ?? null,
      questionCount: diagnosticCase.questionCount ?? 0,
      questions: diagnosticCase.questions ?? [],
    }
  }

  static serializeList(cases) {
    return cases.map(this.serializeListItem.bind(this))
  }

  // The detail service already returns the camelCase shape the form needs; this swaps
  // the raw timestamps for Jakarta ISO ones when they are present.
  static serialize(diagnosticCase) {
    const { created_at, updated_at, image_caption, ...rest } = diagnosticCase
    return {
      ...rest,
      imageCaption: rest.imageCaption ?? image_caption ?? null,
      ...(created_at ? { createdAt: toJakartaISO(created_at) } : {}),
      ...(updated_at ? { updatedAt: toJakartaISO(updated_at) } : {}),
    }
  }
}
