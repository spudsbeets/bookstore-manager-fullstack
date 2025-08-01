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
import { Search, Plus, Eye, Edit, Trash2, Tags } from "lucide-react";
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

interface BookGenre {
   bookGenreID: number;
   bookID: number;
   genreID: number;
   genreName?: string; // For display purposes
   bookTitle?: string; // For display purposes
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
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [bookGenreToDelete, setBookGenreToDelete] = useState<BookGenre | null>(
      null
   );
   const [isDeleting, setIsDeleting] = useState(false);

   // Sample data for book genres
   const sampleBookGenres: BookGenre[] = [
      {
         bookGenreID: 1,
         bookID: bookID,
         genreID: 1,
         genreName: "Postmodern Fiction",
         bookTitle: "Beloved",
      },
      {
         bookGenreID: 2,
         bookID: bookID,
         genreID: 2,
         genreName: "Historical Fiction",
         bookTitle: "Beloved",
      },
   ];

   useEffect(() => {
      const fetchBookGenres = async () => {
         setIsLoading(true);
         try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setBookGenres(sampleBookGenres);
         } catch (error) {
            console.error("Error fetching book genres:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookGenres();
   }, [bookID]);

   const filteredBookGenres = bookGenres.filter(
      (bookGenre) =>
         bookGenre.genreName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         bookGenre.bookGenreID.toString().includes(searchTerm)
   );

   const handleDelete = async (bookGenre: BookGenre) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setBookGenres(
            bookGenres.filter((bg) => bg.bookGenreID !== bookGenre.bookGenreID)
         );
         if (onDelete) {
            onDelete(bookGenre);
         }
      } catch (error) {
         console.error("Error deleting book genre:", error);
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
               <div className="text-center py-8 text-muted-foreground">
                  Loading book genres...
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
                              <p>Add an existing genre to this book</p>
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
                                 <Plus className="h-4 w-4" />
                                 Add Genre
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Create a new genre record</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               {/* Search Bar */}
               <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Search genres..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                     />
                  </div>
               </div>

               {/* Book Genres Table */}
               <div className="rounded-md border">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>ID</TableHead>
                           <TableHead>Genre</TableHead>
                           <TableHead>Book</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredBookGenres.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={4}
                                 className="text-center py-8"
                              >
                                 <div className="text-muted-foreground">
                                    No genres found for this book.
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredBookGenres.map((bookGenre) => (
                              <TableRow key={bookGenre.bookGenreID}>
                                 <TableCell>
                                    <Badge variant="secondary">
                                       #{bookGenre.bookGenreID}
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="font-medium">
                                    <HoverCard>
                                       <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer">
                                             <Tags className="h-4 w-4 text-muted-foreground" />
                                             {bookGenre.genreName}
                                          </div>
                                       </HoverCardTrigger>
                                       <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                             <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                   {bookGenre.genreName}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                   Genre ID: {bookGenre.genreID}
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
                                 <TableCell>{bookGenre.bookTitle}</TableCell>
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
               itemName={bookGenreToDelete?.genreName || ""}
               itemType="book genre"
            />
         </Card>
      </TooltipProvider>
   );
}
