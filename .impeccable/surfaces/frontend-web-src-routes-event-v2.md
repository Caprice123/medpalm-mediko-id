---
version: 1
slug: "frontend-web-src-routes-event-v2"
primary_target: "frontend-web/src/routes/Event/v2"
related_targets: ["frontend-web/src/store/event/v2","backend/services/event/v2"]
---

# Event V2 (`/events`)

Scope: the signed-in Event surface — claiming a reward and tracking the claim.
Visitor mode: Operate. V1 stays on disk under `routes/Event/v1/`, unmounted.

Audience: Indonesian medical students. Task: see whether a reward is claimable
right now, claim it by uploading proof, and later read whether the claim was
approved and what was actually granted.

**Evidence from the live database (5 events, 32 registrations), which drove the
design more than the schema did:**
- `start_at` / `end_at` are null on every event. An Event has no event date —
  only a claim window. It is an offer, not a happening.
- `credits_on_approval` is 0 on all five; `credits_granted` is null on all 32.
  Credits have never once been used. Rendered only when > 0.
- `allowed_features` is always exactly one feature, always `durationDays: 2`
  (`atlas` → "Atlas 3D", `anatomy` → "Quiz Anatomi Interaktif"). The reward is
  one short line, not a goods panel.
- Claim windows run 6–7 days, so **nothing is claimable most of the time**. The
  empty state of track one is the normal state, not an edge case.
- Real rejections are about missing Instagram-follow proof, in casual Indonesian.

Constraints: detail stays a modal; all times Jakarta/WIB; evidence max 5 files.
Registration mechanism is carried over from Webinar V2 unchanged.

Unresolved: none open. Whether events should ever carry a real event date is a
product question; `startAt`/`endAt` stay unexposed until it is answered.

## Direction contract

THESIS: The page is split exactly where the student's two questions are — "what
can I claim right now" and "did my claim land, and what did I actually get". It
refuses the two-tab arrangement that hid the outcome, and refuses a comparison
table, because events are not alternatives to choose between: if you qualify for
three you claim all three.

OWN-WORLD: The committed MedPal palette and type, no new tokens — verified
mechanically, every colour resolves to `theme/palette.js`. Brand blue tint carries
the reward line; brand green marks what was actually granted; amber marks a
closing window; white cards at radius 13–16 on the `#f6fafb` ground, separated by
the tinted page rather than borders. Shadows derive from `gray900` at low alpha.
Baloo 2 headings over Plus Jakarta Sans. Phosphor icons at one stroke weight.

STORY: A student lands and either one claimable reward is sitting there with its
deadline, or the page says plainly that nothing is open and shows their history
instead. They claim by uploading proof; on return the history row tells them what
was granted and whether the access has since expired.

FIRST VIEWPORT: Thin head — "Event" plus a real count line. Track one, "Bisa
diklaim sekarang": a card grid where each card leads with a one-line reward panel
(unlock icon, feature name, duration pill), then the title, a two-line
description, and a window pill — amber when closing, green when there is no limit
— with a depleting bar across the card's top edge only when a window exists. When
nothing is open, the whole track collapses to one quiet notice. Track two,
"Riwayat klaim": rows led by a tinted status icon, each showing what was actually
disbursed, the admin's note on a rejection, the evidence files, and a re-claim
action.

FORM: Dua Jalur — second on my ordered list of seven, dealt into the hand at
index 4. The roll led with the Ledger; I argued against it and the user delegated
the call, because a table's value is choosing one row among many and there is no
such choice here, and because only this structure gives `creditsGranted` /
`featuresGranted` a real home. It carries one raise from the Webinar billboard:
the depleting window bar. seed:6a610d66cd31b4f6

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
