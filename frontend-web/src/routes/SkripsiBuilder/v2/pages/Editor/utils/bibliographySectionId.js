// Which section carries the daftar pustaka panel.
//
// A report created today ends with a flagged Referensi section. One created
// before that flag existed — or one whose flagged section was deleted — has
// none, and for those the last section is where a bibliography belongs anyway.
// This mirrors the server's own fallback in GenerateSkripsiBibliographyV2Service,
// so the panel never appears on a section the generate would not write into.
export const bibliographySectionId = (sections) => {
  if (!sections || sections.length === 0) return null

  const flagged = sections.find(section => section.isReferenceSlot)
  return (flagged ?? sections[sections.length - 1]).id
}
