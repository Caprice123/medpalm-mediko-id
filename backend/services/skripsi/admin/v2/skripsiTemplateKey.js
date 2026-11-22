import prisma from '#prisma/client'

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .slice(0, 40)

// A template is addressed by its `key` in seeds and fixtures, so admins never
// have to type one: it is derived from the name and suffixed until it is free.
export async function buildTemplateKey(name, excludeId = null) {
  const base = slugify(name) || 'template'
  let candidate = base

  for (let suffix = 2; suffix < 100; suffix += 1) {
    const existing = await prisma.skripsi_templates.findUnique({ where: { key: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${base}_${suffix}`
  }

  return `${base}_${Date.now()}`
}
