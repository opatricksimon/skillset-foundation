# Skillset DESIGN V2 implementation analysis

Date: 2026-05-22

Reference source:
`docs/design-reference/skillset-design-v2-2`

This analysis treats the design export as product reference, not production source. The value of the export is not the mock data; it is the product hierarchy: which surfaces exist, how creator and learner workflows are separated, and what backend state each visual element implies.

## Executive conclusion

The V2 design is strong as a product map. It makes the platform feel like a real operating system for courses because it separates five jobs clearly:

1. Discover courses.
2. Learn inside a classroom.
3. Build and manage courses as a creator.
4. Receive money and manage tax/payout state.
5. Configure account, profile, notifications, privacy, and security.

The current app already has more backend reality than the prototype: course creation through a callable Function, duplicate title protection, course modules, lessons, pricing, drip rules, asset uploads, learner workspace, progress, comments, Stripe checkout, Stripe Connect, and payout ledger. The gap is that the current UI still exposes these capabilities as scattered forms and utility panels. The V2 design should become the presentation layer over the existing functional foundation.

The biggest product correction is this: do not add more decorative dashboard cards before tightening the course creation and course consumption loop. The MVP wins if a creator can create a course, upload or embed lessons, attach materials, submit for review, publish, and a learner can enroll, watch, download, comment, and progress.

## What the design defines

| Design screen | Product meaning | Backend/state implied |
| --- | --- | --- |
| `Discover.jsx` | Marketplace home, public learner acquisition, creator CTA | Published courses, categories, instructors, path/course stats, ratings |
| `CourseDetail.jsx` | Public sales/detail page for one course | Course listing, syllabus preview, instructor profile, reviews, checkout eligibility |
| `Paths.jsx` | Curated bundles/programs | Future collection for learning paths that group courses, cohorts, credentials |
| `Classroom.jsx` | Private learner course workspace | Enrollment, active lesson, progress, player state, notes, assets, comments, completion |
| `Community.jsx` | Course-linked/private community | Course rooms, posts, replies, reactions, pinned items, access rules |
| `Credentials.jsx` | Certificate wallet | Issued certificates, verification IDs, completion state, LinkedIn/export |
| `Studio.jsx` | Creator command center | Teacher analytics, top courses, payout summary, tasks requiring attention |
| `Builder.jsx` | Course authoring workflow | Draft course, modules, lessons, pricing, review checklist, preview |
| `Payouts.jsx` | Creator money center | Stripe Connect account, available/pending/released balances, bank accounts, statements |
| `Pricing.jsx` | Plans and platform fees | Billing plans, checkout/portal, plan entitlement, platform fee policy |
| `Settings.jsx` | Unified account settings | User profile, account email, security, notifications, learning prefs, privacy |

## Shell and navigation findings

The design shell has a cleaner mental model than the current app:

| Area | Design pattern | Current app status | Recommendation |
| --- | --- | --- | --- |
| Sidebar | Role-based sections: Teach, Discover, Account for creator; Discover, Learn, Account for learner | Current app has role-context sidebar and collapsible behavior. It is close, but labels are more utility-like and some money/account surfaces sit beside product surfaces. | Keep role-based sidebar. Use design labels: Studio, Course Builder, Media Library, Live cohorts, Communities, Marketplace, Plans & fees, Payouts & tax, Settings. |
| Topbar CTA | No universal duplicate plus button. Creator Studio owns `New course`. | Header currently still exposes `New course` in teacher context. User flagged it as redundant/noisy. | Remove `New course` from global `PlatformHeader`. Keep `New course` inside Studio header only. |
| User menu | Profile/user menu includes plan, settings, billing/payout, credentials, switch role. | Current AccountMenu has switch view and account actions. | Align copy and actions to design: Plan, Settings, Payouts & tax/Billing, My credentials, Switch view, Sign out. |
| Settings | One settings surface with internal tabs. | Current app splits profile/email/security/notifications into separate routes plus account panel. | Keep routes for now, but visually consolidate as Settings Center. Long-term route can be `/account/settings?tab=profile`. |
| Billing vs Payouts | Learner billing and creator payouts are different. Prototype incorrectly maps `billing` to `Payouts` for now. | Current app correctly separates Billing and Payments/Payouts. | Keep separation. Rename `/account/payments` to "Payouts & tax" in UI for creators. Billing remains purchases/subscriptions/invoices. |

## Creator Studio findings

The V2 `Studio.jsx` is the best reference for the teacher dashboard.

It shows:

1. Welcome header with creator-specific summary.
2. Public profile action.
3. New course action inside the Studio page.
4. KPI row: revenue, new students, completion, average rating.
5. Revenue chart with range tabs.
6. Next payout card.
7. Top courses panel.
8. Attention queue for review tasks, student questions, ready-to-review drafts.

