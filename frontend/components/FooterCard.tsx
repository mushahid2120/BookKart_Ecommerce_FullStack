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
    <Card className="shadow-md border border-(--color-header-border) w-full md:max-w-80 min-h-36 bg-(--color-footer-card-bg)">
      <CardHeader className="flex items-center gap-4 text-white">
        {icon}
        <div>
            <CardTitle className="text-lg">{heading}</CardTitle>
        <CardDescription className="text-md font-normal text-(--color-footer-text)">
          {description}
        </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
