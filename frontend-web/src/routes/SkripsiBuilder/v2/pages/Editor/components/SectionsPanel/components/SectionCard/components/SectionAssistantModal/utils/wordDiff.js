// What the AI actually changed, word by word.
//
// A revision and its original read almost identically side by side — the
// wording moves, a clause is reordered, a term is swapped — and a student
// comparing two plain paragraphs concludes nothing happened. Marking the
// difference is the whole point of showing the revision at all.
//
// Classic LCS over whitespace-separated tokens: short selections (a sentence
// or a paragraph, capped at 6000 characters server-side) make the quadratic
// table cheap, and word granularity is what a reader actually sees.

// Whitespace is kept with the token before it, so the pieces concatenate back
// into the original text without guessing where the spaces went.
const tokenize = (text) => String(text ?? '').match(/\S+\s*/g) ?? []

// Compared without punctuation or case, so "cavity." and "cavity" are the same
// word moved rather than one word removed and another added.
const normalize = (token) => token.trim().toLowerCase().replace(/[.,;:()[\]"']/g, '')

const MAX_TOKENS = 1200

export const wordDiff = (before, after) => {
  const a = tokenize(before)
  const b = tokenize(after)

  // Past this size the table costs more than the highlight is worth, and the
  // selection is long enough that reading it whole is the honest option.
  if (a.length > MAX_TOKENS || b.length > MAX_TOKENS) {
    return [{ type: 'same', text: after }]
  }

  // lengths[i][j] = longest common run of a.slice(i) and b.slice(j)
  const lengths = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1))

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      lengths[i][j] = normalize(a[i]) === normalize(b[j])
        ? lengths[i + 1][j + 1] + 1
        : Math.max(lengths[i + 1][j], lengths[i][j + 1])
    }
  }

  const parts = []

  // Runs of the same kind are merged as they are produced, so the markup is one
  // span per change rather than one per word.
  const push = (type, text) => {
    const last = parts[parts.length - 1]
    if (last && last.type === type) last.text += text
    else parts.push({ type, text })
  }

  let i = 0
  let j = 0

  while (i < a.length && j < b.length) {
    if (normalize(a[i]) === normalize(b[j])) {
      // The revision's spelling wins: it is the text being kept.
      push('same', b[j])
      i += 1
      j += 1
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      push('removed', a[i])
      i += 1
    } else {
      push('added', b[j])
      j += 1
    }
  }

  while (i < a.length) { push('removed', a[i]); i += 1 }
  while (j < b.length) { push('added', b[j]); j += 1 }

  return parts
}

// Whether anything changed at all — a model told the text already meets the
// instruction returns it untouched, and saying so is better than showing two
// identical paragraphs.
export const hasChanges = (parts) => parts.some(part => part.type !== 'same')
