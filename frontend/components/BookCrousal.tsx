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

  //     const books = [
  //   {
  //     _id: "1",
  //     images: ["/Image/image_5.jpg", "/Image/Hero_5.jpg"],
  //     title: "The Alchemist",
  //     category: "Reading Books (Novels)",
  //     condition: "Excellent",
  //     classType: "B.Com",
  //     subject: "Fiction",
  //     price: 300,
  //     author: "Paulo Coelho",
  //     edition: "25th Anniversary Edition",
  //     description:
  //       "A philosophical book about a shepherd's journey to realize his dreams.",
  //     finalPrice: 250,
  //     shippingCharge: 50,
  //     paymentMode: "UPI",
  //     paymentDetails: {
  //       upiId: "example@upi",
  //     },
  //     createdAt: new Date("2024-01-01"),
  //     seller: { name: "John Doe", contact: "1234567890" },
  //   },
  //   {
  //     _id: "2",
  //     images: ["/Image/Hero3.jpg", "/Image/Hero3.jpg"],
  //     title: "7 Habits of Highly Effective People",
  //     category: "Reading Books (Business)",
  //     condition: "Good",
  //     classType: "MBA",
  //     subject: "Self-Help",
  //     price: 500,
  //     author: "Stephen R. Covey",
  //     edition: "30th Anniversary Edition",
  //     description: "A guide to personal and professional effectiveness.",
  //     finalPrice: 450,
  //     shippingCharge: 30,
  //     paymentMode: "Bank Account",
  //     paymentDetails: {
  //       bankDetails: {
  //         accountNumber: "1234567890123456",
  //         ifscCode: "ABC1234567",
  //         bankName: "XYZ Bank",
  //       },
  //     },
  //     createdAt: new Date("2024-01-02"),
  //     seller: { name: "Jane Smith", contact: "0987654321" },
  //   },
  //   {
  //     _id: "3",
  //     images: ["/Image/image_5.jpg"],
  //     title: "Ignited Minds",
  //     category: "Reading Books (Motivation)",
  //     condition: "Fair",
  //     classType: "B.Tech",
  //     subject: "Inspiration",
  //     price: 400,
  //     author: "APJ Abdul Kalam",
  //     edition: "1st Edition",
  //     description: "An inspiring book aimed at the youth of India.",
  //     finalPrice: 350,
  //     shippingCharge: 40,
  //     paymentMode: "UPI",
  //     paymentDetails: {
  //       upiId: "kalam@upi",
  //     },
  //     createdAt: new Date("2024-01-03"),
  //     seller: { name: "Rahul Gupta", contact: "1122334455" },
  //   },
  //   {
  //     _id: "4",
  //     images: ["/Image/image_6.jpg"],
  //     title: "Introduction to Algorithms",
  //     category: "College Books (Higher Education Textbooks)",
  //     condition: "Excellent",
  //     classType: "M.Tech",
  //     subject: "Computer Science",
  //     price: 1200,
  //     author: "Thomas H. Cormen et al.",
  //     edition: "3rd Edition",
  //     description: "A comprehensive introduction to algorithms.",
  //     finalPrice: 1100,
  //     shippingCharge: 60,
  //     paymentMode: "Bank Account",
  //     paymentDetails: {
  //       bankDetails: {
  //         accountNumber: "6543210987654321",
  //         ifscCode: "XYZ9876543",
  //         bankName: "ABC Bank",
  //       },
  //     },
  //     createdAt: new Date("2024-01-04"),
  //     seller: { name: "Alice Brown", contact: "2233445566" },
  //   },
  //   {
  //     _id: "5",
  //     images: ["/Image/image_7.jpg"],
  //     title: "Data Structures and Algorithms Made Easy",
  //     category: "College Books (Higher Education Textbooks)",
  //     condition: "Good",
  //     classType: "B.Sc",
  //     subject: "Computer Science",
  //     price: 800,
  //     author: "Narasimha Karumanchi",
  //     edition: "2nd Edition",
  //     description: "A comprehensive guide to data structures and algorithms.",
  //     finalPrice: 700,
  //     shippingCharge: 50,
  //     paymentMode: "UPI",
  //     paymentDetails: { upiId: "data.structures@upi" },
  //     createdAt: new Date("2024-01-05"),
  //     seller: { name: "Michael Johnson", contact: "3344556677" },
  //   },
  //   {
  //     _id: "6",
  //     images: ["/Image/image_8.jpg"],
  //     title: "The Great Gatsby",
  //     category: "Reading Books (Novels)",
  //     condition: "Excellent",
  //     classType: "12th",
  //     subject: "Literature",
  //     price: 450,
  //     author: "F. Scott Fitzgerald",
  //     edition: "New Edition",
  //     description: "A classic novel exploring themes of wealth and society.",
  //     finalPrice: 400,
  //     shippingCharge: 20,
  //     paymentMode: "Bank Account",
  //     paymentDetails: {
  //       bankDetails: {
  //         accountNumber: "7890123456789012",
  //         ifscCode: "LMN4567890",
  //         bankName: "DEF Bank",
  //       },
  //     },
  //     createdAt: new Date("2024-01-06"),
  //     seller: { name: "Emily Davis", contact: "4455667788" },
  //   },
  //   {
  //     _id: "7",
  //     images: ["/Image/image_9.jpg"],
  //     title: "Thinking, Fast and Slow",
  //     category: "Reading Books (Psychology)",
  //     condition: "Good",
  //     classType: "MBA",
  //     subject: "Psychology",
  //     price: 600,
  //     author: "Daniel Kahneman",
  //     edition: "1st Edition",
  //     description: "An exploration of how we think and make decisions.",
  //     finalPrice: 550,
  //     shippingCharge: 25,
  //     paymentMode: "UPI",
  //     paymentDetails: { upiId: "thinking.fast@upi" },
  //     createdAt: new Date("2024-01-07"),
  //     seller: { name: "Sarah Wilson", contact: "5566778899" },
  //   },
  //   {
  //     _id: "8",
  //     images: ["/Image/image_10.jpg"],
  //     title: "The Catcher in the Rye",
  //     category: "Reading Books (Novels)",
  //     condition: "Fair",
  //     classType: "11th",
  //     subject: "Literature",
  //     price: 350,
  //     author: "J.D. Salinger",
  //     edition: "Revised Edition",
  //     description: "A novel about teenage rebellion and alienation.",
  //     finalPrice: 300,
  //     shippingCharge: 15,
  //     paymentMode: "Bank Account",
  //     paymentDetails: {
  //       bankDetails: {
  //         accountNumber: "1234567890123456",
  //         ifscCode: "OPQ1234567",
  //         bankName: "GHI Bank",
  //       },
  //     },
  //     createdAt: new Date("2024-01-08"),
  //     seller: { name: "David Lee", contact: "6677889900" },
  //   },
  //   {
  //     _id: "9",
  //     images: ["/Image/image_11.jpg"],
  //     title: "Becoming",
  //     category: "Reading Books (Biography)",
  //     condition: "Excellent",
  //     classType: "MBA",
  //     subject: "Biography",
  //     price: 500,
  //     author: "Michelle Obama",
  //     edition: "1st Edition",
  //     description: "The memoir of the former First Lady of the United States.",
  //     finalPrice: 450,
  //     shippingCharge: 20,
  //     paymentMode: "UPI",
  //     paymentDetails: { upiId: "becoming@upi" },
  //     createdAt: new Date("2024-01-09"),
  //     seller: { name: "Laura Green", contact: "7788990011" },
  //   },
  //   {
  //     _id: "10",
  //     images: ["/Image/image_14.jpg"],
  //     title: "Sapiens",
  //     category: "Reading Books (History)",
  //     condition: "Good",
  //     classType: "Ph.D",
  //     subject: "History",
  //     price: 700,
  //     author: "Yuval Noah Harari",
  //     edition: "1st Edition",
  //     description: "A brief history of humankind.",
  //     finalPrice: 650,
  //     shippingCharge: 35,
  //     paymentMode: "Bank Account",
  //     paymentDetails: {
  //       bankDetails: {
  //         accountNumber: "2345678901234567",
  //         ifscCode: "RST9876543",
  //         bankName: "JKL Bank",
  //       },
  //     },
  //     createdAt: new Date("2024-01-10"),
  //     seller: { name: "Chris Brown", contact: "8899001122" },
  //   },
  // ];

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
                  <img
                    src={book.images[0]}
                    alt={book.title}
                    className="aspect-video w-full object-cover"
                  />

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
