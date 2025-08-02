"use client";

import { useState } from "react";
import { MultiSelect } from "./multi-select";

// Demo data
const authors = [
   { value: "1", label: "Stephen Edwin King" },
   { value: "2", label: "Terry Pratchett" },
   { value: "3", label: "Toni Morrison" },
   { value: "4", label: "Thomas Pynchon" },
];

const genres = [
   { value: "1", label: "Postmodern Fiction" },
   { value: "2", label: "Historical Fiction" },
   { value: "3", label: "Horror" },
   { value: "4", label: "Fantasy" },
];

export function MultiSelectDemo() {
   const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
   const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

   return (
      <div className="space-y-4 p-4">
         <h2 className="text-lg font-semibold">Multi-Select Demo</h2>

         <div className="space-y-2">
            <label className="text-sm font-medium">Authors</label>
            <MultiSelect
               options={authors}
               selected={selectedAuthors}
               onChange={setSelectedAuthors}
               placeholder="Select authors..."
               searchPlaceholder="Search authors..."
               emptyMessage="No authors found."
            />
            <p className="text-sm text-muted-foreground">
               Selected:{" "}
               {selectedAuthors.length > 0
                  ? selectedAuthors.join(", ")
                  : "None"}
            </p>
         </div>

         <div className="space-y-2">
            <label className="text-sm font-medium">Genres</label>
            <MultiSelect
               options={genres}
               selected={selectedGenres}
               onChange={setSelectedGenres}
               placeholder="Select genres..."
               searchPlaceholder="Search genres..."
               emptyMessage="No genres found."
            />
            <p className="text-sm text-muted-foreground">
               Selected:{" "}
               {selectedGenres.length > 0 ? selectedGenres.join(", ") : "None"}
            </p>
         </div>
      </div>
   );
}
