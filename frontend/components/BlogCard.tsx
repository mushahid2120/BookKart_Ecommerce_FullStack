import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  return (
    <Card className="relative mx-auto w-full max-w-sm md:max-h-100 lg:max-h-200 pt-0 overflow-hidden">
      <div className="absolute inset-0 z-30 aspect-video" />
      <img
        src={imageSrc}
        alt="blog"
        className="relative z-20 aspect-video w-full object-cover "
      />
      <CardHeader className="md:h-40 " >
        <CardTitle className="lg:text-xl text-base flex lg:gap-4 gap-4 md:gap-2 justify-center items-center">
          {icon}
          <div>{title}</div>
        </CardTitle>
        <CardDescription className="lg:text-base text-sm font-normal">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-center ">
        <Link href="/">
          <Button variant="link">Read More <ArrowRight/></Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
