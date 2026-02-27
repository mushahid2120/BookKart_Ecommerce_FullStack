import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function BlogCard({
  imageSrc,title,description,icon
}: {
  imageSrc: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-lg border-none text-center relative" >
      <div className="min-h-24 w-full flex items-center justify-center">
        <Image
        src={imageSrc}
        fill
        alt="myimage"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg flex gap-2">
            {icon}
            <div>{title}</div>
        </CardTitle>
        <CardDescription className="text-base font-normal">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
