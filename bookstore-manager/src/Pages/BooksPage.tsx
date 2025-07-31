import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BooksForm } from "@/components/forms/BooksForm";
import { BookLocationsForm } from "@/components/forms/BookLocationsForm";
import { BookAuthorsForm } from "@/components/forms/BookAuthorsForm";
import { BookGenresForm } from "@/components/forms/BookGenresForm";
import { BooksList } from "@/components/list-views/BooksList";
import { BookAuthorsList } from "@/components/list-views/BookAuthorsList";
import { BookGenresList } from "@/components/list-views/BookGenresList";
import { BookLocationsList } from "@/components/list-views/BookLocationsList";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Tags, MapPin } from "lucide-react";

export function BooksPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBook, setSelectedBook] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Books");
   const [activeTab, setActiveTab] = useState("details");

   // State for intersection table editing
   const [bookAuthorView, setBookAuthorView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookAuthor, setSelectedBookAuthor] = useState<any>(null);
   const [bookGenreView, setBookGenreView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookGenre, setSelectedBookGenre] = useState<any>(null);
   const [bookLocationView, setBookLocationView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookLocation, setSelectedBookLocation] = useState<any>(null);

   const viewArray = ["List Books", "Create Book", "Edit Book", "View Book"];

   const handleCreate = () => {
      setCurrentView("create");
      setSelectViewOption("Create Book");
   };
   const handleEdit = (book: any) => {
      setSelectedBook(book);
      setCurrentView("edit");
      setSelectViewOption("Edit Book");
      setActiveTab("details");
   };
   const handleView = (book: any) => {
      setSelectedBook(book);
      setCurrentView("view");
      setSelectViewOption("View Book");
      setActiveTab("details");
   };
   const handleDelete = () => {
      console.log("Delete book:", selectedBook);
      setCurrentView("list");
      setSelectViewOption("List Books");
   };
   const handleSave = (data: any) => {
      console.log("Save book:", data);
      setCurrentView("list");
      setSelectViewOption("List Books");
   };
   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Books");
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Books":
            setCurrentView("list");
            break;
         case "Create Book":
            setCurrentView("create");
            break;
         case "Edit Book":
            if (selectedBook) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Books");
            }
            break;
         case "View Book":
            if (selectedBook) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Books");
            }
            break;
         default:
            setCurrentView("list");
      }
   };

   // Book Author handlers
   const handleBookAuthorDelete = (bookAuthor: any) => {
      console.log("Delete book author:", bookAuthor);
   };

   const handleAddBookAuthor = () => {
      setBookAuthorView("create");
      setSelectedBookAuthor(null);
   };

   const handleEditBookAuthor = (bookAuthor: any) => {
      setSelectedBookAuthor(bookAuthor);
      setBookAuthorView("edit");
   };

   const handleViewBookAuthor = (bookAuthor: any) => {
      setSelectedBookAuthor(bookAuthor);
      setBookAuthorView("view");
   };

   const handleBookAuthorSave = (data: any) => {
      console.log("Save book author:", data);
      setBookAuthorView("list");
      setSelectedBookAuthor(null);
   };

   const handleBookAuthorBack = () => {
      setBookAuthorView("list");
      setSelectedBookAuthor(null);
   };

   // Book Genre handlers
   const handleBookGenreDelete = (bookGenre: any) => {
      console.log("Delete book genre:", bookGenre);
   };

   const handleAddBookGenre = () => {
      setBookGenreView("create");
      setSelectedBookGenre(null);
   };

   const handleEditBookGenre = (bookGenre: any) => {
      setSelectedBookGenre(bookGenre);
      setBookGenreView("edit");
   };

   const handleViewBookGenre = (bookGenre: any) => {
      setSelectedBookGenre(bookGenre);
      setBookGenreView("view");
   };

   const handleBookGenreSave = (data: any) => {
      console.log("Save book genre:", data);
      setBookGenreView("list");
      setSelectedBookGenre(null);
   };

   const handleBookGenreBack = () => {
      setBookGenreView("list");
      setSelectedBookGenre(null);
   };

   // Book Location handlers
   const handleBookLocationDelete = (bookLocation: any) => {
      console.log("Delete book location:", bookLocation);
   };

   const handleAddBookLocation = () => {
      setBookLocationView("create");
      setSelectedBookLocation(null);
   };

   const handleEditBookLocation = (bookLocation: any) => {
      setSelectedBookLocation(bookLocation);
      setBookLocationView("edit");
   };

   const handleViewBookLocation = (bookLocation: any) => {
      setSelectedBookLocation(bookLocation);
      setBookLocationView("view");
   };

   const handleBookLocationSave = (data: any) => {
      console.log("Save book location:", data);
      setBookLocationView("list");
      setSelectedBookLocation(null);
   };

   const handleBookLocationBack = () => {
      setBookLocationView("list");
      setSelectedBookLocation(null);
   };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-2xl font-bold mb-4">Books Management</h1>
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
                        ← Back to Books
                     </Button>
                  </div>
                  <BooksForm mode="create" onSave={handleSave} />
               </div>
            )}

            {(currentView === "edit" || currentView === "view") &&
               selectedBook && (
                  <div className="space-y-6">
                     <div className="mb-4">
                        <Button variant="outline" onClick={handleBack}>
                           ← Back to Books
                        </Button>
                     </div>

                     <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                     >
                        <TabsList className="grid w-full grid-cols-2">
                           <TabsTrigger
                              value="details"
                              className="flex items-center gap-2"
                           >
                              <BookOpen className="h-4 w-4" />
                              Book Details
                           </TabsTrigger>
                           <TabsTrigger
                              value="locations"
                              className="flex items-center gap-2"
                           >
                              <MapPin className="h-4 w-4" />
                              Storage Locations
                           </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                           {/* Book Details Section */}
                           <Card>
                              <CardHeader>
                                 <CardTitle>Book Details</CardTitle>
                                 <CardDescription>
                                    {currentView === "edit"
                                       ? "Edit book information"
                                       : "View book details"}
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 <BooksForm
                                    mode={currentView}
                                    initialData={selectedBook}
                                    onSave={handleSave}
                                    onDelete={
                                       currentView === "edit"
                                          ? handleDelete
                                          : undefined
                                    }
                                 />
                              </CardContent>
                           </Card>

                           {/* Book Authors Section */}
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Book Authors
                                 </CardTitle>
                                 <CardDescription>
                                    Authors associated with this book
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 {bookAuthorView === "list" && (
                                    <BookAuthorsList
                                       bookID={selectedBook.bookID}
                                       onDelete={handleBookAuthorDelete}
                                       onAdd={handleAddBookAuthor}
                                       onEdit={handleEditBookAuthor}
                                       onView={handleViewBookAuthor}
                                    />
                                 )}

                                 {(bookAuthorView === "create" ||
                                    bookAuthorView === "edit" ||
                                    bookAuthorView === "view") && (
                                    <div className="max-w-2xl mx-auto">
                                       <div className="mb-4">
                                          <Button
                                             variant="outline"
                                             onClick={handleBookAuthorBack}
                                          >
                                             ← Back to Book Authors
                                          </Button>
                                       </div>
                                       <BookAuthorsForm
                                          mode={bookAuthorView}
                                          bookID={selectedBook.bookID}
                                          initialData={selectedBookAuthor}
                                          onSave={handleBookAuthorSave}
                                          onDelete={
                                             bookAuthorView === "edit"
                                                ? () =>
                                                     handleBookAuthorDelete(
                                                        selectedBookAuthor
                                                     )
                                                : undefined
                                          }
                                       />
                                    </div>
                                 )}
                              </CardContent>
                           </Card>

                           {/* Book Genres Section */}
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Tags className="h-5 w-5" />
                                    Book Genres
                                 </CardTitle>
                                 <CardDescription>
                                    Genres associated with this book
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 {bookGenreView === "list" && (
                                    <BookGenresList
                                       bookID={selectedBook.bookID}
                                       onDelete={handleBookGenreDelete}
                                       onAdd={handleAddBookGenre}
                                       onEdit={handleEditBookGenre}
                                       onView={handleViewBookGenre}
                                    />
                                 )}

                                 {(bookGenreView === "create" ||
                                    bookGenreView === "edit" ||
                                    bookGenreView === "view") && (
                                    <div className="max-w-2xl mx-auto">
                                       <div className="mb-4">
                                          <Button
                                             variant="outline"
                                             onClick={handleBookGenreBack}
                                          >
                                             ← Back to Book Genres
                                          </Button>
                                       </div>
                                       <BookGenresForm
                                          mode={bookGenreView}
                                          bookID={selectedBook.bookID}
                                          initialData={selectedBookGenre}
                                          onSave={handleBookGenreSave}
                                          onDelete={
                                             bookGenreView === "edit"
                                                ? () =>
                                                     handleBookGenreDelete(
                                                        selectedBookGenre
                                                     )
                                                : undefined
                                          }
                                       />
                                    </div>
                                 )}
                              </CardContent>
                           </Card>
                        </TabsContent>

                        <TabsContent value="locations" className="space-y-4">
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Storage Locations
                                 </CardTitle>
                                 <CardDescription>
                                    Storage locations for this book
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 {bookLocationView === "list" && (
                                    <BookLocationsList
                                       bookID={selectedBook.bookID}
                                       onDelete={handleBookLocationDelete}
                                       onAdd={handleAddBookLocation}
                                       onEdit={handleEditBookLocation}
                                       onView={handleViewBookLocation}
                                    />
                                 )}

                                 {(bookLocationView === "create" ||
                                    bookLocationView === "edit" ||
                                    bookLocationView === "view") && (
                                    <div className="max-w-2xl mx-auto">
                                       <div className="mb-4">
                                          <Button
                                             variant="outline"
                                             onClick={handleBookLocationBack}
                                          >
                                             ← Back to Book Locations
                                          </Button>
                                       </div>
                                       <BookLocationsForm
                                          mode={bookLocationView}
                                          bookID={selectedBook.bookID}
                                          initialData={selectedBookLocation}
                                          onSave={handleBookLocationSave}
                                          onDelete={
                                             bookLocationView === "edit"
                                                ? () =>
                                                     handleBookLocationDelete(
                                                        selectedBookLocation
                                                     )
                                                : undefined
                                          }
                                       />
                                    </div>
                                 )}
                              </CardContent>
                           </Card>
                        </TabsContent>
                     </Tabs>
                  </div>
               )}

            {currentView === "list" && (
               <BooksList
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
