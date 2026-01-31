# Skeleton Loading Components

Professional skeleton loading components built with `react-loading-skeleton`.

## Available Components

### 1. FeatureCardSkeleton
For Dashboard feature cards.

**Files:** `FeatureCardSkeleton.jsx`

**Usage:**
```jsx
import { FeatureCardSkeleton, FeatureCardSkeletonGrid } from '@components/common/SkeletonCard'

// Single card
<FeatureCardSkeleton />

// Grid of cards
<FeatureCardSkeletonGrid count={6} />
```

**Layout:**
- Icon (60x60px)
- Title
- Description (2 lines)
- Flex spacer
- Access badge
- Requirements (2 items)
- Footer with button

---

### 2. SummaryNoteCardSkeleton
For Summary Notes list cards.

**Files:** `SummaryNoteCardSkeleton.jsx`

**Usage:**
```jsx
import { SummaryNoteCardSkeleton, SummaryNoteSkeletonGrid } from '@components/common/SkeletonCard'

// Single card
<SummaryNoteCardSkeleton />

// Grid of cards (used in list page)
{loading ? (
  <SummaryNoteSkeletonGrid count={6} />
) : (
  <NotesList />
)}
```

**Layout:**
- Title
- Description (2 lines)
- University tags (2 tags)
- Semester tags (1 tag)
- Updated date text
- Full-width button

**Grid specs:**
- Columns: `repeat(auto-fill, minmax(320px, 1fr))`
- Gap: `1.25rem`
- Responsive: single column on mobile

---

### 3. SummaryNoteDetailSkeleton
For Summary Notes detail page.

**Files:** `SummaryNoteDetailSkeleton.jsx`

**Usage:**
```jsx
import { SummaryNoteDetailSkeleton } from '@components/common/SkeletonCard'

{loading ? (
  <SummaryNoteDetailSkeleton />
) : (
  <NoteContent />
)}
```

**Layout:**
- **Header Card:**
  - Back button
  - Title (with icon space)
  - Description (2 lines)
  - University tags (2 tags)
  - Semester tags (1 tag)

- **Content Card:**
  - Multiple heading and paragraph blocks
  - Simulates BlockNote editor content

---

### 4. OsceSessionCardSkeleton
For OSCE Practice session history cards.

**Files:** `OsceSessionCardSkeleton.jsx`

**Usage:**
```jsx
import { OsceSessionCardSkeleton, OsceSessionSkeletonGrid } from '@components/common/SkeletonCard'

// Single card
<OsceSessionCardSkeleton />

// Grid of cards (used in history page)
{loading ? (
  <OsceSessionSkeletonGrid count={6} />
) : (
  <SessionsList />
)}
```

**Layout:**
- Topic title
- Status badge
- Topic tags row
- Batch tags row
- Score and time row
- Action button

**Grid specs:**
- Columns: `repeat(auto-fill, minmax(350px, 1fr))`
- Gap: `1.25rem`

---

### 5. OsceTopicCardSkeleton
For OSCE Practice topic selection cards.

**Files:** `OsceTopicCardSkeleton.jsx`

**Usage:**
```jsx
import { OsceTopicCardSkeleton, OsceTopicSkeletonGrid } from '@components/common/SkeletonCard'

// Single card
<OsceTopicCardSkeleton />

// Grid of cards (used in topic selection)
{loading ? (
  <OsceTopicSkeletonGrid count={6} />
) : (
  <TopicsList />
)}
```

**Layout:**
- Card title
- Description (2 lines)
- Flex spacer
- Topic tags (2 tags)
- Batch tags (1 tag)
- Stats row (3 columns: Created, Duration, Updated)
- Action button

**Grid specs:**
- Columns: `repeat(auto-fill, minmax(320px, 1fr))`
- Gap: `1.5rem`
- Min height: `320px`

---

### 6. LearningContentCardSkeleton
For learning content cards (MCQ, Flashcard, Exercise, Anatomy Quiz).

**Files:** `LearningContentCardSkeleton.jsx`

**Usage:**
```jsx
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'

// MCQ with 2 buttons and 3 stats
<LearningContentSkeletonGrid count={6} hasTwoButtons={true} statsCount={3} />

// Flashcard/Exercise/Anatomy with 1 button and 2 stats
<LearningContentSkeletonGrid count={6} statsCount={2} />
```

**Props:**
- `hasTwoButtons` (boolean) - Show 2 buttons for MCQ mode selection
- `statsCount` (number) - Number of stat items (2 or 3)

