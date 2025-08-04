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
import { BookGenresForm } from "@/components/forms/BookGenresForm";
import { BookGenresList } from "@/components/list-views/BookGenresList";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Tags } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookGenresPage() {
   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookGenre, setSelectedBookGenre] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Book Genres");

   // const handleCreate = () => {
   //    setCurrentView("create");
   //    setSelectViewOption("Create Book Genre");
   //    setSelectedBookGenre(null);
   // };

   // const handleEdit = (bookGenre: any) => {
   //    setSelectedBookGenre(bookGenre);
   //    setCurrentView("edit");
   //    setSelectViewOption("Edit Book Genre");
   // };

   // const handleView = (bookGenre: any) => {
   //    setSelectedBookGenre(bookGenre);
   //    setCurrentView("view");
   //    setSelectViewOption("View Book Genre");
   // };

   // const handleDelete = () => {
   //    console.log("Delete operation");
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Genres");
   // };

   // const handleSave = (data: any) => {
   //    console.log("Save operation:", data);
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Genres");
   // };

   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Book Genres");
      setSelectedBookGenre(null);
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Book Genres":
            setCurrentView("list");
            break;
         case "Create Book Genre":
            setCurrentView("create");
            setSelectedBookGenre(null);
            break;
         case "Edit Book Genre":
            if (selectedBookGenre) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Book Genres");
            }
            break;
         case "View Book Genre":
            if (selectedBookGenre) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Book Genres");
            }
            break;
      }
   };

   const handleBookGenreDelete = (bookGenre: any) => {
      console.log("Delete book genre:", bookGenre);
      // In a real app, this would call an API
   };

   const handleAddBookGenre = () => {
      setCurrentView("create");
      setSelectViewOption("Create Book Genre");
   };

   const handleCreateGenre = () => {
      // Navigate to Genres page to create a new genre
      navigate("/genres");
   };

   const handleEditBookGenre = (bookGenre: any) => {
      setSelectedBookGenre(bookGenre);
      setCurrentView("edit");
      setSelectViewOption("Edit Book Genre");
   };

   const handleViewBookGenre = (bookGenre: any) => {
      setSelectedBookGenre(bookGenre);
      setCurrentView("view");
      setSelectViewOption("View Book Genre");
   };

   const handleBookGenreSave = (data: any) => {
      console.log("Save book genre:", data);
      setCurrentView("list");
      setSelectViewOption("List Book Genres");
      setSelectedBookGenre(null);
   };

   // const handleBookGenreBack = () => {
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Genres");
   //    setSelectedBookGenre(null);
   // };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-3xl font-bold mb-2">
                  Book Genres Management
               </h1>
               <p className="text-muted-foreground">
                  Manage the relationships between books and genres
               </p>
            </div>

            {/* View Selection Dropdown */}
            <div className="mb-6">
               <div className="flex items-center space-x-2">
                  <Label htmlFor="view-select">View:</Label>
                  <Select
                     value={selectViewOption}
                     onValueChange={handleViewChange}
                  >
                     <SelectTrigger className="w-64">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="List Book Genres">
                           List Book Genres
                        </SelectItem>
                        <SelectItem value="Create Book Genre">
                           Create Book Genre
                        </SelectItem>
                        <SelectItem value="Edit Book Genre">
                           Edit Book Genre
                        </SelectItem>
                        <SelectItem value="View Book Genre">
                           View Book Genre
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>

            {/* Create View */}
            {currentView === "create" && (
               <div className="space-y-6">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Book Genres
                     </Button>
                  </div>
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Tags className="h-5 w-5" />
                           Create Book Genre
                        </CardTitle>
                        <CardDescription>
                           Add a new genre to a book
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <BookGenresForm
                           mode="create"
                           bookID={0} // 0 means no specific book selected, form will handle book selection
                           onSave={handleBookGenreSave}
                        />
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* Edit/View View */}
            {(currentView === "edit" || currentView === "view") &&
               selectedBookGenre && (
                  <div className="space-y-6">
                     <div className="mb-4">
                        <Button variant="outline" onClick={handleBack}>
                           ← Back to Book Genres
                        </Button>
                     </div>
                     <BookGenresForm
                        mode={currentView}
                        bookID={selectedBookGenre.bookID}
                        initialData={selectedBookGenre}
                        onSave={handleBookGenreSave}
                        onDelete={
                           currentView === "edit"
                              ? () => handleBookGenreDelete(selectedBookGenre)
                              : undefined
                        }
                     />
                  </div>
               )}

            {/* List View */}
            {currentView === "list" && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Tags className="h-5 w-5" />
                        Book Genres
                     </CardTitle>
                     <CardDescription>
                        All book-genre relationships in the system
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-semibold">
                              All Book Genres
                           </h3>
                           <Button onClick={handleAddBookGenre}>
                              <Tags className="h-4 w-4 mr-2" />
                              Add Book Genre
                           </Button>
                        </div>
                        <BookGenresList
                           bookID={0} // 0 means show all
                           onDelete={handleBookGenreDelete}
                           onAdd={handleAddBookGenre}
                           onEdit={handleEditBookGenre}
                           onView={handleViewBookGenre}
                           onCreateGenre={handleCreateGenre}
                        />
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}
