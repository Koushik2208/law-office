import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
  defaultValue?: string;
  required: boolean;
  onChange?: (value: string) => void; // Add onChange prop
}

const SelectDropdown = ({
  placeholder,
  options,
  defaultValue,
  required,
  onChange,
}: SelectProps) => {
  return (
    <Select
      onValueChange={onChange}
      required={required}
      defaultValue={defaultValue}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectDropdown;
