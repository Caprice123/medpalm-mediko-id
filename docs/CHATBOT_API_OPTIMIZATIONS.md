# Chatbot User-Facing API Optimizations

## ✅ API CHATBOT - SERIALIZER AUDIT

### **CONVERSATION LIST (GET /api/v1/chatbot/conversations)**
**Frontend:** `frontend-web/src/routes/Chatbot/pages/List/components/ConversationList/index.jsx`

**Fields Actually Displayed:**
- ✅ id
- ✅ topic
- ✅ messageCount
- ✅ lastMessage (with content)
- ✅ updatedAt (or createdAt)

**API Response (Current):**
```javascript
{
  id,
  topic,
  messageCount,
  lastMessage: { content, sender_type, mode_type, created_at },
  createdAt,
  updatedAt
}
```

**Status:** ✅ **ALREADY OPTIMAL** - All fields are used by frontend

---

### **MESSAGE LIST (GET /api/v1/chatbot/conversations/:id/messages)**
**Frontend:** `frontend-web/src/routes/Chatbot/pages/Conversation/components/MessageList/index.jsx`

**Fields Actually Displayed:**
- ✅ id
- ✅ senderType
- ✅ modeType
- ✅ content
- ✅ sources (only url, title)
- ✅ createdAt

**API Message Serializer Returns (AFTER FIX):**
```javascript
{
  id,
  senderType,
  modeType,
  content,
  sources: [
    {
      url,
      title
    }
  ],
  createdAt
}
```

**Removed from Message Response:**
- ❌ `creditsUsed` - Not displayed in message list
- ❌ `sources[].id` - Not needed by frontend
- ❌ `sources[].sourceType` - Not displayed
- ❌ `sources[].content` - Not displayed (only title/url shown)
- ❌ `sources[].score` - Not displayed
- ❌ `userFeedback` - Not displayed in message list

**Status:** ✅ **OPTIMIZED** - Only returns displayed fields

---

## 🔧 CHANGES MADE

### 1. Created Message Serializer

**File:** `backend/serializers/api/v1/chatbotMessageSerializer.js`

```javascript
export class ChatbotMessageSerializer {
  static serialize(messages) {
    return messages.map(msg => ({
      id: msg.id,
      senderType: msg.sender_type || msg.senderType,
      modeType: msg.mode_type || msg.modeType,
      content: msg.content,
      sources: (msg.chatbot_message_sources || msg.sources || []).map(src => ({
        url: src.url,
        title: src.title
      })),
      createdAt: msg.created_at || msg.createdAt
    }))
  }
}
```

---

### 2. Updated Service

**File:** `backend/services/chatbot/getMessagesService.js`

**Before:**
```javascript
const transformedMessages = paginatedMessages.map(msg => ({
  id: msg.id,
  senderType: msg.sender_type,
  modeType: msg.mode_type,
  content: msg.content,
  creditsUsed: msg.credits_used,        // ❌ Not displayed
  sources: msg.chatbot_message_sources.map(src => ({
    id: src.id,                         // ❌ Not needed
    sourceType: src.source_type,        // ❌ Not displayed
    title: src.title,
    content: src.content,               // ❌ Not displayed
    url: src.url,
    score: src.score                    // ❌ Not displayed
  })),
  userFeedback: msg.chatbot_message_feedbacks[0] ? { // ❌ Not displayed
    isHelpful: msg.chatbot_message_feedbacks[0].is_helpful,
    feedback: msg.chatbot_message_feedbacks[0].feedback
  } : null,
  createdAt: msg.created_at
}))

return {
  data: transformedMessages,
  pagination: { page, perPage, isLastPage }
}
```

**After:**
```javascript
// Service returns raw data, serializer handles transformation
return {
  messages: paginatedMessages,
  pagination: { page, perPage, isLastPage }
}
```

---

### 3. Updated Controller

**File:** `backend/controllers/api/v1/chatbot/messages.controller.js`

**Before:**
```javascript
const result = await GetMessagesService.call({...})

return res.status(200).json({
  data: result.data,  // ❌ Includes unused fields
  pagination: result.pagination
})
```

**After:**
```javascript
const result = await GetMessagesService.call({...})

return res.status(200).json({
  data: ChatbotMessageSerializer.serialize(result.messages),
  pagination: result.pagination
})
```

---

## 📊 Performance Impact

### Conversation List:
**Status:** Already optimal - no changes needed
- All fields (id, topic, messageCount, lastMessage, timestamps) are used

---

### Message List Payload Reduction:
**Before (per message):**
- 8 main fields
- Full source objects (6 fields each)
- userFeedback object

**After (per message):**
- 6 main fields
- Minimal source objects (2 fields each: url, title)
- No userFeedback

**Estimated reduction:** ~40-50% smaller payload per message

**Typical conversation (50 messages, 2 sources each):**
- **Before:** ~45-55 KB
- **After:** ~25-30 KB

**Example per message:**
```javascript
// Before (example with 2 sources):
{
  id: 1,
  senderType: "ai",
  modeType: "validated",
  content: "...",
  creditsUsed: 5,                      // ❌ Removed
  sources: [
    {
      id: 1,                            // ❌ Removed
      sourceType: "medical_journal",    // ❌ Removed
      title: "...",
      content: "...",                   // ❌ Removed
      url: "...",
      score: 0.95                       // ❌ Removed
    },
    {...}
  ],
  userFeedback: {                       // ❌ Removed
    isHelpful: true,
    feedback: "Very helpful"
  },
  createdAt: "..."
}
// Approx size: ~900-1100 bytes

// After:
{
  id: 1,
  senderType: "ai",
  modeType: "validated",
  content: "...",
  sources: [
    {
      title: "...",
      url: "..."
    },
    {...}
  ],
  createdAt: "..."
}
// Approx size: ~500-600 bytes (~45% reduction)
```

---

## ✅ Summary

**Conversation List:**
- ✅ Already optimal - all fields used
- No serializer needed

**Message List:**
- ✅ Created `ChatbotMessageSerializer`
- ✅ Removed `creditsUsed` (not displayed)
- ✅ Simplified sources - only url, title (removed id, sourceType, content, score)
- ✅ Removed `userFeedback` (not displayed in message list)
- ✅ ~40-50% smaller payload

**Code Quality:**
- ✅ Removed inline transformation from service
- ✅ Separated presentation logic into serializer
- ✅ Consistent pattern with other features
