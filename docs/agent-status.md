# Agent status

## 2026-05-11

- `[P6-CL-1][assumption]` Deleted only confirmed unused marketing components in this batch. Deferred `/onboarding`, `/platform`, and demo-data archival until the onboarding/sidebar routes are replaced, to avoid breaking active flows.
- `[P6-OB-1][assumption]` Teacher onboarding questionnaire completion routes to the existing guarded `/onboarding?path=teacher` setup until the Fase 6 status-banner and teacher setup replacement is implemented. This preserves email verification and Teacher Terms safeguards.
- `[P6-ADD-06][assumption]` The create-course modal keeps the requested three visible fields. Because the current course schema still requires `category` and `summary`, new drafts use a default Management category and an explicit draft summary that creators replace in Course Builder before review.
- `[P6-ADD-16][assumption]` Export buttons use client-side CSV/JSON generation for rows already loaded in the current surface. The Cloud Function + signed URL export path remains a later scaling upgrade for large datasets.
