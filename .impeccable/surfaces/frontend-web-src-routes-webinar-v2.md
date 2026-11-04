---
version: 1
slug: "frontend-web-src-routes-webinar-v2"
primary_target: "frontend-web/src/routes/Webinar/v2"
related_targets: ["frontend-web/src/store/webinar/v2"]
---

# Webinar V2 (`/webinar`)

Scope: the signed-in webinar surface — discovery, registration, and registration
status. Visitor mode: Operate. V1 stays on disk under `routes/Webinar/v1/` and is
no longer mounted.

Audience: Indonesian medical students, returning across short sessions.
Task: find the next webinar whose registration is still open and register for it
(registration requires uploading 1–3 evidence files, so it is a deliberate act,
not a browse); on every later visit, read the approval state and open the join
link. Constraints: detail stays a modal (user's call — no `/webinar/:uniqueId`);
all times Jakarta/WIB; data comes from the existing V1 API unchanged.

Unresolved: none open. Number of concurrent webinars is unknown; the chosen form
is the one that holds from 2 to 20.

## Direction contract

THESIS: One viewport answers both standing questions — "webinar apa berikutnya"
and "pendaftaran saya sudah disetujui belum". It refuses the two-tab arrangement
that hides registration state behind a click, and refuses the flat equal-weight
grid where the nearest open webinar has to be hunted for.

OWN-WORLD: The committed MedPal palette and type, unchanged, no new tokens. Brand
blue `#1e73aa`→`#2e8fc2` is the only large colour field on the page; brand green is
reserved for live and approved state; amber for a closing deadline; white cards at
radius 12–18 on the `#f6fafb` ground, separated by the tinted page rather than by
borders. Baloo 2 headings over Plus Jakarta Sans body. Phosphor icons (`react-icons/pi`)
at one stroke weight — no emoji anywhere, which is what V1 used as its icon system.

STORY: A student lands and the nearest open webinar is already the largest thing on
screen with its closing deadline legible; they register by uploading evidence; on
return the status band tells them where their registration stands and hands over the
join link without a second page.

FIRST VIEWPORT: Thin head — "Webinar" plus a real count line. Then a full-width
billboard, min 260px: the webinar's thumbnail under a left-weighted blue scrim,
title at ~2rem Baloo 2 with speakers and the Jakarta time beneath it, and a white
action block at the right holding the state-aware primary CTA over the registration
window. A 5px bar across the billboard's top edge depletes across the registration
window — the signature move, and the only progress indicator on the page. Directly
beneath it a permanent white band, "Pendaftaran Saya", carrying three counted status
chips and the next approved join link; the chips expand a drawer in place. Then the
filter chips with search, then the 3-up card grid closing with "Muat Lebih Banyak".

FORM: Billboard & Kisi — first on my ordered list of seven, dealt into the hand at
index 1. The roll led with Panggung & Strip; the user delegated the choice and I took
Billboard, because it holds from 2 to 20 webinars where the stage degrades at both
ends, and because it keeps the join-link job permanently visible. It carries one raise
from Panggung: the depleting registration-deadline bar. seed:b0e92860010eff0e

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
