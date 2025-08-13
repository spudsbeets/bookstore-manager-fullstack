/**
 * @date August 4, 2025
 * @based_on The project's frontend architecture, which utilizes React Router for client-side page navigation.
 *
 * @degree_of_originality The implementation uses standard practices from the `react-router-dom` library. The specific routes, the use of `lazy` for code-splitting page components, and the `Suspense` fallback are custom to this application's design.
 *
 * @source_url N/A - This implementation is based on the project's unique frontend requirements.
 *
 * @ai_tool_usage The main App component, including the router and route definitions, was generated using Cursor based on the website's page structure. The generated code was then reviewed and integrated into the project.
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Suspense, lazy } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";

// Lazy load all pages
const HomePage = lazy(() =>
   import("@/Pages/HomePage").then((module) => ({ default: module.HomePage }))
);
const PublishersPage = lazy(() =>
   import("@/Pages/PublishersPage").then((module) => ({
      default: module.PublishersPage,
   }))
);
const BooksPage = lazy(() =>
   import("@/Pages/BooksPage").then((module) => ({ default: module.BooksPage }))
);
const CustomersPage = lazy(() =>
   import("@/Pages/CustomersPage").then((module) => ({
      default: module.CustomersPage,
   }))
);
const OrdersPage = lazy(() =>
   import("@/Pages/OrdersPage").then((module) => ({
      default: module.OrdersPage,
   }))
);
const AuthorsPage = lazy(() =>
   import("@/Pages/AuthorsPage").then((module) => ({
      default: module.AuthorsPage,
   }))
);
const GenresPage = lazy(() =>
   import("@/Pages/GenresPage").then((module) => ({
      default: module.GenresPage,
   }))
);
const SalesRatesPage = lazy(() =>
   import("@/Pages/SalesRatesPage").then((module) => ({
      default: module.SalesRatesPage,
   }))
);
const LocationsPage = lazy(() =>
   import("@/Pages/LocationsPage").then((module) => ({
      default: module.LocationsPage,
   }))
);
const InventoryPage = lazy(() =>
   import("@/Pages/InventoryPage").then((module) => ({
      default: module.InventoryPage,
   }))
);
const BookAuthorsPage = lazy(() =>
   import("@/Pages/BookAuthorsPage").then((module) => ({
      default: module.BookAuthorsPage,
   }))
);
const BookGenresPage = lazy(() =>
   import("@/Pages/BookGenresPage").then((module) => ({
      default: module.BookGenresPage,
   }))
);
const BookLocationsPage = lazy(() =>
   import("@/Pages/BookLocationsPage").then((module) => ({
      default: module.BookLocationsPage,
   }))
);
const OrderItemsPage = lazy(() =>
   import("@/Pages/OrderItemsPage").then((module) => ({
      default: module.OrderItemsPage,
   }))
);
const BookRelationshipsPage = lazy(
   () => import("@/Pages/BookRelationshipsPage")
);

// Loading component
const LoadingSpinner = () => (
   <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
   </div>
);

function App() {
   return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
         <Router>
            <AppContent />
         </Router>
         <Toaster richColors closeButton />
      </ThemeProvider>
   );
}

function AppContent() {
   usePageTitle();

   return (
      <div
         className="min-h-screen"
         style={{ backgroundColor: "hsl(var(--background))" }}
      >
         <Navbar />
         <Suspense fallback={<LoadingSpinner />}>
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
               <Route path="/book-locations" element={<BookLocationsPage />} />
               <Route path="/order-items" element={<OrderItemsPage />} />
               <Route
                  path="/books/:id/relationships"
                  element={<BookRelationshipsPage />}
               />
            </Routes>
         </Suspense>
      </div>
   );
}

export default App;
