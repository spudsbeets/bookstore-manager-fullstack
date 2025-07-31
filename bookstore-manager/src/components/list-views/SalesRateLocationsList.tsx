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
import {
   Plus,
   Search,
   Edit,
   Eye,
   Trash2,
   MapPin,
   MoreHorizontal,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface SalesRateLocation {
   salesRateID: number;
   county: string;
   state: string;
   taxRate: number;
}

// Sample data - replace with actual API calls
const sampleSalesRateLocations: SalesRateLocation[] = [
   { salesRateID: 1, county: "Polk", state: "Iowa", taxRate: 4.2 },
   { salesRateID: 2, county: "Jerome", state: "Idaho", taxRate: 5.1 },
   {
      salesRateID: 3,
      county: "San Francisco",
      state: "California",
      taxRate: 8.625,
   },
];

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
      // Simulate API call
      const fetchSalesRateLocations = async () => {
         setIsLoading(true);
         try {
            // Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSalesRateLocations(sampleSalesRateLocations);
         } catch (error) {
            console.error("Error fetching sales rate locations:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchSalesRateLocations();
   }, []);

   const filteredSalesRateLocations = salesRateLocations.filter(
      (salesRateLocation) =>
         salesRateLocation.county
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         salesRateLocation.state
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         salesRateLocation.taxRate.toString().includes(searchTerm)
   );

   const handleDelete = async (salesRateLocation: SalesRateLocation) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
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
                        <TableHead>County</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Tax Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredSalesRateLocations.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={5} className="text-center py-8">
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
                                    {salesRateLocation.county}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline">
                                    {salesRateLocation.state}
                                 </Badge>
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {salesRateLocation.taxRate}%
                                 </div>
                              </TableCell>
                              <TableCell className="text-right">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                       {onView && (
                                          <DropdownMenuItem
                                             onClick={() =>
                                                onView(salesRateLocation)
                                             }
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() =>
                                                onEdit(salesRateLocation)
                                             }
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() =>
                                             setSalesRateLocationToDelete(
                                                salesRateLocation
                                             )
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
            isOpen={!!salesRateLocationToDelete}
            onOpenChange={() => setSalesRateLocationToDelete(null)}
            onConfirm={() =>
               salesRateLocationToDelete &&
               handleDelete(salesRateLocationToDelete)
            }
            isDeleting={isDeleting}
            itemName={
               `${salesRateLocationToDelete?.county}, ${salesRateLocationToDelete?.state}` ||
               ""
            }
            itemType="sales rate location"
         />
      </Card>
   );
}
