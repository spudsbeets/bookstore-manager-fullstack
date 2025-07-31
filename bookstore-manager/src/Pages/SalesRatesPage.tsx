import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SalesRateLocationsForm } from "@/components/forms/SalesRateLocationsForm";
import { SalesRateLocationsList } from "@/components/list-views/SalesRateLocationsList";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function SalesRatesPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedSalesRate, setSelectedSalesRate] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Sales Rates");

   const viewArray = [
      "List Sales Rates",
      "Create Sales Rate",
      "Edit Sales Rate",
      "View Sales Rate",
   ];

   const handleCreate = () => {
      setCurrentView("create");
      setSelectViewOption("Create Sales Rate");
   };
   const handleEdit = (salesRate: any) => {
      setSelectedSalesRate(salesRate);
      setCurrentView("edit");
      setSelectViewOption("Edit Sales Rate");
   };
   const handleView = (salesRate: any) => {
      setSelectedSalesRate(salesRate);
      setCurrentView("view");
      setSelectViewOption("View Sales Rate");
   };
   const handleDelete = () => {
      console.log("Delete sales rate:", selectedSalesRate);
      setCurrentView("list");
      setSelectViewOption("List Sales Rates");
   };
   const handleSave = (data: any) => {
      console.log("Save sales rate:", data);
      setCurrentView("list");
      setSelectViewOption("List Sales Rates");
   };
   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Sales Rates");
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Sales Rates":
            setCurrentView("list");
            break;
         case "Create Sales Rate":
            setCurrentView("create");
            break;
         case "Edit Sales Rate":
            if (selectedSalesRate) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Sales Rates");
            }
            break;
         case "View Sales Rate":
            if (selectedSalesRate) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Sales Rates");
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
               <h1 className="text-2xl font-bold mb-4">
                  Sales Rates Management
               </h1>
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
                        ← Back to Sales Rates
                     </Button>
                  </div>
                  <SalesRateLocationsForm mode="create" onSave={handleSave} />
               </div>
            )}

            {currentView === "edit" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Sales Rates
                     </Button>
                  </div>
                  <SalesRateLocationsForm
                     mode="edit"
                     initialData={selectedSalesRate}
                     onSave={handleSave}
                     onDelete={handleDelete}
                  />
               </div>
            )}

            {currentView === "view" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Sales Rates
                     </Button>
                  </div>
                  <SalesRateLocationsForm
                     mode="view"
                     initialData={selectedSalesRate}
                  />
               </div>
            )}

            {currentView === "list" && (
               <SalesRateLocationsList
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
