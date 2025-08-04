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
import { BookOpen, Users, Tags, MapPin /*Link*/ } from "lucide-react";
import { type Book } from "@/services/BooksService";

export function BooksPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBook, setSelectedBook] = useState<Book | null>(null);
   const [activeTab, setActiveTab] = useState("details");

   // View labels mapping
   const viewLabels = {
      list: "List Books",
      create: "Create Book",
      edit: "Edit Book",
      view: "View Book",
   };

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

   const handleCreate = () => {
      setCurrentView("create");
   };
   const handleEdit = (book: Book) => {
      setSelectedBook(book);
      setCurrentView("edit");
      setActiveTab("details");
   };
   const handleView = (book: Book) => {
      setSelectedBook(book);
      setCurrentView("view");
      setActiveTab("details");
   };
   const handleDelete = (book: Book) => {
      console.log("Delete book:", book);
      setCurrentView("list");
   };
   const handleSave = (data: any) => {
      console.log("Save book:", data);
      setCurrentView("list");
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
         if (selectedBook) {
            setCurrentView(viewKey);
         }
      } else {
         setCurrentView(viewKey);
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
                                 (label === "Edit Book" ||
                                    label === "View Book") &&
                                 !selectedBook
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
                        <TabsList className="grid w-full grid-cols-3">
                           <TabsTrigger
                              value="details"
                              className="flex items-center gap-2"
                           >
                              <BookOpen className="h-4 w-4" />
                              Book Details
                           </TabsTrigger>
                           {/* <TabsTrigger
                              value="relationships"
                              className="flex items-center gap-2"
                           >
                              <Link className="h-4 w-4" />
                              Relationships
                           </TabsTrigger> */}
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
                                    onEdit={() => setCurrentView("edit")}
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

                        {/* <TabsContent
                           value="relationships"
                           className="space-y-6"
                        >
                           <Card>
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                                    <Link className="h-5 w-5" />
                                    Book Relationships
                                 </CardTitle>
                                 <CardDescription>
                                    Manage authors and genres for this book
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">
                                       Use the multi-select interface to manage
                                       book relationships
                                    </p>
                                    <Button
                                       onClick={() =>
                                          (window.location.href = `/books/${selectedBook.bookID}/relationships`)
                                       }
                                       className="flex items-center gap-2"
                                    >
                                       <Link className="h-4 w-4" />
                                       Manage Relationships
                                    </Button>
                                 </div>
                              </CardContent>
                           </Card>
                        </TabsContent> */}

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
