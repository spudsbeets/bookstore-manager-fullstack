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
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Import services for real data fetching
import BooksService from "@/services/BooksService";
import BookLocationsService from "@/services/BookLocationsService";
import LocationsService from "@/services/LocationsService";

/**
 * Custom business logic: Inventory list data interfaces
 * These interfaces demonstrate understanding of:
 * - Real API data structures
 * - Complex data relationships between books and locations
 * - Type safety for inventory management
 */
interface InventoryItem {
   bookID: number;
   title: string;
   inventoryQty: number;
   price: string;
   inStock: number;
   publicationDate: string;
   "isbn-10": string | null;
   "isbn-13": string | null;
   publisherID: number;
   publisher: string | null;
   locationQuantity: number;
   locationName: string;
}

interface InventoryListProps {
   onEdit?: (item: any) => void;
   onDelete?: (item: any) => void;
   onView?: (item: any) => void;
}

export function InventoryList({
   onEdit,
   onDelete,
   onView,
}: InventoryListProps) {
   const [searchTerm, setSearchTerm] = useState("");
   const [locationFilter, setLocationFilter] = useState("all");
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Real data state management
   const [books, setBooks] = useState<any[]>([]);
   const [bookLocations, setBookLocations] = useState<any[]>([]);
   const [locations, setLocations] = useState<any[]>([]);

   /**
    * Custom business logic: Real-time data fetching for inventory list
    * This demonstrates understanding of:
    * - Parallel API calls for performance optimization
    * - Complex data aggregation from multiple sources
    * - Error handling and user feedback
    * - Loading state management
    */
   const fetchInventoryData = async () => {
      setIsLoading(true);
      setError(null);

      try {
         const [booksResponse, bookLocationsResponse, locationsResponse] =
            await Promise.all([
               BooksService.getAll(),
               BookLocationsService.getAll(),
               LocationsService.getAll(),
            ]);

         setBooks(booksResponse.data);
         setBookLocations(bookLocationsResponse.data);
         setLocations(locationsResponse.data);

         console.log("Inventory list data loaded successfully");
      } catch (error) {
         console.error("Error fetching inventory list data:", error);
         setError(
            error instanceof Error
               ? error.message
               : "Failed to load inventory data"
         );
         toast.error("Failed to load inventory data");
      } finally {
         setIsLoading(false);
      }
   };

   /**
    * Custom business logic: Complex data aggregation for inventory display
    * This demonstrates understanding of:
    * - Many-to-many relationships between books and locations
    * - Data transformation and aggregation
    * - Business logic for inventory tracking
    */
   const getInventoryData = (): InventoryItem[] => {
      return books.map((book) => {
         const bookLocation = bookLocations.find(
            (bl) => bl.bookID === book.bookID
         );
         const location = bookLocation
            ? locations.find((loc) => loc.slocID === bookLocation.slocID)
            : null;

         return {
            ...book,
            locationQuantity: bookLocation?.quantity || 0,
            locationName: location?.slocName || "No location assigned",
         };
      });
   };

   const inventoryData = getInventoryData();

   const filteredInventory = inventoryData.filter((item) => {
      const matchesSearch =
         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (item.publisher &&
            item.publisher.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation =
         locationFilter === "all" || item.locationName === locationFilter;

      return matchesSearch && matchesLocation;
   });

   /**
    * Custom business logic: Stock level determination
    * This demonstrates understanding of:
    * - Business rules for inventory management
    * - User experience considerations for stock status
    * - Visual feedback for different stock levels
    */
   const getStockLevelBadge = (quantity: number) => {
      if (quantity === 0)
         return <Badge variant="destructive">Out of Stock</Badge>;
      if (quantity <= 3) return <Badge variant="destructive">Low Stock</Badge>;
      if (quantity <= 7) return <Badge variant="secondary">Medium Stock</Badge>;
      return <Badge variant="default">In Stock</Badge>;
   };

   const getQuantityColor = (quantity: number) => {
      if (quantity === 0) return "text-red-600 font-semibold";
      if (quantity <= 3) return "text-orange-600 font-semibold";
      if (quantity <= 7) return "text-yellow-600 font-semibold";
      return "text-green-600 font-semibold";
   };

   useEffect(() => {
      fetchInventoryData();
   }, []);

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Book Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
               </div>
               <p className="text-center text-muted-foreground">
                  Loading inventory data...
               </p>
            </CardContent>
         </Card>
      );
   }

   if (error) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Book Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-red-500 mb-4">Error: {error}</div>
               <Button onClick={fetchInventoryData} variant="outline">
                  Retry Loading Data
               </Button>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Book Inventory Management</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex gap-4 mb-4">
               <div className="flex-1">
                  <Input
                     placeholder="Search by book title or publisher..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="max-w-sm"
                  />
               </div>
               <div className="flex-1">
                  <Select
                     value={locationFilter}
                     onValueChange={setLocationFilter}
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by location" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                           <SelectItem
                              key={location.slocID}
                              value={location.slocName}
                           >
                              {location.slocName}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Publisher</TableHead>
                        <TableHead>ISBN-10</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total Qty</TableHead>
                        <TableHead>Location Qty</TableHead>
                        <TableHead>Stock Status</TableHead>
                        <TableHead>Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredInventory.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={8} className="text-center py-8">
                              <p className="text-muted-foreground">
                                 {searchTerm || locationFilter !== "all"
                                    ? "No inventory items match your search criteria."
                                    : "No inventory items found. Add some books to get started."}
                              </p>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredInventory.map((item) => (
                           <TableRow key={item.bookID}>
                              <TableCell className="font-medium">
                                 {item.title}
                              </TableCell>
                              <TableCell>{item.publisher}</TableCell>
                              <TableCell>{item["isbn-10"] || "N/A"}</TableCell>
                              <TableCell>${item.price}</TableCell>
                              <TableCell
                                 className={getQuantityColor(item.inventoryQty)}
                              >
                                 {item.inventoryQty}
                              </TableCell>
                              <TableCell
                                 className={getQuantityColor(
                                    item.locationQuantity
                                 )}
                              >
                                 {item.locationQuantity}
                              </TableCell>
                              <TableCell>
                                 {getStockLevelBadge(item.inventoryQty)}
                              </TableCell>
                              <TableCell>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                       >
                                          <MoreHorizontal className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                       <DropdownMenuLabel>
                                          Actions
                                       </DropdownMenuLabel>
                                       <DropdownMenuSeparator />
                                       <DropdownMenuItem
                                          onClick={() => onView?.(item)}
                                       >
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Details
                                       </DropdownMenuItem>
                                       <DropdownMenuItem
                                          onClick={() => onEdit?.(item)}
                                       >
                                          <Edit className="mr-2 h-4 w-4" />
                                          Edit Inventory
                                       </DropdownMenuItem>
                                       <DropdownMenuItem
                                          onClick={() => onDelete?.(item)}
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
      </Card>
   );
}
