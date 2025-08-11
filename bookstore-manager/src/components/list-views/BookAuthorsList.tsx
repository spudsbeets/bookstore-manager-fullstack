"use client";

import { useState, useEffect } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
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
import { User, Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Services
import BookAuthorsService from "@/services/BookAuthorsService";

interface BookAuthor {
   bookAuthorID: number;
   title: string;
   author: string;
}

interface BookAuthorsListProps {
   bookID: number;
   onView?: (bookAuthor: BookAuthor) => void;
   onEdit?: (bookAuthor: BookAuthor) => void;
   onDelete?: (bookAuthor: BookAuthor) => void;
   onAdd?: () => void;
   onCreateAuthor?: () => void; // New prop for creating authors
}

export function BookAuthorsList({
   bookID,
   onView,
   onEdit,
   onDelete,
   onAdd,
   onCreateAuthor,
}: BookAuthorsListProps) {
   const [bookAuthors, setBookAuthors] = useState<BookAuthor[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [bookAuthorToDelete, setBookAuthorToDelete] =
      useState<BookAuthor | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchBookAuthors = async () => {
         setIsLoading(true);
         try {
            // If bookID is 0, get all book authors (for the main Book Authors page)
            // If bookID is > 0, get only book authors for that specific book
            const response =
               bookID > 0
                  ? await BookAuthorsService.getByBookId(bookID)
                  : await BookAuthorsService.getAll();
            setBookAuthors(response.data);
         } catch (error) {
            console.error("Error fetching book authors:", error);
            toast.error("Failed to load book authors", {
               description:
                  "There was an error loading the book authors. Please try again.",
               duration: 30000,
               dismissible: true,
            });
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookAuthors();
   }, [bookID]);

   const filteredBookAuthors = bookAuthors.filter(
      (bookAuthor) =>
         bookAuthor.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         bookAuthor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         bookAuthor.bookAuthorID?.toString().includes(searchTerm)
   );

   const handleDelete = async (bookAuthor: BookAuthor) => {
      setIsDeleting(true);
      try {
         await BookAuthorsService.remove(bookAuthor.bookAuthorID);
         setBookAuthors(
            bookAuthors.filter(
               (ba) => ba.bookAuthorID !== bookAuthor.bookAuthorID
            )
         );
         toast.success("Book author relationship deleted successfully!", {
            description: `${bookAuthor.author} has been removed from ${bookAuthor.title}.`,
         });
         if (onDelete) {
            onDelete(bookAuthor);
         }
      } catch (error) {
         console.error("Error deleting book author:", error);
         toast.error("Failed to delete book author relationship", {
            description:
               "There was an error deleting the relationship. Please try again.",
            duration: 30000,
            dismissible: true,
         });
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
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
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
                  <div className="flex gap-2">
                     {onAdd && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button
                                 onClick={onAdd}
                                 className="flex items-center gap-2"
                              >
                                 <Plus className="h-4 w-4" />
                                 Add Author to Book
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Add a new author to this book</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                     {onCreateAuthor && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button
                                 onClick={onCreateAuthor}
                                 variant="outline"
                                 className="flex items-center gap-2"
                              >
                                 <User className="h-4 w-4" />
                                 Add Author
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Create a new author</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                     <Input
                        placeholder="Search book authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                     />
                  </div>

                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Author</TableHead>
                           <TableHead>Book</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredBookAuthors.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={3}
                                 className="text-center py-8"
                              >
                                 <div className="text-muted-foreground">
                                    {searchTerm
                                       ? "No book authors found matching your search."
                                       : "No book authors found."}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredBookAuthors.map((bookAuthor) => (
                              <TableRow key={bookAuthor.bookAuthorID}>
                                 <TableCell>
                                    <HoverCard>
                                       <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer">
                                             <User className="h-4 w-4 text-muted-foreground" />
                                             {bookAuthor.author}
                                          </div>
                                       </HoverCardTrigger>
                                       <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                             <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                   {bookAuthor.author}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                   Book: {bookAuthor.title}
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
                                 <TableCell>{bookAuthor.title}</TableCell>
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
               itemName={bookAuthorToDelete?.author || ""}
               itemType="book author"
            />
         </Card>
      </TooltipProvider>
   );
}
