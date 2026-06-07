import { IBookSale } from "@/app/(main)/book-sell/page";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller } from "react-hook-form";

export default function SelectFeild({
  placeholder,
  selectItems,
  control,
  name,
}: {
  placeholder: string;
  selectItems: string[];
  control: Control<IBookSale>;
  name: "classType" | "category";
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Please select any one " }} // Validation
      render={({ field }) => (
        <Select
          onValueChange={field.onChange || ""} // Updates React Hook Form state
          value={field.value ?? ""}
        >
          <SelectTrigger className="w-full md:max-w-140 sm:max-w-110 max-w-100 font-normal text-sm truncate">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="overflow-hidden max-w-140">
            <SelectGroup>
              <SelectLabel>{placeholder}</SelectLabel>
              {selectItems.map((item, i) => (
                <SelectItem value={item} key={i}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
}
