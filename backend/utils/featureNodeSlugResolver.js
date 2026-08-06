import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'

/**
 * feature_nodes doesn't stamp a real node_type for Diagnostic V2 nodes (see
 * CLAUDE.md's node_type convention) — Diagnostic disambiguates itself via
 * visibility: 'diagnostic' + layer (1 = module, 2 = submodule) instead. This
 * gives every node a comparable "logical type" regardless of which
 * convention it uses, so slug-collision checks compare apples to apples.
 */
function nodeTypeSignature({ nodeType, visibility, layer }) {
  if (visibility === 'diagnostic') return `diagnostic-${parseInt(layer) === 1 ? 'module' : 'submodule'}`
  return nodeType || null
}

/**
 * Resolves a requested slug for a feature_nodes row, avoiding collisions with
 * nodes of a *different* logical type by falling back to a type-prefixed
 * slug (e.g. "jantung" -> "module-jantung") instead of hard-failing. A
 * collision with a node of the *same* logical type is still a genuine
 * duplicate and throws.
 */
export async function resolveFeatureNodeSlug({ slug, nodeType, visibility, layer, excludeId }) {
  const requested = slug.trim()

  const findCollision = (candidateSlug) => prisma.feature_nodes.findFirst({
    where: { slug: candidateSlug, ...(excludeId ? { id: { not: excludeId } } : {}) },
  })

  const existing = await findCollision(requested)
  if (!existing) return requested

  const requestedSignature = nodeTypeSignature({ nodeType, visibility, layer })
  const existingSignature = nodeTypeSignature({ nodeType: existing.node_type, visibility: existing.visibility, layer: existing.layer })

  if (requestedSignature === existingSignature) {
    throw new ValidationError('Slug sudah digunakan')
  }

  const prefixed = `${requestedSignature || 'node'}-${requested}`
  const prefixedExisting = await findCollision(prefixed)
  if (prefixedExisting) throw new ValidationError('Slug sudah digunakan')

  return prefixed
}
