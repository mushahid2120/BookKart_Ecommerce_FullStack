import BlogCard from "@/components/BlogCard";
import BookCrousal from "@/components/BookCrousal";
import Hero from "@/components/Hero";
import StepCard from "@/components/StepCard";
import { Button } from "@/components/ui/button";
import {
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

export default function Home() {
  const sellSteps = [
    {
      step: "Step 1",
      title: "Post an ad for selling used books",
      description:
        "Post an ad on BookKart describing your book details to sell your old books online.",
      icon: <Camera className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 2",
      title: "Set the selling price for your books",
      description:
        "Set the price for your books at which you want to sell them.",
      icon: <Tag className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 3",
      title: "Get paid into your UPI/Bank account",
      description:
        "You will get money into your account once you receive an order for your book.",
      icon: <Wallet className="h-8 w-8 text-primary" />,
    },
  ];

  const buySteps = [
    {
      step: "Step 1",
      title: "Select the used books you want",
      description:
        "Search from over thousands of used books listed on BookKart.",
      icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className="h-8 w-8 text-primary" />,
    },
  ];

  const blogPosts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "Where and how to sell old books online?",
      description:
        "Get started with selling your used books online and earn money from your old books.",
      icon: <BookOpen className="w-12 h-6 text-primary" />,
    },
    {
      imageSrc:
        "https://img.freepik.com/premium-photo/little-girl-is-laying-floor-reading-book_1041545-4497.jpg?w=1060",
      title: "What to do with old books?",
      description:
        "Learn about different ways to make use of your old books and get value from them.",
      icon: <Library className="w-12 text-primary" />,
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "What is BookKart?",
      description:
        "Discover how BookKart helps you buy and sell used books online easily.",
      icon: <Store className="w-12 text-primary" />,
    },
  ];

  return (
    <main>
      <Hero />
      <section className="md:px-12 sm:px-10  px-6 bg-[#f9fafb]">
        <h1 className="pt-10 mb-8 text-xl md:text-3xl sm:text-2xl text-center font-semibold">
          Newly Added Books
        </h1>

        <BookCrousal />

        <div className="flex items-center justify-center my-8">
          <Button
            className="bg-[#eab308] hover:bg-[#be951c] text-white text-lg font-normal h-12 "
            size="lg"
          >
            Explore All Books
          </Button>
        </div>

        <div className=" font-semibold text-center lg:mt-24 md:mt-16 mt-12 lg:mb-16 mb-12">
          <h1 className="text-3xl">
            How to SELL your old books online on BookKart?
          </h1>
          <p className="font-normal text-[#885563] mt-4">
            Earning money by selling your old books is just 3 steps away from
            you
          </p>
        </div>

        <div className="grid md:grid-cols-3 grid-row-3 lg:gap-8 sm:px-10 md:px-0 gap-4">
          {sellSteps.map(({ step, title, description, icon }, index) => (
            <StepCard
              key={index}
              step={step}
              title={title}
              description={description}
              icon={icon}
              cardbg="bg-[#ffff]"
              stepbg="bg-[#facc15]"
            />
          ))}
        </div>

        <div className=" font-semibold text-center lg:mt-24 md:mt-16 mt-12 lg:mb-16 mb-12">
          <h1 className="text-3xl">
            How to BUY second hand books online on BookKart?
          </h1>
          <p className="font-normal text-[#885563] mt-4">
            Saving some good amount of money by buying used books is just 3
            steps away from you you
          </p>
        </div>

        <div className="grid md:grid-cols-3 grid-row-3 lg:gap-8 gap-4">
          {buySteps.map(({ step, title, description, icon }, index) => (
            <StepCard
              key={index}
              step={step}
              title={title}
              description={description}
              icon={icon}
              cardbg="bg-[#facc15]"
              stepbg="bg-[#ffff]"
            />
          ))}
        </div>
      </section>

      <section className="md:px-12 sm:px-10  px-6 pb-20 pt-8 mt-12   bg-[#ddeafe] ">
          <h1 className=" pb-12 text-3xl font-semibld text-center">
            Read from our Blog
          </h1>
          <div className="grid md:grid-cols-3 grid-row-3 gap-8">
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
      </section>
    </main>
  );
}