Current app has:

1. Tabs and filters.
2. Basic metrics.
3. Revenue milestone strip.
4. Publishing checklist.
5. Wallet panel.
6. Course studio list and create modal.
7. Event studio.

Gap:

The current dashboard is function-first but not command-center-first. It feels like a checklist plus forms, while the design feels like an operating dashboard. The correct MVP compromise is to keep current functionality but restructure the top of `/teach`:

1. Hero header: "Welcome back, [name]."
2. Actions: `Public profile`, `New course`.
3. KPI row based on real zero-safe data.
4. Two-column row: revenue/zero-state chart and payout setup/status card.
5. Course list with search/status filter.
6. Attention queue.

Important: do not fake revenue. If there is no data, render zero-state KPI cards with honest labels.

## Course Builder findings

The V2 `Builder.jsx` gives the best UX flow:

1. Course title is editable inline at the top.
2. Status, category, autosave state, module count, lesson count, and total duration appear before forms.
3. Step bar has four steps: Details, Curriculum, Pricing, Submit.
4. Curriculum editor is the center of the builder, not a buried form.
5. Right rail shows review readiness and marketplace preview.
6. Preview and Submit are always visible in the header.

Current app already has most backend pieces:

1. `createTeacherCourseDraft` callable Function.
2. Duplicate course title protection via normalized `titleKey`.
3. `courses/{courseId}` with owner, title, categories, modules, lessons, price, currency, payment type, drip, preview lesson.
4. Modules with title, summary, cover asset ID.
5. Lessons with title, type, description, duration, text content, external URL, drip delay, thumbnail asset ID.
6. Asset uploads for course cover, module cover, lesson thumbnail, lesson material, lesson video, live recording.
7. Review submission.
8. Preview route.

Gap:

The current UI is too form-heavy. It works more than it feels like it works. The next step should not be rebuilding the backend; it should be reorganizing the existing builder into the V2 flow:

1. Builder header with inline title, status chip, autosave/save state, module/lesson/duration summary.
2. Step bar using V2 names: Details, Curriculum, Pricing, Submit.
3. Curriculum first layout with modules and lessons visible as editable rows.
4. Right rail always visible on desktop: readiness checklist, marketplace preview, asset upload shortcuts.
5. Lesson editor drawer/modal for advanced fields: description, text body, YouTube/Vimeo URL, direct upload, materials, thumbnail.

## Recommended course creation workflow

This is the practical MVP workflow the product should enforce:

1. Creator setup gate.
Creator must be signed in, have `teacher` role, accepted Teacher Terms, and verified email. Stripe Connect is required for paid courses, but free course drafts can exist without Stripe.

2. Studio CTA.
Creator clicks `New course` inside `/teach`, not in the global header.

3. Create modal.
Required: course title, payment model, optional categories.
Rules: title min 3, max 120, unique globally through callable Function. Payment model can be `free` or `one_time` for MVP. Subscription stays disabled.

4. Draft creation.
Backend creates `courses/{courseId}` with `status: draft`, `titleKey`, `ownerId`, empty modules, zero lesson count, initial payment type, and audit timestamps.

5. Details step.
Creator sets title, summary/description, category or categories, cover image, optional support email, and public profile visibility.

6. Curriculum step.
Creator creates modules. Each module can have title, description, cover image, and ordered lessons.

7. Lesson creation.
Each lesson can have title, description, type, duration, release delay, text body, YouTube/Vimeo embed URL, or direct uploaded video. Each lesson can also have thumbnail and downloadable materials.

8. Pricing and release step.
Creator chooses free or one-time paid, currency, price, installments, drip strategy, interval, and free preview lesson.

9. Preview step.
Creator opens the member/classroom preview exactly as a student sees it. Preview is read-only.

10. Submit step.
Readiness checklist blocks submission if there is no title, weak summary, no modules, no lessons, invalid price/payment model, or invalid installment config.

11. Ops review.
Admin/ops can publish, request changes, or deactivate. Published courses appear in marketplace and can be enrolled in.

12. Learner experience.
Learner enrolls through free enrollment or Stripe checkout, lands in private course workspace, watches embedded or uploaded video, downloads materials, comments under lesson, marks complete, and eventually receives certificate.

## Learner Classroom findings

The V2 `Classroom.jsx` is stronger than the current workspace visually:

1. Left rail curriculum.
2. Center video/player.
3. Lesson tools below player.
4. Notes/resources area.
5. Right panel for study companion.

Current app already supports:

1. Enrollment gating.
2. Progress.
3. Drip unlock state.
4. Trusted YouTube/Vimeo embeds.
5. Protected uploaded videos.
6. Course and lesson assets.
7. Lesson comments.
8. Preview mode.

Gap:

