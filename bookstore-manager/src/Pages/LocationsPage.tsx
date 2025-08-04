/**
 * @date August 4, 2025
 * @based_on The page layouts and component compositions from the official shadcn/ui examples and a personal inventory project from CS 361.
 *
 * @degree_of_originality The core layout for these pages is adapted from shadcn/ui examples and patterns from a prior project. They have been modified to display this application's specific data and integrated with the project's data-fetching logic and state management.
 *
 * @source_url The official shadcn/ui examples (e.g., https://ui.shadcn.com/examples/dashboard) and a prior personal project for CS 361.
 *
 * @ai_tool_usage The page components were generated using Cursor. The generation was guided by adapting the official shadcn/ui examples and by providing code from a personal CS 361 inventory project as a template. The generated code was then refined and customized for this application.
 */

import { useState } from "react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LocationsForm } from "@/components/forms/LocationsForm";
import { LocationsList } from "@/components/list-views/LocationsList";

interface Location {
   slocID: number;
   slocName: string;
}

export function LocationsPage() {
   console.log("LocationsPage rendered");
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedLocation, setSelectedLocation] = useState<Location | null>(
      null
   );
   const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-render

   // View labels mapping
   const viewLabels = {
      list: "List Locations",
      create: "Create Location",
      edit: "Edit Location",
      view: "View Location",
   };

   const handleViewChange = (label: string) => {
      // Find the key ('list', 'create', etc.) from the label
      const viewKey = Object.keys(viewLabels).find(
         (key) => viewLabels[key as keyof typeof viewLabels] === label
      ) as "list" | "create" | "edit" | "view";

      if (viewKey === "edit" || viewKey === "view") {
         if (selectedLocation) {
            setCurrentView(viewKey);
         }
      } else {
         setCurrentView(viewKey);
      }
   };

   const handleCreate = () => {
      setSelectedLocation(null);
      setCurrentView("create");
   };

   const handleEdit = (location: Location) => {
      setSelectedLocation(location);
      setCurrentView("edit");
   };

   const handleView = (location: Location) => {
      setSelectedLocation(location);
      setCurrentView("view");
   };

   const handleDelete = () => {
      console.log("Delete location:", selectedLocation);
      setCurrentView("list");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };

   const handleSave = (data: any) => {
      console.log("Save location:", data);
      setCurrentView("list");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };

   // const handleBack = () => {
   //    setCurrentView("list");
   //    setSelectViewOption("List Locations");
   //    setSelectedLocation(null);
   // };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-2xl font-bold mb-4">Locations Management</h1>
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
                                 (label === "Edit Location" ||
                                    label === "View Location") &&
                                 !selectedLocation
                              }
                           >
                              {label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            {currentView === "list" && (
               <>
                  {console.log("Rendering LocationsList")}
                  <LocationsList
                     key={refreshKey}
                     onView={handleView}
                     onEdit={handleEdit}
                     onDelete={handleDelete}
                     onAdd={handleCreate}
                  />
               </>
            )}

            {currentView === "create" && (
               <LocationsForm mode="create" onSave={handleSave} />
            )}

            {currentView === "edit" && selectedLocation && (
               <LocationsForm
                  mode="edit"
                  initialData={selectedLocation}
                  onSave={handleSave}
                  onDelete={handleDelete}
               />
            )}

            {currentView === "view" && selectedLocation && (
               <LocationsForm
                  mode="view"
                  initialData={selectedLocation}
                  onDelete={handleDelete}
               />
            )}
         </div>
      </div>
   );
}
