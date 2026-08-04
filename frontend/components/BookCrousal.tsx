"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useLazyGetLatestProductQuery } from "@/store/api";
import Link from "next/link";

interface ILatestBooks {
  _id: string;
  title: string;
  condition: string;
  price: number;
  finalPrice: number;
  images: string[];
}

// Accent styles cycled per card
const accentColors = [
  {
    labelText: "text-accent-teal",
    hoverTitle: "group-hover:text-accent-teal",
    btnHover: "hover:bg-accent-teal hover:text-white",
  },
  {
    labelText: "text-accent-coral",
    hoverTitle: "group-hover:text-accent-coral",
    btnHover: "hover:bg-accent-coral hover:text-white",
  },
  {
    labelText: "text-primary",
    hoverTitle: "group-hover:text-primary",
    btnHover: "hover:bg-primary hover:text-white",
  },
];

export default function BookCarousel() {
  const [books, setBooks] = useState<ILatestBooks[]>([]);
  const [getLatestBook, { isLoading }] = useLazyGetLatestProductQuery();

  useEffect(() => {
    fetchingLatestProduct();
  }, []);

  const fetchingLatestProduct = async () => {
    try {
      const response = await getLatestBook({}).unwrap();
      if (response.isSuccess) {
        setBooks(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, books.length - visibleCards);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const calculateDiscount = (price: number, finalPrice: number) => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  // ── Skeleton ──
  if (isLoading) {
    return (
      <div className="flex gap-6">
        {Array.from({ length: visibleCards }).map((_, index) => (
          <div
            key={index}
            className=" rounded-[2rem] overflow-hidden border border-outline-variant bg-surface-container-lowest animate-pulse"
            style={{
              width: `calc(${100 / visibleCards}% - 1rem)`,
            }}
          >
            <div className="m-3 rounded-[1.5rem] aspect-4/5 bg-surface-container" />
            <div className="p-5 space-y-3">
              <div className="h-3 rounded-full w-1/3 bg-surface-container" />
              <div className="h-5 rounded-full w-3/4 bg-surface-container" />
              <div className="flex justify-between">
                <div className="h-7 rounded-full w-1/2 bg-surface-container" />
                <div className="h-6 rounded-full w-1/5 bg-surface-container" />
              </div>
              <div className="h-12 rounded-2xl w-full bg-surface-container" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ──
  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-lg font-medium text-on-surface-variant">
        No books listed yet — check back soon!
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full">
      {/* Carousel track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
        }}
      >
        {books.map((book, index) => {
          const accent = accentColors[index % accentColors.length];
          const discount = calculateDiscount(book.price, book.finalPrice);

          return (
            <div
              key={book._id}
              className="px-3 "
              style={{ minWidth: `${100 / visibleCards}%` }}
            >
              {/* Card */}
              <div className="group rounded-[2rem] border border-outline-variant bg-surface-container-lowest overflow-hidden transition-all duration-500 cursor-pointer hover:shadow-2xl">
                {/* Image area */}
                <div className="relative aspect-4/5 overflow-hidden m-3 rounded-[1.5rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.images[0]}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Condition badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase shadow-sm bg-white/95 text-accent-teal">
                    {book.condition}
                  </div>

                  {/* Wishlist heart (appears on hover) */}
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-on-surface hover:bg-accent-coral hover:text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-5 pb-5 pt-1">
                  {/* Category */}
                  <div
                    className={`text-xs font-extrabold uppercase mb-2 tracking-widest ${accent.labelText}`}
                  >
                    Used Book
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-bold text-lg mb-4 leading-snug text-on-surface transition-colors ${accent.hoverTitle}`}
                  >
                    {book.title}
                  </h3>

                  {/* Price row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-on-surface">
                        ₹{book.finalPrice}
                      </span>
                      {book.price > book.finalPrice && (
                        <span className="line-through text-sm text-on-surface-variant">
                          ₹{book.price}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <span className="px-3 py-1 rounded-full font-bold text-xs bg-accent-coral-container text-accent-coral">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Buy button */}
                  <Link href={`/books/${book._id}`}>
                    <button
                      className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-sm bg-surface-container-high text-on-surface-variant ${accent.btnHover} cursor-pointer`}
                    >
                      Bag this book
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Nav arrows ── */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-outline-variant bg-white text-on-surface flex items-center justify-center transition-all shadow-sm hover:border-accent-teal hover:text-accent-teal z-10 cursor-pointer"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-outline-variant bg-white text-on-surface flex items-center justify-center transition-all shadow-sm hover:border-accent-teal hover:text-accent-teal z-10 cursor-pointer"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
