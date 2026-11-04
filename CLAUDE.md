# MedPal / MedIko Project

## Stack
- **Backend**: Express.js + Prisma + PostgreSQL (`backend/`)
- **Frontend**: React + Redux Toolkit + styled-components + Vite (`frontend-web/`)

---

## Frontend Rules

### Always use common components — do not reinvent them
Reusable components live in `frontend-web/src/components/common/`. **Always check here first before writing custom markup.**

| Need | Use |
|------|-----|
| Text field | `TextInput` |
| Multi-line text | `Textarea` |
| File upload (single or multiple) | `FileUpload` (supports `multiple` prop) |
| Dialog / overlay | `Modal` |
| Click action | `Button` |
| Card container | `Card`, `CardHeader`, `CardBody`, `CardFooter` |
| Empty state | `EmptyState` |
| Spinner / loading state | `Loading` |
| Page-level pagination | `Pagination` |
| Tag multi-select | `TagSelector` |
| Confirmation dialog | `ConfirmationModal` |
| Status label | `StatusBadge` |
| Select / combobox | `Dropdown` |
| Filter row | `Filter` (FilterComponent) |

Only write custom styled-components for layout and page-specific containers that have no common equivalent.

### Colours — always `var(--color-*)`, never a raw hex
The whole product's colour theme lives in **`frontend-web/src/theme/palette.js`** — one file, brand + neutral ramp + status. `GlobalStyles` publishes every entry as a CSS custom property (`--color-brand-blue`, `--color-gray-200`, …), `config/colors.jsx` exposes the same values as JS tokens, and `routes/Home/theme.js` (the landing page) maps them onto its own key names. Nothing else may hold a hex value.

```js
// correct — the colour resolves back to the palette
background: var(--color-brand-blue);
color: ${props => props.$active ? 'var(--color-surface)' : 'var(--color-gray-700)'};

// wrong — a hex here is invisible to the theme and drifts on the next re-brand
background: #1e73aa;
```

Use the JS tokens (`colors.primary.main` from `@config/colors`) only where a real hex string is required — a chart library, canvas, a default prop. Everywhere else in CSS, use the custom property. If a colour you need has no entry, add it to `palette.js` rather than inlining it; per-feature *categorical* accents (the indigo/purple/orange used to tell content types apart) are the one exception and stay local.

The app behind `PrivateRoute` and the public landing page share this palette on purpose — they must not drift apart.

### Date & timezone formatting — always use moment-timezone
All date/time display must be in **Jakarta timezone (WIB, Asia/Jakarta)**. Use helpers from `@utils/dateUtils` — never use `new Date().toLocaleDateString()`, `Intl.DateTimeFormat` directly, or `toISOString()` for display.

| Need | Use |
|------|-----|
| Full date + time display (e.g. event times) | `formatJakartaDateTimeFull(iso)` → "Rabu, 14 Mei 2026, 10.00 WIB" |
| Date only display (e.g. registration/review dates) | `formatJakartaDateLong(iso)` → "14 Mei 2026" |
| Pre-fill a `datetime-local` input for editing | `toJakartaInputValue(iso)` → "2026-05-14T10:00" |
| Submit a `datetime-local` value back to backend (UTC) | `new Date(\`${value}:00+07:00\`).toISOString()` |

All helpers use `moment-timezone` (`moment(iso).tz('Asia/Jakarta')`). The backend stores and receives UTC ISO strings — only the frontend converts for display and form inputs.

### API calls — always go through Redux action creators
Never call `getWithToken`, `postWithToken`, `putWithToken`, or `deleteWithToken` directly from components or hooks. Define a thunk action creator in the feature's `adminAction.js` or `userAction.js` and dispatch it instead.

