import { useState } from "react";
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
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

// Sample data based on actual database schema
const sampleBooks = [
   {
      bookID: 1,
      title: "Inherent Vice",
      inventoryQty: 5,
      price: 15.99,
      inStock: 1,
      publicationDate: "2009-08-04",
      "isbn-10": "0143126850",
      "isbn-13": "9780143126850",
      publisherID: 2,
      publisherName: "Penguin Books",
   },
   {
      bookID: 2,
      title: "Beloved",
      inventoryQty: 7,
      price: 17.99,
      inStock: 1,
      publicationDate: "1987-09-01",
      "isbn-10": "1400033416",
      "isbn-13": "9781400033416",
      publisherID: 1,
      publisherName: "Vintage International",
   },
   {
      bookID: 3,
      title: "The Talisman",
      inventoryQty: 6,
      price: 18.99,
      inStock: 1,
      publicationDate: "1984-11-08",
      "isbn-10": "0670691992",
      "isbn-13": "9780670691999",
      publisherID: 3,
      publisherName: "Viking Press",
   },
   {
      bookID: 4,
      title: "Good Omens",
      inventoryQty: 8,
      price: 16.99,
      inStock: 1,
      publicationDate: "2006-11-28",
      "isbn-10": "0060853980",
      "isbn-13": "9780060853983",
      publisherID: 4,
      publisherName: "William Morrow",
   },
];

const sampleBookLocations = [
   {
      bookLocationID: 1,
      bookID: 2,
      slocID: 1,
      quantity: 8,
      bookTitle: "Beloved",
      locationName: "Orchard",
   },
   {
      bookLocationID: 2,
      bookID: 1,
      slocID: 2,
      quantity: 12,
      bookTitle: "Inherent Vice",
      locationName: "Sunwillow",
   },
];

const sampleLocations = [
   { slocID: 1, slocName: "Orchard" },
   { slocID: 2, slocName: "Sunwillow" },
];

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

   // Combine books with their location data
   const inventoryData = sampleBooks.map((book) => {
      const bookLocation = sampleBookLocations.find(
         (bl) => bl.bookID === book.bookID
      );
      const location = bookLocation
         ? sampleLocations.find((loc) => loc.slocID === bookLocation.slocID)
         : null;

      return {
         ...book,
         locationQuantity: bookLocation?.quantity || 0,
         locationName: location?.slocName || "No location assigned",
      };
   });

   const filteredInventory = inventoryData.filter((item) => {
      const matchesSearch =
         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.publisherName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
         locationFilter === "all" || item.locationName === locationFilter;

      return matchesSearch && matchesLocation;
   });

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
                        {sampleLocations.map((location) => (
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
                     {filteredInventory.map((item) => (
                        <TableRow key={item.bookID}>
                           <TableCell className="font-medium">
                              {item.title}
                           </TableCell>
                           <TableCell>{item.publisherName}</TableCell>
                           <TableCell>{item["isbn-10"]}</TableCell>
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
                     ))}
                  </TableBody>
               </Table>
            </div>
         </CardContent>
      </Card>
   );
}
