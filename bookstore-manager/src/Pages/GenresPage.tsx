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
   const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-render

   // View labels mapping
   const viewLabels = {
      list: "List Genres",
      create: "Create Genre",
      edit: "Edit Genre",
      view: "View Genre",
   };

   const handleCreate = () => {
      setCurrentView("create");
   };
   const handleEdit = (genre: any) => {
      setSelectedGenre(genre);
      setCurrentView("edit");
   };
   const handleView = (genre: any) => {
      setSelectedGenre(genre);
      setCurrentView("view");
   };
   const handleDelete = () => {
      console.log("Delete genre:", selectedGenre);
      setCurrentView("list");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };
   const handleSave = (data: any) => {
      console.log("Save genre:", data);
      setCurrentView("list");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };
   const handleBack = () => {
      setCurrentView("list");
   };

   const handleViewChange = (label: string) => {
      // Find the key ('list', 'create', etc.) from the label
      const viewKey = Object.keys(viewLabels).find(
         (key) => viewLabels[key as keyof typeof viewLabels] === label
      ) as "list" | "create" | "edit" | "view";

      if (viewKey === "edit" || viewKey === "view") {
         if (selectedGenre) {
            setCurrentView(viewKey);
         }
      } else {
         setCurrentView(viewKey);
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
                     value={viewLabels[currentView]}
                     onValueChange={handleViewChange}
                  >
                     <SelectTrigger className="w-[200px]">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {Object.values(viewLabels).map((label) => (
                           <SelectItem
                              key={label}
                              value={label}
                              disabled={
                                 (label === "Edit Genre" ||
                                    label === "View Genre") &&
                                 !selectedGenre
                              }
                           >
                              {label}
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
                  key={refreshKey}
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