**Layout:**
- Title
- Description (2 lines)
- Flex spacer
- University tags (2 tags)
- Semester tags (1 tag)
- Stats row (2 or 3 items)
- Action button(s) (1 or 2)

**Grid specs:**
- Columns: `repeat(auto-fill, minmax(320px, 1fr))`
- Gap: `1.25rem`

**Used in:**
- Multiple Choice (`hasTwoButtons={true}`, `statsCount={3}`)
- Flashcard (`statsCount={2}`)
- Exercise (`statsCount={2}`)
- Anatomy Quiz (`statsCount={2}`)

---

### 7. CalculatorCardSkeleton
For Calculator list cards.

**Files:** `CalculatorCardSkeleton.jsx`

**Usage:**
```jsx
import { CalculatorSkeletonGrid } from '@components/common/SkeletonCard'

<CalculatorSkeletonGrid count={6} />
```

**Layout:**
- Title
- Description (2 lines)
- Kategori tags
- Flex spacer
- Stats row (2 items: Input Fields, Updated)
- Action button

**Grid specs:**
- Columns: `repeat(auto-fill, minmax(300px, 1fr))`
- Gap: `1.5rem`

---

### 8. TopupTableSkeleton
For Topup page transaction history table.

**Files:** `TopupTableSkeleton.jsx`

**Usage:**
```jsx
import { TopupTableSkeleton } from '@components/common/SkeletonCard'

{loading ? (
  <TopupTableSkeleton rowCount={5} />
) : (
  <Table columns={columns} data={data} />
)}
```

**Props:**
- `rowCount` (number) - Number of table rows to show (default: 5)

**Layout:**
- Table header row (6 columns: Tanggal, Paket, Tipe, Nominal, Status, Aksi)
- Table body rows with:
  - Date column (with date and time)
  - Plan name column
  - Type badge column
  - Amount column (right-aligned)
  - Status badge column
  - Action button column

---

### 9. CreditPurchaseSkeleton
For Topup page credit purchase modal (pricing plans popup).

**Files:** `CreditPurchaseSkeleton.jsx`

**Usage:**
```jsx
import { CreditPurchaseSkeleton } from '@components/common/SkeletonCard'

{loading ? (
  <CreditPurchaseSkeleton planCount={6} />
) : (
  <PlansGrid>...</PlansGrid>
)}
```

**Props:**
- `planCount` (number) - Number of plan cards to show (default: 6)

**Layout:**
- Filter tabs row (4 tabs)
- Plans grid with cards:
  - Popular badge (on some cards)
  - Plan name
  - Plan credits/duration
  - Plan price with optional discount badge
  - Description (2 lines)
  - Purchase button

**Grid specs:**
- Columns: `repeat(auto-fill, minmax(280px, 1fr))`
- Gap: `1.5rem`

---

### 10. TransactionDetailSkeleton
For Topup page transaction detail modal (popup).

**Files:** `TransactionDetailSkeleton.jsx`

**Usage:**
```jsx
import { TransactionDetailSkeleton } from '@components/common/SkeletonCard'

{loading ? (
  <TransactionDetailSkeleton />
) : (
  <TransactionDetails />
)}
```

**Layout:**
- **Package Information Section:**
  - Section title
  - Detail grid with 5 items (Name, Description, Type badge, Credits, Duration)

- **Payment Information Section:**
  - Section title
  - Detail grid with 5 items (Date, Amount, Method, Status badge, Reference)

- **Payment Evidence Section:**
  - Section title
  - Evidence list with file items (icon, filename, date, view button)

- **Action Buttons:**
  - Centered action button

---

### 11. SessionResultSkeleton
For OSCE Practice session result page.

**Files:** `SessionResultSkeleton.jsx`

**Usage:**
```jsx
import { SessionResultSkeleton } from '@components/common/SkeletonCard'

{loading.isLoadingSessionDetail ? (
  <SessionResultSkeleton />
) : (
  <SessionResultContent />
)}
```

**Layout:**
- Header section with back button
- Tab bar with 5 tabs (Hasil, Percakapan, Observasi, Diagnosis, Terapi)
- Content section with:
  - Score cards grid (4 cards with label and value)
  - Multiple section blocks (3 sections)
  - Each section has:
    - Section title
    - Table with header row and 3 data rows
    - 3 columns per row

---

### 12. ChatbotMessagesSkeleton
For Chatbot conversation messages.

**Files:** `ChatbotMessagesSkeleton.jsx`

**Usage:**
```jsx
import { ChatbotMessagesSkeleton } from '@components/common/SkeletonCard'

{loading.isMessagesLoading ? (
  <ChatbotMessagesSkeleton messageCount={6} />
) : (
  <MessageList messages={messages} />
)}
```

