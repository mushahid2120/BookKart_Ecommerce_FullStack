import { IBookSale } from "@/app/book-sell/page";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control, Controller } from "react-hook-form";

export default function RadioGroupFeild({
  RadioItem,
  setSelectedItem,
  control,
  name,
}: {
  RadioItem: string[];
  control: Control<IBookSale>;
  name: "paymentMode" | "condition";
  setSelectedItem: (arg: string) => void;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Please select any one" }}
      render={({ field }) => (
        <RadioGroup
          className=" flex flex-row w-full md:max-w-140 sm:max-w-110 max-w-100"
          value={field.value ?? ""} // Controlled by react-hook-form
          onValueChange={(val) => {
            field.onChange(val || ""); // Update react-hook-form
            setSelectedItem(val || ""); // Update your custom state
          }}
        >
          {RadioItem.map((item, i) => (
            <div className="flex items-center gap-3 " key={i}>
              <RadioGroupItem value={item} id={item} />
              <Label htmlFor={item}>{item}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
    />
  );
}
