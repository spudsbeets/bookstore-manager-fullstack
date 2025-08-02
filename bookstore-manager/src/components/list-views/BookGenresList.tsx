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
import { Tag, Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Services
import BookGenresService from "@/services/BookGenresService";

interface BookGenre {
   bookGenreID: number;
   title: string;
   genre: string;
}

interface BookGenresListProps {
   bookID: number;
   onView?: (bookGenre: BookGenre) => void;
   onEdit?: (bookGenre: BookGenre) => void;
   onDelete?: (bookGenre: BookGenre) => void;
   onAdd?: () => void;
   onCreateGenre?: () => void; // New prop for creating genres
}

export function BookGenresList({
   bookID,
   onView,
   onEdit,
   onDelete,
   onAdd,
   onCreateGenre,
}: BookGenresListProps) {
   const [bookGenres, setBookGenres] = useState<BookGenre[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [bookGenreToDelete, setBookGenreToDelete] = useState<BookGenre | null>(
      null
   );
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchBookGenres = async () => {
         setIsLoading(true);
         try {
            // If bookID is 0, get all book genres (for the main Book Genres page)
            // If bookID is > 0, get only book genres for that specific book
            const response =
               bookID > 0
                  ? await BookGenresService.getByBookId(bookID)
                  : await BookGenresService.getAll();
            setBookGenres(response.data);
         } catch (error) {
            console.error("Error fetching book genres:", error);
            toast.error("Failed to load book genres", {
               description:
                  "There was an error loading the book genres. Please try again.",
               duration: Infinity,
            });
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookGenres();
   }, [bookID]);

   const filteredBookGenres = bookGenres.filter(
      (bookGenre) =>
         bookGenre.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         bookGenre.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         bookGenre.bookGenreID.toString().includes(searchTerm)
   );

   const handleDelete = async (bookGenre: BookGenre) => {
      setIsDeleting(true);
      try {
         await BookGenresService.remove(bookGenre.bookGenreID);
         setBookGenres(
            bookGenres.filter((bg) => bg.bookGenreID !== bookGenre.bookGenreID)
         );
         toast.success("Book genre relationship deleted successfully!", {
            description: `${bookGenre.genre} has been removed from ${bookGenre.title}.`,
         });
         if (onDelete) {
            onDelete(bookGenre);
         }
      } catch (error) {
         console.error("Error deleting book genre:", error);
         toast.error("Failed to delete book genre relationship", {
            description:
               "There was an error deleting the relationship. Please try again.",
            duration: Infinity,
         });
      } finally {
         setIsDeleting(false);
         setBookGenreToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Book Genres</CardTitle>
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
                     <CardTitle>Book Genres</CardTitle>
                     <CardDescription>
                        Genres for this book ({bookGenres.length} total)
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
                                 Add Genre to Book
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Add a new genre to this book</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                     {onCreateGenre && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button
                                 onClick={onCreateGenre}
                                 variant="outline"
                                 className="flex items-center gap-2"
                              >
                                 <Tag className="h-4 w-4" />
                                 Add Genre
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Create a new genre</p>
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
                        placeholder="Search book genres..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                     />
                  </div>

                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Genre</TableHead>
                           <TableHead>Book</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredBookGenres.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={3}
                                 className="text-center py-8"
                              >
                                 <div className="text-muted-foreground">
                                    {searchTerm
                                       ? "No book genres found matching your search."
                                       : "No book genres found."}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredBookGenres.map((bookGenre) => (
                              <TableRow key={bookGenre.bookGenreID}>
                                 <TableCell>
                                    <HoverCard>
                                       <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer">
                                             <Tag className="h-4 w-4 text-muted-foreground" />
                                             {bookGenre.genre}
                                          </div>
                                       </HoverCardTrigger>
                                       <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                             <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                   {bookGenre.genre}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                   Book: {bookGenre.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                   Book Genre ID:{" "}
                                                   {bookGenre.bookGenreID}
                                                </p>
                                             </div>
                                          </div>
                                       </HoverCardContent>
                                    </HoverCard>
                                 </TableCell>
                                 <TableCell>{bookGenre.title}</TableCell>
                                 <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       {onView && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() =>
                                                      onView(bookGenre)
                                                   }
                                                >
                                                   <Eye className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>View genre details</p>
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
                                                      onEdit(bookGenre)
                                                   }
                                                >
                                                   <Edit className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>Edit genre</p>
                                             </TooltipContent>
                                          </Tooltip>
                                       )}
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                   setBookGenreToDelete(
                                                      bookGenre
                                                   )
                                                }
                                                className="text-destructive hover:text-destructive"
                                             >
                                                <Trash2 className="h-4 w-4" />
                                             </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             <p>Delete genre</p>
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
               isOpen={!!bookGenreToDelete}
               onOpenChange={() => setBookGenreToDelete(null)}
               onConfirm={() =>
                  bookGenreToDelete && handleDelete(bookGenreToDelete)
               }
               isDeleting={isDeleting}
               itemName={bookGenreToDelete?.genre || ""}
               itemType="book genre"
            />
         </Card>
      </TooltipProvider>
   );
}
