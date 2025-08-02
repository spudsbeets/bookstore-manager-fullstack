import { useState, useEffect } from "react";
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

// Import services for real data
import BooksService from "@/services/BooksService";

export function BookGenresPage() {
   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookGenre, setSelectedBookGenre] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Book Genres");
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
                              <BookGenresForm
                                 mode="create"
                                 bookID={selectedBook.bookID}
                                 onSave={handleBookGenreSave}
                              />
                           )}
                        </div>
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
