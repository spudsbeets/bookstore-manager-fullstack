import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookLocationsForm } from "@/components/forms/BookLocationsForm";
import { BookLocationsList } from "@/components/list-views/BookLocationsList";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import services for real data
import BooksService from "@/services/BooksService";

export function BookLocationsPage() {
   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookLocation, setSelectedBookLocation] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState(
      "List Book Locations"
   );
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
   //    setSelectViewOption("Create Book Location");
   //    setSelectedBookLocation(null);
   // };

   // const handleEdit = (bookLocation: any) => {
   //    setSelectedBookLocation(bookLocation);
   //    setCurrentView("edit");
   //    setSelectViewOption("Edit Book Location");
   // };

   // const handleView = (bookLocation: any) => {
   //    setSelectedBookLocation(bookLocation);
   //    setCurrentView("view");
   //    setSelectViewOption("View Book Location");
   // };

   // const handleDelete = () => {
   //    console.log("Delete operation");
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Locations");
   // };

   // const handleSave = (data: any) => {
   //    console.log("Save operation:", data);
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Locations");
   // };

   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Book Locations");
      setSelectedBookLocation(null);
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Book Locations":
            setCurrentView("list");
            break;
         case "Create Book Location":
            setCurrentView("create");
            setSelectedBookLocation(null);
            break;
         case "Edit Book Location":
            if (selectedBookLocation) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Book Locations");
            }
            break;
         case "View Book Location":
            if (selectedBookLocation) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Book Locations");
            }
            break;
      }
   };

   const handleBookLocationDelete = (bookLocation: any) => {
      console.log("Delete book location:", bookLocation);
      // In a real app, this would call an API
   };

   const handleAddBookLocation = () => {
      setCurrentView("create");
      setSelectViewOption("Create Book Location");
   };

   const handleCreateLocation = () => {
      // Navigate to Locations page to create a new location
      navigate("/locations");
   };

   const handleEditBookLocation = (bookLocation: any) => {
      setSelectedBookLocation(bookLocation);
      setCurrentView("edit");
      setSelectViewOption("Edit Book Location");
   };

   const handleViewBookLocation = (bookLocation: any) => {
      setSelectedBookLocation(bookLocation);
      setCurrentView("view");
      setSelectViewOption("View Book Location");
   };

   const handleBookLocationSave = (data: any) => {
      console.log("Save book location:", data);
      setCurrentView("list");
      setSelectViewOption("List Book Locations");
      setSelectedBookLocation(null);
   };

   // const handleBookLocationBack = () => {
   //    setCurrentView("list");
   //    setSelectViewOption("List Book Locations");
   //    setSelectedBookLocation(null);
   // };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-3xl font-bold mb-2">
                  Book Locations Management
               </h1>
               <p className="text-muted-foreground">
                  Manage the storage locations and quantities for books
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
                        <SelectItem value="List Book Locations">
                           List Book Locations
                        </SelectItem>
                        <SelectItem value="Create Book Location">
                           Create Book Location
                        </SelectItem>
                        <SelectItem value="Edit Book Location">
                           Edit Book Location
                        </SelectItem>
                        <SelectItem value="View Book Location">
                           View Book Location
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
                        ← Back to Book Locations
                     </Button>
                  </div>
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <MapPin className="h-5 w-5" />
                           Create Book Location
                        </CardTitle>
                        <CardDescription>
                           Add a new storage location for a book
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div>
                              <Label>Select Book</Label>
                              <SearchableSelect
                                 options={books.map((book) => ({
                                    value: book.bookID.toString(),
                                    label: book.title,
                                 }))}
                                 value={selectedBook?.bookID?.toString()}
                                 onValueChange={(value) => {
                                    const book = books.find(
                                       (b) => b.bookID === Number(value)
                                    );
                                    setSelectedBook(book);
                                 }}
                                 placeholder="Choose a book..."
                                 searchPlaceholder="Search books..."
                                 emptyMessage="No books found."
                              />
                           </div>
                           {selectedBook && (
                              <BookLocationsForm
                                 mode="create"
                                 bookID={selectedBook.bookID}
                                 onSave={handleBookLocationSave}
                              />
                           )}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* Edit/View View */}
            {(currentView === "edit" || currentView === "view") &&
               selectedBookLocation && (
                  <div className="space-y-6">
                     <div className="mb-4">
                        <Button variant="outline" onClick={handleBack}>
                           ← Back to Book Locations
                        </Button>
                     </div>
                     <BookLocationsForm
                        mode={currentView}
                        bookID={selectedBookLocation.bookID}
                        initialData={selectedBookLocation}
                        onSave={handleBookLocationSave}
                        onDelete={
                           currentView === "edit"
                              ? () =>
                                   handleBookLocationDelete(
                                      selectedBookLocation
                                   )
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
                        <MapPin className="h-5 w-5" />
                        Book Locations
                     </CardTitle>
                     <CardDescription>
                        All book storage locations and quantities
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-semibold">
                              All Book Locations
                           </h3>
                           <Button onClick={handleAddBookLocation}>
                              <MapPin className="h-4 w-4 mr-2" />
                              Add Book Location
                           </Button>
                        </div>
                        <BookLocationsList
                           bookID={0} // 0 means show all
                           onDelete={handleBookLocationDelete}
                           onAdd={handleAddBookLocation}
                           onEdit={handleEditBookLocation}
                           onView={handleViewBookLocation}
                           onCreateLocation={handleCreateLocation}
                        />
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}
