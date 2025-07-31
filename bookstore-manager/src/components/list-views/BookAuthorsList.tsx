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
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Trash2, User } from "lucide-react";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface BookAuthor {
   bookAuthorID: number;
   authorID: number;
   bookID: number;
   authorName?: string; // For display purposes
   bookTitle?: string; // For display purposes
}

interface BookAuthorsListProps {
   bookID: number;
   onView?: (bookAuthor: BookAuthor) => void;
   onEdit?: (bookAuthor: BookAuthor) => void;
   onDelete?: (bookAuthor: BookAuthor) => void;
   onAdd?: () => void;
}

export function BookAuthorsList({
   bookID,
   onView,
   onEdit,
   onDelete,
   onAdd,
}: BookAuthorsListProps) {
   const [bookAuthors, setBookAuthors] = useState<BookAuthor[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [bookAuthorToDelete, setBookAuthorToDelete] =
      useState<BookAuthor | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   // Sample data for book authors
   const sampleBookAuthors: BookAuthor[] = [
      {
         bookAuthorID: 1,
         authorID: 1,
         bookID: bookID,
         authorName: "Toni Morrison",
         bookTitle: "Beloved",
      },
      {
         bookAuthorID: 2,
         authorID: 2,
         bookID: bookID,
         authorName: "Thomas Pynchon",
         bookTitle: "Inherent Vice",
      },
   ];

   useEffect(() => {
      const fetchBookAuthors = async () => {
         setIsLoading(true);
         try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setBookAuthors(sampleBookAuthors);
         } catch (error) {
            console.error("Error fetching book authors:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookAuthors();
   }, [bookID]);

   const filteredBookAuthors = bookAuthors.filter(
      (bookAuthor) =>
         bookAuthor.authorName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         bookAuthor.bookAuthorID.toString().includes(searchTerm)
   );

   const handleDelete = async (bookAuthor: BookAuthor) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setBookAuthors(
            bookAuthors.filter(
               (ba) => ba.bookAuthorID !== bookAuthor.bookAuthorID
            )
         );
         if (onDelete) {
            onDelete(bookAuthor);
         }
      } catch (error) {
         console.error("Error deleting book author:", error);
      } finally {
         setIsDeleting(false);
         setBookAuthorToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Book Authors</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8 text-muted-foreground">
                  Loading book authors...
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <TooltipProvider>
         <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Book Authors</CardTitle>
                     <CardDescription>
                        Authors for this book ({bookAuthors.length} total)
                     </CardDescription>
                  </div>
                  {onAdd && (
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button
                              onClick={onAdd}
                              className="flex items-center gap-2"
                           >
                              <Plus className="h-4 w-4" />
                              Add Author
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Add a new author to this book</p>
                        </TooltipContent>
                     </Tooltip>
                  )}
               </div>
            </CardHeader>
            <CardContent>
               {/* Search Bar */}
               <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Search authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                     />
                  </div>
               </div>

               {/* Book Authors Table */}
               <div className="rounded-md border">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>ID</TableHead>
                           <TableHead>Author</TableHead>
                           <TableHead>Book</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredBookAuthors.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={4}
                                 className="text-center py-8"
                              >
                                 <div className="text-muted-foreground">
                                    No authors found for this book.
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredBookAuthors.map((bookAuthor) => (
                              <TableRow key={bookAuthor.bookAuthorID}>
                                 <TableCell>
                                    <Badge variant="secondary">
                                       #{bookAuthor.bookAuthorID}
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="font-medium">
                                    <HoverCard>
                                       <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer">
                                             <User className="h-4 w-4 text-muted-foreground" />
                                             {bookAuthor.authorName}
                                          </div>
                                       </HoverCardTrigger>
                                       <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                             <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                   {bookAuthor.authorName}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                   Author ID:{" "}
                                                   {bookAuthor.authorID}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                   Book Author ID:{" "}
                                                   {bookAuthor.bookAuthorID}
                                                </p>
                                             </div>
                                          </div>
                                       </HoverCardContent>
                                    </HoverCard>
                                 </TableCell>
                                 <TableCell>{bookAuthor.bookTitle}</TableCell>
                                 <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       {onView && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() =>
                                                      onView(bookAuthor)
                                                   }
                                                >
                                                   <Eye className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>View author details</p>
                                             </TooltipContent>
                                          </Tooltip>
                                       )}
                                       {onEdit && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() =>
                                                      onEdit(bookAuthor)
                                                   }
                                                >
                                                   <Edit className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>Edit author</p>
                                             </TooltipContent>
                                          </Tooltip>
                                       )}
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                   setBookAuthorToDelete(
                                                      bookAuthor
                                                   )
                                                }
                                                className="text-destructive hover:text-destructive"
                                             >
                                                <Trash2 className="h-4 w-4" />
                                             </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             <p>Delete author</p>
                                          </TooltipContent>
                                       </Tooltip>
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
               isOpen={!!bookAuthorToDelete}
               onOpenChange={() => setBookAuthorToDelete(null)}
               onConfirm={() =>
                  bookAuthorToDelete && handleDelete(bookAuthorToDelete)
               }
               isDeleting={isDeleting}
               itemName={bookAuthorToDelete?.authorName || ""}
               itemType="book author"
            />
         </Card>
      </TooltipProvider>
   );
}
