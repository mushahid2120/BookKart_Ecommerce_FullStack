// Trust badge card used in the Footer
export default function FooterCard({
  heading,
  icon,
  description,
  iconBgClass = "bg-surface-container text-on-surface",
}: {
  heading: string;
  icon: React.ReactNode;
  description: string;
  iconBgClass?: string;
  // Kept for backward compatibility if passed:
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Icon container */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass}`}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <h5 className="font-black text-base text-on-surface">{heading}</h5>
        <p className="text-xs font-bold uppercase tracking-tight text-on-surface-variant">
          {description}
        </p>
      </div>
    </div>
  );
}
