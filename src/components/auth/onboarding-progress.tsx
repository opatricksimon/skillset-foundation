"use client";

type OnboardingProgressProps = {
  activeQuestion: number;
  totalQuestions?: number;
};

export function OnboardingProgress({
  activeQuestion,
  totalQuestions = 7,
}: OnboardingProgressProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`Question ${activeQuestion} of ${totalQuestions}`}>
      {Array.from({ length: totalQuestions }, (_, index) => {
        const questionNumber = index + 1;
        const isActive = questionNumber === activeQuestion;
        const isPast = questionNumber < activeQuestion;

        return (
          <span
            key={questionNumber}
            className={[
              "h-2 rounded-full transition-all duration-[280ms]",
              isActive
                ? "w-6 bg-[var(--color-accent)]"
                : isPast
                  ? "w-2 bg-[var(--color-primary)] opacity-50"
                  : "w-2 bg-[var(--color-line-strong)]",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
