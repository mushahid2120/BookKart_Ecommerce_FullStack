import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StepCard({
  step,title,description,icon,stepbg,cardbg
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  stepbg:string;
  cardbg:string
}) {
  return (
    <Card className={`shadow-lg border-none text-center relative ${cardbg}`} >
        <div className={` md:text-sm text-base absolute top-4 left-4 md:px-3 px-4 p1-2 py-1 rounded-2xl font-normal ${stepbg}`}>{step}</div>
      <div className="min-h-24 md:min-h-16 flex items-center justify-center">{icon}</div>
      <CardHeader>
        <CardTitle className="md:text-lg md:leading-6 lg:leading-normal text-base">{title}</CardTitle>
        <CardDescription className="md:text-base md:leading-4 lg:leading-normal text-sm  font-normal">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
