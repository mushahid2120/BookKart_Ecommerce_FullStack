"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, BookOpenCheck, Rocket, Tag } from "lucide-react";

export default function Hero() {
  const heroImages = ["Hero1.jpg", "Hero2.jpg", "Hero3.jpg"];
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => {
        if (prev === 2) return 0;
        return prev + 1;
      });
      return () => clearInterval(timer);
    }, 4000);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-2 gap-12 items-center min-h-110">
      {/* ── Left: text content ── */}
      <div className="space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-teal-container text-accent-teal">
          <BookOpenCheck />
          Keep stories moving
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-5xl font-black leading-[1.1] text-on-surface">
          Find a New{" "}
          <br />
          <span className="inline-block border-b-8 text-primary-container border-primary-container/30">
            Home
          </span>{" "}
          for your Books.
        </h1>

        {/* Subheading */}
        <p className="text-lg max-w-lg leading-relaxed text-on-surface-variant">
          Join India&apos;s friendliest community of book lovers! Whether
          you&apos;re hunting for a hidden gem or clearing your shelves, we make
          it fun and easy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/books">
            <button className="px-10 py-4 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-primary-container/30 bg-primary-container text-on-primary-container transition-all hover:scale-[1.05] active:scale-95 cursor-pointer">
              <Rocket />
              Let&apos;s Browse
            </button>
          </Link>
          <Link href="/book-sell">
            <button className="px-10 py-4 rounded-full font-bold flex items-center gap-2 bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-all hover:shadow-md cursor-pointer">
              <Tag />
              I&apos;m Selling!
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10 pt-6 border-t border-outline-variant">
          <div className="text-center">
            <div className="text-3xl font-black text-on-surface">50k+</div>
            <div className="text-sm font-medium text-on-surface-variant">
              Readers
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-on-surface">12k+</div>
            <div className="text-sm font-medium text-on-surface-variant">
              Stories Sold
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-accent-coral">4.8/5</div>
            <div className="text-sm font-medium text-on-surface-variant">
              Happy Faces
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: hero image with blobs ── */}
      <div className="relative hidden lg:block">
        {/* Blob decorations */}
        <div className="absolute -inset-6 blob-shape -rotate-6 opacity-60 bg-accent-teal/10" />
        <div className="absolute -inset-4 blob-shape rotate-3 opacity-60 bg-primary-container/10" />

        {/* Rotating hero images */}
        <div className="relative z-10 w-full h-120 rounded-[3rem] overflow-hidden shadow-2xl">
          {heroImages.map((image, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={`/Image/${image}`}
              alt="Hero Image"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Floating badge */}
        <div className="absolute bottom-12 -left-12 z-20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 border-l-4 border-l-accent-teal bg-white animate-bounce">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-accent-teal-container text-accent-teal">
            <BadgeCheck />
          </div>
          <div>
            <p className="font-bold text-on-surface">Trusted Quality</p>
            <p className="text-xs text-on-surface-variant">
              Verified by Readers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
