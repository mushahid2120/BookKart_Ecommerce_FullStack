"use client";
import BlogCard from "@/components/BlogCard";
import BookCrousal from "@/components/BookCrousal";
import Hero from "@/components/Hero";
import StepCard from "@/components/StepCard";
import {
  ArrowRight,
  BookOpen,
  Camera,
  CreditCard,
  Library,
  Search,
  Store,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const sellSteps = [
    {
      step: "Step 1",
      title: "Snap some cool pics",
      description:
        "Grab your phone, take a few shots, and tell us why this book is great.",
      icon: <Camera className="h-6 w-6 text-accent-teal" />,
    },
    {
      step: "Step 2",
      title: "Pick your price",
      description:
        "You're the boss! Set a price that makes both you and the next reader happy.",
      icon: <Tag className="h-6 w-6 text-accent-teal" />,
    },
    {
      step: "Step 3",
      title: "Get paid fast!",
      description:
        "No waiting games. Once the book reaches its new home, the cash is yours.",
      icon: <Wallet className="h-6 w-6 text-accent-teal" />,
    },
  ];

  const buySteps = [
    {
      step: "Step 1",
      title: "Discover hidden gems",
      description:
        "Thousands of stories waiting for you at up to 70% off the original price.",
      icon: <Search className="h-6 w-6 text-on-primary-container" />,
    },
    {
      step: "Step 2",
      title: "Safe & sound payments",
      description:
        "Pay with UPI, Cards, or whatever you like. We keep your money safe until the book arrives.",
      icon: <CreditCard className="h-6 w-6 text-on-primary-container" />,
    },
    {
      step: "Step 3",
      title: "Doorstep high-fives",
      description:
        "Sit tight! We handle the delivery so you can start clearing space on your nightstand.",
      icon: <Truck className="h-6 w-6 text-on-primary-container" />,
    },
  ];

  const blogPosts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "How to get the most for your old books?",
      description:
        "Tips and tricks from our top sellers on making your listings stand out and sell faster!",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      imageSrc:
        "https://img.freepik.com/premium-photo/little-girl-is-laying-floor-reading-book_1041545-4497.jpg?w=1060",
      title: "The magic of pre-loved books 🌍",
      description:
        "Discover how your choice to buy second-hand is helping the planet, one page at a time.",
      icon: <Library className="w-5 h-5" />,
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "Meet the readers of BookKart",
      description:
        "Fun stories from our community members about their rarest finds and best book memories.",
      icon: <Store className="w-5 h-5" />,
    },
  ];

  return (
    <main className="bg-background">
      {/* ── Hero ── */}
      <Hero />

      {/* ── Fresh Arrivals ── */}
      <section className="py-12 overflow-hidden bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-on-surface">
                Fresh Arrivals ✨
              </h2>
              <p className="text-lg text-on-surface-variant">
                Check out what the community just listed!
              </p>
            </div>
          </div>

          <BookCrousal />

          <div className="mt-10 text-center">
            <Link href="/books">
              <button className="border-2 border-primary-container px-10 py-4 rounded-full font-black flex items-center gap-3 mx-auto transition-all group shadow-sm bg-white text-primary hover:bg-primary-container hover:text-on-primary-container cursor-pointer">
                Explore all books
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-12 relative overflow-hidden">
        {/* Blob decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 blob-shape -translate-y-1/2 translate-x-1/2 pointer-events-none bg-accent-coral/5" />
        <div className="absolute bottom-0 left-0 w-96 h-96 blob-shape translate-y-1/2 -translate-x-1/2 pointer-events-none bg-accent-teal/5" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-on-surface">
              How it works? It&apos;s easy-peasy! 🥳
            </h2>
            <p className="text-lg max-w-2xl mx-auto font-medium text-on-surface-variant">
              We&apos;ve built a friendly neighborhood for books where everyone
              wins. No complicated stuff, just love for reading.
            </p>
          </div>

          {/* Two panel cards */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* ── Give & Earn (sell) ── */}
            <div className="rounded-[3rem] p-10 relative overflow-hidden border border-white bg-surface-container">
              {/* Card header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl -rotate-6 bg-white text-accent-teal">
                  <Library className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-on-surface">
                    Give &amp; Earn
                  </h3>
                  <p className="font-bold text-sm text-accent-teal">
                    Empty your shelves
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {sellSteps.map(({ step, title, description, icon }, i) => (
                  <StepCard
                    key={i}
                    step={step}
                    title={title}
                    description={description}
                    icon={icon}
                    cardbg="bg-surface-container"
                    stepbg="bg-teal"
                  />
                ))}
              </div>

              {/* CTA */}
              <Link href="/book-sell">
                <button className="w-full mt-8 py-5 rounded-3xl font-black transition-all shadow-lg hover:-translate-y-1 bg-white text-on-surface hover:bg-accent-teal hover:text-white cursor-pointer">
                  I want to Sell Books!
                </button>
              </Link>
            </div>

            {/* ── Hunt & Read (buy) ── */}
            <div className="rounded-[3rem] p-10 relative overflow-hidden bg-primary-container">
              {/* Glow blob */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl rotate-6 bg-on-primary-container text-primary-container">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-on-primary-container">
                    Hunt &amp; Read
                  </h3>
                  <p className="font-bold text-sm text-on-primary-container/70">
                    Find your next obsession
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {buySteps.map(({ step, title, description, icon }, i) => (
                  <StepCard
                    key={i}
                    step={step}
                    title={title}
                    description={description}
                    icon={icon}
                    cardbg="bg-accent-yellow"
                    stepbg="bg-card"
                  />
                ))}
              </div>

              {/* CTA */}
              <Link href="/books">
                <button className="w-full mt-8 py-5 rounded-3xl font-black transition-all shadow-lg hover:-translate-y-1 bg-on-primary-container text-white hover:bg-white hover:text-on-primary-container cursor-pointer">
                  Take me to the Shop!
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community Stories ── */}
      <section className="py-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-on-surface">
              Community Stories ✍️
            </h2>
            <Link
              href="/"
              className="px-6 py-2 rounded-full border-2 border-outline-variant font-bold text-sm transition-all bg-white text-on-surface hover:border-accent-coral hover:text-accent-coral"
            >
              See everything
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(({ imageSrc, icon, title, description }, index) => (
              <BlogCard
                key={index}
                imageSrc={imageSrc}
                icon={icon}
                title={title}
                description={description}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
