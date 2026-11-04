---
target: "http://localhost:5173/topic"
total_score: 17
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:D:\\codes\\project\\zharfan\\medpalm-mediko-id\\frontend-web\\src\\routes\\TopicHub\\pages\\TopicHub"
timestamp: 2026-11-04T13-34-34Z
slug: frontend-web-src-routes-topichub-pages-topichub
---
**Method: dual-agent** (A: design review, B: detector + static evidence, isolated and parallel)
**Mode: Operate** - judged as app UI.

**Run notes:** no browser automation exposed (browser-use MCP failed to connect); no rendered-DOM evidence, no overlay, no measured boxes. Source-read only; contrast computed from palette hexes. The 1240px max-width was removed mid-run at the user's request.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Skeletons exist; no error state, no empty state. SKELETON_COUNT=8 vs 11 topics reflows every load. |
| 2 | Match System / Real World | 2 | English "Hi," and "Complete Study" in an Indonesian UI; "Sesi Terakhir" names a thing that is not a session. |
| 3 | User Control and Freedom | 3 | Easy to leave, nothing destructive; resume card cannot be dismissed, topics cannot be pinned. |
| 4 | Consistency and Standards | 1 | Two greetings in two languages; emoji removed here, kept on TopicDetail + DashboardV2; local shimmer duplicates common/SkeletonCard; no :focus-visible though common/Button defines one. |
| 5 | Error Prevention | 2 | localStorage last-topic can outlive its slug; nothing validates before navigating. |
| 6 | Recognition Rather Than Recall | 2 | 22 topics visible but identical - no description, progress, or visited marker. |
| 7 | Flexibility and Efficiency | 1 | No search, filter, or shortcut across 22 topics; refetches on every mount. |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely restrained. 38px informationless greeting is loudest element; card edges 1.19:1. |
| 9 | Error Recovery | 0 | No error path exists. No catch, no interceptor, both sections return null on empty. |
| 10 | Help and Documentation | 1 | Section descriptions do real work; nothing explains the one-tree-many-features model. |
| **Total** | | **17/40** | **Poor - major UX work required** |

Honest framing: the visual design is not a 17. Two heuristics score 0 and 1 because whole categories of behaviour are missing - error recovery and efficiency - not because the page is ugly. Fix those two and it moves into the low 20s without touching a colour.

## Design Specificity Verdict

Category-interchangeable. Swap the Indonesian strings and this ships as a Notion workspace index or Jira project list unchanged.

Sharpest finding: the page throws away data it already has. userFeatureNodesSerializer hands the frontend icon, description and classification on every node, and TopicInfo/index.jsx:15 renders all three one click deeper. The hub renders {topic.name} plus an arrow. PRODUCT.md principle 4: a field an admin can fill and the UI then ignores is a bug, not a spare.

The only authored product-specific element is one sentence of section copy. Removing the random emoji circles was right; removing the only decoration without replacing it with information left a page that is tasteful and anonymous. Restraint is not specificity.

**Deterministic scan:** exit 2, 11 files scanned, 1 finding - `side-tab` (warning) at LastSession.styles.jsx:29 (border-left: 4px solid var(--color-brand-blue)). FALSE POSITIVE: Assessment A independently named that rail the only boundary above 3:1 on the page. The detector ran regex-only on .jsx; parsed-page rules (tiny-text, low-contrast) never executed - an undercount, which matters because the contrast failures below are exactly what those rules would have caught.

**Visual overlays:** unavailable (no browser automation).

## Overall Impression

The re-theme worked; #1e73aa on #f6fafb is a credible calm medical palette, and the uniform grid is the best decision on the page. What is wrong is not taste: it is a beautiful list of 22 identical things with no way to tell them apart, no search, and no behaviour when the network fails.

Biggest opportunity: GET /api/v2/review/stats already returns dueCount per topic node, keyed on exactly the node_type 'topic' layer-1 set this page renders. One existing endpoint turns a flat grid into a page that shows where work is waiting - and creates the missing visual hierarchy, since cards with work earn weight and the rest recede.

## What's Working

1. Uniform grid - repeat(auto-fill, minmax(17.5rem, 1fr)) gives one left edge to scan down, which matters because names run from "Dasar Kedokteran" to "Sistem Gastrointestinal, Hepatobilier, dan Pankreas". min-height 3.5rem keeps every target above 44px even when a long name wraps.
2. Demoting "Sesi Terakhir" (1rem/gray-600 under a 1.625rem blue heading) plus the accent rail and max-width 32rem makes it a different kind of object without raising its voice.
3. Section descriptions are editorial, not filler - they teach the shape of the content tree in one sentence.

## Priority Issues

**[P1] A failed fetch renders a greeting over an empty page, silently.**
fetchUserTopics (store/featureNodes/userAction.js:23-34) is try/finally with no catch; there is no axios interceptor; TopicGroupSection returns null on empty for both sections. Dropped campus wifi yields "Hi, Dinda." over 600px of nothing plus an unhandled rejection. Nothing distinguishes network failure from no-content-published from still-loading.
Fix: add catch, add an error field to the slice beside the existing loading flags, branch three ways using the existing common/EmptyState ("Gagal memuat topik" + "Coba Lagi"; empty gets a capybara from assets/landing/).
Command: /impeccable harden