**Props:**
- `messageCount` (number) - Number of message bubbles to show (default: 4)

**Layout:**
- Alternating user and AI message bubbles
- User messages (right-aligned, gray background):
  - Single line content
  - Timestamp
- AI messages (left-aligned, white background):
  - Multi-line content (2 lines)
  - Mode badge
  - Timestamp
  - Occasionally shows sources section (every 3rd message)

---

### 13. ChatbotLoadingIndicator
For Chatbot infinite scroll loading indicator.

**Files:** `ChatbotLoadingIndicator.jsx`

**Usage:**
```jsx
import { ChatbotLoadingIndicator } from '@components/common/SkeletonCard'

// Spinner variant (default) - shows at top when loading more messages
{loading.isMessagesLoading && currentPage > 1 && (
  <ChatbotLoadingIndicator variant="spinner" />
)}

// Skeleton variant - shows compact message bubbles
<ChatbotLoadingIndicator variant="skeleton" />
```

**Props:**
- `variant` (string) - Display variant: "spinner" (default) or "skeleton"

**Variants:**
- **spinner**: Animated spinner with "Memuat pesan lama..." text
- **skeleton**: Compact 2-message bubble skeleton

**Used for:**
- Infinite scroll loading at the top of message list (page 2+)
- Non-intrusive loading indicator that doesn't replace content

---

### 14. SkripsiSetCardSkeleton
For Skripsi Builder set list cards.

**Files:** `SkripsiSetCardSkeleton.jsx`

**Usage:**
```jsx
import { SkripsiSetSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isSetsLoading ? (
  <SkripsiSetSkeletonGrid count={6} />
) : (
  <SetsList />
)}
```

**Layout:**
- Card header with title
- Description (2 lines)
- Flex spacer
- Updated date text
- Action buttons row:
  - Primary full-width button (Buka Set)
  - Danger icon button (Delete)

**Grid specs:**
- Columns: `repeat(auto-fill, minmax(320px, 1fr))`
- Gap: `1.5rem`

---

### 15. ConversationListSkeleton
For Chatbot conversation list sidebar.

**Files:** `ConversationListSkeleton.jsx`

**Usage:**
```jsx
import { ConversationListSkeleton } from '@components/common/SkeletonCard'

{isLoading ? (
  <ConversationListSkeleton count={8} />
) : (
  <ConversationsList />
)}
```

**Props:**
- `count` (number) - Number of conversation items to show (default: 8)

**Layout:**
- Conversation items with:
  - Header row (topic + time)
  - Last message preview
- Hover effect on items
- Border between items

---

### 16. SkeletonCard (Generic)
General purpose skeleton for simple cards.

**Files:** `GenericSkeleton.jsx`

**Usage:**
```jsx
import { SkeletonCard } from '@components/common/SkeletonCard'

// Basic card
<SkeletonCard />

// With image
<SkeletonCard showImage imageHeight={200} />

// With button
<SkeletonCard rows={4} showButton />
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| rows | Number | 3 | Number of text rows |
| showImage | Boolean | false | Show image placeholder |
| imageHeight | Number | 150 | Image height in px |
| showButton | Boolean | false | Show button placeholder |

---

## File Structure

```
SkeletonCard/
├── index.jsx                        # Exports all components
├── FeatureCardSkeleton.jsx          # Dashboard feature cards
├── SummaryNoteCardSkeleton.jsx      # Summary notes list
├── SummaryNoteDetailSkeleton.jsx    # Summary notes detail
├── OsceSessionCardSkeleton.jsx      # OSCE session/history cards
├── OsceTopicCardSkeleton.jsx        # OSCE topic selection cards
├── LearningContentCardSkeleton.jsx  # MCQ/Flashcard/Exercise/Anatomy
├── CalculatorCardSkeleton.jsx       # Calculator cards
├── TopupTableSkeleton.jsx           # Topup transaction table
├── CreditPurchaseSkeleton.jsx       # Topup purchase modal plans
├── TransactionDetailSkeleton.jsx    # Topup transaction detail modal
├── SessionResultSkeleton.jsx        # OSCE session result page
├── ChatbotMessagesSkeleton.jsx      # Chatbot conversation messages
├── ChatbotLoadingIndicator.jsx      # Chatbot infinite scroll indicator
├── ConversationListSkeleton.jsx     # Chatbot conversation list sidebar
├── SkripsiSetCardSkeleton.jsx       # Skripsi Builder set cards
├── GenericSkeleton.jsx              # Generic card skeleton
└── README.md                        # This file
```

## Customization

All skeleton components use the same base color scheme:
```css
--base-color: #e5e7eb;
--highlight-color: #f3f4f6;
```

To customize colors, modify the `SkeletonWrapper` styled component in each file.

## Best Practices

1. **Always show skeleton during loading**
   ```jsx
   {isLoading ? <SkeletonGrid count={6} /> : <DataList />}
   ```

2. **Match skeleton to actual layout**
   - Use same grid layout
   - Match element sizes and spacing
   - Include all major UI elements

3. **Hide pagination during loading**
   ```jsx
   {!isLoading && <Pagination ... />}
   ```

4. **Use appropriate count**
   - Lists: 6-8 items
   - Detail pages: 1 item
   - Grids: Match expected item count

## Examples in Codebase

### Dashboard
```jsx
// frontend-web/src/routes/Dashboard.jsx
import { FeatureCardSkeletonGrid } from '@components/common/SkeletonCard'

