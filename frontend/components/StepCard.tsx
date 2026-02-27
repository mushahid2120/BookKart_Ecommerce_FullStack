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
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-2xl font-normal ${stepbg}`}>{step}</div>
      <div className="min-h-24 flex items-center justify-center">{icon}</div>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-base font-normal">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
