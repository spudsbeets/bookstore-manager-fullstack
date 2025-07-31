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
   const [selectViewOption, setSelectViewOption] = useState("List Publishers");

   const viewArray = [
      "List Publishers",
      "Create Publisher",
      "Edit Publisher",
      "View Publisher",
   ];

   const handleCreate = () => {
      setCurrentView("create");
      setSelectViewOption("Create Publisher");
   };
   const handleEdit = (publisher: any) => {
      setSelectedPublisher(publisher);
      setCurrentView("edit");
      setSelectViewOption("Edit Publisher");
   };
   const handleView = (publisher: any) => {
      setSelectedPublisher(publisher);
      setCurrentView("view");
      setSelectViewOption("View Publisher");
   };
   const handleDelete = () => {
      console.log("Delete publisher:", selectedPublisher);
      setCurrentView("list");
      setSelectViewOption("List Publishers");
   };
   const handleSave = (data: any) => {
      console.log("Save publisher:", data);
      setCurrentView("list");
      setSelectViewOption("List Publishers");
   };
   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Publishers");
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Publishers":
            setCurrentView("list");
            break;
         case "Create Publisher":
            setCurrentView("create");
            break;
         case "Edit Publisher":
            if (selectedPublisher) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Publishers");
            }
            break;
         case "View Publisher":
            if (selectedPublisher) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Publishers");
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
                  Publishers Management
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
