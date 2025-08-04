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
   const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-render

   // View labels mapping
   const viewLabels = {
      list: "List Sales Rates",
      create: "Create Sales Rate",
      edit: "Edit Sales Rate",
      view: "View Sales Rate",
   };

   const handleCreate = () => {
      setCurrentView("create");
   };
   const handleEdit = (salesRate: any) => {
      setSelectedSalesRate(salesRate);
      setCurrentView("edit");
   };
   const handleView = (salesRate: any) => {
      setSelectedSalesRate(salesRate);
      setCurrentView("view");
   };
   const handleDelete = () => {
      console.log("Delete sales rate:", selectedSalesRate);
      setCurrentView("list");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };
   const handleSave = (data: any) => {
      console.log("Save sales rate:", data);
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
         if (selectedSalesRate) {
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
               <h1 className="text-2xl font-bold mb-4">
                  Sales Rates Management
               </h1>
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
                                 (label === "Edit Sales Rate" ||
                                    label === "View Sales Rate") &&
                                 !selectedSalesRate
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