**[P1] 22 undifferentiated options, no search, no study signal - though the data exists.**
Every card is a name and a chevron. No search on the page and none in the 44px TopBar, which holds one toggle icon. The first and most consequential decision of every session gets no help at all.
Fix in order: (1) topic.description as a clamped second line; (2) a dueCount chip from /api/v2/review/stats; (3) a TextInput filtering client-side over arrays already fully in Redux. Caveat: a per-topic content count is a cross-row rollup (node_statistics lives on layer-2 children) requiring CLAUDE.md confirmation first - do not start there.
Command: /impeccable shape

**[P1] Hierarchy inversion, plus a second greeting in a different language.**
The 38px "Hi, Dinda." is the largest, highest-contrast element and carries no information, while the 22 targets sit at 0.9375rem/gray-700. DashboardV2 index.jsx:105 already greets in Indonesian with fallback 'Sobat'; this page uses English "Hi," and 'Dokter Muda'. Roughly 378px is consumed before the first card - about 42% of a laptop's first screen.
Fix: collapse to one line at ~1.125rem, or delete it and let "Sistem Blok" be the h1. If a greeting stays, share DashboardV2's getGreeting().
Command: /impeccable layout

**[P2] "Sesi Terakhir" over-promises.**
saveLastTopic is called from exactly one place - this page's own click handler - so it records the last card clicked here, never a subtopic, never a deep link. Its meta line reads "Overview topik" and it resolves to a table of contents. No staleness check, so a renamed topic renders its raw slug downstream.
Fix: relabel honestly ("Topik Terakhir Dibuka"), or make it true - write the bookmark from the subtopic and player routes, store {topicSlug, subtopicSlug}, resolve to subtopicRoute. The second is the only way this page gets a genuine peak.
Command: /impeccable clarify

**[P2] Card boundaries effectively invisible; the arrow fails AA.**
TopicCard fill #ffffff on page #f6fafb = 1.05:1; its 1.5px #e7ecef border = 1.19:1, against WCAG 1.4.11's 3:1. TopicCardArrow at gray-400 = 2.93:1 against the 4.5:1 it needs as a text glyph, and it is the card's only affordance marker. No :focus-visible on either card though common/Button defines one. This is a palette gap, not a component oversight: gray-300 is 1.26:1 and gray-400 is 2.93:1. The palette.js comment claiming the tinted page gives cards an edge without a border or shadow is measurably false at 1.05:1.
Fix: add a border token at >=3:1 against surface (around #949ea6) or carry the boundary with a 0 1px 2px elevation; darken the arrow to gray-500 (~6.1:1) or use a react-icons/pi chevron; lift Button's focus-visible into GlobalStyles, which currently defines no focus rule at all.
Command: /impeccable audit

## Persona Red Flags

**Alex (impatient power user):** no / or Cmd-K; mouse-only across 22 cards; unconditional refetch on every mount, so the 16-to-22 skeleton reflow happens on visit 40 exactly as on visit 1; no pinning while studying one block for six weeks; the one accelerator is a decoy at four clicks to actually resume.

**Sam (accessibility-dependent):** at 200% zoom the 22 cards are 22 text fragments with no perceivable extents (1.19:1); the arrow glyphs are literal text characters inside buttons, announced as "right arrow" after the topic name; SectionLabel and TopicSectionTag are both h2, so the visual demotion that works for sighted users is inaudible to him.

**Dinda (preklinik student, 15-minute sessions - PRODUCT.md's primary user):** she must remember her own curriculum position, since nothing records that she finished three Kardiovaskular subtopics yesterday; "Sesi Terakhir" says "Overview topik" when she wanted her flashcards; no due-review signal though the endpoint computes it; no subtopic counts, so she cannot judge whether a topic fits her window.

**Hana (content editor - secondary audience):** the icon she fills in is ignored on this page and rendered on the next; a topic with no qualifying children simply does not appear, with nothing distinguishing unpublished from published-but-empty from fetch-failed; the order she maintains is honoured but invisible.

## Minor Observations

- SKELETON_COUNT=8 against 11 real topics guarantees a reflow on every load, landing after the fadeUp entrance.
- Four body sizes inside a 3px span (1.0625 / 1 / 1 / 0.9375rem); the 17-vs-16px distinction does no perceptual work.
- Local shimmer duplicates components/common/SkeletonCard, and EmptyState is absent - both "always use common components" misses.
- TopBar holds rgba(255,255,255,0.65) and rgba(229,231,235,0.7); 229,231,235 is Tailwind gray-200, a value from the exact ramp the palette replaced. Assessment B also found raw hexes in AppLayout.styles.jsx at lines 47, 80, 201, 235, 242 and 395.
- Assessment B: two icon-only buttons with no accessible name (MobileCloseButton glyph, FloatingHamburger three bare spans); five sub-13px font sizes in the sidebar, down to 0.5rem (8px) on StatChevron.
- DB classification values are Indonesian ('sistem_blok', 'ilmu_lintas_sistem') against CLAUDE.md's English-enums rule and PRODUCT.md's own block_system / cross_system.
- TopicGroupSection's classification prop takes "primary"/"special" - store keys, not classifications. A third group means reshaping the reducer.

## Questions to Consider

1. If the greeting were deleted outright, what would actually be lost?
2. What if this page opened on the one card that matters instead of all 22?
3. Is "Sesi Terakhir" a bookmark or a resume button? It is written as the second and built as the first.
4. Emoji removed here, kept on TopicDetail and DashboardV2 - which surface is now wrong?
5. The palette has ten greys and not one can draw a 3:1 border. Was borderless the intent, or did the separation get asserted in a comment without anyone measuring it?
