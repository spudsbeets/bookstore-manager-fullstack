import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PublishersForm } from "@/components/forms/PublishersForm";
import { PublishersList } from "@/components/list-views/PublishersList";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function PublishersPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedPublisher, setSelectedPublisher] = useState<any>(null);
   const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-render

   // View labels mapping
   const viewLabels = {
      list: "List Publishers",
      create: "Create Publisher",
      edit: "Edit Publisher",
      view: "View Publisher",
   };

   const handleCreate = () => {
      setCurrentView("create");
   };
   const handleEdit = (publisher: any) => {
      setSelectedPublisher(publisher);
      setCurrentView("edit");
   };
   const handleView = (publisher: any) => {
      setSelectedPublisher(publisher);
      setCurrentView("view");
   };
   const handleDelete = () => {
      console.log("Delete publisher:", selectedPublisher);
      setCurrentView("list");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };
   const handleSave = (data: any) => {
      console.log("Save publisher:", data);
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
         if (selectedPublisher) {
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
                  Publishers Management
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
                                 (label === "Edit Publisher" ||
                                    label === "View Publisher") &&
                                 !selectedPublisher
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
                        ← Back to Publishers
                     </Button>
                  </div>
                  <PublishersForm mode="create" onSave={handleSave} />
               </div>
            )}

            {currentView === "edit" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Publishers
                     </Button>
                  </div>
                  <PublishersForm
                     mode="edit"
                     initialData={selectedPublisher}
                     onSave={handleSave}
                     onDelete={handleDelete}
                  />
               </div>
            )}

            {currentView === "view" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Publishers
                     </Button>
                  </div>
                  <PublishersForm mode="view" initialData={selectedPublisher} />
               </div>
            )}

            {currentView === "list" && (
               <PublishersList
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
