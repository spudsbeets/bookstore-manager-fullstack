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

import { useState, useEffect } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   BookOpen,
   Users,
   ShoppingCart,
   Building2,
   PenTool,
   Tags,
   MapPin,
   Package,
   Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Import services
import BooksService from "@/services/BooksService";
import CustomersService from "@/services/CustomersService";
import OrdersService from "@/services/OrdersService";
import PublishersService from "@/services/PublishersService";
import AuthorsService from "@/services/AuthorsService";
import GenresService from "@/services/GenresService";
import SalesRateLocationsService from "@/services/SalesRateLocationsService";
import BookLocationsService from "@/services/BookLocationsService";

interface DashboardStats {
   books: number;
   customers: number;
   orders: number;
   publishers: number;
   authors: number;
   genres: number;
   salesRates: number;
   inventory: number;
}

export function HomePage() {
   const [stats, setStats] = useState<DashboardStats>({
      books: 0,
      customers: 0,
      orders: 0,
      publishers: 0,
      authors: 0,
      genres: 0,
      salesRates: 0,
      inventory: 0,
   });
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            const [
               customersResponse,
               booksResponse,
               ordersResponse,
               publishersResponse,
               authorsResponse,
               genresResponse,
               salesRatesResponse,
               bookLocationsResponse,
            ] = await Promise.all([
               CustomersService.getAll(),
               BooksService.getAll(),
               OrdersService.getAll(),
               PublishersService.getAll(),
               AuthorsService.getAll(),
               GenresService.getAll(),
               SalesRateLocationsService.getAll(),
               BookLocationsService.getAll(),
            ]);

            console.log("All API calls completed successfully");

            // Calculate inventory total from book-locations (actual inventory)
            const inventoryTotal = bookLocationsResponse.data.reduce(
               (sum: number, bookLocation: any) =>
                  sum + (bookLocation.quantity || 0),
               0
            );

            const newStats = {
               books: booksResponse.data.length,
               customers: customersResponse.data.length,
               orders: ordersResponse.data.length,
               publishers: publishersResponse.data.length,
               authors: authorsResponse.data.length,
               genres: genresResponse.data.length,
               salesRates: salesRatesResponse.data.length,
               inventory: inventoryTotal,
            };

            console.log("Setting stats:", newStats);
            setStats(newStats);
         } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError(error instanceof Error ? error.message : "Unknown error");
            toast.error("Failed to load dashboard data", {
               description: "Some statistics may not be accurate.",
            });
         } finally {
            setIsLoading(false);
         }
      };

      fetchDashboardData();
   }, []);

   if (isLoading) {
      return (
         <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
               <Card>
                  <CardHeader>
                     <CardTitle>Welcome to Bookstore Manager</CardTitle>
                     <CardDescription>
                        Loading dashboard data...
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
               <Card>
                  <CardHeader>
                     <CardTitle>Welcome to Bookstore Manager</CardTitle>
                     <CardDescription>
                        Error loading dashboard data
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="text-red-500 mb-4">Error: {error}</div>
                     <p className="text-sm text-muted-foreground">
                        Showing placeholder data. Please refresh the page to try
                        again.
                     </p>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Books
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Total books in inventory
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Registered customers
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Total orders placed
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Publishers
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Publishing partners
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Authors
                        </CardTitle>
                        <PenTool className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Authors in catalog
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Genres
                        </CardTitle>
                        <Tags className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Book categories
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Sales Rates
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Tax rate locations
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Inventory
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">
                           Items in stock
                        </p>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto space-y-8">
            <Card>
               <CardHeader>
                  <CardTitle>Welcome to Bookstore Manager</CardTitle>
                  <CardDescription>
                     Use the navigation bar above to manage your bookstore
                     database
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">
                     This application allows you to perform CRUD operations on
                     all your bookstore entities including Books, Customers,
                     Orders, Publishers, Authors, Genres, Locations, Sales
                     Rates, and Inventory.
                  </p>
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Books
                     </CardTitle>
                     <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stats.books}</div>
                     <p className="text-xs text-muted-foreground">
                        Total books in inventory
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Customers
                     </CardTitle>
                     <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stats.customers}</div>
                     <p className="text-xs text-muted-foreground">
                        Registered customers
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Orders
                     </CardTitle>
                     <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stats.orders}</div>
                     <p className="text-xs text-muted-foreground">
                        Total orders placed
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Publishers
                     </CardTitle>
                     <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">
                        {stats.publishers}
                     </div>
                     <p className="text-xs text-muted-foreground">
                        Publishing partners
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Authors
                     </CardTitle>
                     <PenTool className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stats.authors}</div>
                     <p className="text-xs text-muted-foreground">
                        Authors in catalog
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Genres
                     </CardTitle>
                     <Tags className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stats.genres}</div>
                     <p className="text-xs text-muted-foreground">
                        Book categories
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Sales Rates
                     </CardTitle>
                     <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">
                        {stats.salesRates}
                     </div>
                     <p className="text-xs text-muted-foreground">
                        Tax rate locations
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Inventory
                     </CardTitle>
                     <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stats.inventory}</div>
                     <p className="text-xs text-muted-foreground">
                        Items in stock
                     </p>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