```js
// correct — action in adminAction.js, dispatched from hook/component
export const fetchAdminMcqTopics = (overrides = {}) => async (dispatch, getState) => { ... }
// in component/hook:
dispatch(fetchAdminMcqTopics({ status: 'published', page: 2, append: true }))

// wrong — raw API call in a hook
const res = await getWithToken(Endpoints.admin.mcq + '/topics', { ... })
```

When an existing action needs new behaviour (e.g. appending instead of replacing), extend it with an `overrides` parameter rather than creating a duplicate action. Add `appendFoo` to the reducer when needed.

### Loading state — always use Redux, never local state
Every feature reducer already has loading flags (e.g., `isCreatingDeck`, `isUpdatingDeck`, `isDeletingDeck`). **Never add local `useState` for async operation loading.** Read the flag directly from Redux and pass it to the relevant button or spinner.

```jsx
// correct
const { loading } = useSelector(state => state.flashcard)
<Button disabled={loading.isCreatingDeck}>
  {loading.isCreatingDeck ? 'Menyimpan...' : 'Simpan'}
</Button>

// wrong — don't do this
const [isSaving, setIsSaving] = useState(false)
```

The only exception is modal *visibility* (open/closed), which is always local state.

### Admin list pagination — always append ("Load More"), never numbered page-jump
Admin panel lists (`Table` + pagination) always accumulate results via a "Muat Lebih Banyak" button, never a numbered `Pagination` component that replaces the list per page. This matches the pattern already used for user-facing topic lists (e.g. AtlasQuiz Home's `loadMoreSistemBlokTopics`).

**Reducer** — add an `appendX` action alongside `setX`:
```js
setCards(state, action) { state.cards = action.payload },
appendCards(state, action) { state.cards = [...state.cards, ...action.payload] },
```

**Action creator** — the fetch thunk never receives a `page` argument; it always reads the current page from Redux state, and only takes an `append` flag to pick `setX` vs `appendX`:
```js
export const fetchNodeCards = (nodeId, { append = false } = {}) => async (dispatch, getState) => {
  const { pagination } = getState().nodeCards
  const res = await getWithToken(url, { page: pagination.page, perPage: pagination.perPage })
  dispatch(append ? appendCards(res.data.data || []) : setCards(res.data.data || []))
  if (res.data.pagination) dispatch(setPagination(res.data.pagination))
}

export const loadMoreNodeCards = (nodeId) => (dispatch, getState) => {
  const { pagination } = getState().nodeCards
  if (pagination.isLastPage) return
  dispatch(setPagination({ page: pagination.page + 1 }))
  dispatch(fetchNodeCards(nodeId, { append: true }))
}
```
Never pass `{ page: n }` as a call argument into a fetch thunk — update `pagination.page` in the reducer first (`dispatch(setPagination({ page: 1 }))` to reset, or `page: pagination.page + 1` to advance), then call the fetch thunk with no page argument. The thunk's only job is "fetch whatever page the reducer currently says," not to decide which page.

**Hook** — mount effect and any post-mutation refresh reset to page 1 (never keep the accumulated list at the current end-page after a delete/edit, since item counts shift):
```js
const reload = () => {
  dispatch(setPagination({ page: 1 }))
  dispatch(fetchNodeCards(nodeId))
}
useEffect(reload, [dispatch, nodeId])
const handleLoadMore = () => dispatch(loadMoreNodeCards(nodeId))
// handleDelete/handleEditSuccess/handleMoveSuccess all call reload(), not a page-specific refetch
```

**Component** — replace `<Pagination currentPage totalPages onPageChange>` with a conditional button:
```jsx
{!pagination.isLastPage && (
  <Button variant="secondary" onClick={handleLoadMore} disabled={loading.isFetchingCards}>
    {loading.isFetchingCards ? 'Memuat...' : 'Muat Lebih Banyak'}
  </Button>
)}
```

### Admin table columns — never set a fixed `width` on `Table` columns
Let the `Table` common component size every column naturally (content-driven). Do not pass `width` on column definitions, including the `Aksi`/actions column — a fixed px width either clips buttons as more actions are added or leaves wasted whitespace as the row set changes.

To right-align an actions column, pass `align: 'right'` on the column **and** make sure the button-group wrapper actually collapses to its content width so the alignment has something to push against — either:
- `display: inline-flex` on the wrapper (so it responds to the cell's `text-align: right`), or
- `display: flex; justify-content: flex-end` on the wrapper (a block-level flex container already stretches to the cell's full width, so `justify-content: flex-end` positions the buttons correctly on its own)

```jsx
// correct — no width, right-aligned via inline-flex button group
{ header: 'Aksi', align: 'right', render: (c) => <ActionGroup>...</ActionGroup> }
// ActionGroup: styled.div`display: inline-flex; gap: 0.375rem;`

// wrong — fixed width clips/wastes space as actions change
{ header: 'Aksi', width: '200px', align: 'right', render: (c) => <ActionGroup>...</ActionGroup> }
```

### Styled-components convention
- Each component has its own co-located `ComponentName.styles.jsx` — do **not** aggregate all styles into the page-level `PageName.styles.jsx`
- The page-level `PageName.styles.jsx` holds only: page layout wrappers (Container, PageHeader, etc.) and styled components genuinely shared by two or more sibling components
- All styled-component identifiers must be in English — do not use Indonesian words as styled-component names (e.g., `StartButton` not `MulaiBtn`, `SectionLabel` not `BidangLabel`)
- Use `styled-components` — no inline style objects except for one-off spacing tweaks
- Transient props use the `$` prefix (e.g., `$active`, `$locked`)

### react-bootstrap for page structure/layout, styled-components for visuals
New pages should combine **react-bootstrap** (layout/structure primitives — `Container`, `Row`, `Col`, `Stack`, and similar grid/responsive utilities) with **styled-components** (custom visual styling, theming, one-off elements) rather than hand-rolling layout with bespoke styled `<div>` grids.
- react-bootstrap is for structural scaffolding only — it does **not** replace the common component library (`components/common/`). Buttons, modals, inputs, dropdowns, etc. still must use the existing common components (see the table at the top of this file), not react-bootstrap's `Button`/`Modal`/`Form.Control`/etc.
- Wrap react-bootstrap primitives with styled-components when custom visual treatment is needed (e.g. `styled(Row)\`...\``), rather than passing one-off inline styles.
- **Not yet an installed dependency** — add `react-bootstrap` (and `bootstrap` for its base CSS) to `frontend-web/package.json` the first time a page actually adopts this pattern.
- This is a go-forward convention for new pages — existing pages built purely with styled-components are not required to be retrofitted.

### Component and hook naming — always use English
All component file names, function component names, hook names, and hook-exported variable names must be in English. UI label text (placeholders, button labels, headings) stays in Indonesian — only the code identifiers must be English.

```
✓ ContentTab.jsx, RelatedContentTab.jsx, DepartmentSection.jsx
✗ KontenTab.jsx, KontenTerkaitTab.jsx, BidangSection.jsx
```

### Page structure — components in `components/`, logic in `hooks/`
Every page follows this layout:

```
PageName/
  index.jsx                    ← thin orchestrator: composes components, passes props
  PageName.styles.jsx          ← page layout + any styles shared by sibling components
  components/
    ComponentA/
      index.jsx                ← UI only — no inline useState/useEffect logic
      ComponentA.styles.jsx    ← styles for this component only
      hooks/
        useComponentA.js       ← state/effects/derived data used only by ComponentA
    ComponentB/
      index.jsx
      ComponentB.styles.jsx
  hooks/
    usePageName.js             ← state/effects owned by index.jsx itself, or shared by 2+ components
  utils/
    pureHelper.js              ← plain functions with no React/Redux dependency (e.g. checkFeatureLock) — not a hook, don't prefix with `use`
```

Rules:
- Each component has its own `ComponentName.styles.jsx` — never dump all styles into the page styles file
- `index.jsx` is a thin orchestrator: no inline business logic, no Redux calls except to pass dispatch actions as props
- A hook that only re-exports another hook's values is not a hook — inline the call instead
- **Hook placement — always a hook file, never inlined, scope decides which folder**: any component using `useState`/`useEffect`/`useCallback`/etc. for its own state must have that logic in a hook file, not written inline in its `index.jsx`. Where that hook file lives depends on scope: used by only that one component → `components/ComponentName/hooks/useComponentName.js`. Owned by the page itself or shared by two or more sibling components → the page-level `hooks/` folder. A single-component hook never sits in the page-level `hooks/` folder, and page/shared logic never sits inside one component's folder.
- The parent `index.jsx` owns any hook whose state is shared between two or more child components
- **useSelector placement**: If Redux data is needed for display only (no logic in the hook touches it), call `useSelector` directly in the component — do not return it from the hook. If the hook itself needs the data for its logic, call `useSelector` inside the hook. Never have the hook return data it doesn't process just so the component can read it.
- **Audit hook returns for pass-through fields**: when reviewing a hook's `return` statement, check each field against the component that calls the hook — if that component only forwards the field as a prop to a child without ever reading/branching on it itself, the field doesn't belong in the hook's return at all. Move the `useSelector` all the way down to whichever component actually reads the value (which may be a grandchild, not just the immediate caller) rather than threading it through intermediate layers. This applies transitively — re-check the new leaf component too, since it may reveal further fields (e.g. a feature-flag object) that only exist to be forwarded again.
- A component that's grown multiple independent modes/tabs (e.g. a drawer with 3 unrelated content types) should split each mode into its own subcomponent + hook under that component's own `components/` folder, rather than managing all modes' state in one file.
- **When to split**: if `index.jsx` has more than one visually distinct section (a header, a search+list block, a side panel, etc.), each section becomes its own `components/` entry — don't wait for the file to become unreadable. This applies retroactively too: an older page that still has everything inline in `index.jsx` should be split the same way the next time it's touched, not left as-is because "it already works."
- A styled-component used by two or more sibling components (not by the page itself) stays in the page-level `PageName.styles.jsx`, with a one-line comment naming which siblings share it (e.g. `// Shared by DueTodayPanel and ProgressPanel`) — this is the one exception to "every component owns its own styles file."

### Navigation — always use named route definitions, never hardcoded path strings
Every route group exports a `SomethingRoute` class with the path patterns (e.g. `TopicHubRoute.detailRoute = '/topic/:topicSlug'`). Always navigate through it — never rebuild a path by concatenating a local constant or a raw string template.

```js
// correct
import { TopicHubRoute } from '../../routes'
navigate(generatePath(TopicHubRoute.subtopicRoute, { topicSlug, subtopicSlug: slug }))
navigate(TopicHubRoute.moduleRoute)

// wrong — hardcoded/rebuilt path, drifts silently if the route definition changes
const TOPIC_ROUTE = '/topic'
navigate(`${TOPIC_ROUTE}/${topicSlug}/${slug}`)
```

Use `generatePath` (from `react-router-dom`) whenever the route has params; a route with no params can be passed directly.

---

## Backend Rules

### File & image storage — always use attachments + blobs
- **Never** add `blob_id` or `image_id` columns directly to feature tables
- **Never** store raw URLs in columns — always store via the blob/attachment pattern
- Use the polymorphic `attachments` table: `record_type` + `record_id` + `name`

**Frontend upload flow:**
1. Use the `FileUpload` common component with `onFileSelect`
2. Call `dispatch(upload(file, 'folder-name'))` from `@store/common/action` → returns `{ blobId, url, filename, ... }`
3. Send the `blobId` to the backend in the create/update payload

**Backend attach flow (in the service, after creating the record):**
```js
await attachmentService.attach({ blobId, recordType: 'my_feature', recordId: record.id, name: 'image' })
```

**Retrieve with signed URL:**
```js
// single
const attachment = await attachmentService.getAttachmentWithUrl('my_feature', record.id, 'image')
// multiple
const attachments = await attachmentService.getAttachmentsWithUrls({ recordType: 'my_feature', recordId: record.id, name: 'evidence' })
```

**When updating:** call `attachmentService.detachAll({ recordType, recordId })` before re-attaching if replacing.

### Video upload — Bunny.net Storage + blobs + attachments
Videos are stored on **Bunny.net Storage** (CDN) and tracked via the blob/attachment system. The CDN URL is also stored directly as a column on the record for fast retrieval (no presigning needed — Bunny URLs don't expire).

**env vars required:** `BUNNY_STORAGE_REGION`, `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_STORAGE_ACCESS_KEY`, `BUNNY_CDN_HOSTNAME`

**Frontend upload flow:**
1. Use `FileUpload` with `acceptedTypes={['video/mp4', ...]}` and `onFileSelect`
2. Call `dispatch(uploadNodeVideo(file))` from the feature's `adminAction.js` → hits `POST /admin/v1/feature-nodes/upload/video`
3. Returns `{ blobId, videoUrl, filename }` — `videoUrl` is the permanent Bunny CDN URL
4. Store both in local state: `form.videoUrl` (for display + submit) and `videoBlobId` (for attachment)
5. Send `videoUrl`, `videoExplanation`, and `videoBlobId` in the create/update payload

**Backend attach flow:**
```js
// In service, after creating/updating the record:
if (videoBlobId) {
  await attachmentService.attach({ blobId: parseInt(videoBlobId), recordType: 'feature_node', recordId: node.id, name: 'video' })
}
```

**Blob metadata for Bunny blobs:** `{ storageType: 'bunny', cdnUrl: '...' }` — `attachmentService.getAttachmentWithUrl()` reads this and returns `cdnUrl` directly (skips iDrive presigning).

**User-facing video display — download prevention + watermark:**
- Render video via `<video controlsList="nodownload" disablePictureInPicture onContextMenu={e => e.preventDefault()}>` inside a positioned container
- Overlay a watermark `<div>` with `position: absolute`, `pointerEvents: none`, `userSelect: none`
- For full URL-level protection: enable Token Authentication on the Bunny pull zone in the Bunny dashboard

### Content-to-content relations — always use `content_relations`
When linking one content record to another (e.g. summary note ↔ anatomy quiz, summary note ↔ flashcard deck, quiz ↔ related quiz), **never create a new dedicated join table**. Use the existing polymorphic `content_relations` table: `source_type` + `source_id` + `target_type` + `target_id` (+ optional `relation_type`).

```js
// correct — generic relation row, no new table
await prisma.content_relations.create({
  data: { source_type: 'summary_note', source_id: note.id, target_type: 'anatomy_quiz', target_id: quiz.id },
})

// wrong — don't add a new summary_note_anatomy_quizzes table
model summary_note_anatomy_quizzes { ... }
```

To read relations for a record, query both directions as needed:
```js
await prisma.content_relations.findMany({ where: { source_type: 'summary_note', source_id: note.id, target_type: 'anatomy_quiz' } })
```

This keeps new content-linking features from requiring a schema migration. `feature_node_records` (node → content) and the `attachments`/blob pattern (file → content) remain separate, purpose-built tables — this rule applies specifically to content-to-content relations.

### `feature_nodes` layer & `node_type` convention — always filter reads by `node_type`

`feature_nodes` is a shared, self-referencing tree (`parent_id`, `layer`, `node_type`, `slug`, `visibility`, `classification`) reused across multiple features — Materi (canonical topic/subtopic admin), Flashcard V2, MCQ V2, SummaryNotes V2, Diagnostic V2, and Anatomy/Atlas V2. Because it's shared, **sibling nodes under the same parent can have different `node_type` values** (e.g. a topic can have both `subtopic` children from Flashcard/MCQ and `module` children from Anatomy/Atlas). A `layer`-only filter is not enough to isolate the nodes a feature actually owns.

**Layer 1 (root/topic) — `node_type: 'topic'`** for every feature except Diagnostic, which uses `node_type: 'module'` at layer 1 instead (its own naming — a Diagnostic "module" is the layer-1/topic-equivalent, not the same concept as Anatomy/Atlas's layer-2 `module`).

**Layer 2 (child) — varies by feature:**
| Feature | `node_type` |
|---|---|
| Materi, Flashcard V2, MCQ V2, SummaryNotes V2 | `subtopic` |
| Anatomy/Atlas V2 (holds `3d_atlas` / `anatomy_quiz` content) | `module` |
| Diagnostic V2 | `submodule` (Diagnostic's own naming — layer 1 is `module`, layer 2 is `submodule`; unrelated to Atlas's layer-2 `module`, disambiguated by `visibility: 'diagnostic'` vs `'general'`) |

**Rule:** every fetch of `feature_nodes` (admin and user-facing) must pass an explicit `nodeType` filter matching what the calling feature actually creates. Diagnostic V2 used to be the sole exception (it relied on `visibility: 'diagnostic'` alone) but as of 2026-08 its admin panel and its user-facing read services (categories, submodules, progress) also filter explicitly — `node_type: 'module'` at layer 1, `node_type: 'submodule'` at layer 2 — like every other feature. **Caveat:** legacy/seeded Diagnostic nodes that still have `node_type: null` (created before this convention existed) will not match the filter and will silently disappear from listings until an admin re-opens and re-saves them through the admin form (which now always stamps the correct `node_type` on save). This is an accepted tradeoff, not a bug — no backfill migration has been run for those rows yet. Omitting the filter entirely lets nodes from other features silently leak into a topic/subtopic list.

```js
// correct — Flashcard V2 fetching its own subtopics
getWithToken(Endpoints.api.featureNodes, { parentSlug, layer: 2, nodeType: 'subtopic', perPage: 100 })

// wrong — missing nodeType lets Anatomy/Atlas 'module' nodes leak into the subtopic list
getWithToken(Endpoints.api.featureNodes, { parentSlug, layer: 2, perPage: 100 })
```

When creating a node, always set `nodeType` explicitly to the value above for that feature/layer — never leave it `null`/unset on new records (only pre-existing Diagnostic topics are allowed to be null, as a historical exception, not a pattern to repeat).

### Route/controller/service pattern
```
Routes  →  Controller  →  Service  →  Serializer  →  Response
```
- Routes: `backend/routes/admin/v1/<feature>.routes.js` + `backend/routes/api/v1/<feature>.routes.js`
- Controllers: thin — extract params, call service, serialize, respond
- Services: all business logic, one class per operation, `static async call({})`
- Serializers: shape the JSON response, one per admin/user variant

### Admin middleware stack
```js
authenticateToken → requireAdmin → requireTabPermission('tab') → requireFeaturePermission('feature')
```

### Complex queries — always confirm before implementing
Before writing any service logic that involves a **count/sum aggregation across rows, a multi-table join beyond a single Prisma `include`, or raw SQL (`$queryRaw`/`$executeRaw`)**, stop and ask the user to confirm the approach first — don't just implement it. This covers things like: rolling up child-node statistics to a parent, cross-table `UPDATE ... FROM` raw SQL (e.g. syncing `user_node_progress` counts off `user_review_states.last_rating`), or any aggregation that mixes counts from more than one table/relation. Simple single-table `findMany`/`aggregate`/`groupBy` calls don't need this — it's specifically for logic complex enough that a subtle off-by-one or wrong join direction would silently corrupt stats.

### Pagination
- Backend: `take = perPage + 1`, return `isLastPage = items.length <= perPage`, slice to `perPage`
- **Never** return `total` or `totalPages` — only ever return `isLastPage` (and optionally `page`, `perPage`)
- Frontend: use the `Pagination` common component

### Admin list filters
- **Never** filter client-side after loading all records
- Always pass filter values as query params to the API and let the backend filter
- Include all active filters in the Redux `filter` state; read them in the action before building `queryParams`
- Call the API (re-fetch) when the user clicks apply/search, not on every keystroke

### Enum/status values in database — always in English
All enum-like string values stored in the database (status fields, type fields, difficulty levels, classification keys, etc.) must use English identifiers. UI display labels shown to users stay in Indonesian, but the stored values must be English.

```js
// correct — stored value is English, displayed label is Indonesian
difficulty: 'easy' | 'medium' | 'hard'   // stored
label: 'Mudah' | 'Sedang' | 'Sulit'      // displayed

status: 'draft' | 'published'
classification: 'physiology' | 'pathology' | 'block_system' | 'cross_system'

// wrong
difficulty: 'mudah' | 'sedang' | 'sulit'  // don't store Indonesian in DB
```

### Validation error messages — always in Indonesian (Bahasa Indonesia)
All `ValidationError` messages thrown in services must be written in Indonesian. Never use English for user-facing error messages.

```js
// correct
throw new ValidationError('Nama wajib diisi')
throw new ValidationError('Slug sudah digunakan')
throw new ValidationError('Node induk tidak ditemukan')

// wrong
throw new ValidationError('Name is required')
```

### Datetime responses — always ISO 8601 in Jakarta timezone
All datetime fields returned from the backend API must be formatted as ISO 8601 strings in Jakarta timezone (`+07:00`), not UTC. Use the `toJakartaISO` helper from `backend/utils/dateUtils.js`.

```js
import { toJakartaISO } from '#utils/dateUtils'

// In serializers:
createdAt: toJakartaISO(record.created_at),
updatedAt: toJakartaISO(record.updated_at),
```

The helper: `new Date(date).toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).replace(' ', 'T') + '+07:00'`

### Email
- Email is sent via `emailService` (`backend/services/email/emailService.js`) using nodemailer
- Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

---

## V1 vs V2 endpoints — never modify V1, always add V2

When a V2 variant of an existing endpoint is needed (e.g., different response shape, combined features, new behaviour), **never modify the existing V1 endpoint or service**. Instead:

1. Create a new service in the same folder (e.g., `getActiveFeaturesV2Service.js`)
2. Create a new controller under `backend/controllers/api/v2/<feature>.controller.js`
3. Create a new route file under `backend/routes/api/v2/<feature>.routes.js`
4. Register with `app.use('/api/v2/<feature>', ...)` in `backend/server.js`
5. Add the new path to `frontend-web/src/config/endpoint.jsx` (e.g., `featuresV2: "/api/v2/features"`)
6. Add a new action in `userAction.js` (e.g., `fetchFeaturesV2`) — do **not** replace the existing action

The V1 endpoint and its consumers stay untouched.

---

## Adding a New Feature — Checklist

**Backend**
1. Add models to `backend/prisma/schema.prisma`
2. Create migration SQL in `backend/prisma/migrations/<timestamp>_<name>/migration.sql`
3. Create routes, controller, services, serializers
4. Register routes in `backend/server.js`
5. Seed constants if needed

**Frontend**
1. Create store: `reducer.js`, `adminAction.js`, `userAction.js`, `index.js`
2. Add reducer to `frontend-web/src/store/store.js`
3. Add endpoints to `frontend-web/src/config/endpoint.jsx`
4. Build admin page under `frontend-web/src/routes/Admin/`
5. Build user pages under `frontend-web/src/routes/<Feature>/`
6. Register routes in `frontend-web/src/appRoutes.jsx`
