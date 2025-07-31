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
} from "lucide-react";

// Import sample data arrays
const sampleBooks = [
   {
      bookID: 1,
      title: "Inherent Vice",
      publicationDate: "2009-08-04",
      "isbn-10": "0143126850",
      "isbn-13": "9780143126850",
      inStock: true,
      price: 15.99,
      inventoryQty: 5,
      publisherID: 2,
      publisherName: "Penguin Books",
   },
   {
      bookID: 2,
      title: "Beloved",
      publicationDate: "1987-09-01",
      "isbn-10": "1400033416",
      "isbn-13": "9781400033416",
      inStock: true,
      price: 17.99,
      inventoryQty: 7,
      publisherID: 1,
      publisherName: "Vintage International",
   },
   {
      bookID: 3,
      title: "The Talisman",
      publicationDate: "1984-11-08",
      "isbn-10": "0670691992",
      "isbn-13": "9780670691999",
      inStock: true,
      price: 18.99,
      inventoryQty: 6,
      publisherID: 3,
      publisherName: "Viking Press",
   },
   {
      bookID: 4,
      title: "Good Omens",
      publicationDate: "2006-11-28",
      "isbn-10": "0060853980",
      "isbn-13": "9780060853983",
      inStock: true,
      price: 16.99,
      inventoryQty: 8,
      publisherID: 4,
      publisherName: "William Morrow",
   },
];

const sampleCustomers = [
   {
      customerID: 1,
      firstName: "Reggie",
      lastName: "Reggerson",
      email: "regreg@reg.com",
      phoneNumber: "3333888902",
   },
   {
      customerID: 2,
      firstName: "Gail",
      lastName: "Nightingstocks",
      email: "gailsmail@gmail.com",
      phoneNumber: "2295730384",
   },
];

const sampleOrders = [
   {
      orderID: 1,
      orderDate: "2025-10-01",
      orderTime: "21:12:11",
      total: 45.61,
      taxRate: 4.2,
      customerID: 1,
      salesRateID: 1,
      customerName: "Reggie Reggerson",
      salesRateLocation: "Polk, Iowa",
   },
   {
      orderID: 2,
      orderDate: "2025-10-01",
      orderTime: "21:12:11",
      total: 61.21,
      taxRate: 5.1,
      customerID: 2,
      salesRateID: 2,
      customerName: "Gail Nightingstocks",
      salesRateLocation: "Jerome, Idaho",
   },
];

const samplePublishers = [
   { publisherID: 1, publisherName: "Vintage International" },
   { publisherID: 2, publisherName: "Penguin Books" },
   { publisherID: 3, publisherName: "Viking Press" },
   { publisherID: 4, publisherName: "William Morrow" },
];

const sampleAuthors = [
   {
      authorID: 1,
      firstName: "Toni",
      lastName: "Morrison",
      fullName: "Toni Morrison",
   },
   {
      authorID: 2,
      firstName: "Thomas",
      lastName: "Pynchon",
      fullName: "Thomas Pynchon",
   },
   {
      authorID: 3,
      firstName: "Stephen",
      middleName: "Edwin",
      lastName: "King",
      fullName: "Stephen Edwin King",
   },
   {
      authorID: 4,
      firstName: "Peter",
      lastName: "Straub",
      fullName: "Peter Straub",
   },
   {
      authorID: 5,
      firstName: "Neil",
      middleName: "Richard",
      lastName: "Gaiman",
      fullName: "Neil Richard Gaiman",
   },
   {
      authorID: 6,
      firstName: "Terry",
      lastName: "Pratchett",
      fullName: "Terry Pratchett",
   },
];

const sampleGenres = [
   { genreID: 1, genreName: "Postmodern Fiction" },
   { genreID: 2, genreName: "Historical Fiction" },
   { genreID: 3, genreName: "Horror Fiction" },
   { genreID: 4, genreName: "Science Fiction" },
   { genreID: 5, genreName: "Fantasy Fiction" },
];

const sampleSalesRates = [
   { salesRateID: 1, county: "Polk", state: "Iowa", taxRate: 4.2 },
   { salesRateID: 2, county: "Jerome", state: "Idaho", taxRate: 5.1 },
   {
      salesRateID: 3,
      county: "San Francisco",
      state: "California",
      taxRate: 8.625,
   },
];

export function HomePage() {
   // Calculate statistics dynamically
   const totalBooks = sampleBooks.length;
   const totalCustomers = sampleCustomers.length;
   const totalOrders = sampleOrders.length;
   const totalPublishers = samplePublishers.length;
   const totalAuthors = sampleAuthors.length;
   const totalGenres = sampleGenres.length;
   const totalSalesRates = sampleSalesRates.length;
   const totalInventory = sampleBooks.reduce(
      (sum, book) => sum + book.inventoryQty,
      0
   );

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
                     <div className="text-2xl font-bold">{totalBooks}</div>
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
                     <div className="text-2xl font-bold">{totalCustomers}</div>
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
                     <div className="text-2xl font-bold">{totalOrders}</div>
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
                     <div className="text-2xl font-bold">{totalPublishers}</div>
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
                     <div className="text-2xl font-bold">{totalAuthors}</div>
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
                     <div className="text-2xl font-bold">{totalGenres}</div>
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
                     <div className="text-2xl font-bold">{totalSalesRates}</div>
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
                     <div className="text-2xl font-bold">{totalInventory}</div>
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
