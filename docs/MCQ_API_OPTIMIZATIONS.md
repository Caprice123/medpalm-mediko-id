# MCQ User-Facing API Optimizations

## ✅ API MCQ - SERIALIZER AUDIT

### **LIST VIEW (GET /api/v1/mcq/topics)**
**Frontend:** `frontend-web/src/routes/MultipleChoice/pages/List/components/TopicList/index.jsx`

**Fields Actually Displayed:**
- ✅ id
- ✅ title
- ✅ description
- ✅ tags (with tagGroup.name to filter university/semester)
- ✅ question_count
- ✅ quiz_time_limit
- ✅ passing_score

**API List Serializer Returns (AFTER FIX):**
```javascript
{
  id,
  title,
  description,
  quiz_time_limit,
  passing_score,
  question_count,
  tags: [{ id, name, tagGroup: { name } }]
}
```

**Removed from List Response:**
- ❌ `tags[].tagGroupId` - Not needed (only tagGroup.name is used)
- ❌ `updated_at` - Not displayed in list view

**Status:** ✅ **OPTIMIZED** - Only returns displayed fields

---

### **DETAIL VIEW (GET /api/v1/mcq/topics/:id)**
**Frontend:** `frontend-web/src/routes/MultipleChoice/pages/Detail/index.jsx`

**Fields Actually Used:**
- ✅ title
- ✅ description
- ✅ quiz_time_limit
- ✅ mcq_questions[] (only id, question, options, correct_answer, explanation)

**API Detail Serializer Returns (AFTER FIX):**
```javascript
{
  id,
  title,
  description,
  quiz_time_limit,
  mcq_questions: [
    {
      id,
      question,
      options,
      // Only when includeAnswers=true:
      correct_answer,  // ⚠️ See security note below
      explanation
    }
  ]
}
```

**Removed from Detail Response:**
- ❌ `passing_score` - Not used in detail view (only in results after submission)
- ❌ `mcq_questions[].image_url` - Not displayed in detail view
- ❌ `mcq_questions[].order` - Not needed by frontend

**Status:** ✅ **OPTIMIZED** - Only returns needed fields

---

## ⚠️ Security Note

### Answer Exposure in Detail Endpoint

The controller currently has a **temporary security workaround**:

```javascript
/**
 * WARNING: This endpoint should NOT be used for quiz sessions as it would expose answers.
 * Use /topics/:id/session instead for quiz/learning mode.
 *
 * Frontend currently uses this incorrectly - needs to be updated to use /session endpoint.
 */
async getTopic(req, res) {
  // TEMPORARY: Include answers for backward compatibility with current frontend
  // TODO: Update frontend to use /session endpoint, then set includeAnswers=false here
  return res.status(200).json({
    data: McqTopicSerializer.serialize(topic, true) // includeAnswers=true for now
  })
}
```

**Recommended Fix:**
1. Frontend should migrate to using `/api/v1/mcq/topics/:id/session` endpoint instead
2. The `/session` endpoint uses `McqTopicSessionSerializer` which **does NOT** expose answers
3. After migration, set `includeAnswers=false` in the `getTopic` endpoint

The session endpoint is already implemented and secure:
```javascript
async getTopicSession(req, res) {
  // SECURITY: This endpoint does NOT expose correct_answer in the response.
  // Answers are only revealed after submission via /submit or /check endpoints.
  return res.status(200).json({
    data: McqTopicSessionSerializer.serialize(result)
  })
}
```

---

## 🔧 CHANGES MADE

### API List Serializer (`backend/serializers/api/v1/mcqTopicListSerializer.js`)

**Before:**
```javascript
{
  id, title, description,
  quiz_time_limit, passing_score, question_count,
  tags: [{
    id, name,
    tagGroupId,        // ❌ Not used
    tagGroup: { name }
  }],
  updated_at           // ❌ Not displayed
}
```

**After:**
```javascript
{
  id, title, description,
  quiz_time_limit, passing_score, question_count,
  tags: [{
    id, name,
    tagGroup: { name }
  }]
}
```

---

### API Detail Serializer (`backend/serializers/api/v1/mcqTopicSerializer.js`)

**Before:**
```javascript
{
  id, title, description,
  quiz_time_limit,
  passing_score,     // ❌ Not used in detail
  mcq_questions: [{
    id, question,
    image_url,       // ❌ Not displayed
    options,
    order,           // ❌ Not needed
    // If includeAnswers=true:
    correct_answer,
    explanation
  }]
}
```

**After:**
```javascript
{
  id, title, description,
  quiz_time_limit,
  mcq_questions: [{
    id, question, options,
    // If includeAnswers=true:
    correct_answer,
    explanation
  }]
}
```

---

## 📊 Performance Impact

### List View Payload Reduction:
**Before:** 8 fields + nested tag data with extra fields
**After:** 7 fields + streamlined tag data

**Removed:**
- `tags[].tagGroupId` (not used)
- `updated_at` (not displayed)

**Estimated reduction:** ~10-15% smaller payload

**Typical list (20 topics with 5 tags each):**
- **Before:** ~15-18 KB
- **After:** ~13-16 KB

---

### Detail View Payload Reduction:
**Before:** 5 main fields + questions with extra data
**After:** 4 main fields + streamlined questions

**Removed:**
- `passing_score` (not used in detail)
- `mcq_questions[].image_url` (not displayed)
- `mcq_questions[].order` (not needed)

**Estimated reduction:** ~15-20% smaller payload

**Typical topic detail (with 20 questions, 4 options each):**
- **Before:** ~12-15 KB
- **After:** ~10-12 KB

---

## ✅ Summary

**List View:**
- ✅ Removed `tags[].tagGroupId`, `updated_at` (not used)
- ✅ ~10-15% smaller payload

**Detail View:**
- ✅ Removed `passing_score`, `mcq_questions[].image_url`, `mcq_questions[].order` (not used)
- ✅ ~15-20% smaller payload

**Security:**
- ⚠️ Current detail endpoint exposes answers (temporary, for backward compatibility)
- ✅ Secure `/session` endpoint already available for migration
- 📋 TODO: Frontend should migrate to `/session` endpoint

**Code Quality:**
- ✅ Serializers already existed and followed clean patterns
- ✅ Further optimized by removing unused fields
- ✅ Maintained security controls with `includeAnswers` parameter