{isLoadingFeatures ? (
  <FeatureCardSkeletonGrid count={6} />
) : (
  <CatalogGrid>...</CatalogGrid>
)}
```

### Summary Notes List
```jsx
// frontend-web/src/routes/SummaryNotes/pages/List/components/NotesList/index.jsx
import { SummaryNoteSkeletonGrid } from '@components/common/SkeletonCard'

if (loading?.isNotesLoading) {
  return <SummaryNoteSkeletonGrid count={6} />
}
```

### Summary Notes Detail
```jsx
// frontend-web/src/routes/SummaryNotes/pages/Detail/index.jsx
import { SummaryNoteDetailSkeleton } from '@components/common/SkeletonCard'

if (loading.isNoteDetailLoading || !note) {
  return <SummaryNoteDetailSkeleton />
}
```

### OSCE Practice Sessions
```jsx
// frontend-web/src/routes/OscePractice/index.jsx
import { OsceSessionSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isLoadingUserSessions ? (
  <OsceSessionSkeletonGrid count={6} />
) : (
  <SessionsList />
)}
```

### OSCE Practice Topics
```jsx
// frontend-web/src/routes/OscePractice/pages/TopicSelection/index.jsx
import { OsceTopicSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isLoadingUserTopics ? (
  <OsceTopicSkeletonGrid count={6} />
) : (
  <TopicsList />
)}
```

### Multiple Choice Topics
```jsx
// frontend-web/src/routes/MultipleChoice/pages/List/components/TopicList/index.jsx
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isTopicsLoading ? (
  <LearningContentSkeletonGrid count={6} hasTwoButtons={true} statsCount={3} />
) : (
  <TopicsList />
)}
```

### Flashcard Decks
```jsx
// frontend-web/src/routes/Flashcard/pages/List/components/DeckList/index.jsx
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isGetListDecksLoading ? (
  <LearningContentSkeletonGrid count={6} statsCount={2} />
) : (
  <DecksList />
)}
```

### Exercise Topics
```jsx
// frontend-web/src/routes/Exercise/pages/List/components/TopicList/index.jsx
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isTopicsLoading ? (
  <LearningContentSkeletonGrid count={6} statsCount={2} />
) : (
  <TopicsList />
)}
```

### Anatomy Quiz
```jsx
// frontend-web/src/routes/AnatomyQuiz/pages/List/components/QuizList/index.jsx
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isGetListAnatomyQuizLoading ? (
  <LearningContentSkeletonGrid count={6} statsCount={2} />
) : (
  <QuizList />
)}
```

### Calculator List
```jsx
// frontend-web/src/routes/Calculator/pages/List/components/CalculatorList/index.jsx
import { CalculatorSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isGetListCalculatorsLoading ? (
  <CalculatorSkeletonGrid count={6} />
) : (
  <CalculatorList />
)}
```

### Topup Transaction Table
```jsx
// frontend-web/src/routes/Topup/index.jsx
import { TopupTableSkeleton } from '@components/common/SkeletonCard'

{loading ? (
  <TopupTableSkeleton rowCount={5} />
) : (
  <>
    <Table columns={columns} data={safeHistory} />
    {!loading && <Pagination ... />}
  </>
)}
```

### Topup Purchase Modal
```jsx
// frontend-web/src/routes/Topup/components/CreditPurchase/CreditPurchase.jsx
import { CreditPurchaseSkeleton } from '@components/common/SkeletonCard'

