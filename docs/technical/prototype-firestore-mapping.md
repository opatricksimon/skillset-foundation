# PROTOTYPE TO FIRESTORE MAPPING
## Claude Design V2 (5) integration map

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Implementation mapping

---

## Rule

The prototype file `data.js` is not a data source for Skillset.
Visual components may be adapted, but data must come from Firebase Authentication, Firestore, Storage, or existing client adapters in `src/lib/data`.

---

## Field Mapping

| Prototype source | Prototype field | Real source | Real field or adapter | Status |
|------------------|-----------------|-------------|------------------------|--------|
| `session` | `currentUserId` | Firebase Auth | `useAuth().user.uid` | Connected |
| `session` | `currentRole` | User profile | `users/{uid}.roles` | Connected |
| `users` | `id` | Firebase Auth / Firestore | `uid` | Connected |
| `users` | `name` | User profile | `displayName` | Connected |
| `users` | `email` | User profile | `email` | Connected |
| `users` | `firstName` | Derived | First token from `displayName` | Connected |
| `users` | `slug` | User profile | `username` | Partial |
| `users` | `bio` | User profile | `bio` | Connected |
| `users` | `avatarTone`, `initials` | Derived UI | `displayName`, `photoURL` | Partial |
| `users` | `hasLearnerProfile` | User profile | `roles.includes("student")` | Connected |
| `users` | `hasCreatorProfile` | User profile | `roles.includes("teacher")` | Connected |
| `users` | `creatorPlan` | User profile | `currentPlanId` | Connected |
| `users` | `learnerSubscription` | User profile / billing | `currentPlanId` | Partial |
| `educators` | `name` | Course owner profile | `users/{ownerId}.displayName` | Partial |
| `educators` | `studentCount` | Orders/enrollments | Derivable from `orders` or `enrollments` | Partial |
| `educators` | `title`, `company`, `region` | None | No real field yet | Missing |
| `categories` | `id`, `label` | Domain | `skillsetCourseCategories` / course `category` | Connected |
| `categories` | `count` | Courses query | Derivable from `courses` | Partial |
| `courses` | `id` | Firestore | `courses/{courseId}` | Connected |
| `courses` | `slug` | Firestore | `id` currently used as public slug | Partial |
| `courses` | `title` | Firestore | `courses.title` | Connected |
| `courses` | `authorId` | Firestore | `courses.ownerId` | Connected |
| `courses` | `catId` | Firestore | `courses.category`, `courses.categories` | Connected |
| `courses` | `duration`, `hours` | Course modules/lessons | Derivable from lesson durations | Partial |
| `courses` | `lessons` | Firestore | `courses.lessonCount` | Connected |
| `courses` | `modules` | Firestore | `courses.modules.length` | Connected |
| `courses` | `price` | Firestore | `courses.priceAmountMinor` | Connected |
| `courses` | `status` | Firestore | `courses.status` | Connected |
| `courses` | `desc` | Firestore | `courses.summary` | Connected |
| `courses` | `bg`, `tone`, `accent` | UI derived | No stored data required | Derived |
| `courses` | `rating`, `reviews`, `strike`, `cohortType` | None | No real field yet | Missing |
| `enrollments` | `id` | Firestore | `enrollments/{id}` | Connected |
| `enrollments` | `userId` | Firestore | `enrollments.userId` | Connected |
| `enrollments` | `courseId` | Firestore | `enrollments.courseId` | Connected |
| `enrollments` | `progress` | Firestore | `enrollments.progressPercent` | Connected |
| `enrollments` | `status` | Firestore | `enrollments.status` | Connected |
| `enrollments` | `nextLessonTitle`, `currentModule`, `currentLesson` | Enrollment/course modules | Partially derivable from `lastLessonId` and course modules | Partial |
| `enrollments` | `score` | Certificates/progress | No real score field yet | Missing |
| `enrollments` | `credentialId` | Firestore | `certificates.verificationCode` | Partial |
| `learningPaths` | all fields | None | No real collection yet | Stub |
| `communities` | `courseId`, `name`, `slug` | Course/community posts | Course-linked community can be derived from `courses` and `communityPosts` | Partial |
| `communities` | `memberCount` | Enrollments | Derivable from enrollment count | Partial |
| `creatorStats` | `kpis` | Orders/courses/enrollments | Derivable zero-state metrics | Partial |
| `creatorStats` | `revenue.months`, `students` | Orders/enrollments | Derivable with aggregation | Partial |
| `payouts` | `available`, `pending`, `lifetime` | Firestore | `payoutLedger.netAmountMinor` by status | Connected |
| `payouts` | `nextPayoutDate` | Firestore | `payoutLedger.releaseAt` | Connected |
| `payouts` | `method` | Stripe Connect | Not exposed beyond account status | Missing |
| `payouts` | `statements` | Firestore | `payoutLedger` entries | Partial |
| `billing` | `subscription` | User profile / Stripe Billing | `users.currentPlanId` plus billing functions | Partial |
| `billing` | `paymentMethods` | Stripe Billing Portal | Not stored locally | Missing |
| `billing` | `purchases` | Firestore | `orders` for learner | Partial |
| `syllabi` | modules/lessons | Firestore | `courses.modules[].lessons[]` | Connected |
| `reviews` | `avg`, `count`, `breakdown`, `featured` | None | No real reviews collection yet | Missing |
| `lessonComments` | comments | Firestore | `lessonComments` adapter exists | Partial |
| `instructorBios` | bio | User profile | `users.bio` | Connected |
| `builderDraft` | completion, modules, checks | Firestore | `courses.modules`, computed readiness | Connected |

---

## Screens Imported Or Adapted

| Prototype screen | Project surface | Data status |
|------------------|-----------------|-------------|
| `Studio.jsx` | `/teach` via `TeacherStudioDashboard`, `TeacherOverviewMetrics`, `TeacherStudioInsights` | Connected to real courses/orders/profile. |
| `Builder.jsx` | `/teach/builder` via `TeacherCourseStudio`, `CourseBuilderStudio` | Connected to real courses/assets/functions. |
| `Classroom.jsx` | `/learn/courses/[slug]` existing learning surface | Partial real data; not replaced in this pass. |
| `Discover.jsx` | `/courses` existing marketplace | Partial real data; already reads published Firestore courses. |
| `CourseDetail.jsx` | `/courses/[slug]` existing detail | Partial real data; already supports published Firestore courses. |
| `Credentials.jsx` | `/learn/credentials` | Partial real data through certificates adapter. |
| `Community.jsx` | `/learn/community` | Partial real data through community posts adapter. |
| `Payouts.jsx` | `/account/payments` | Existing Stripe/Firestore surface preserved. |
| `Pricing.jsx` | `/account/plans` and `/pricing` | Existing plan surface preserved. |
| `Billing.jsx` | `/account/billing` | Partial real data; Stripe billing portal is source for payment methods. |
| `Settings.jsx` | `/account` and account subroutes | Existing real profile/settings surface preserved. |
| `Paths.jsx` | none | Stub; no real learning paths collection yet. |
| `Auth.jsx` | `/auth`, `/welcome` | Existing real auth/onboarding preserved. |
| `LessonUploadModal.jsx` | `LessonContentModal`, `CourseAssetUploader` | Connected to real Storage/course assets. |

