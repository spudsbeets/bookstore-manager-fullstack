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
// import { Badge } from "@/components/ui/badge"; // Commented out unused import
import {
   Plus,
   Search,
   Edit,
   Eye,
   Trash2,
   Building2,
   MoreHorizontal,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Publisher {
   publisherID: number;
   publisherName: string;
}

// Sample data - replace with actual API calls
const samplePublishers: Publisher[] = [
   { publisherID: 1, publisherName: "Vintage International" },
   { publisherID: 2, publisherName: "Penguin Books" },
   { publisherID: 3, publisherName: "Viking Press" },
   { publisherID: 4, publisherName: "William Morrow" },
];

interface PublishersListProps {
   onView?: (publisher: Publisher) => void;
   onEdit?: (publisher: Publisher) => void;
   onDelete?: (publisher: Publisher) => void;
   onCreate?: () => void;
}

export function PublishersList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: PublishersListProps) {
   const [publishers, setPublishers] = useState<Publisher[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [publisherToDelete, setPublisherToDelete] = useState<Publisher | null>(
      null
   );
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      // Simulate API call
      const fetchPublishers = async () => {
         setIsLoading(true);
         try {
            // Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setPublishers(samplePublishers);
         } catch (error) {
            console.error("Error fetching publishers:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchPublishers();
   }, []);

   const filteredPublishers = publishers.filter((publisher) =>
      publisher.publisherName.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleDelete = async (publisher: Publisher) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setPublishers(
            publishers.filter((p) => p.publisherID !== publisher.publisherID)
         );
         if (onDelete) {
            onDelete(publisher);
         }
      } catch (error) {
         console.error("Error deleting publisher:", error);
      } finally {
         setIsDeleting(false);
         setPublisherToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Publishers</CardTitle>
               <CardDescription>Loading publishers...</CardDescription>
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
                     <Building2 className="h-5 w-5" />
                     Publishers
                  </CardTitle>
                  <CardDescription>
                     Manage your bookstore's publishers ({publishers.length}{" "}
                     total)
                  </CardDescription>
               </div>
               <Button onClick={onCreate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Publisher
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            {/* Search Bar */}
            <div className="flex items-center space-x-2 mb-4">
               <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search publishers..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
            </div>

            {/* Publishers Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Publisher Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredPublishers.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={3} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No publishers found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredPublishers.map((publisher) => (
                           <TableRow key={publisher.publisherID}>
                              <TableCell className="font-medium">
                                 {publisher.publisherID}
                              </TableCell>
                              <TableCell>{publisher.publisherName}</TableCell>
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
                                             onClick={() => onView(publisher)}
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() => onEdit(publisher)}
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() =>
                                             setPublisherToDelete(publisher)
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
            isOpen={!!publisherToDelete}
            onOpenChange={() => setPublisherToDelete(null)}
            onConfirm={() =>
               publisherToDelete && handleDelete(publisherToDelete)
            }
            isDeleting={isDeleting}
            itemName={publisherToDelete?.publisherName || ""}
            itemType="publisher"
         />
      </Card>
   );
}
