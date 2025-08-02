"use client";

import { useState, useEffect } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MapPin, Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Services
import BookLocationsService from "@/services/BookLocationsService";

interface BookLocation {
   bookLocationID: number;
   slocName: string;
   title: string;
   quantity: number;
}

interface BookLocationsListProps {
   bookID: number;
   onView?: (bookLocation: BookLocation) => void;
   onEdit?: (bookLocation: BookLocation) => void;
   onDelete?: (bookLocation: BookLocation) => void;
   onAdd?: () => void;
   onCreateLocation?: () => void; // New prop for creating locations
}

export function BookLocationsList({
   bookID,
   onView,
   onEdit,
   onDelete,
   onAdd,
   onCreateLocation,
}: BookLocationsListProps) {
   const [bookLocations, setBookLocations] = useState<BookLocation[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [bookLocationToDelete, setBookLocationToDelete] =
      useState<BookLocation | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchBookLocations = async () => {
         setIsLoading(true);
         try {
            const response = await BookLocationsService.getAll();
            setBookLocations(response.data);
         } catch (error) {
            console.error("Error fetching book locations:", error);
            toast.error("Failed to load book locations", {
               description:
                  "There was an error loading the book locations. Please try again.",
               duration: Infinity,
            });
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookLocations();
   }, [bookID]);

   const filteredBookLocations = bookLocations.filter(
      (bookLocation) =>
         bookLocation.slocName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         bookLocation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         bookLocation.bookLocationID.toString().includes(searchTerm)
   );

   const handleDelete = async (bookLocation: BookLocation) => {
      setIsDeleting(true);
      try {
         await BookLocationsService.remove(bookLocation.bookLocationID);
         setBookLocations(
            bookLocations.filter(
               (bl) => bl.bookLocationID !== bookLocation.bookLocationID
            )
         );
         toast.success("Book location relationship deleted successfully!", {
            description: `${bookLocation.slocName} has been removed from ${bookLocation.title}.`,
         });
         if (onDelete) {
            onDelete(bookLocation);
         }
      } catch (error) {
         console.error("Error deleting book location:", error);
         toast.error("Failed to delete book location relationship", {
            description:
               "There was an error deleting the relationship. Please try again.",
            duration: Infinity,
         });
      } finally {
         setIsDeleting(false);
         setBookLocationToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Book Locations</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <TooltipProvider>
         <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Book Locations</CardTitle>
                     <CardDescription>
                        Storage locations for books ({bookLocations.length}{" "}
                        total)
                     </CardDescription>
                  </div>
                  <div className="flex gap-2">
                     {onAdd && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button
                                 onClick={onAdd}
                                 className="flex items-center gap-2"
                              >
                                 <Plus className="h-4 w-4" />
                                 Add Location to Book
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Add a new location to a book</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                     {onCreateLocation && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button
                                 onClick={onCreateLocation}
                                 variant="outline"
                                 className="flex items-center gap-2"
                              >
                                 <MapPin className="h-4 w-4" />
                                 Add Location
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Create a new location</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                     <Input
                        placeholder="Search book locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                     />
                  </div>

                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Location</TableHead>
                           <TableHead>Book</TableHead>
                           <TableHead>Quantity</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredBookLocations.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={4}
                                 className="text-center py-8"
                              >
                                 <div className="text-muted-foreground">
                                    {searchTerm
                                       ? "No book locations found matching your search."
                                       : "No book locations found."}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredBookLocations.map((bookLocation) => (
                              <TableRow key={bookLocation.bookLocationID}>
                                 <TableCell>
                                    <div className="flex items-center gap-2">
                                       <MapPin className="h-4 w-4 text-muted-foreground" />
                                       {bookLocation.slocName}
                                    </div>
                                 </TableCell>
                                 <TableCell>{bookLocation.title}</TableCell>
                                 <TableCell>{bookLocation.quantity}</TableCell>
                                 <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       {onView && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() =>
                                                      onView(bookLocation)
                                                   }
                                                >
                                                   <Eye className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>View location details</p>
                                             </TooltipContent>
                                          </Tooltip>
                                       )}
                                       {onEdit && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() =>
                                                      onEdit(bookLocation)
                                                   }
                                                >
                                                   <Edit className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>Edit location</p>
                                             </TooltipContent>
                                          </Tooltip>
                                       )}
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                   setBookLocationToDelete(
                                                      bookLocation
                                                   )
                                                }
                                                className="text-destructive hover:text-destructive"
                                             >
                                                <Trash2 className="h-4 w-4" />
                                             </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             <p>Delete location</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </div>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </div>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
               isOpen={!!bookLocationToDelete}
               onOpenChange={() => setBookLocationToDelete(null)}
               onConfirm={() =>
                  bookLocationToDelete && handleDelete(bookLocationToDelete)
               }
               isDeleting={isDeleting}
               itemName={bookLocationToDelete?.slocName || ""}
               itemType="book location"
            />
         </Card>
      </TooltipProvider>
   );
}
