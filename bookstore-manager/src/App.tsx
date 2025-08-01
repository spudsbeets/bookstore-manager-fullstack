import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { HomePage } from "@/Pages/HomePage";
import { PublishersPage } from "@/Pages/PublishersPage";
import { BooksPage } from "@/Pages/BooksPage";
import { CustomersPage } from "@/Pages/CustomersPage";
import { OrdersPage } from "@/Pages/OrdersPage";
import { AuthorsPage } from "@/Pages/AuthorsPage";
import { GenresPage } from "@/Pages/GenresPage";
import { SalesRatesPage } from "@/Pages/SalesRatesPage";
import { LocationsPage } from "@/Pages/LocationsPage";
import { InventoryPage } from "@/Pages/InventoryPage";
import { BookAuthorsPage } from "@/Pages/BookAuthorsPage";
import { BookGenresPage } from "@/Pages/BookGenresPage";
import { BookLocationsPage } from "@/Pages/BookLocationsPage";
import { OrderItemsPage } from "@/Pages/OrderItemsPage";

function App() {
   return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
         <Router>
            <div
               className="min-h-screen"
               style={{ backgroundColor: "hsl(var(--background))" }}
            >
               <Navbar />
               <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/publishers" element={<PublishersPage />} />
                  <Route path="/authors" element={<AuthorsPage />} />
                  <Route path="/genres" element={<GenresPage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                  <Route path="/sales-rates" element={<SalesRatesPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/book-authors" element={<BookAuthorsPage />} />
                  <Route path="/book-genres" element={<BookGenresPage />} />
                  <Route
                     path="/book-locations"
                     element={<BookLocationsPage />}
                  />
                  <Route path="/order-items" element={<OrderItemsPage />} />
               </Routes>
            </div>
         </Router>
         <Toaster richColors />
      </ThemeProvider>
   );
}

export default App;
