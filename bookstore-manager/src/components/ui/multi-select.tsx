"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
   value: string;
   label: string;
}

interface MultiSelectProps {
   options: MultiSelectOption[];
   selected: string[];
   onChange: (selected: string[]) => void;
   placeholder?: string;
   searchPlaceholder?: string;
   emptyMessage?: string;
   disabled?: boolean;
   className?: string;
}

export function MultiSelect({
   options,
   selected,
   onChange,
   placeholder = "Select options...",
   searchPlaceholder = "Search...",
   emptyMessage = "No options found.",
   disabled = false,
   className,
}: MultiSelectProps) {
   const [open, setOpen] = React.useState(false);

   const handleUnselect = (item: string) => {
      onChange(selected.filter((i) => i !== item));
   };

   const handleSelect = (item: string) => {
      if (selected.includes(item)) {
         onChange(selected.filter((i) => i !== item));
      } else {
         onChange([...selected, item]);
      }
   };

   const selectedOptions = options.filter((option) =>
      selected.includes(option.value)
   );

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className={cn(
                  "w-full justify-between min-h-[2.5rem] h-auto",
                  className
               )}
               disabled={disabled}
            >
               <div className="flex flex-wrap gap-1 flex-1">
                  {selectedOptions.length === 0 ? (
                     <span className="text-muted-foreground">
                        {placeholder}
                     </span>
                  ) : (
                     selectedOptions.map((option) => (
                        <Badge
                           variant="secondary"
                           key={option.value}
                           className="mr-1 mb-1"
                           onClick={(e) => {
                              e.stopPropagation();
                              handleUnselect(option.value);
                           }}
                        >
                           {option.label}
                           <button
                              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onKeyDown={(e) => {
                                 if (e.key === "Enter") {
                                    handleUnselect(option.value);
                                 }
                              }}
                              onMouseDown={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                              }}
                              onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 handleUnselect(option.value);
                              }}
                           >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                           </button>
                        </Badge>
                     ))
                  )}
               </div>
               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder={searchPlaceholder} />
               <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                     {options.map((option) => (
                        <CommandItem
                           key={option.value}
                           onSelect={() => handleSelect(option.value)}
                        >
                           <Check
                              className={cn(
                                 "mr-2 h-4 w-4",
                                 selected.includes(option.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                              )}
                           />
                           {option.label}
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
