"use client";

import Link from "next/link";
import { CalendarClock, CreditCard, ExternalLink, Gift, Repeat } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  PlanSelectorCards,
  type PlanSelectorOption,
} from "@/components/shared/plan-selector-cards";
import { InlineHelp } from "@/components/shared/inline-help";
import { StatusChip } from "@/components/shared/status-chip";
import { CourseAssetUploader } from "@/components/teacher/course-asset-uploader";
import type { DripStrategy } from "@/domain/drip-policy";
import type {
  LessonType,
  TeacherCourse,
  TeacherLesson,
  TeacherCourseModule,
  TeacherCoursePaymentType,
} from "@/domain/teacher-course";
import {
  countCourseLessons,
  normalizeInstallmentsMax,
  teacherCanEditCourse,
  teacherCanSubmitCourse,
} from "@/domain/teacher-course";
import {
  subscribeToTeacherCourse,
  submitTeacherCourseForReview,
  updateTeacherCourseBuilder,
} from "@/lib/data/teacher-courses";
import {
  defaultSkillsetCurrency,
  getCurrencyLabel,
  supportedStripeCurrencies,
  topSkillsetCurrencies,
} from "@/lib/payments/currencies";

const categories = ["Psychology", "Management", "Health", "Soft Skills"];
const secondaryCurrencies = supportedStripeCurrencies.filter(
  (currency) => !(topSkillsetCurrencies as readonly string[]).includes(currency),
);
const builderTabs = [
  { value: "details", label: "Details" },
  { value: "content", label: "Content" },
  { value: "pricing", label: "Pricing" },
  { value: "review", label: "Review" },
] as const;

type BuilderTab = (typeof builderTabs)[number]["value"];

const lessonTypes: { value: LessonType; label: string }[] = [
  { value: "video", label: "Video lesson" },
  { value: "text", label: "Text lesson" },
  { value: "quiz", label: "Quiz" },
  { value: "assignment", label: "Assignment" },
  { value: "live_recording", label: "Live recording" },
  { value: "download", label: "Download" },
  { value: "external_embed", label: "External embed" },
];

const dripStrategies: { value: DripStrategy; label: string; detail: string }[] = [
  {
    value: "instant",
    label: "Instant access",
    detail: "Unlock every lesson immediately after enrollment.",
  },
  {
    value: "sequential_progress",
    label: "Sequential progress",
    detail: "Unlock the next lesson after the previous lesson is completed.",
  },
  {
    value: "time_drip_lesson",
    label: "One lesson per interval",
    detail: "Release lessons gradually based on enrollment date.",
  },
  {
    value: "time_drip_module",
    label: "One module per interval",
    detail: "Release modules gradually based on enrollment date.",
  },
  {
    value: "time_drip_custom",
    label: "Custom lesson schedule",
    detail: "Use each lesson's delay field for precise release timing.",
  },
];

const paymentModelOptions: PlanSelectorOption<TeacherCoursePaymentType>[] = [
  {
    value: "one_time",
    title: "One-time payment",
    description: "Student pays once and gets lifetime access.",
    features: ["Best for complete courses", "Supports optional installments"],
    icon: CreditCard,
  },
  {
    value: "free",
    title: "Free",
    description: "No payment required. Useful for lead-gen or trial cohorts.",
    features: ["Opens enrollment without checkout", "Useful for previews or pilots"],
    icon: Gift,
  },
  {
    value: "subscription_monthly",
    title: "Monthly subscription",
    description: "Recurring monthly billing.",
    features: ["Recurring access", "Cancellation controls"],
    icon: Repeat,
    disabled: true,
    badge: "Coming soon",
  },
  {
    value: "subscription_yearly",
    title: "Yearly subscription",
    description: "Recurring yearly billing.",
    features: ["Annual access", "Renewal reminders"],
    icon: CalendarClock,
    disabled: true,
    badge: "Coming soon",
  },
];

function createLocalId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parsePriceAmountMinor(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue.replace(",", "."));

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return Math.round(parsedValue * 100);
}

function hasInvalidPriceAmount(value: string): boolean {
  return value.trim().length > 0 && parsePriceAmountMinor(value) === null;
}

function parseInstallmentsMax(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return null;
  }

  return normalizeInstallmentsMax(parsedValue);
}

function normalizeDurationMinutes(value: string): number | null {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return Math.round(parsedValue);
}

function normalizeDripDelayDays(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return Math.round(parsedValue);
}

function getLessonTypeLabel(type: LessonType) {
  return lessonTypes.find((item) => item.value === type)?.label ?? type;
}

function moveArrayItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function sanitizeModules(modules: TeacherCourseModule[]): TeacherCourseModule[] {
  return modules.map((module) => ({
    ...module,
    title: module.title.trim(),
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      title: lesson.title.trim(),
      description: lesson.description.trim(),
      contentText: lesson.contentText?.trim() || null,
      externalUrl: lesson.externalUrl?.trim() || null,
      dripDelayDays:
        typeof lesson.dripDelayDays === "number"
          ? Math.max(0, Math.round(lesson.dripDelayDays))
          : null,
    })),
  }));
}

function getCourseStructureError(modules: TeacherCourseModule[]): string {
  for (const [moduleIndex, module] of modules.entries()) {
    if (!module.title.trim()) {
      return `Module ${moduleIndex + 1} needs a title before saving.`;
    }

    for (const [lessonIndex, lesson] of module.lessons.entries()) {
      if (!lesson.title.trim()) {
        return `Lesson ${lessonIndex + 1} in module ${moduleIndex + 1} needs a title before saving.`;
      }
    }
  }

  return "";
}

export function CourseBuilderStudio() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const { user } = useAuth();
  const [course, setCourse] = useState<TeacherCourse | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [modules, setModules] = useState<TeacherCourseModule[]>([]);
  const [priceAmount, setPriceAmount] = useState("");
  const [currency, setCurrency] = useState(defaultSkillsetCurrency);
  const [paymentType, setPaymentType] =
    useState<TeacherCoursePaymentType>("one_time");
  const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
  const [installmentsMax, setInstallmentsMax] = useState("12");
  const [dripStrategy, setDripStrategy] = useState<DripStrategy>("instant");
  const [dripIntervalDays, setDripIntervalDays] = useState("1");
  const [freePreviewLessonId, setFreePreviewLessonId] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonModuleId, setLessonModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("video");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonDurationMinutes, setLessonDurationMinutes] = useState("");
  const [lessonDripDelayDays, setLessonDripDelayDays] = useState("");
  const [lessonContentText, setLessonContentText] = useState("");
  const [lessonExternalUrl, setLessonExternalUrl] = useState("");
  const [lessonIsFreePreview, setLessonIsFreePreview] = useState(false);
  const [activeTab, setActiveTab] = useState<BuilderTab>("details");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    return subscribeToTeacherCourse(
      courseId,
      (nextCourse) => {
        setIsLoading(false);

        if (!nextCourse) {
          setError("We could not find this course.");
          return;
        }

        setCourse(nextCourse);
        setTitle(nextCourse.title);
        setSummary(nextCourse.summary);
        setCategory(nextCourse.category);
        setModules(nextCourse.modules ?? []);
        setPriceAmount(
          typeof nextCourse.priceAmountMinor === "number"
            ? String(nextCourse.priceAmountMinor / 100)
            : "",
        );
        setCurrency(nextCourse.currency ?? defaultSkillsetCurrency);
        setPaymentType(
          nextCourse.paymentType ??
            (nextCourse.priceAmountMinor === 0 ? "free" : "one_time"),
        );
        setInstallmentsEnabled(Boolean(nextCourse.installmentsEnabled));
        setInstallmentsMax(String(nextCourse.installmentsMax ?? 12));
        setDripStrategy(nextCourse.dripStrategy ?? "instant");
        setDripIntervalDays(String(nextCourse.dripIntervalDays ?? 1));
        setFreePreviewLessonId(nextCourse.freePreviewLessonId ?? "");
        setLessonModuleId(nextCourse.modules?.[0]?.id ?? "");
        setError("");
      },
      () => {
        setIsLoading(false);
        setError("We could not load this course. Please return to Teacher Studio and try again.");
      },
    );
  }, [courseId]);

  const isOwner = course && user?.uid === course.ownerId;
  const isEditable = Boolean(isOwner && course && teacherCanEditCourse(course.status));
  const canSubmitForReview = Boolean(
    isOwner && course && teacherCanSubmitCourse(course.status),
  );
  const lessonCount = countCourseLessons(modules);
  const allLessons = modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleTitle: module.title,
    })),
  );
  const priceFieldIsValid =
    paymentType === "free" || !hasInvalidPriceAmount(priceAmount);
  const installmentsAreValid =
    paymentType !== "one_time" ||
    !installmentsEnabled ||
    parseInstallmentsMax(installmentsMax) !== null;
  const readinessItems = [
    {
      label: title.trim() ? "Course title is set." : "Add a course title.",
      ready: Boolean(title.trim()),
    },
    {
      label:
        summary.trim().length >= 20
          ? "Summary is ready."
          : "Add a clearer summary.",
      ready: summary.trim().length >= 20,
    },
    {
      label: modules.length > 0 ? "At least one module exists." : "Add at least one module.",
      ready: modules.length > 0,
    },
    {
      label: lessonCount > 0 ? "At least one lesson exists." : "Add at least one lesson.",
      ready: lessonCount > 0,
    },
    {
      label:
        priceFieldIsValid
          ? "Pricing field is valid."
          : "Fix the pricing field.",
      ready: priceFieldIsValid,
    },
    {
      label:
        installmentsAreValid
          ? "Payment model is ready."
          : "Set a valid installment limit.",
      ready: installmentsAreValid,
    },
  ];

  function handlePaymentTypeChange(nextPaymentType: TeacherCoursePaymentType) {
    if (!isEditable) {
      return;
    }

    setPaymentType(nextPaymentType);

    if (nextPaymentType === "free") {
      setPriceAmount("0");
      setInstallmentsEnabled(false);
    }

    if (nextPaymentType !== "one_time") {
      setInstallmentsEnabled(false);
    }

    setSuccess("");
  }

  function handleAddModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEditable) {
      return;
    }

    const nextTitle = moduleTitle.trim();

    if (!nextTitle) {
      setError("Add a module title before creating the module.");
      return;
    }

    const nextModule = {
      id: createLocalId("module"),
      title: nextTitle,
      lessons: [],
    };

    setModules((current) => [...current, nextModule]);
    setLessonModuleId(nextModule.id);
    setModuleTitle("");
    setError("");
    setSuccess("");
  }

  function handleAddLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEditable) {
      return;
    }

    if (!lessonModuleId) {
      setError("Create or choose a module before adding a lesson.");
      return;
    }

    const nextTitle = lessonTitle.trim();

    if (!nextTitle) {
      setError("Add a lesson title before creating the lesson.");
      return;
    }

    const durationMinutes = Number(lessonDurationMinutes);
    const nextLessonId = createLocalId("lesson");
    const nextDurationMinutes =
      lessonDurationMinutes.trim().length > 0 && Number.isFinite(durationMinutes) && durationMinutes > 0
        ? Math.round(durationMinutes)
        : null;
    const nextDripDelayDays = normalizeDripDelayDays(lessonDripDelayDays);

    setModules((current) =>
      current.map((module) =>
        module.id === lessonModuleId
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  id: nextLessonId,
                  title: nextTitle,
                  type: lessonType,
                  description: lessonDescription.trim(),
                  durationMinutes: nextDurationMinutes,
                  dripDelayDays: nextDripDelayDays,
                  contentText: lessonContentText.trim() || null,
                  externalUrl: lessonExternalUrl.trim() || null,
                },
              ],
            }
          : module,
      ),
    );
    if (lessonIsFreePreview) {
      setFreePreviewLessonId(nextLessonId);
    }
    setLessonTitle("");
    setLessonDescription("");
    setLessonDurationMinutes("");
    setLessonDripDelayDays("");
    setLessonContentText("");
    setLessonExternalUrl("");
    setLessonIsFreePreview(false);
    setError("");
    setSuccess("");
  }

  function updateModuleTitle(moduleId: string, nextTitle: string) {
    if (!isEditable) {
      return;
    }

    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId ? { ...module, title: nextTitle } : module,
      ),
    );
    setSuccess("");
  }

  function moveModule(moduleId: string, direction: "up" | "down") {
    if (!isEditable) {
      return;
    }

    setModules((currentModules) => {
      const currentIndex = currentModules.findIndex((module) => module.id === moduleId);
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      return moveArrayItem(currentModules, currentIndex, nextIndex);
    });
    setSuccess("");
  }

  function deleteModule(moduleId: string) {
    if (!isEditable) {
      return;
    }

    setModules((currentModules) => {
      const deletedModule = currentModules.find((module) => module.id === moduleId);
      const nextModules = currentModules.filter((module) => module.id !== moduleId);

      if (lessonModuleId === moduleId) {
        setLessonModuleId(nextModules[0]?.id ?? "");
      }

      if (
        deletedModule?.lessons.some((lesson) => lesson.id === freePreviewLessonId)
      ) {
        setFreePreviewLessonId("");
      }

      return nextModules;
    });
    setSuccess("");
  }

  function updateLesson(
    moduleId: string,
    lessonId: string,
    patch: Partial<TeacherLesson>,
  ) {
    if (!isEditable) {
      return;
    }

    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, ...patch } : lesson,
              ),
            }
          : module,
      ),
    );
    setSuccess("");
  }

  function moveLesson(moduleId: string, lessonId: string, direction: "up" | "down") {
    if (!isEditable) {
      return;
    }

    setModules((currentModules) =>
      currentModules.map((module) => {
        if (module.id !== moduleId) {
          return module;
        }

        const currentIndex = module.lessons.findIndex((lesson) => lesson.id === lessonId);
        const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        return {
          ...module,
          lessons: moveArrayItem(module.lessons, currentIndex, nextIndex),
        };
      }),
    );
    setSuccess("");
  }

  function deleteLesson(moduleId: string, lessonId: string) {
    if (!isEditable) {
      return;
    }

    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
            }
          : module,
      ),
    );

    if (freePreviewLessonId === lessonId) {
      setFreePreviewLessonId("");
    }

    setSuccess("");
  }

  async function saveDraft() {
    if (!courseId || !isEditable) {
      return;
    }

    setError("");
    setSuccess("");
    setIsSaving(true);
    const nextPriceAmountMinor =
      paymentType === "free" ? 0 : parsePriceAmountMinor(priceAmount);
    const nextInstallmentsEnabled =
      paymentType === "one_time" && installmentsEnabled;
    const nextInstallmentsMax = nextInstallmentsEnabled
      ? parseInstallmentsMax(installmentsMax)
      : null;
    const nextDripIntervalDays = Math.max(
      1,
      normalizeDripDelayDays(dripIntervalDays) ?? 1,
    );
    const nextModules = sanitizeModules(modules);
    const structureError = getCourseStructureError(nextModules);

    if (!priceFieldIsValid) {
      setError("Use a valid non-negative price, or leave the field empty.");
      setIsSaving(false);
      return;
    }

    if (!installmentsAreValid) {
      setError("Set a valid installment limit before saving.");
      setIsSaving(false);
      return;
    }

    if (structureError) {
      setError(structureError);
      setIsSaving(false);
      return;
    }

    try {
      await updateTeacherCourseBuilder(courseId, {
        title,
        summary,
        category,
        modules: nextModules,
        priceAmountMinor: nextPriceAmountMinor,
        currency,
        paymentType,
        installmentsEnabled: nextInstallmentsEnabled,
        installmentsMax: nextInstallmentsMax,
        platformFeeBps: course?.platformFeeBps ?? 1500,
        dripStrategy,
        dripIntervalDays: nextDripIntervalDays,
        freePreviewLessonId: freePreviewLessonId || null,
      });
      setSuccess("Draft saved.");
    } catch {
      setError("We could not save this course. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function submitForReview() {
    if (!courseId || !canSubmitForReview) {
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);
    const nextPriceAmountMinor =
      paymentType === "free" ? 0 : parsePriceAmountMinor(priceAmount);
    const nextInstallmentsEnabled =
      paymentType === "one_time" && installmentsEnabled;
    const nextInstallmentsMax = nextInstallmentsEnabled
      ? parseInstallmentsMax(installmentsMax)
      : null;
    const nextDripIntervalDays = Math.max(
      1,
      normalizeDripDelayDays(dripIntervalDays) ?? 1,
    );
    const nextModules = sanitizeModules(modules);
    const structureError = getCourseStructureError(nextModules);

    if (!priceFieldIsValid) {
      setError("Use a valid non-negative price, or leave the field empty.");
      setIsSubmitting(false);
      return;
    }

    if (!installmentsAreValid) {
      setError("Set a valid installment limit before submitting.");
      setIsSubmitting(false);
      return;
    }

    if (structureError) {
      setError(structureError);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateTeacherCourseBuilder(courseId, {
        title,
        summary,
        category,
        modules: nextModules,
        priceAmountMinor: nextPriceAmountMinor,
        currency,
        paymentType,
        installmentsEnabled: nextInstallmentsEnabled,
        installmentsMax: nextInstallmentsMax,
        platformFeeBps: course?.platformFeeBps ?? 1500,
        dripStrategy,
        dripIntervalDays: nextDripIntervalDays,
        freePreviewLessonId: freePreviewLessonId || null,
      });
      await submitTeacherCourseForReview(courseId);
      setSuccess("Course submitted for Skillset review.");
    } catch {
      setError("We could not submit this course for review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!courseId) {
    return (
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          Choose a course from Teacher Studio before opening the builder.
        </p>
        <Link href="/teach" className="button-outline mt-5 px-4 py-2 text-sm">
          Back to Teacher Studio
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-[var(--color-ink-soft)]">Loading course builder...</p>
      </section>
    );
  }

  if (error && !course) {
    return (
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
        <Link href="/teach" className="button-outline mt-5 px-4 py-2 text-sm">
          Back to Teacher Studio
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.78fr]">
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
              Course builder
            </p>
            <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
              Shape the learner path
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {courseId ? (
              <Link
                href={`/teach/builder/${courseId}/preview`}
                target="_blank"
                className="button-outline px-4 py-2 text-xs"
              >
                <ExternalLink aria-hidden="true" size={14} strokeWidth={1.8} />
                Preview
              </Link>
            ) : null}
            <StatusChip status={course?.status ?? "draft"} />
          </div>
        </div>

        {course?.status === "in_review" ? (
          <p className="mt-5 rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
            This course is with Skillset for review. If changes are needed, it
            will return here as editable.
          </p>
        ) : course?.status === "published" ? (
          <p className="mt-5 rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
            This course is live. You can keep improving the structure while
            Skillset controls marketplace visibility.
          </p>
        ) : null}
        {course?.reviewNote ? (
          <div className="mt-5 rounded-[3px] border border-[rgba(178,34,52,0.18)] bg-[rgba(178,34,52,0.04)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Skillset review note
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
              {course.reviewNote}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2 rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-2">
          {builderTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-[9px] px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "details" ? (
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Course title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={!isEditable}
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={!isEditable}
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Course summary
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              disabled={!isEditable}
              rows={4}
              className="resize-none rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
            />
          </label>
          <p className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
            Keep the title specific, the category clear, and the summary focused
            on learner outcomes. This copy will influence the marketplace page.
          </p>
        </div>
        ) : null}

        {activeTab === "pricing" ? (
          <div className="rounded-[4px] border fine-rule bg-[var(--color-surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Marketplace setup
            </p>
            <div className="mt-4">
              <PlanSelectorCards
                label="Payment model"
                options={paymentModelOptions}
                value={paymentType}
                onChange={handlePaymentTypeChange}
                disabled={!isEditable}
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_140px]">
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                Price
                <input
                  value={priceAmount}
                  onChange={(event) => setPriceAmount(event.target.value)}
                  disabled={!isEditable || paymentType === "free"}
                  inputMode="decimal"
                  placeholder={
                    paymentType === "free" ? "Free course" : "Example: 149"
                  }
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                Currency
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  disabled={!isEditable}
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                >
                  <optgroup label="Most used">
                    {topSkillsetCurrencies.map((item) => (
                      <option key={item} value={item}>
                        {item} - {getCurrencyLabel(item)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other supported currencies">
                    {secondaryCurrencies.map((item) => (
                      <option key={item} value={item}>
                        {item} - {getCurrencyLabel(item)}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>
            </div>
            {paymentType === "one_time" ? (
              <div className="mt-4 rounded-[3px] border border-[var(--color-line)] bg-white p-4">
                <label className="flex items-start gap-3 text-sm font-semibold text-[var(--color-ink)]">
                  <input
                    type="checkbox"
                    checked={installmentsEnabled}
                    onChange={(event) =>
                      setInstallmentsEnabled(event.target.checked)
                    }
                    disabled={!isEditable}
                    className="mt-1 size-4 accent-[var(--color-accent)]"
                  />
                  <span>
                    Allow installments
                    <span className="mt-1 block text-xs font-normal leading-5 text-[var(--color-ink-soft)]">
                      Useful for higher-priced courses in markets where installment
                      payments are common.
                    </span>
                  </span>
                </label>
                {installmentsEnabled ? (
                  <label className="mt-4 grid max-w-[220px] gap-2 text-sm font-semibold text-[var(--color-ink)]">
                    Max installments
                    <input
                      value={installmentsMax}
                      onChange={(event) => setInstallmentsMax(event.target.value)}
                      disabled={!isEditable}
                      inputMode="numeric"
                      placeholder="12"
                      className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                    />
                  </label>
                ) : null}
              </div>
            ) : null}
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                Content release
                <select
                  value={dripStrategy}
                  onChange={(event) =>
                    setDripStrategy(event.target.value as DripStrategy)
                  }
                  disabled={!isEditable}
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                >
                  {dripStrategies.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                Interval days
                <input
                  value={dripIntervalDays}
                  onChange={(event) => setDripIntervalDays(event.target.value)}
                  disabled={
                    !isEditable
                    || !["time_drip_lesson", "time_drip_module"].includes(
                      dripStrategy,
                    )
                  }
                  inputMode="numeric"
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                />
              </label>
            </div>
            <p className="mt-3 rounded-[10px] border fine-rule bg-white px-4 py-3 text-xs leading-5 text-[var(--color-ink-soft)]">
              {dripStrategies.find((item) => item.value === dripStrategy)?.detail}
              {dripStrategy === "time_drip_custom"
                ? " Set each lesson delay in the curriculum editor."
                : ""}
            </p>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
              Free preview lesson
              <select
                value={freePreviewLessonId}
                onChange={(event) => setFreePreviewLessonId(event.target.value)}
                disabled={!isEditable || allLessons.length === 0}
                className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
              >
                <option value="">No preview selected yet</option>
                {allLessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.moduleTitle} - {lesson.title}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-3 text-xs leading-5 text-[var(--color-ink-soft)]">
              These fields prepare the public listing. Paid access still requires
              Stripe checkout before enrollment opens.
            </p>
            <InlineHelp
              topic="course pricing"
              href="/help#course-pricing"
              className="mt-4"
            >
              Set the public payment model before review so checkout, free access,
              and creator payouts can be checked consistently.
            </InlineHelp>
          </div>
        ) : null}

        {activeTab === "content" ? (
        <div className="mt-6 grid gap-4">
          <div className="rounded-[4px] border fine-rule bg-[var(--color-surface-soft)] p-4">
            <h4 className="text-sm font-semibold text-[var(--color-ink)]">
              Add module
            </h4>
            <form className="mt-3 flex flex-col gap-3 sm:flex-row" onSubmit={handleAddModule}>
              <input
                value={moduleTitle}
                onChange={(event) => setModuleTitle(event.target.value)}
                disabled={!isEditable}
                placeholder="Example: Foundations"
                className="min-w-0 flex-1 rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
              />
              <button
                type="submit"
                disabled={!isEditable}
                className="button-outline px-4 py-3 text-sm disabled:opacity-60"
              >
                Add module
              </button>
            </form>
          </div>

          <div className="rounded-[4px] border fine-rule bg-[var(--color-surface-soft)] p-4">
            <h4 className="text-sm font-semibold text-[var(--color-ink)]">
              Add lesson
            </h4>
            <InlineHelp
              topic="drip-released content"
              href="/help#drip-release"
              className="mt-3"
            >
              Use lesson delays and preview selection to protect the course while
              still giving learners enough context before enrollment.
            </InlineHelp>
            <form className="mt-3 grid gap-3" onSubmit={handleAddLesson}>
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  value={lessonModuleId}
                  onChange={(event) => setLessonModuleId(event.target.value)}
                  disabled={!isEditable || modules.length === 0}
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                >
                  <option value="">Choose module</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </select>
                <select
                  value={lessonType}
                  onChange={(event) => setLessonType(event.target.value as LessonType)}
                  disabled={!isEditable}
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                >
                  {lessonTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                value={lessonTitle}
                onChange={(event) => setLessonTitle(event.target.value)}
                disabled={!isEditable}
                placeholder="Lesson title"
                className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
              />
              <div className="grid gap-3 md:grid-cols-[160px_160px_1fr]">
                <input
                  value={lessonDurationMinutes}
                  onChange={(event) => setLessonDurationMinutes(event.target.value)}
                  disabled={!isEditable}
                  inputMode="numeric"
                  placeholder="Minutes"
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                />
                <input
                  value={lessonDripDelayDays}
                  onChange={(event) => setLessonDripDelayDays(event.target.value)}
                  disabled={!isEditable}
                  inputMode="numeric"
                  placeholder="Drip delay days"
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                />
                <input
                  value={lessonExternalUrl}
                  onChange={(event) => setLessonExternalUrl(event.target.value)}
                  disabled={!isEditable}
                  placeholder="Optional external link or replay URL"
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                />
              </div>
              <textarea
                value={lessonDescription}
                onChange={(event) => setLessonDescription(event.target.value)}
                disabled={!isEditable}
                rows={3}
                placeholder="Optional lesson note or outcome"
                className="resize-none rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
              />
              <textarea
                value={lessonContentText}
                onChange={(event) => setLessonContentText(event.target.value)}
                disabled={!isEditable}
                rows={4}
                placeholder="Optional text content, instructions, assignment prompt, or lesson outline."
                className="resize-none rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
              />
              <label className="flex items-start gap-3 rounded-[10px] border fine-rule bg-white p-3 text-sm leading-6 text-[var(--color-ink-soft)]">
                <input
                  type="checkbox"
                  checked={lessonIsFreePreview}
                  disabled={!isEditable}
                  onChange={(event) => setLessonIsFreePreview(event.target.checked)}
                  className="mt-1"
                />
                Make this lesson the public free preview.
              </label>
              <button
                type="submit"
                disabled={!isEditable || modules.length === 0}
                className="button-outline px-4 py-3 text-sm disabled:opacity-60"
              >
                Add lesson
              </button>
            </form>
          </div>

          <div className="rounded-[4px] border fine-rule bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  Curriculum editor
                </p>
                <h4 className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                  Edit, reorder, and clean up modules and lessons
                </h4>
              </div>
              <span className="rounded-[8px] bg-[var(--color-surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-ink-soft)]">
                {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-4 grid gap-4">
              {modules.length === 0 ? (
                <p className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
                  Add your first module above. Once it exists, you can organize
                  lessons here like a real course builder.
                </p>
              ) : (
                modules.map((module, moduleIndex) => (
                  <article
                    key={module.id}
                    className="rounded-[4px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                      <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
                        Module {moduleIndex + 1}
                        <input
                          value={module.title}
                          onChange={(event) =>
                            updateModuleTitle(module.id, event.target.value)
                          }
                          disabled={!isEditable}
                          className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                        />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveModule(module.id, "up")}
                          disabled={!isEditable || moduleIndex === 0}
                          className="button-outline px-3 py-2 text-xs disabled:opacity-50"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModule(module.id, "down")}
                          disabled={!isEditable || moduleIndex === modules.length - 1}
                          className="button-outline px-3 py-2 text-xs disabled:opacity-50"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteModule(module.id)}
                          disabled={!isEditable}
                          className="rounded-[8px] border border-[rgba(178,34,52,0.22)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-accent)] disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {module.lessons.length === 0 ? (
                        <p className="rounded-[10px] border fine-rule bg-white px-4 py-3 text-sm leading-6 text-[var(--color-ink-soft)]">
                          This module has no lessons yet.
                        </p>
                      ) : (
                        module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="grid gap-3 rounded-[3px] border border-[var(--color-line)] bg-white p-4"
                          >
                            <div className="grid gap-3 lg:grid-cols-[1fr_190px_120px_140px_auto] lg:items-end">
                              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                                Lesson title
                                <input
                                  value={lesson.title}
                                  onChange={(event) =>
                                    updateLesson(module.id, lesson.id, {
                                      title: event.target.value,
                                    })
                                  }
                                  disabled={!isEditable}
                                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[var(--color-ink)] outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                                />
                              </label>
                              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                                Type
                                <select
                                  value={lesson.type}
                                  onChange={(event) =>
                                    updateLesson(module.id, lesson.id, {
                                      type: event.target.value as LessonType,
                                    })
                                  }
                                  disabled={!isEditable}
                                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[var(--color-ink)] outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                                >
                                  {lessonTypes.map((item) => (
                                    <option key={item.value} value={item.value}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                                Minutes
                                <input
                                  value={lesson.durationMinutes ?? ""}
                                  onChange={(event) =>
                                    updateLesson(module.id, lesson.id, {
                                      durationMinutes: normalizeDurationMinutes(
                                        event.target.value,
                                      ),
                                    })
                                  }
                                  disabled={!isEditable}
                                  inputMode="numeric"
                                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[var(--color-ink)] outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                                />
                              </label>
                              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                                Delay days
                                <input
                                  value={lesson.dripDelayDays ?? ""}
                                  onChange={(event) =>
                                    updateLesson(module.id, lesson.id, {
                                      dripDelayDays: normalizeDripDelayDays(
                                        event.target.value,
                                      ),
                                    })
                                  }
                                  disabled={!isEditable}
                                  inputMode="numeric"
                                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[var(--color-ink)] outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                                />
                              </label>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveLesson(module.id, lesson.id, "up")}
                                  disabled={!isEditable || lessonIndex === 0}
                                  className="button-outline px-3 py-2 text-xs disabled:opacity-50"
                                >
                                  Up
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveLesson(module.id, lesson.id, "down")}
                                  disabled={
                                    !isEditable ||
                                    lessonIndex === module.lessons.length - 1
                                  }
                                  className="button-outline px-3 py-2 text-xs disabled:opacity-50"
                                >
                                  Down
                                </button>
                              </div>
                            </div>

                            <textarea
                              value={lesson.description}
                              onChange={(event) =>
                                updateLesson(module.id, lesson.id, {
                                  description: event.target.value,
                                })
                              }
                              disabled={!isEditable}
                              rows={2}
                              placeholder="Lesson note or learner outcome"
                              className="resize-none rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                            />
                            <textarea
                              value={lesson.contentText ?? ""}
                              onChange={(event) =>
                                updateLesson(module.id, lesson.id, {
                                  contentText: event.target.value || null,
                                })
                              }
                              disabled={!isEditable}
                              rows={3}
                              placeholder="Text content, assignment prompt, or lesson outline"
                              className="resize-none rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                            />
                            <input
                              value={lesson.externalUrl ?? ""}
                              onChange={(event) =>
                                updateLesson(module.id, lesson.id, {
                                  externalUrl: event.target.value || null,
                                })
                              }
                              disabled={!isEditable}
                              placeholder="Optional external link, live replay, or embed URL"
                              className="rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFreePreviewLessonId(
                                    freePreviewLessonId === lesson.id ? "" : lesson.id,
                                  )
                                }
                                disabled={!isEditable}
                                className={`rounded-[8px] border px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                                  freePreviewLessonId === lesson.id
                                    ? "border-[var(--color-primary)] bg-[rgba(26,54,93,0.08)] text-[var(--color-primary)]"
                                    : "border-[var(--color-line)] bg-white text-[var(--color-ink-soft)]"
                                }`}
                              >
                                {freePreviewLessonId === lesson.id
                                  ? "Free preview selected"
                                  : "Mark free preview"}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLesson(module.id, lesson.id)}
                                disabled={!isEditable}
                                className="rounded-[8px] border border-[rgba(178,34,52,0.22)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-accent)] disabled:opacity-50"
                              >
                                Delete lesson
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
        ) : null}

        {activeTab === "review" ? (
          <div className="mt-6 rounded-[4px] border fine-rule bg-[var(--color-surface-soft)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Submit readiness
            </p>
            <h4 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
              Prepare for Skillset review
            </h4>
            <div className="mt-5 grid gap-3">
              {readinessItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3"
                >
                  <p className={`text-sm font-semibold ${item.ready ? "text-[var(--color-primary)]" : "text-[var(--color-accent)]"}`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-[var(--color-ink-soft)]">
              Review stays lightweight: Skillset checks structure, basic quality,
              trust, pricing readiness, and whether the public listing should go live.
            </p>
            <InlineHelp
              topic="course review"
              href="/help#course-review"
              className="mt-4"
            >
              Submit only when the core promise, course structure, pricing, and
              preview lesson are ready for Skillset review.
            </InlineHelp>
          </div>
        ) : null}
      </section>

      <aside className="space-y-5">
        <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
            Course structure
          </p>
          <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
            {modules.length} modules, {lessonCount} lessons
          </h3>
          <div className="mt-5 grid gap-3">
            {modules.length === 0 ? (
              <p className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
                Start with one module, then add the lessons learners should complete.
              </p>
            ) : (
              modules.map((module, index) => (
                <article
                  key={module.id}
                  className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    Module {index + 1}
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                    {module.title}
                  </h4>
                  <div className="mt-3 grid gap-2">
                    {module.lessons.length === 0 ? (
                      <p className="text-xs leading-5 text-[var(--color-ink-soft)]">
                        No lessons yet.
                      </p>
                    ) : (
                      module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="rounded-[10px] bg-white px-3 py-2"
                        >
                          <p className="text-xs font-semibold text-[var(--color-ink)]">
                            {lesson.title}
                          </p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                            {getLessonTypeLabel(lesson.type)}
                            {lesson.durationMinutes ? ` - ${lesson.durationMinutes} min` : ""}
                            {typeof lesson.dripDelayDays === "number"
                              ? ` - D+${lesson.dripDelayDays}`
                              : ""}
                            {freePreviewLessonId === lesson.id ? " - preview" : ""}
                          </p>
                          {lesson.description ? (
                            <p className="mt-2 text-xs leading-5 text-[var(--color-ink-soft)]">
                              {lesson.description}
                            </p>
                          ) : null}
                          {lesson.contentText ? (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--color-ink-soft)]">
                              {lesson.contentText}
                            </p>
                          ) : null}
                          {lesson.externalUrl ? (
                            <p className="mt-2 break-all text-[11px] leading-5 text-[var(--color-primary)]">
                              {lesson.externalUrl}
                            </p>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
            Review readiness
          </p>
          <div className="mt-4 grid gap-2 text-sm text-[var(--color-ink-soft)]">
            <p>{title.trim() ? "Course title is set." : "Add a course title."}</p>
            <p>{summary.trim().length >= 20 ? "Summary is ready." : "Add a clearer summary."}</p>
            <p>{modules.length > 0 ? "At least one module exists." : "Add at least one module."}</p>
            <p>{lessonCount > 0 ? "At least one lesson exists." : "Add at least one lesson."}</p>
          </div>
          {error ? (
            <p className="mt-4 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="mt-4 rounded-[10px] border border-[rgba(26,54,93,0.12)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
              {success}
            </p>
          ) : null}
          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={!isEditable || isSaving}
              className="button-outline px-4 py-3 text-sm disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              onClick={submitForReview}
              disabled={!canSubmitForReview || isSubmitting || !title.trim() || summary.trim().length < 20 || modules.length === 0 || lessonCount === 0}
              className="button-solid px-4 py-3 text-sm disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit for review"}
            </button>
            <Link href="/teach" className="button-outline px-4 py-3 text-sm">
              Back to Teacher Studio
            </Link>
          </div>
        </section>

        {course ? (
          <CourseAssetUploader course={course} isEditable={isEditable} />
        ) : null}
      </aside>
    </div>
  );
}
