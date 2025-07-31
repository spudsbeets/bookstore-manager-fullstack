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
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Location {
   slocID: number;
   slocName: string;
}

const sampleLocations: Location[] = [
   { slocID: 1, slocName: "Orchard" },
   { slocID: 2, slocName: "Sunwillow" },
];

interface LocationsListProps {
   onView?: (location: Location) => void;
   onEdit?: (location: Location) => void;
   onDelete?: (location: Location) => void;
   onAdd?: () => void;
}

export function LocationsList({
   onView,
   onEdit,
   onDelete,
   onAdd,
}: LocationsListProps) {
   const [locations, setLocations] = useState<Location[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [locationToDelete, setLocationToDelete] = useState<Location | null>(
      null
   );
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchLocations = async () => {
         setIsLoading(true);
         try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setLocations(sampleLocations);
         } catch (error) {
            console.error("Error fetching locations:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchLocations();
   }, []);

   const filteredLocations = locations.filter(
      (location) =>
         location.slocName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         location.slocID.toString().includes(searchTerm)
   );

   const handleDelete = async (location: Location) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setLocations(locations.filter((l) => l.slocID !== location.slocID));
         if (onDelete) {
            onDelete(location);
         }
      } catch (error) {
         console.error("Error deleting location:", error);
      } finally {
         setIsDeleting(false);
         setLocationToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Storage Locations</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8 text-muted-foreground">
                  Loading storage locations...
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle>Storage Locations</CardTitle>
                  <CardDescription>
                     Manage your bookstore's storage locations (
                     {locations.length} total)
                  </CardDescription>
               </div>
               {onAdd && (
                  <Button onClick={onAdd} className="flex items-center gap-2">
                     <Plus className="h-4 w-4" />
                     Add Location
                  </Button>
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

            {/* Locations Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Location Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredLocations.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={3} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No storage locations found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredLocations.map((location) => (
                           <TableRow key={location.slocID}>
                              <TableCell>
                                 <Badge variant="secondary">
                                    #{location.slocID}
                                 </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                 {location.slocName}
                              </TableCell>
                              <TableCell className="text-right">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                       >
                                          <span className="sr-only">
                                             Open menu
                                          </span>
                                          <Edit className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                       {onView && (
                                          <DropdownMenuItem
                                             onClick={() => onView(location)}
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() => onEdit(location)}
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() =>
                                             setLocationToDelete(location)
                                          }
                                          className="text-destructive"
                                       >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
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
            isOpen={!!locationToDelete}
            onOpenChange={() => setLocationToDelete(null)}
            onConfirm={() => locationToDelete && handleDelete(locationToDelete)}
            isDeleting={isDeleting}
            itemName={locationToDelete?.slocName || ""}
            itemType="storage location"
         />
      </Card>
   );
}
