import { useState } from "react";
// import { MapPin } from "lucide-react"; // Commented out unused import
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
   const [selectViewOption, setSelectViewOption] = useState("List Locations");
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedLocation, setSelectedLocation] = useState<Location | null>(
      null
   );

   const viewArray = [
      "List Locations",
      "Create Location",
      "Edit Location",
      "View Location",
   ];

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Locations":
            setCurrentView("list");
            break;
         case "Create Location":
            setCurrentView("create");
            break;
         case "Edit Location":
            if (selectedLocation) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Locations");
               setCurrentView("list");
            }
            break;
         case "View Location":
            if (selectedLocation) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Locations");
               setCurrentView("list");
            }
            break;
      }
   };

   const handleCreate = () => {
      setSelectedLocation(null);
      setCurrentView("create");
      setSelectViewOption("Create Location");
   };

   const handleEdit = (location: Location) => {
      setSelectedLocation(location);
      setCurrentView("edit");
      setSelectViewOption("Edit Location");
   };

   const handleView = (location: Location) => {
      setSelectedLocation(location);
      setCurrentView("view");
      setSelectViewOption("View Location");
   };

   const handleDelete = () => {
      console.log("Delete location:", selectedLocation);
      setCurrentView("list");
      setSelectViewOption("List Locations");
   };

   const handleSave = (data: any) => {
      console.log("Save location:", data);
      setCurrentView("list");
      setSelectViewOption("List Locations");
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

            {currentView === "list" && (
               <LocationsList
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleCreate}
               />
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
