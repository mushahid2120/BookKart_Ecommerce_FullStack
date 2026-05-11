"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = books.length - visibleCards;

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

  

  return (
    <div className="relative overflow-hidden w-full max-w-5xl mx-auto px-2">
      {isLoading ? (
        <div className="flex">
          {Array.from({ length: visibleCards }).map((_, index) => (
            <div
              key={index}
              className="px-2"
              style={{ minWidth: `${100 / visibleCards}%` }}
            >
              <Card className="bg-(--color-card) shadow-md border border-(--color-header-border)">
                <div className="aspect-video w-full bg-(--color-surface-soft) animate-pulse rounded"></div>
                <CardContent>
                  <div className="h-4 bg-(--color-surface-soft) animate-pulse rounded mb-2"></div>
                  <div className="flex justify-between mt-2 mb-2">
                    <div className="h-6 bg-(--color-surface-soft) animate-pulse rounded w-1/2"></div>
                    <div className="h-4 bg-(--color-surface-soft) animate-pulse rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-(--color-surface-soft) animate-pulse rounded w-1/3 mb-3"></div>
                  <div className="h-10 bg-(--color-surface-soft) animate-pulse rounded"></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-(--color-text-muted) text-lg font-medium">
          Product is yet to be added, book list is empty
        </div>
      ) : (
        <>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
            }}
          >
            {books.map((book) => (
              <div
                key={book._id}
                className="px-2"
                style={{ minWidth: `${100 / visibleCards}%` }}
              >
                <Card className="bg-(--color-card) shadow-md border border-(--color-header-border)">
                  <div className="h-40">
                    <img
                    src={book.images[0]}
                    alt={book.title}
                    className="aspect-video w-full object-cover"
                  />
                  </div>

                  <CardContent>
                    <div className="font-medium truncate text-base">
                      {book.title}
                    </div>

                    <div className="flex justify-between mt-2">
                      <h3 className="text-lg font-semibold text-(--color-button-yellow)">
                        ₹{book.finalPrice}
                        <span className="line-through text-sm font-normal ml-2 text-(--color-text-muted)">
                          ₹{book.price}
                        </span>
                      </h3>

                      <span className="text-sm text-(--color-text-muted)">
                        {book.condition}
                      </span>
                    </div>

                    <div className="mt-2 text-(--color-accent-yellow) font-medium text-sm">
                      {calculateDiscount(book.price, book.finalPrice)}% Off
                    </div>

                    <Link href={`/books/${book._id}`}>
                      <Button className="mt-3 w-full bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover)">
                        Buy Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-(--color-card) rounded-full shadow p-2 border border-(--color-header-border)"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-(--color-card) rounded-full shadow p-2 border border-(--color-header-border)"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
