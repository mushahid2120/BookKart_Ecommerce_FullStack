import { IBookSale } from "@/app/(main)/book-sell/page";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control, Controller } from "react-hook-form";

export default function RadioGroupFeild({
  RadioItem,
  control,
  name,
}: {
  RadioItem: string[];
  control: Control<IBookSale>;
  name: "paymentMode" | "condition";
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Please select any one" }}
      render={({ field }) => (
        <RadioGroup
          className="flex flex-wrap items-center gap-6 py-1"
          value={field.value ?? ""} // Controlled by react-hook-form
          onValueChange={(val) => {
            field.onChange(val || ""); // Update react-hook-form
          }}
        >
          {RadioItem.map((item, i) => (
            <div className="flex items-center gap-2.5 cursor-pointer group" key={i}>
              <RadioGroupItem value={item} id={`${name}-${i}`} className="w-5 h-5 border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer" />
              <Label htmlFor={`${name}-${i}`} className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                {item}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    />
  );
}
