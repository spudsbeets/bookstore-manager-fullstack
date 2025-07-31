import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
   Plus,
   Eye,
   Edit,
   Trash2,
   Menu,
   ChevronDown,
   LayoutGrid,
   List,
   Database,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DatabaseEntity {
   name: string;
   icon: any;
   baseUrl: string;
   operations: {
      name: string;
      icon: any;
      action: string;
      url: string;
   }[];
}

interface LayoutMode {
   id: string;
   name: string;
   icon: any;
   className: string;
   containerClass: string;
}

export function Navbar() {
   const [activeSection, setActiveSection] = useState<string>("");
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [currentLayoutMode, setCurrentLayoutMode] =
      useState<string>("contained");
   const navigate = useNavigate();
   // const location = useLocation(); // Commented out unused variable

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

   const operations = [
      { namePrefix: "View All", action: "view", icon: Eye, urlSuffix: "" },
      { namePrefix: "Add New", action: "add", icon: Plus, urlSuffix: "/add" },
      { namePrefix: "Edit", action: "edit", icon: Edit, urlSuffix: "/edit" },
      {
         namePrefix: "Delete",
         action: "delete",
         icon: Trash2,
         urlSuffix: "/delete",
      },
   ];

   const databaseEntities: DatabaseEntity[] = tableNames.map((name) => {
      const baseUrl = `/${name.toLowerCase().replace(/\s+/g, "-")}`;
      return {
         name,
         icon: iconMap[name] || Database, // fallback icon
         baseUrl,
         operations: operations.map(
            ({ namePrefix, action, icon, urlSuffix }) => ({
               name: `${namePrefix} ${name}`,
               action,
               icon,
               url: `${baseUrl}${urlSuffix}`,
            })
         ),
      };
   });
   const handleOperation = (entityName: string, operation: any) => {
      setActiveSection(`${operation.action}-${entityName.toLowerCase()}`);
      console.log(`Navigating to: ${operation.url}`);
      navigate(operation.url);
   };

   const handleMobileNavigation = (entity: DatabaseEntity) => {
      setActiveSection(`view-${entity.name.toLowerCase()}`);
      console.log(`Navigating to: ${entity.baseUrl}`);
      navigate(entity.baseUrl);
      setIsMobileMenuOpen(false);
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
         className={`backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50 ${currentLayout.className}`}
         style={{ backgroundColor: "hsl(var(--background) / 0.95)" }}
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
                  {/* Layout Toggle */}
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleLayoutToggle}
                     className="flex items-center justify-center"
                  >
                     <currentLayout.icon className="h-4 w-4" />
                  </Button>

                  {/* Divider */}
                  <div className="h-6 w-px bg-border" />

                  {/* Theme Toggle */}
                  <ModeToggle />

                  {/* Mobile Menu Button */}
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

            {/* Second Row - Navigation Items */}
            <div className="hidden md:flex items-center justify-center py-2 border-t">
               <div className="flex items-center space-x-2 flex-wrap justify-center">
                  <Button
                     variant="ghost"
                     onClick={() => navigate("/")}
                     className="text-sm font-medium hover:text-primary"
                  >
                     Home
                  </Button>

                  {databaseEntities.map((entity) => (
                     <DropdownMenu key={entity.name}>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              className="flex items-center space-x-1"
                           >
                              <entity.icon className="h-4 w-4" />
                              <span>{entity.name}</span>
                              <ChevronDown className="h-3 w-3" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           {entity.operations.map((operation) => (
                              <DropdownMenuItem
                                 key={operation.action}
                                 onClick={() =>
                                    handleOperation(entity.name, operation)
                                 }
                              >
                                 <operation.icon className="mr-2 h-4 w-4" />
                                 {operation.name}
                              </DropdownMenuItem>
                           ))}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ))}
               </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
               <div
                  className="md:hidden border-t backdrop-blur"
                  style={{ backgroundColor: "hsl(var(--background) / 0.95)" }}
               >
                  <div className="px-4 py-2 space-y-2">
                     <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                           navigate("/");
                           setIsMobileMenuOpen(false);
                        }}
                     >
                        Home
                     </Button>
                     {databaseEntities.map((entity) => (
                        <Button
                           key={entity.name}
                           variant="ghost"
                           className="w-full justify-start"
                           onClick={() => handleMobileNavigation(entity)}
                        >
                           <entity.icon className="mr-2 h-4 w-4" />
                           {entity.name}
                        </Button>
                     ))}
                  </div>
               </div>
            )}
         </div>

         {/* Active Section Display */}
         {activeSection && (
            <div className={`border-t bg-muted/50 ${currentLayout.className}`}>
               <div className={`${currentLayout.containerClass} py-2`}>
                  <div className="flex items-center space-x-2 text-sm">
                     <span className="text-muted-foreground">Active:</span>
                     <span className="font-medium capitalize">
                        {activeSection.replace(/-/g, " ")}
                     </span>
                  </div>
               </div>
            </div>
         )}
      </nav>
   );
}