The current learner workspace should adopt the V2 classroom layout while keeping current backend. AI companion and notes can wait. For MVP, the right panel should be resources/comments first, not AI.

Recommended MVP classroom:

1. Header: course title, instructor, progress.
2. Left: modules and lessons.
3. Center: active lesson player/content.
4. Right: lesson resources and comments.
5. Footer/action: mark complete, next lesson.

## Settings and account findings

The design is correct that profile, email, notifications, security, learning preferences, privacy, and danger zone belong under Settings. The user concern about confusion is valid.

Current app already separated money correctly:

1. Billing: purchases, subscriptions, invoices, receipts.
2. Payouts/Payments: Stripe Connect, teacher wallet, sales, payout status.

Recommended naming:

1. Sidebar item: `Settings`.
2. Settings tabs: Profile, Account, Notifications, Security, Learning, Privacy.
3. Money surfaces: `Plans & fees`, `Payouts & tax`, `Billing`.
4. Do not put Payouts inside general Profile settings.

Implementation approach:

1. Keep separate routes temporarily for low risk.
2. Make `/account` a real Settings Center shell.
3. Change copy so `/account/profile`, `/account/email`, `/account/security`, and `/account/notifications` read as tabs/sections of Settings.
4. Move `/account/payments` UI label to `Payouts & tax`.
5. Keep `/account/billing` for purchases/subscriptions/invoices.

## Payouts findings

The V2 payout page is a good product target, but several parts are beyond MVP if using Stripe Connect Express:

1. "Withdraw now" cannot be fully custom unless using supported Connect flows and compliance constraints.
2. Bank account management should stay delegated to Stripe onboarding/dashboard unless explicitly supported.
3. Tax forms should be informational until real tax reporting is configured.

Current app has Stripe Connect status and payout ledger. Correct next step is:

1. Show Stripe setup status.
2. Show paid orders, gross sales, net estimate, pending release, released, refunded.
3. Link to Stripe onboarding/dashboard.
4. Show statements/export from `payoutLedger`.
5. Do not promise instant withdrawals until backend and Stripe account capabilities support it.

## Design features to defer

These are valuable but should not block MVP:

1. AI Study Companion.
2. Learning paths as bundled products.
3. Live cohorts as a full scheduling/payment surface.
4. Custom instant withdrawals.
5. Full tax center.
6. Complex plan pricing if the current creator business model is 15 percent fee.
7. Rich rating/review system beyond basic course rating.
8. Advanced marketplace recommendation algorithms.

## Design issues not to copy blindly

1. The prototype has fake revenue, fake students, fake ratings, and fake payout numbers.
2. Some copy has encoding artifacts from export.
3. `Pricing.jsx` implies SaaS subscription plans that may conflict with the current Skillset promise/platform fee model.
4. `App.jsx` maps learner `billing` to `Payouts`, which is wrong for production.
5. `Community.jsx` includes emoji reactions; current product rules previously avoided emoji in UI. If reactions are added, use icons or text labels.
6. The prototype's role switch is too frictionless if creator/student separation later needs stricter account boundaries.

## Implementation priority

### P0 launch loop

1. Remove global teacher `New course` CTA from `PlatformHeader`; keep it only in Studio.
2. Rework `/teach` top section toward V2 Studio: welcome, public profile, new course, zero-safe KPIs, payout status, top courses/empty state, attention queue.
3. Rework `CourseBuilderStudio` layout toward V2 Builder without replacing backend.
4. Add lesson editor drawer/modal so direct video upload, YouTube/Vimeo URL, materials, thumbnails, and text body are easier to understand.
5. Rework learner course workspace toward V2 Classroom layout: left curriculum, center player/content, right resources/comments.
6. Smoke test full loop: create free course, add module, add lesson, upload material, embed YouTube/Vimeo, submit, publish, enroll, open lesson, comment, mark complete.

### P1 operational clarity

1. Settings Center visual consolidation.
2. Rename creator money surface to `Payouts & tax`.
3. Improve Stripe setup banner so it disappears only when email/terms/Stripe states are actually complete.
4. Add real attention items: draft missing lesson, course in review, Stripe incomplete, student comments unanswered.
5. Add teacher analytics zero states and later real aggregates.

### P2 product expansion

1. Learning paths.
2. AI study companion.
3. Live cohorts.
4. Rich certificates and LinkedIn export.
5. Advanced payout statements and export.
6. Marketplace ranking/recommendation.

## Final recommendation

Start with the builder/classroom loop, not dashboard decoration. The current app is close enough functionally that the fastest route to MVP is to wrap the existing backend in the V2 design hierarchy:

Creator Studio -> Create Course -> Builder -> Preview -> Submit -> Publish -> Enroll -> Classroom.

Once this loop is reliable and visually coherent, the dashboard analytics and payout polish can sit on top without making the product feel fake.
