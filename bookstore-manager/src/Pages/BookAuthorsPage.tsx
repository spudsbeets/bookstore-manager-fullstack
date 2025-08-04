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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookAuthorsForm } from "@/components/forms/BookAuthorsForm";
import { BookAuthorsList } from "@/components/list-views/BookAuthorsList";
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
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import services for real data
import BooksService from "@/services/BooksService";

export function BookAuthorsPage() {
   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookAuthor, setSelectedBookAuthor] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] =
      useState("List Book Authors");
   const [selectedBook, setSelectedBook] = useState<any>(null);
   const [books, setBooks] = useState<any[]>([]);

   // Fetch real data from API
   useEffect(() => {
      const fetchData = async () => {
         try {
            const booksResponse = await BooksService.getAll();
            setBooks(booksResponse.data);
         } catch (error) {
            console.error("Error fetching books:", error);
         }
      };

      fetchData();
   }, []);

   // const handleCreate = () => {
   //    setCurrentView("create");
   //    setSelectViewOption("Create Book Author");
   //    setSelectedBookAuthor(null);
   // };

   // const handleEdit = (bookAuthor: any) => {
   //    setSelectedBookAuthor(bookAuthor);
   //    setCurrentView("edit");
   //    setSelectViewOption("Edit Book Author");
   // };

   // const handleView = (bookAuthor: any) => {
   //    setSelectedBookAuthor(bookAuthor);
   //    setCurrentView("view");
   //    setSelectViewOption("View Book Author");
   // };

   // const handleDelete = () => {
   //    console.log("Delete operation");
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Authors");
   // };

   // const handleSave = (data: any) => {
   //    console.log("Save operation:", data);
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Authors");
   // };

   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Book Authors");
      setSelectedBookAuthor(null);
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Book Authors":
            setCurrentView("list");
            break;
         case "Create Book Author":
            setCurrentView("create");
            setSelectedBookAuthor(null);
            break;
         case "Edit Book Author":
            if (selectedBookAuthor) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Book Authors");
            }
            break;
         case "View Book Author":
            if (selectedBookAuthor) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Book Authors");
            }
            break;
      }
   };

   const handleBookAuthorDelete = (bookAuthor: any) => {
      console.log("Delete book author:", bookAuthor);
      // In a real app, this would call an API
   };

   const handleAddBookAuthor = () => {
      setCurrentView("create");
      setSelectViewOption("Create Book Author");
   };

   const handleCreateAuthor = () => {
      // Navigate to Authors page to create a new author
      navigate("/authors");
   };

   const handleEditBookAuthor = (bookAuthor: any) => {
      setSelectedBookAuthor(bookAuthor);
      setCurrentView("edit");
      setSelectViewOption("Edit Book Author");
   };

   const handleViewBookAuthor = (bookAuthor: any) => {
      setSelectedBookAuthor(bookAuthor);
      setCurrentView("view");
      setSelectViewOption("View Book Author");
   };

   const handleBookAuthorSave = (data: any) => {
      console.log("Save book author:", data);
      setCurrentView("list");
      setSelectViewOption("List Book Authors");
      setSelectedBookAuthor(null);
   };

   // const handleBookAuthorBack = () => {
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Authors");
   //    setSelectedBookAuthor(null);
   // };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-3xl font-bold mb-2">
                  Book Authors Management
               </h1>
               <p className="text-muted-foreground">
                  Manage the relationships between books and authors
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
                        <SelectItem value="List Book Authors">
                           List Book Authors
                        </SelectItem>
                        <SelectItem value="Create Book Author">
                           Create Book Author
                        </SelectItem>
                        <SelectItem value="Edit Book Author">
                           Edit Book Author
                        </SelectItem>
                        <SelectItem value="View Book Author">
                           View Book Author
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
                        ← Back to Book Authors
                     </Button>
                  </div>
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Users className="h-5 w-5" />
                           Create Book Author
                        </CardTitle>
                        <CardDescription>
                           Add a new author to a book
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div>
                              <Label>Select Book</Label>
                              <Select
                                 value={selectedBook?.bookID?.toString() || ""}
                                 onValueChange={(value) => {
                                    const book = books.find(
                                       (b) => b.bookID === Number(value)
                                    );
                                    setSelectedBook(book);
                                 }}
                              >
                                 <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Choose a book..." />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {books.map((book) => (
                                       <SelectItem
                                          key={book.bookID}
                                          value={book.bookID.toString()}
                                       >
                                          {book.title}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                           {selectedBook && (
                              <BookAuthorsForm
                                 mode="create"
                                 bookID={selectedBook.bookID}
                                 onSave={handleBookAuthorSave}
                              />
                           )}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* Edit/View View */}
            {(currentView === "edit" || currentView === "view") &&
               selectedBookAuthor && (
                  <div className="space-y-6">
                     <div className="mb-4">
                        <Button variant="outline" onClick={handleBack}>
                           ← Back to Book Authors
                        </Button>
                     </div>
                     <BookAuthorsForm
                        mode={currentView}
                        bookID={selectedBookAuthor.bookID}
                        initialData={selectedBookAuthor}
                        onSave={handleBookAuthorSave}
                        onDelete={
                           currentView === "edit"
                              ? () => handleBookAuthorDelete(selectedBookAuthor)
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
                        <Users className="h-5 w-5" />
                        Book Authors
                     </CardTitle>
                     <CardDescription>
                        All book-author relationships in the system
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-semibold">
                              All Book Authors
                           </h3>
                           <Button onClick={handleAddBookAuthor}>
                              <Users className="h-4 w-4 mr-2" />
                              Add Book Author
                           </Button>
                        </div>
                        <BookAuthorsList
                           bookID={0} // 0 means show all
                           onDelete={handleBookAuthorDelete}
                           onAdd={handleAddBookAuthor}
                           onEdit={handleEditBookAuthor}
                           onView={handleViewBookAuthor}
                           onCreateAuthor={handleCreateAuthor}
                        />
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}
