---
version: 1
slug: "frontend-web-src-routes-oscepractice-v2"
primary_target: "frontend-web/src/routes/OscePractice/v2"
related_targets: ["frontend-web/src/store/oscePractice/v2","backend/services/osce/v2"]
---

# OSCE Practice V2 (`/osce-practice`)

Scope: the whole signed-in OSCE practice flow — hub, station picking, the mic/STT
gate, the live station, and the result debrief. Visitor mode: Operate. V1 stays on
disk under `routes/OscePractice/v1/` and is no longer mounted.

Audience: Indonesian medical students preparing for OSCE/UKMPPD, returning across
short sessions. Task: resume an unfinished station, or pick the station that fixes
their weakest topic, work it under a 15-minute clock talking to an AI patient, and
read the rubric debrief afterwards.

Constraints: all times Jakarta/WIB; the session engine (messages, STT provider
choice, physical-exam interactions, end/evaluate) is reused unchanged from
`store/oscePractice` — only the hub's own shape gets a V2 slice, the way Webinar V2
did. V1 backend endpoints stay untouched; the hub's three new reads ship as
`/api/v2/osce-practice/{hub,topics,sessions}`.

Decided this session (user): all five pages reshaped; the flow may be condensed; the
hub's first viewport answers "lanjutkan atau mulai", not "aku lemah di mana".

Unresolved: none open. Mic permission becomes a gate inside the hub's start action
rather than its own page, so `/session/:id/preparation` survives only as a redirect
for existing links.

## Direction contract

THESIS: One board, work areas side by side — nothing a student still owes the rubric
is hidden behind a tab. It refuses the five-top-tab station room of V1, where you can
talk for fourteen minutes and hear the bell with Diagnosa and Terapi still empty, and
it refuses the separate `/topics` page that made picking a station a second errand.

OWN-WORLD: The committed MedPal palette and type, no new tokens. Brand blue
`#1e73aa`→`#033c62` is the only large colour field, and it is reserved for the live
rail and the running clock; brand green for a cleared station, amber for the last
2.5 minutes, danger red for under a minute and for a rubric section left empty.
White panels at radius 14 on the `#f6fafb` ground, separated by the tinted page and
by 1px `#eff3f5` hairlines rather than by nested cards. Baloo 2 headings over Plus
Jakarta Sans body; all numbers read under time pressure — the clock, scores,
durations — set with `font-variant-numeric: tabular-nums` so the digits hold their
width as the clock ticks. No mono face is loaded: a fourth webfont request for one
surface costs more than it buys when the committed body face already has tabular
figures. Micro-labels are uppercase at 0.14em tracking in the same family, never
below 12px and never lighter than `#5c6b74`. Phosphor icons
(`react-icons/pi`) at one stroke weight; no emoji anywhere, which is what V1 used as
its icon system.

STORY: A student lands and the running session is already the first thing in the
rail with its clock live and one Lanjutkan. If nothing is running, the same rail slot
names their weakest topic and the board beside it is already filtered to it — which
is how a student knows which patient is worth their next fifteen minutes: the
performance rows in the rail are the filter, and each station row carries that
student's own record on it (Belum pernah / Skor terbaik 78 / Terakhir 2 Nov). Inside
the station the board stays: scenario in the rail, the patient conversation in the
middle, the worksheet always visible at the right with its empty sections marked, so
the bell never arrives as a surprise. The debrief reuses the same board — weighted
rubric at the left, the evidence that earned it at the right.

FIRST VIEWPORT: Thin page head ("Latihan OSCE" plus a real count line). Below it a
two-column board at 320px / 1fr. Left rail, one white panel: a blue live block —
mono "SESI BERJALAN", station name in Baloo 2 at ~19px, topic and batch beneath, the
clock at ~38px mono, and a full-width Lanjutkan; then hairline-separated performance
rows, weakest first, each a name, a 72px bar and a mono score, each one a filter;
then two mono footnote rows (stations marked, total practice time). Right column, two
stacked white panels: "Pilih stasiun" with a search field and topic/batch selects
over hairline station rows (name, one-line scenario, tag, mono duration, the
student's own record, and a right-aligned Mulai sesi), then "Riwayat latihan" as
hairline rows closing with Muat Lebih Banyak. The primary action sits in the rail,
never hunted for in a card.

FORM: Papan Kerja — third on my ordered list of seven, dealt into the lead by the
roll. The user delegated the final pick and I took it over my own first-ranked
Kartu Tugas & Kisi, because the billboard answers the hub well but leaves the station
room tabbed, and the station room is where V1 actually loses marks for students. It
carries three raises: hairline data rows with mono micro-labels instead of nested
cards (from the declined Plate Section), a declared grid that folds by whole columns
(from the declined Grid Specimen), and the worked-in area lifting while the others
quiet down (from the declined Title Card Wall), plus one borrowing from the
competitive Rel Tab Berjenjang: per-section "masih kosong" state marks on the
worksheet. seed:b96785c8d2050c80

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
