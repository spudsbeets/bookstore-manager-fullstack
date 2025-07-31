import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GenresForm } from "@/components/forms/GenresForm";
import { GenresList } from "@/components/list-views/GenresList";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function GenresPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedGenre, setSelectedGenre] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Genres");

   const viewArray = [
      "List Genres",
      "Create Genre",
      "Edit Genre",
      "View Genre",
   ];

   const handleCreate = () => {
      setCurrentView("create");
      setSelectViewOption("Create Genre");
   };
   const handleEdit = (genre: any) => {
      setSelectedGenre(genre);
      setCurrentView("edit");
      setSelectViewOption("Edit Genre");
   };
   const handleView = (genre: any) => {
      setSelectedGenre(genre);
      setCurrentView("view");
      setSelectViewOption("View Genre");
   };
   const handleDelete = () => {
      console.log("Delete genre:", selectedGenre);
      setCurrentView("list");
      setSelectViewOption("List Genres");
   };
   const handleSave = (data: any) => {
      console.log("Save genre:", data);
      setCurrentView("list");
      setSelectViewOption("List Genres");
   };
   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Genres");
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Genres":
            setCurrentView("list");
            break;
         case "Create Genre":
            setCurrentView("create");
            break;
         case "Edit Genre":
            if (selectedGenre) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Genres");
            }
            break;
         case "View Genre":
            if (selectedGenre) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Genres");
            }
            break;
         default:
            setCurrentView("list");
      }
   };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-2xl font-bold mb-4">Genres Management</h1>
               <div className="flex flex-col items-start gap-2">
                  <Label>View Options</Label>
                  <Select
                     value={selectViewOption}
                     onValueChange={handleViewChange}
                  >
                     <SelectTrigger className="w-[200px]">
                        <SelectValue>{selectViewOption}</SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                        {viewArray.map((view) => (
                           <SelectItem key={view} value={view}>
                              {view}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            {currentView === "create" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Genres
                     </Button>
                  </div>
                  <GenresForm mode="create" onSave={handleSave} />
               </div>
            )}

            {currentView === "edit" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Genres
                     </Button>
                  </div>
                  <GenresForm
                     mode="edit"
                     initialData={selectedGenre}
                     onSave={handleSave}
                     onDelete={handleDelete}
                  />
               </div>
            )}

            {currentView === "view" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Genres
                     </Button>
                  </div>
                  <GenresForm mode="view" initialData={selectedGenre} />
               </div>
            )}

            {currentView === "list" && (
               <GenresList
                  onCreate={handleCreate}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
               />
            )}
         </div>
      </div>
   );
}
