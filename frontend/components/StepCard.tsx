export default function StepCard({
  step,
  title,
  description,
  icon,
  stepbg,
  cardbg,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  stepbg: string;
  cardbg: string;
}) {
  const isBuyCard =
    cardbg.includes("accent-yellow") ||
    cardbg.includes("primary-container") ||
    cardbg.includes("color-accent");

  return (
    <div className="flex gap-5 items-start p-2 rounded-2xl">
      {/* Step number circle */}
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
          isBuyCard
            ? "bg-on-primary-container text-primary-container"
            : "bg-accent-teal/10 text-accent-teal"
        }`}
      >
        {step.replace("Step ", "")}
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Icon + title row */}
        <div className="flex items-center gap-3 mb-1">
          <span className="opacity-80">{icon}</span>
          <h4
            className={`font-black text-base leading-snug ${
              isBuyCard ? "text-on-primary-container" : "text-on-surface"
            }`}
          >
            {title}
          </h4>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            isBuyCard ? "text-on-primary-container/80" : "text-on-surface-variant"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
