import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountryCodeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

interface CountryCode {
  value: string;
  label: string;
  country: string;
}

const countryCodes: CountryCode[] = [
  { value: "+1", label: "+1", country: "United States/Canada" },
  { value: "+44", label: "+44", country: "United Kingdom" },
  { value: "+91", label: "+91", country: "India" },
  { value: "+61", label: "+61", country: "Australia" },
  { value: "+86", label: "+86", country: "China" },
  { value: "+49", label: "+49", country: "Germany" },
  { value: "+33", label: "+33", country: "France" },
  { value: "+81", label: "+81", country: "Japan" },
  { value: "+7", label: "+7", country: "Russia" },
  { value: "+55", label: "+55", country: "Brazil" },
  { value: "+52", label: "+52", country: "Mexico" },
  { value: "+966", label: "+966", country: "Saudi Arabia" },
  { value: "+971", label: "+971", country: "United Arab Emirates" },
  { value: "+65", label: "+65", country: "Singapore" },
  { value: "+82", label: "+82", country: "South Korea" },
  { value: "+234", label: "+234", country: "Nigeria" },
  { value: "+27", label: "+27", country: "South Africa" },
  { value: "+20", label: "+20", country: "Egypt" },
  { value: "+34", label: "+34", country: "Spain" },
  { value: "+39", label: "+39", country: "Italy" },
  { value: "+31", label: "+31", country: "Netherlands" },
  { value: "+90", label: "+90", country: "Turkey" },
  { value: "+92", label: "+92", country: "Pakistan" },
  { value: "+62", label: "+62", country: "Indonesia" },
  { value: "+60", label: "+60", country: "Malaysia" },
  { value: "+63", label: "+63", country: "Philippines" },
  { value: "+84", label: "+84", country: "Vietnam" },
  { value: "+66", label: "+66", country: "Thailand" },
  { value: "+48", label: "+48", country: "Poland" },
  { value: "+46", label: "+46", country: "Sweden" },
  { value: "+41", label: "+41", country: "Switzerland" },
  { value: "+43", label: "+43", country: "Austria" },
  { value: "+32", label: "+32", country: "Belgium" },
  { value: "+45", label: "+45", country: "Denmark" },
  { value: "+64", label: "+64", country: "New Zealand" }
];

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountryCodes = useMemo(() => {
    if (!searchQuery) return countryCodes;
    const search = searchQuery.toLowerCase();
    return countryCodes.filter(
      code => 
        code.country.toLowerCase().includes(search) || 
        code.value.toLowerCase().includes(search)
    );
  }, [searchQuery]);

  const selectedCountry = countryCodes.find(code => code.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 hover:border-blue-400 dark:hover:border-blue-500 transition-colors rounded-lg shadow-sm justify-between"
        >
          {value ? selectedCountry?.label : "+1"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search country code..." 
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No country code found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {filteredCountryCodes.map((code) => (
              <CommandItem
                key={code.value}
                value={code.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  setSearchQuery("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === code.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="font-medium">{code.label}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {code.country}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryCodeSelect; 