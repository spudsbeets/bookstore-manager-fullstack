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
import { Plus, Search, Edit, Eye, Trash2, MapPin } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import SalesRateLocationsService from "@/services/SalesRateLocationsService";

interface SalesRateLocation {
   salesRateID: number;
   location: string;
   taxRate: string;
}

interface SalesRateLocationsListProps {
   onView?: (salesRateLocation: SalesRateLocation) => void;
   onEdit?: (salesRateLocation: SalesRateLocation) => void;
   onDelete?: (salesRateLocation: SalesRateLocation) => void;
   onCreate?: () => void;
}

export function SalesRateLocationsList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: SalesRateLocationsListProps) {
   const [salesRateLocations, setSalesRateLocations] = useState<
      SalesRateLocation[]
   >([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [salesRateLocationToDelete, setSalesRateLocationToDelete] =
      useState<SalesRateLocation | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchSalesRateLocations = async () => {
         setIsLoading(true);
         try {
            const response = await SalesRateLocationsService.getAll();
            setSalesRateLocations(response.data);
         } catch (error) {
            console.error("Error fetching sales rate locations:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchSalesRateLocations();
   }, []); // This will re-run when the component is re-mounted due to key change

   const filteredSalesRateLocations = salesRateLocations.filter(
      (salesRateLocation) =>
         salesRateLocation.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         salesRateLocation.taxRate.includes(searchTerm)
   );

   const handleDelete = async (salesRateLocation: SalesRateLocation) => {
      setIsDeleting(true);
      try {
         await SalesRateLocationsService.remove(salesRateLocation.salesRateID);
         setSalesRateLocations(
            salesRateLocations.filter(
               (s) => s.salesRateID !== salesRateLocation.salesRateID
            )
         );
         if (onDelete) {
            onDelete(salesRateLocation);
         }
      } catch (error) {
         console.error("Error deleting sales rate location:", error);
      } finally {
         setIsDeleting(false);
         setSalesRateLocationToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Sales Rate Locations</CardTitle>
               <CardDescription>
                  Loading sales rate locations...
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                  <CardTitle className="flex items-center gap-2">
                     <MapPin className="h-5 w-5" />
                     Sales Rate Locations
                  </CardTitle>
                  <CardDescription>
                     Manage your bookstore's sales tax rates by location (
                     {salesRateLocations.length} total)
                  </CardDescription>
               </div>
               <Button onClick={onCreate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Sales Rate Location
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            {/* Search Bar */}
            <div className="flex items-center space-x-2 mb-4">
               <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search by county, state, or tax rate..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
            </div>

            {/* Sales Rate Locations Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Tax Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredSalesRateLocations.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={4} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No sales rate locations found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredSalesRateLocations.map((salesRateLocation) => (
                           <TableRow key={salesRateLocation.salesRateID}>
                              <TableCell className="font-medium">
                                 {salesRateLocation.salesRateID}
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {salesRateLocation.location}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {salesRateLocation.taxRate}%
                                 </div>
                              </TableCell>
                              <TableCell className="text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    {onView && (
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                             onView(salesRateLocation)
                                          }
                                          className="h-8 w-8 p-0"
                                       >
                                          <Eye className="h-4 w-4" />
                                       </Button>
                                    )}
                                    {onEdit && (
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                             onEdit(salesRateLocation)
                                          }
                                          className="h-8 w-8 p-0"
                                       >
                                          <Edit className="h-4 w-4" />
                                       </Button>
                                    )}
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() =>
                                          setSalesRateLocationToDelete(
                                             salesRateLocation
                                          )
                                       }
                                       className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
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
            isOpen={!!salesRateLocationToDelete}
            onOpenChange={() => setSalesRateLocationToDelete(null)}
            onConfirm={() =>
               salesRateLocationToDelete &&
               handleDelete(salesRateLocationToDelete)
            }
            isDeleting={isDeleting}
            itemName={salesRateLocationToDelete?.location || ""}
            itemType="sales rate location"
         />
      </Card>
   );
}
