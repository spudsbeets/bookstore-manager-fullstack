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
import { Plus, Search, Edit, Eye, Trash2, Building2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import PublishersService from "@/services/PublishersService";

interface Publisher {
   publisherID: number;
   publisherName: string;
}

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
      const fetchPublishers = async () => {
         setIsLoading(true);
         try {
            const response = await PublishersService.getAll();
            setPublishers(response.data);
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
         await PublishersService.remove(publisher.publisherID);
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
                                 <div className="flex items-center justify-end gap-2">
                                    {onView && (
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => onView(publisher)}
                                          className="h-8 w-8 p-0"
                                       >
                                          <Eye className="h-4 w-4" />
                                       </Button>
                                    )}
                                    {onEdit && (
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => onEdit(publisher)}
                                          className="h-8 w-8 p-0"
                                       >
                                          <Edit className="h-4 w-4" />
                                       </Button>
                                    )}
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() =>
                                          setPublisherToDelete(publisher)
                                       }
                                       className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
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
