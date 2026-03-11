"use client";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";

export default function BookList({ books,monthDiff }: { books: any ,monthDiff:any}) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const calculateDiscount = (price: number, finalPrice: number) => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };



  if(books.length===0) 
    return (<div className=" text-center py-12 text-2xl text-gray-700">No Book Found</div>)

  return (
    <div>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-2 ml-2 ">
        {books.slice((currentPage - 1) * 6, currentPage * 6).map((book:any) => (
            <Link href={`/books/${book._id}`} key={book._id}>
            <Card   className="relative hover:shadow-2xl py-0 overflow-hidden pb-4 gap-2 sm:gap-4">
              <img
                src={book.images[0]}
                alt={book.title}
                className="relative aspect-video w-full object-cover"
              />

              <div className="absolute mt-2 bg-orange-600 text-white rounded-r-xl pl-1 pr-2 font-semibold text-sm z-100">
                {calculateDiscount(book.price, book.finalPrice)}% Off
              </div>

              <div className=" absolute top-2 right-2 p-1 text-red-500 bg-[#ddeafe] hover:bg-[#c5d5ee] hover:text-red-600 rounded-full z-100">
                <Heart width={22}  />
              </div>

              <CardContent className="px-2 sm:px-4">
                <div className="font-semibold truncate sm:py-0 sm:text-base text-[14px]">
                  {book.title}
                </div>
                <div className="font-normal sm:text-sm text-[12px]  text-gray-500 ">
                  {book.author}
                </div>

                <h3 className="sm:text-lg text-[13px] font-semibold my-1">
                  ₹{book.finalPrice}
                  <span className="line-through sm:text-sm text-[11px] font-normal sm:ml-2 ml-1">
                    ₹{book.price}
                  </span>
                </h3>
                <div className="flex justify-between items-center ">
                  <p className="sm:text-[12px] text-[8px] text-gray-400">
                    {monthDiff(book.createdAt)} month ago
                  </p>

                  <span className="sm:text-[14px] text-[10px] text-gray-500">
                    {book.condition}
                  </span>
                </div>

                {/* <Button className="mt-3 w-full bg-[#eb5a0d]">Buy Now</Button> */}
              </CardContent>
            </Card>
            </Link>
        ))}
      </div>
      <div className="flex gap-2 justify-center items-center mt-8">
        <Button
          variant="outline"
          className={
            currentPage === 1 ? "text-black/20 hover:text-black/20" : ""
          }
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev === 1) return prev;
              return prev - 1;
            });
          }}
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: Math.ceil(books.length / 6) }).map((_, i) => {
          if (i + 1 <= currentPage + 2 && i + 1 >= currentPage - 1)
            return (
              <Button
                variant="outline"
                key={i}
                className={` ${currentPage === i + 1 ? "bg-blue-400 text-white" : ""}`}
                onClick={() => {
                  setCurrentPage((prev) => i + 1);
                }}
              >
                {i + 1}
              </Button>
            );
        })}
        <Button
          variant="outline"
          className={
            currentPage === books.length/6 ? "text-black/40 hover:text-black/40" : ""
          }
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev === books.length / 6) return prev;
              return prev + 1;
            });
          }}
        >
          <ChevronRight />
        </Button> 
      </div>
    </div>
  );
}
