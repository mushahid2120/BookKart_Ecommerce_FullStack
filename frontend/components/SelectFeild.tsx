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
          <SelectTrigger className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-normal text-sm truncate">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="overflow-hidden border border-outline-variant bg-surface-container-lowest rounded-xl shadow-md">
            <SelectGroup>
              <SelectLabel className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-3 py-2">{placeholder}</SelectLabel>
              {selectItems.map((item, i) => (
                <SelectItem value={item} key={i} className="cursor-pointer hover:bg-surface-container-low text-on-surface text-sm focus:bg-surface-container-low">
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
