"use client";
import { Button } from "@/components/ui/button";
import { Book, BookOpen, ShoppingBagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const heroImages = ["Hero1.jpg", "Hero2.jpg", "Hero3.jpg"];

  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => {
        if(prev===2)
            return 0;
        return prev+1
      });
        return () => clearInterval(timer);
    }, 4000);
  }, []);

  // console.log(currentImage);

  return (
    <section className="flex relative items-center justify-center flex-col  min-h-120">
      <h1 className="md:text-[56px] sm:text-[40px] text-[28px] z-20 text-white font-semibold sm:leading-15 md:leading-12 leading-10 text-center mb-4">
        Buy and Sell Old Books
        <br /> Online in India
      </h1>
      <div className="flex sm:flex-row gap-6 flex-col sm:gap-8  z-20 text-[4px] md:text-normal">
        <Button className="w-auto px-28   max-w-44 rounded-2xl h-auto flex items-center gap-x-4 bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover)">
          <div className="md:p-2 p-1 bg-(--color-surface-muted) rounded-lg">
            <ShoppingBagIcon />
          </div>
          <Link href="/books" className="flex flex-col">
            <span  className="font-normal">Start Shopping</span>
            <span className="font-semibold">Buy Used Books</span>
          </Link >
        </Button>
        <Button className="w-auto px-28  max-w-44 rounded-2xl h-auto flex items-center gap-x-4 bg-(--color-accent-yellow) hover:bg-(--color-button-yellow-hover)">
          <div className="md:p-2 p-1 bg-(--color-surface-muted) rounded-lg">
            <BookOpen />
          </div>
          <Link href="/book-sell" className="flex flex-col">
            <span className="font-normal">Start Selling</span>
            <span className="font-semibold">Sell Old Books</span>
          </Link>
        </Button>
      </div>
      <div className="absolute inset-0 w-full h-auto bg-black/50">
        {heroImages.map((image,index)=>(
          <Image
          src={`/Image/${image}`}
          fill
          alt="Hero Image"
          key={index} 
          priority={index===0}
          className={`w=full object-cover ${index===currentImage ?"opacity-100":"opacity-0"} transition-opacity duration-1000 ease-in-out`}
          />
        ))}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>
    </section>
  );
}
