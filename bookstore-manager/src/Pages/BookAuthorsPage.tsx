import { useState } from "react";
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

// Sample data for demonstration
const sampleBooks = [
   {
      bookID: 1,
      title: "Beloved",
      "isbn-10": "1400033416",
      publicationDate: "1987-09-01",
      price: 17.99,
      publisherID: 1,
   },
   {
      bookID: 2,
      title: "Inherent Vice",
      "isbn-10": "0143126850",
      publicationDate: "2009-08-04",
      price: 15.99,
      publisherID: 2,
   },
   {
      bookID: 3,
      title: "The Talisman",
      "isbn-10": "0670691992",
      publicationDate: "1984-11-08",
      price: 18.99,
      publisherID: 3,
   },
   {
      bookID: 4,
      title: "Good Omens",
      "isbn-10": "0060853980",
      publicationDate: "2006-11-28",
      price: 16.99,
      publisherID: 4,
   },
];

// @ts-ignore - Demo data for UI
const sampleBookAuthors = [
   {
      bookAuthorID: 1,
      bookID: 1,
      authorID: 1,
      bookTitle: "Beloved",
      authorName: "Toni Morrison",
   },
   {
      bookAuthorID: 2,
      bookID: 2,
      authorID: 2,
      bookTitle: "Inherent Vice",
      authorName: "Thomas Pynchon",
   },
];

export function BookAuthorsPage() {
   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookAuthor, setSelectedBookAuthor] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] =
      useState("List Book Authors");
   const [selectedBook, setSelectedBook] = useState<any>(null);

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
                                    const book = sampleBooks.find(
                                       (b) => b.bookID === Number(value)
                                    );
                                    setSelectedBook(book);
                                 }}
                              >
                                 <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Choose a book..." />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {sampleBooks.map((book) => (
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