{loading ? (
  <CreditPurchaseSkeleton planCount={6} />
) : (
  <>
    <FilterTabs>...</FilterTabs>
    <PlansGrid>...</PlansGrid>
  </>
)}
```

### Topup Transaction Detail Modal
```jsx
// frontend-web/src/routes/Topup/components/TransactionDetail/TransactionDetail.jsx
import { TransactionDetailSkeleton } from '@components/common/SkeletonCard'

{loading.isTransactionDetailLoading ? (
  <TransactionDetailSkeleton />
) : error ? (
  <ErrorState>{error}</ErrorState>
) : transaction ? (
  <TransactionDetails />
) : null}
```

### OSCE Session Result Page
```jsx
// frontend-web/src/routes/OscePractice/pages/SessionResult/index.jsx
import { SessionResultSkeleton } from '@components/common/SkeletonCard'

{loading.isLoadingSessionDetail ? (
  <Container>
    <SessionResultSkeleton />
  </Container>
) : (
  <SessionContent />
)}
```

### Chatbot Conversation Messages
```jsx
// frontend-web/src/routes/Chatbot/pages/Conversation/index.jsx
import { ChatbotMessagesSkeleton } from '@components/common/SkeletonCard'

// Main conversation loading
{loading.isCurrentConversationLoading && !currentConversation ? (
  <Container>
    <ChatbotMessagesSkeleton messageCount={6} />
  </Container>
) : (
  <ConversationContent />
)}

// MessageList component loading (page 1 only)
// frontend-web/src/routes/Chatbot/pages/Conversation/components/MessageList/index.jsx
{isLoading ? (
  <ChatbotMessagesSkeleton messageCount={6} />
) : (
  <MessagesList />
)}

// Infinite scroll loading indicator (page 2+)
// frontend-web/src/routes/Chatbot/pages/Conversation/index.jsx
import { ChatbotLoadingIndicator } from '@components/common/SkeletonCard'

<ChatArea>
  {!pagination.isLastPage && loading.isMessagesLoading && currentPage > 1 && (
    <ChatbotLoadingIndicator variant="spinner" />
  )}
  <MessageList />
</ChatArea>
```

### Chatbot Conversation List
```jsx
// frontend-web/src/routes/Chatbot/pages/List/components/ConversationList/index.jsx
import { ConversationListSkeleton } from '@components/common/SkeletonCard'

{isLoading ? (
  <Container>
    <ConversationListSkeleton count={8} />
  </Container>
) : (
  <ConversationsList />
)}
```

### Skripsi Builder Set List
```jsx
// frontend-web/src/routes/SkripsiBuilder/pages/List/components/SetsList/index.jsx
import { SkripsiSetSkeletonGrid } from '@components/common/SkeletonCard'

{loading.isSetsLoading ? (
  <SkripsiSetSkeletonGrid count={6} />
) : (
  <SetsList />
)}

// Pagination hidden during loading
// frontend-web/src/routes/SkripsiBuilder/pages/List/index.jsx
{!loading.isSetsLoading && (
  <Pagination ... />
)}
```

### Skripsi Builder Chat Panel
```jsx
// frontend-web/src/routes/SkripsiBuilder/pages/Editor/components/ChatPanel.jsx
import { ChatbotLoadingIndicator, ChatbotMessagesSkeleton } from '@components/common/SkeletonCard'

// Initial loading (same as chatbot)
{isInitialLoading && messages.length === 0 ? (
  <ChatbotMessagesSkeleton messageCount={4} />
) : messages.length === 0 ? (
  <EmptyMessages>...</EmptyMessages>
) : (
  <MessagesList />
)}

// Infinite scroll loading (same as chatbot)
{isLoadingOlder && hasMore && (
  <ChatbotLoadingIndicator variant="spinner" />
)}
```

**Note:** Skripsi Builder chat reuses both chatbot skeleton components for consistent UI across features.

## Adding New Skeleton Components

1. Create a new file: `YourComponentSkeleton.jsx`
2. Follow the existing pattern:
   ```jsx
   import Skeleton from 'react-loading-skeleton'
   import 'react-loading-skeleton/dist/skeleton.css'
   import styled from 'styled-components'

   const SkeletonWrapper = styled.div`
     .react-loading-skeleton {
       --base-color: #e5e7eb;
       --highlight-color: #f3f4f6;
     }
   `

   export function YourComponentSkeleton() {
     return (
       <SkeletonWrapper>
         {/* Your skeleton layout */}
       </SkeletonWrapper>
     )
   }
   ```

3. Export from `index.jsx`:
   ```jsx
   export { YourComponentSkeleton } from './YourComponentSkeleton'
   ```

## Dependencies

- `react-loading-skeleton`: ^3.x
- `styled-components`: ^6.x
