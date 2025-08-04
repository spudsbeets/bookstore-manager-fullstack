/**
 * @date August 4, 2025
 * @based_on The page layouts and component compositions from the official shadcn/ui examples.
 *
 * @degree_of_originality The core layout for these pages is adapted from the shadcn/ui examples. They have been modified to display this application's specific data and integrated with the project's data-fetching logic and state management.
 *
 * @source_url The official shadcn/ui examples, such as the one found at https://ui.shadcn.com/examples/dashboard
 *
 * @ai_tool_usage The page components were generated using Cursor by adapting the official shadcn/ui examples. The generated code was then refined and customized for this application.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthorsForm } from "@/components/forms/AuthorsForm";
import { AuthorsList } from "@/components/list-views/AuthorsList";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function AuthorsPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Authors");

   const viewArray = [
      "List Authors",
      "Create Author",
      "Edit Author",
      "View Author",
   ];

   const handleCreate = () => {
      setCurrentView("create");
      setSelectViewOption("Create Author");
   };
   const handleEdit = (author: any) => {
      setSelectedAuthor(author);
      setCurrentView("edit");
      setSelectViewOption("Edit Author");
   };
   const handleView = (author: any) => {
      setSelectedAuthor(author);
      setCurrentView("view");
      setSelectViewOption("View Author");
   };
   const handleDelete = () => {
      console.log("Delete author:", selectedAuthor);
      setCurrentView("list");
      setSelectViewOption("List Authors");
   };
   const handleSave = (data: any) => {
      console.log("Save author:", data);
      setCurrentView("list");
      setSelectViewOption("List Authors");
   };
   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Authors");
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Authors":
            setCurrentView("list");
            break;
         case "Create Author":
            setCurrentView("create");
            break;
         case "Edit Author":
            if (selectedAuthor) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Authors");
            }
            break;
         case "View Author":
            if (selectedAuthor) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Authors");
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
               <h1 className="text-2xl font-bold mb-4">Authors Management</h1>
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
                        ← Back to Authors
                     </Button>
                  </div>
                  <AuthorsForm mode="create" onSave={handleSave} />
               </div>
            )}

            {currentView === "edit" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Authors
                     </Button>
                  </div>
                  <AuthorsForm
                     mode="edit"
                     initialData={selectedAuthor}
                     onSave={handleSave}
                     onDelete={handleDelete}
                  />
               </div>
            )}

            {currentView === "view" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Authors
                     </Button>
                  </div>
                  <AuthorsForm mode="view" initialData={selectedAuthor} />
               </div>
            )}

            {currentView === "list" && (
               <AuthorsList
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
