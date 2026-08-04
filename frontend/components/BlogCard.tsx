"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Accent themes cycled per card (teal / coral / primary)
const cardAccents = [
  {
    hoverBorder: "hover:border-accent-teal",
    badgeBg: "bg-accent-teal",
    label: "Seller Guide",
    textColor: "text-accent-teal",
    groupHoverText: "group-hover:text-accent-teal",
  },
  {
    hoverBorder: "hover:border-accent-coral",
    badgeBg: "bg-accent-coral",
    label: "Sustainability",
    textColor: "text-accent-coral",
    groupHoverText: "group-hover:text-accent-coral",
  },
  {
    hoverBorder: "hover:border-primary",
    badgeBg: "bg-primary",
    label: "Community",
    textColor: "text-primary",
    groupHoverText: "group-hover:text-primary",
  },
];

let cardIndex = 0;

export default function BlogCard({
  imageSrc,
  title,
  description,
  icon,
}: {
  imageSrc: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  const accent = cardAccents[cardIndex % cardAccents.length];
  cardIndex++;

  return (
    <div
      className={`group rounded-[2.5rem] overflow-hidden border border-outline-variant bg-surface-container-lowest transition-all duration-500 cursor-pointer hover:shadow-2xl ${accent.hoverBorder}`}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden m-3 rounded-[2rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Category badge */}
        <div
          className={`absolute bottom-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${accent.badgeBg}`}
        >
          {accent.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-2">
        <h3
          className={`font-black text-xl leading-tight mb-3 text-on-surface transition-colors ${accent.groupHoverText}`}
        >
          {title}
        </h3>
        <p className="text-sm mb-5 line-clamp-2 leading-relaxed text-on-surface-variant">
          {description}
        </p>
        <Link
          href="/"
          className={`inline-flex items-center gap-2 font-black text-sm transition-all group-hover:gap-4 ${accent.textColor}`}
        >
          Keep Reading <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
