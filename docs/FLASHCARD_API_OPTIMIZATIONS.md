# Flashcard User-Facing API Optimizations

## ✅ API FLASHCARD - SERIALIZER AUDIT

### **LIST VIEW (GET /api/v1/flashcards/decks)**
**Frontend:** `frontend-web/src/routes/Flashcard/pages/List/components/DeckList/index.jsx`

**Fields Actually Displayed:**
- ✅ id
- ✅ title
- ✅ description
- ✅ tags (with tag_group.name for filtering)
- ✅ cardCount
- ✅ updated_at

**API List Serializer Returns:**
```javascript
{
  id,
  title,
  description,
  tags: [{ id, name, tag_group: { id, name } }],
  cardCount,
  updated_at
}
```

**Status:** ✅ **PERFECT** - Only returns displayed fields

---

### **DETAIL/STUDY VIEW (POST /api/v1/flashcards/decks/start)**
**Frontend:** `frontend-web/src/routes/Flashcard/components/FlashcardPlayer/index.jsx`

**Fields Actually Used During Study:**
- ✅ deck.id
- ✅ deck.title
- ✅ deck.description
- ✅ cards[].id
- ✅ cards[].front (question)
- ✅ cards[].back (answer - needed for client-side similarity calculation)
- ✅ cards[].image_url
- ✅ cards[].order

**API Detail Serializer Returns (AFTER FIX):**
```javascript
{
  id,
  title,
  description,
  cards: [{
    id,
    front,
    back,        // ✅ KEPT - needed for client-side similarity calculation
    image_url,
    order
  }]
}
```

**Removed from Service Response:**
- ❌ `content_type` - not used by frontend
- ❌ `tags` - not displayed during study session

**IMPORTANT NOTE:**
Unlike Exercise (quiz), Flashcard KEEPS the `back` (answer) field in the start response because:
1. Flashcard is a study/learning tool, not a quiz - users should see answers
2. Frontend performs client-side similarity calculation between user input and answer
3. No security risk - answers are meant to be visible after flipping cards

---

## 🔧 CHANGES MADE

### 1. Created API Serializers

**File:** `backend/serializers/api/v1/flashcardDeckListSerializer.js`
```javascript
export class FlashcardDeckListSerializer {
  static serialize(decks) {
    return decks.map(deck => ({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      tags: (deck.flashcard_deck_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tag_group: t.tags.tag_group ? {
          id: t.tags.tag_group.id,
          name: t.tags.tag_group.name
        } : null
      })),
      cardCount: deck.flashcard_cards?.length || deck._count?.flashcard_cards || 0,
      updated_at: deck.updated_at
    }))
  }
}
```

**File:** `backend/serializers/api/v1/flashcardDeckSerializer.js`
```javascript
export class FlashcardDeckSerializer {
  static serialize(deck) {
    return {
      id: deck.id,
      title: deck.title,
      description: deck.description,
      cards: (deck.cards || []).map((card, index) => ({
        id: card.id,
        front: card.front,
        back: card.back,  // Client-side similarity calculation
        image_url: card.image_url || null,
        order: card.order !== undefined ? card.order : index
      }))
    }
  }
}
```

---

### 2. Fixed Controller Import

**File:** `backend/controllers/api/v1/flashcard.controller.js`

**Before:**
```javascript
import { FlashcardDeckListSerializer } from '#serializers/admin/v1/flashcardDeckListSerializer'  // ❌ Wrong path
```

**After:**
```javascript
import { FlashcardDeckListSerializer } from '#serializers/api/v1/flashcardDeckListSerializer'  // ✅ API serializer
import { FlashcardDeckSerializer } from '#serializers/api/v1/flashcardDeckSerializer'
```

---

### 3. Optimized Service Response

**File:** `backend/services/flashcard/startFlashcardDeckService.js`

**Before:**
```javascript
const deckSnapshot = {
  id: deck.id,
  title: deck.title || 'Untitled',
  description: deck.description || '',
  content_type: deck.content_type || 'text',  // ❌ Not used
  tags: (deck.flashcard_deck_tags || []).map(t => ({...})),  // ❌ Not used
  cards: sortedCards.map((card, index) => ({
    id: card.id,
    front: card.front || '',
    back: card.back || '',
    image_url: urlMap.get(card.id) || null,
    order: index
  }))
}
```

**After:**
```javascript
// NOTE: Flashcard needs 'back' (answer) for client-side similarity calculation
const deckSnapshot = {
  id: deck.id,
  title: deck.title || 'Untitled',
  description: deck.description || '',
  cards: sortedCards.map((card, index) => ({
    id: card.id,
    front: card.front || '',
    back: card.back || '',  // ✅ KEPT - needed for similarity check
    image_url: urlMap.get(card.id) || null,
    order: index
  }))
}
```

---

## 📊 Performance Impact

### Start Deck Payload Reduction:
**Before:**
- Base fields: 5 (id, title, description, content_type, tags)
- Per card: 4 fields (id, front, back, image_url)
- Extra: tags array with full objects

**After:**
- Base fields: 3 (id, title, description)
- Per card: 4 fields (id, front, back, image_url)

**Estimated reduction:** ~15-20% smaller payload (removed content_type and tags array)

**Typical deck:** 20 cards
- **Before:** ~3-4 KB (with tags)
- **After:** ~2.5-3 KB

---

## ✅ Summary

**API List Serializer:** Already optimal ✅
**API Detail Serializer:** Fixed and optimized ✅
**Service Response:** Cleaned up ✅
**Controller:** Fixed import path ✅

All Flashcard API endpoints now return **ONLY** the fields actually used by the frontend, with proper separation between admin and API serializers.

**Key Difference from Exercise:**
- **Exercise (Quiz):** Answer removed for security - it's a test
- **Flashcard (Study):** Answer kept intentionally - it's for learning + similarity calculation
