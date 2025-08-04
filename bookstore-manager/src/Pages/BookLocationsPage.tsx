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
import { BookLocationsForm } from "@/components/forms/BookLocationsForm";
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
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookLocationsPage() {
   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedBookLocation, setSelectedBookLocation] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState(
      "List Book Locations"
   );

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
                        <BookLocationsForm
                           mode="create"
                           bookID={0} // 0 means no specific book selected, form will handle book selection
                           onSave={handleBookLocationSave}
                        />
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
