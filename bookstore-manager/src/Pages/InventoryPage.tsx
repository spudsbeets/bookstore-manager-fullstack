import { useState } from "react";
// import { Button } from "@/components/ui/button"; // Commented out unused import
import { InventoryForm } from "@/components/InventoryForm";
import { InventoryList } from "@/components/list-views/InventoryList";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Package, Plus, List, BarChart3 } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

export function InventoryPage() {
   const [currentView, setCurrentView] = useState<
      "overview" | "add" | "list" | "analytics"
   >("overview");
   const [selectViewOption, setSelectViewOption] = useState(
      "Book Inventory Overview"
   );

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "Book Inventory Overview":
            setCurrentView("overview");
            break;
         case "Add Book Inventory":
            setCurrentView("add");
            break;
         case "Book Inventory List":
            setCurrentView("list");
            break;
         case "Book Inventory Analytics":
            setCurrentView("analytics");
            break;
      }
   };

   // Calculate inventory statistics
   const totalBooks = sampleBooks.length;
   const totalInventory = sampleBooks.reduce(
      (sum, book) => sum + book.inventoryQty,
      0
   );
   const lowStockBooks = sampleBooks.filter(
      (book) => book.inventoryQty <= 3
   ).length;
   const outOfStockBooks = sampleBooks.filter(
      (book) => book.inventoryQty === 0
   ).length;
   const totalValue = sampleBooks.reduce(
      (sum, book) => sum + book.price * book.inventoryQty,
      0
   );

   // Location breakdown
   const locationBreakdown = sampleLocations.map((location) => {
      const booksAtLocation = sampleBookLocations.filter(
         (bl) => bl.slocID === location.slocID
      );
      const totalQuantity = booksAtLocation.reduce(
         (sum, bl) => sum + bl.quantity,
         0
      );
      return {
         locationName: location.slocName,
         bookCount: booksAtLocation.length,
         totalQuantity,
      };
   });

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-3xl font-bold">Book Inventory Management</h1>
               <p className="text-muted-foreground">
                  Manage your bookstore inventory and track book quantities
               </p>
            </div>

            {/* View Selection */}
            <div className="mb-6">
               <Label htmlFor="view-select">Select View</Label>
               <Select
                  value={selectViewOption}
                  onValueChange={handleViewChange}
               >
                  <SelectTrigger className="w-full md:w-[300px]">
                     <SelectValue placeholder="Select a view" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="Book Inventory Overview">
                        <div className="flex items-center gap-2">
                           <Package className="h-4 w-4" />
                           Book Inventory Overview
                        </div>
                     </SelectItem>
                     <SelectItem value="Add Book Inventory">
                        <div className="flex items-center gap-2">
                           <Plus className="h-4 w-4" />
                           Add Book Inventory
                        </div>
                     </SelectItem>
                     <SelectItem value="Book Inventory List">
                        <div className="flex items-center gap-2">
                           <List className="h-4 w-4" />
                           Book Inventory List
                        </div>
                     </SelectItem>
                     <SelectItem value="Book Inventory Analytics">
                        <div className="flex items-center gap-2">
                           <BarChart3 className="h-4 w-4" />
                           Book Inventory Analytics
                        </div>
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Overview Section */}
            {currentView === "overview" && (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">
                              Total Books
                           </CardTitle>
                           <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">
                              {totalBooks}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Unique book titles
                           </p>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">
                              Total Inventory
                           </CardTitle>
                           <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">
                              {totalInventory}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Total book copies
                           </p>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">
                              Low Stock
                           </CardTitle>
                           <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold text-orange-600">
                              {lowStockBooks}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Books with ≤ 3 copies
                           </p>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">
                              Total Value
                           </CardTitle>
                           <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">
                              ${totalValue.toFixed(2)}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Inventory value
                           </p>
                        </CardContent>
                     </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <Card>
                        <CardHeader>
                           <CardTitle>Stock Status</CardTitle>
                           <CardDescription>
                              Current inventory levels
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                              <div className="flex justify-between">
                                 <span>In Stock</span>
                                 <span className="font-semibold">
                                    {totalBooks - outOfStockBooks}
                                 </span>
                              </div>
                              <div className="flex justify-between">
                                 <span>Out of Stock</span>
                                 <span className="font-semibold text-red-600">
                                    {outOfStockBooks}
                                 </span>
                              </div>
                              <div className="flex justify-between">
                                 <span>Low Stock (≤3 copies)</span>
                                 <span className="font-semibold text-orange-600">
                                    {lowStockBooks}
                                 </span>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                           <CardTitle>Location Breakdown</CardTitle>
                           <CardDescription>
                              Books by storage location
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                              {locationBreakdown.map((location) => (
                                 <div
                                    key={location.locationName}
                                    className="flex justify-between"
                                 >
                                    <span>{location.locationName}</span>
                                    <span className="font-semibold">
                                       {location.bookCount} books (
                                       {location.totalQuantity} copies)
                                    </span>
                                 </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            )}

            {/* Add Inventory Section */}
            {currentView === "add" && (
               <div>
                  <InventoryForm />
               </div>
            )}

            {/* List View Section */}
            {currentView === "list" && (
               <div>
                  <InventoryList />
               </div>
            )}

            {/* Analytics Section */}
            {currentView === "analytics" && (
               <div className="space-y-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Inventory Analytics</CardTitle>
                        <CardDescription>
                           Detailed analysis of your book inventory
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <h3 className="text-lg font-semibold mb-4">
                                 Stock Levels
                              </h3>
                              <div className="space-y-2">
                                 <div className="flex justify-between">
                                    <span>High Stock (&gt;7 copies)</span>
                                    <span className="font-semibold text-green-600">
                                       {
                                          sampleBooks.filter(
                                             (book) => book.inventoryQty > 7
                                          ).length
                                       }
                                    </span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span>Medium Stock (4-7 copies)</span>
                                    <span className="font-semibold text-yellow-600">
                                       {
                                          sampleBooks.filter(
                                             (book) =>
                                                book.inventoryQty >= 4 &&
                                                book.inventoryQty <= 7
                                          ).length
                                       }
                                    </span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span>Low Stock (1-3 copies)</span>
                                    <span className="font-semibold text-orange-600">
                                       {
                                          sampleBooks.filter(
                                             (book) =>
                                                book.inventoryQty >= 1 &&
                                                book.inventoryQty <= 3
                                          ).length
                                       }
                                    </span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span>Out of Stock</span>
                                    <span className="font-semibold text-red-600">
                                       {
                                          sampleBooks.filter(
                                             (book) => book.inventoryQty === 0
                                          ).length
                                       }
                                    </span>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <h3 className="text-lg font-semibold mb-4">
                                 Publisher Distribution
                              </h3>
                              <div className="space-y-2">
                                 {Array.from(
                                    new Set(
                                       sampleBooks.map(
                                          (book) => book.publisherName
                                       )
                                    )
                                 ).map((publisher) => {
                                    const bookCount = sampleBooks.filter(
                                       (book) =>
                                          book.publisherName === publisher
                                    ).length;
                                    return (
                                       <div
                                          key={publisher}
                                          className="flex justify-between"
                                       >
                                          <span>{publisher}</span>
                                          <span className="font-semibold">
                                             {bookCount} books
                                          </span>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            )}
         </div>
      </div>
   );
}
