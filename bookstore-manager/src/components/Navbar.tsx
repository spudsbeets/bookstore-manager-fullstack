/**
 * @date August 4, 2025
 * @based_on The design and component structure from a navbar on a previous personal website project.
 *
 * @degree_of_originality This component is an adaptation of a prior implementation. It has been updated to use this project's specific navigation links, theme-switching functionality, and shadcn/ui components.
 *
 * @source_url N/A - Based on a prior personal project.
 *
 * @ai_tool_usage The navbar component was created using Cursor, an AI code editor, based on the prior project's design. The generated code was then customized for this application.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
   BookOpen,
   Users,
   ShoppingCart,
   Building2,
   MapPin,
   UserCheck,
   Tags,
   PenTool,
   Package,
   Menu,
   LayoutGrid,
   List,
   Database,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DatabaseEntity {
   name: string;
   icon: LucideIcon;
   baseUrl: string;
}

interface LayoutMode {
   id: string;
   name: string;
   icon: LucideIcon;
   className: string;
   containerClass: string;
}

export function Navbar() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [currentLayoutMode, setCurrentLayoutMode] =
      useState<string>("contained");
   const navigate = useNavigate();

   const layoutModes: LayoutMode[] = [
      {
         id: "contained",
         name: "Contained Layout",
         icon: LayoutGrid,
         className: "",
         containerClass: "container mx-auto px-4",
      },
      {
         id: "full-width",
         name: "Full Width Layout",
         icon: List,
         className: "w-full",
         containerClass: "w-full px-4",
      },
   ];

   const tableNames = [
      "Books",
      "Customers",
      "Orders",
      "Publishers",
      "Authors",
      "Genres",
      "Locations",
      "Sales Rates",
      "Inventory",
      "Book Authors",
      "Book Genres",
      "Book Locations",
      "Order Items",
   ];

   const iconMap: Record<string, LucideIcon> = {
      Books: BookOpen,
      Customers: Users,
      Orders: ShoppingCart,
      Publishers: Building2,
      Authors: PenTool,
      Genres: Tags,
      Locations: MapPin,
      "Sales Rates": UserCheck,
      Inventory: Package,
      "Book Authors": Users,
      "Book Genres": Tags,
      "Book Locations": MapPin,
      "Order Items": Package,
   };

   const databaseEntities: DatabaseEntity[] = tableNames.map((name) => {
      const baseUrl = `/${name.toLowerCase().replace(/\s+/g, "-")}`;
      return {
         name,
         icon: iconMap[name] || Database, // fallback icon
         baseUrl,
      };
   });

   const handleNavigation = (url: string) => {
      console.log(`Navigating to: ${url}`);
      navigate(url);
      // Close mobile menu if it's open
      if (isMobileMenuOpen) {
         setIsMobileMenuOpen(false);
      }
   };

   const handleLayoutToggle = () => {
      const currentIndex = layoutModes.findIndex(
         (mode) => mode.id === currentLayoutMode
      );
      const nextIndex = (currentIndex + 1) % layoutModes.length;
      const nextMode = layoutModes[nextIndex];
      setCurrentLayoutMode(nextMode.id);
      console.log(`Layout changed to: ${nextMode.name}`);
   };

   const getCurrentLayoutMode = () => {
      return (
         layoutModes.find((mode) => mode.id === currentLayoutMode) ||
         layoutModes[0]
      );
   };

   const currentLayout = getCurrentLayoutMode();

   return (
      <nav
         className={`backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 border-b sticky top-0 z-50 ${currentLayout.className}`}
         style={{ backgroundColor: "hsl(var(--background) / 0.75)" }}
      >
         <div className={currentLayout.containerClass}>
            {/* First Row - Brand and Controls */}
            <div className="flex h-16 items-center justify-between">
               {/* Brand */}
               <div className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">Bookstore Manager</span>
               </div>

               {/* Right side - Layout Toggle, Theme Toggle, and Mobile Menu */}
               <div className="flex items-center space-x-2">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleLayoutToggle}
                     className="flex items-center justify-center"
                  >
                     <currentLayout.icon className="h-4 w-4" />
                  </Button>
                  <div className="h-6 w-px bg-border" />
                  <ModeToggle />
                  <div className="md:hidden">
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     >
                        <Menu className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </div>

            {/* Second Row - Navigation Items (Refactored) */}
            <div className="hidden md:flex items-center justify-center py-2 border-t border-border/60">
               <div className="flex items-center space-x-2 flex-wrap justify-center">
                  <Button
                     variant="ghost"
                     onClick={() => handleNavigation("/")}
                     className="text-sm font-medium hover:text-primary"
                  >
                     Home
                  </Button>
                  {}
                  {databaseEntities.map((entity) => (
                     <Button
                        key={entity.name}
                        variant="ghost"
                        onClick={() => handleNavigation(entity.baseUrl)}
                        className="flex items-center space-x-1 text-sm font-medium hover:text-primary"
                     >
                        <entity.icon className="h-4 w-4" />
                        <span>{entity.name}</span>
                     </Button>
                  ))}
               </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
               <div
                  className="md:hidden border-t backdrop-blur-xl"
                  style={{ backgroundColor: "hsl(var(--background) / 0.8)" }}
               >
                  <div className="px-4 py-2 space-y-2">
                     <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigation("/")}
                     >
                        Home
                     </Button>
                     {databaseEntities.map((entity) => (
                        <Button
                           key={entity.name}
                           variant="ghost"
                           className="w-full justify-start"
                           onClick={() => handleNavigation(entity.baseUrl)}
                        >
                           <entity.icon className="mr-2 h-4 w-4" />
                           {entity.name}
                        </Button>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </nav>
   );
}
