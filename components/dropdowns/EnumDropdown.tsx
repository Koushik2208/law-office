"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnumDropdownProps<T extends string> {
  placeholder: string;
  enumType: Record<string, T>;
  defaultValue?: T;
  required?: boolean;
  onChange?: (value: string | undefined) => void;
}

const EnumDropdown = <T extends string>({
  placeholder,
  enumType,
  defaultValue,
  required = false,
  onChange,
}: EnumDropdownProps<T>) => {
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
        {Object.values(enumType).map((enumValue) => (
          <SelectItem key={enumValue} value={enumValue}>
            {enumValue}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EnumDropdown;
