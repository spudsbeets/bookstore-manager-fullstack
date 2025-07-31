"use client";

import { useState, useEffect } from "react";
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
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2, MapPin } from "lucide-react";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface BookLocation {
   bookLocationID: number;
   bookID: number;
   slocID: number;
   quantity: number;
   locationName?: string; // For display purposes
   bookTitle?: string; // For display purposes
}

interface BookLocationsListProps {
   bookID: number;
   onView?: (bookLocation: BookLocation) => void;
   onEdit?: (bookLocation: BookLocation) => void;
   onDelete?: (bookLocation: BookLocation) => void;
   onAdd?: () => void;
}

export function BookLocationsList({
   bookID,
   onView,
   onEdit,
   onDelete,
   onAdd,
}: BookLocationsListProps) {
   const [bookLocations, setBookLocations] = useState<BookLocation[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [bookLocationToDelete, setBookLocationToDelete] =
      useState<BookLocation | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   // Sample data for book locations
   const sampleBookLocations: BookLocation[] = [
      {
         bookLocationID: 1,
         bookID: bookID,
         slocID: 1,
         quantity: 8,
         locationName: "Orchard",
         bookTitle: "Beloved",
      },
      {
         bookLocationID: 2,
         bookID: bookID,
         slocID: 2,
         quantity: 12,
         locationName: "Sunwillow",
         bookTitle: "Inherent Vice",
      },
   ];

   useEffect(() => {
      const fetchBookLocations = async () => {
         setIsLoading(true);
         try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setBookLocations(sampleBookLocations);
         } catch (error) {
            console.error("Error fetching book locations:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookLocations();
   }, [bookID]);

   const filteredBookLocations = bookLocations.filter(
      (bookLocation) =>
         bookLocation.locationName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         bookLocation.bookLocationID.toString().includes(searchTerm)
   );

   const handleDelete = async (bookLocation: BookLocation) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setBookLocations(
            bookLocations.filter(
               (bl) => bl.bookLocationID !== bookLocation.bookLocationID
            )
         );
         if (onDelete) {
            onDelete(bookLocation);
         }
      } catch (error) {
         console.error("Error deleting book location:", error);
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
               <div className="text-center py-8 text-muted-foreground">
                  Loading book locations...
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
                        Storage locations for this book ({bookLocations.length}{" "}
                        total)
                     </CardDescription>
                  </div>
                  {onAdd && (
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              onClick={onAdd}
                              className="flex items-center gap-2"
                           >
                              <Plus className="h-4 w-4" />
                              Add Location
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Add a new storage location for this book</p>
                        </TooltipContent>
                     </Tooltip>
                  )}
               </div>
            </CardHeader>
            <CardContent>
               {/* Search Bar */}
               <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Search locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                     />
                  </div>
               </div>

               {/* Book Locations Table */}
               <div className="rounded-md border">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>ID</TableHead>
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
                                 colSpan={5}
                                 className="text-center py-8"
                              >
                                 <div className="text-muted-foreground">
                                    No storage locations found for this book.
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredBookLocations.map((bookLocation) => (
                              <TableRow key={bookLocation.bookLocationID}>
                                 <TableCell>
                                    <Badge variant="secondary">
                                       #{bookLocation.bookLocationID}
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="font-medium">
                                    <HoverCard>
                                       <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer">
                                             <MapPin className="h-4 w-4 text-muted-foreground" />
                                             {bookLocation.locationName}
                                          </div>
                                       </HoverCardTrigger>
                                       <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                             <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                   {bookLocation.locationName}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                   Location ID:{" "}
                                                   {bookLocation.slocID}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                   Book Location ID:{" "}
                                                   {bookLocation.bookLocationID}
                                                </p>
                                             </div>
                                          </div>
                                       </HoverCardContent>
                                    </HoverCard>
                                 </TableCell>
                                 <TableCell>{bookLocation.bookTitle}</TableCell>
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
               itemName={bookLocationToDelete?.locationName || ""}
               itemType="book location"
            />
         </Card>
      </TooltipProvider>
   );
}
