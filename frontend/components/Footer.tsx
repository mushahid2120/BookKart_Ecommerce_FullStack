"use client";
import Link from "next/link";
import FooterCard from "./FooterCard";
import { Earth, Laugh, Mail, ShieldCheck, ShieldUser, Waypoints } from "lucide-react";

export default function Footer() {
  const footList = [
    {
      heading: "Fun Links",
      hoverClass: "hover:text-accent-teal",
      items: [
        { name: "Shop the Stacks", path: "/books" },
        { name: "Start Selling", path: "/book-sell" },
        { name: "About Us", path: "/about-us" },
        { name: "How it works?", path: "/" },
      ],
    },
    {
      heading: "About Us",
      hoverClass: "hover:text-accent-coral",
      items: [
        { name: "Our Story", path: "/about-us" },
        { name: "The Blog", path: "/" },
        { name: "Help & Support", path: "/help" },
        { name: "Contact Us", path: "/" },
      ],
    },
    {
      heading: "The Rules",
      hoverClass: "hover:text-primary",
      items: [
        { name: "Privacy First", path: "/privacy-policy" },
        { name: "Terms of Use", path: "/term-of-use" },
        { name: "Shipping Details", path: "/" },
        { name: "Safe Trading Guide", path: "/" },
      ],
    },
  ];

  const footFeatures = [
    {
      icon: <ShieldCheck />,
      heading: "Super Safe Pay",
      description: "100% Secure & Protected",
      iconBgClass: "bg-accent-teal-container text-accent-teal",
    },
    {
      icon: <ShieldUser />,
      heading: "BookKart Trust",
      description: "Hand-picked Sellers Only",
      iconBgClass: "bg-accent-coral-container text-accent-coral",
    },
    {
      icon: <Laugh />,
      heading: "Happy Readers",
      description: "24/7 Friendly Support",
      iconBgClass: "bg-primary-container text-on-primary-container",
    },
  ];

  return (
    <footer className="w-full mt-12 border-t border-outline-variant bg-surface-container-lowest rounded-t-[3rem] pt-12">
      <div className="max-w-7xl mx-auto px-8">
        {/* ── Top grid: brand + nav columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-1">
            <span className="text-3xl font-black text-primary">BookKart</span>
            <p className="mt-4 text-sm leading-relaxed font-medium text-secondary">
              The friendliest place in India to swap stories and save books from
              the dust. Let&apos;s build a library together!
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              <button
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary-container cursor-pointer"
                aria-label="Website"
              >
                <Earth />
              </button>
              <button
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all bg-surface-container text-on-surface hover:bg-accent-teal hover:text-white cursor-pointer"
                aria-label="Share"
              >
                <Waypoints />
              </button>
              <button
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all bg-surface-container text-on-surface hover:bg-accent-coral hover:text-white cursor-pointer"
                aria-label="Email"
              >
                <Mail />
              </button>
            </div>
          </div>

          {/* Nav link columns */}
          {footList.map(({ heading, items, hoverClass }, index) => (
            <div key={index}>
              <h4 className="font-black text-on-surface mb-6 text-lg">
                {heading}
              </h4>
              <ul className="space-y-3">
                {items.map(({ path, name }, i) => (
                  <li key={i}>
                    <Link
                      href={path}
                      className={`text-sm font-medium text-secondary transition-all ${hoverClass}`}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Trust badges ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y-2 border-dashed border-outline-variant py-12 mb-12">
          {footFeatures.map(
            ({ heading, icon, description, iconBgClass }, index) => (
              <FooterCard
                key={index}
                heading={heading}
                icon={icon}
                description={description}
                iconBgClass={iconBgClass}
              />
            )
          )}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
          <p className="text-sm font-medium italic text-secondary">
            © {new Date().getFullYear()} BookKart. Helping stories find new
            homes, one shelf at a time.
          </p>
          <div className="flex items-center gap-6 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">
              UPI · Cards · Net Banking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
