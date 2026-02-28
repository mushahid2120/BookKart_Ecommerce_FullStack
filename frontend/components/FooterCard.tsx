import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FooterCard({
  heading,
  icon,
  description,
}: {
  heading: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card className="shadow-lg border-none  w-full md:max-w-80 min-h-36 bg-[#202736] ">
      <CardHeader className="flex items-center gap-4 text-white">
        {icon}
        <div>
            <CardTitle className="text-lg">{heading}</CardTitle>
        <CardDescription className="text-md font-normal text-[#4b5563]">
          {description}
        </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
