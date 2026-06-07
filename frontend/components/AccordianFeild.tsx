import { IOptionalDetail } from "@/app/(main)/book-sell/page"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function AccordianFeild({optionalDetail}:{optionalDetail:IOptionalDetail[]}) {
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["notifications"]}
    >
      {optionalDetail.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
