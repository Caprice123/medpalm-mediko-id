# Calculator User-Facing API Optimizations

## ✅ API CALCULATOR - SERIALIZER AUDIT

### **LIST VIEW (GET /api/v1/calculators/topics)**
**Frontend:** `frontend-web/src/routes/Calculator/pages/List/components/CalculatorList/index.jsx`

**Fields Actually Displayed:**
- ✅ id
- ✅ title
- ✅ description
- ✅ tags (with tag_group.name to filter 'kategori')
- ✅ fields.length (count only)
- ✅ updated_at

**API List Serializer Returns (AFTER FIX):**
```javascript
{
  id,
  title,
  description,
  tags: [{ id, name, tag_group: { id, name } }],
  fields: [{ id, key, label }],  // Minimal field info for count
  updated_at
}
```

**Removed from List Response:**
- ❌ `result_label` - Not displayed in list view
- ❌ `result_unit` - Not displayed in list view
- ❌ `clinical_references` - Not displayed in list view
- ❌ Full field objects - Only need id, key, label for display count

**Status:** ✅ **OPTIMIZED** - Only returns displayed fields

---

### **DETAIL VIEW (GET /api/v1/calculators/topics/:id)**
**Frontend:** `frontend-web/src/routes/Calculator/pages/Detail/index.jsx`

**Fields Actually Used:**
- ✅ title
- ✅ description
- ✅ result_label (for result display)
- ✅ result_unit (for result display)
- ✅ clinical_references[]
- ✅ calculator_fields[]
  - key, label, description, type, unit, placeholder, is_required, order
  - field_options[] (id, value, label, order)

**API Detail Serializer Returns:**
```javascript
{
  id,
  title,
  description,
  result_label,
  result_unit,
  clinical_references: [...],
  calculator_fields: [{
    id, key, label, description, type, unit,
    placeholder, is_required, order,
    field_options: [{ id, value, label, order }]
  }]
}
```

**Removed from Detail Response:**
- ❌ `status` - Not needed (already filtered in controller)
- ❌ `is_active` - Not needed (already filtered in controller)
- ❌ `created_by`, `created_at`, `updated_at` - Not displayed
- ❌ `calculator_topic_tags` relation - Not used in detail view

**Status:** ✅ **OPTIMIZED** - Only returns needed fields for calculation

---

## 🔧 CHANGES MADE

### 1. Created API Serializers

**File:** `backend/serializers/api/v1/calculatorTopicListSerializer.js`
- Returns minimal field info (id, key, label) instead of full objects
- Frontend only needs count, so lightweight field objects reduce payload
- Properly formats tags with tag_group

**File:** `backend/serializers/api/v1/calculatorTopicSerializer.js`
- Returns all fields needed for calculator functionality
- Includes field_options with proper ordering
- Removes internal/admin fields (status, timestamps)

---

### 2. Updated Controller

**File:** `backend/controllers/api/v1/calculator.controller.js`

**Before:**
```javascript
// Inline transformation in controller
const publicTopics = result.topics.filter(...).map(topic => ({
  id: topic.id,
  title: topic.title,
  description: topic.description,
  result_label: topic.result_label,  // ❌ Not used in list
  result_unit: topic.result_unit,    // ❌ Not used in list
  fields: topic.fields,              // ❌ Full objects (heavy)
  tags: topic.tags,
  clinical_references: topic.clinical_references,  // ❌ Not used
  updated_at: topic.updated_at
}))

// Detail returns raw Prisma data
return res.status(200).json({
  data: topic  // ❌ Includes unnecessary relations and fields
})
```

**After:**
```javascript
// Use serializer for clean transformation
const publicTopics = result.topics.filter(...)

return res.status(200).json({
  data: {
    topics: CalculatorTopicListSerializer.serialize(publicTopics),
    pagination: result.pagination
  }
})

// Detail uses serializer
return res.status(200).json({
  data: CalculatorTopicSerializer.serialize(topic)
})
```

**Also optimized detail query:**
- Removed unnecessary `calculator_topic_tags` relation include
- Only includes `calculator_fields` and `field_options` (what's actually used)

---

## 📊 Performance Impact

### List View Payload Reduction:
**Before (per topic):**
- All fields: ~8-10 fields
- Full field objects with all properties
- Unused clinical_references, result_label, result_unit

**After (per topic):**
- Only 6 fields displayed
- Minimal field objects (id, key, label only)
- No unused data

**Estimated reduction:** ~40-50% smaller payload per topic

**Typical list (15 calculators, 5 fields each):**
- **Before:** ~12-15 KB (full field objects)
- **After:** ~6-8 KB (minimal field info)

---

### Detail View Payload Reduction:
**Before:**
- Included `calculator_topic_tags` relation (not used)
- Internal fields (status, is_active, timestamps)
- Unordered field_options

**After:**
- No unnecessary relations
- Only fields used for calculation
- Properly ordered field_options

**Estimated reduction:** ~20-25% smaller payload

**Typical calculator detail:**
- **Before:** ~8-10 KB
- **After:** ~6-8 KB

---

## ✅ Summary

**List View:**
- ✅ Removed `result_label`, `result_unit`, `clinical_references` (not displayed)
- ✅ Minimal field objects instead of full data
- ✅ ~40-50% smaller payload

**Detail View:**
- ✅ Removed unnecessary relations and internal fields
- ✅ Clean serialized response
- ✅ ~20-25% smaller payload

**Code Quality:**
- ✅ Removed inline transformation from controller
- ✅ Separated presentation logic into serializers
- ✅ Consistent pattern with other features
