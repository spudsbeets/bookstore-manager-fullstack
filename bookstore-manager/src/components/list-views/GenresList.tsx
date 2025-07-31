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
   Tags,
   MoreHorizontal,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Genre {
   genreID: number;
   genreName: string;
}

// Sample data - replace with actual API calls
const sampleGenres: Genre[] = [
   { genreID: 1, genreName: "Postmodern Fiction" },
   { genreID: 2, genreName: "Historical Fiction" },
   { genreID: 3, genreName: "Horror Fiction" },
   { genreID: 4, genreName: "Science Fiction" },
   { genreID: 5, genreName: "Fantasy Fiction" },
];

interface GenresListProps {
   onView?: (genre: Genre) => void;
   onEdit?: (genre: Genre) => void;
   onDelete?: (genre: Genre) => void;
   onCreate?: () => void;
}

export function GenresList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: GenresListProps) {
   const [genres, setGenres] = useState<Genre[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      // Simulate API call
      const fetchGenres = async () => {
         setIsLoading(true);
         try {
            // Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setGenres(sampleGenres);
         } catch (error) {
            console.error("Error fetching genres:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchGenres();
   }, []);

   const filteredGenres = genres.filter((genre) =>
      genre.genreName.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleDelete = async (genre: Genre) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setGenres(genres.filter((g) => g.genreID !== genre.genreID));
         if (onDelete) {
            onDelete(genre);
         }
      } catch (error) {
         console.error("Error deleting genre:", error);
      } finally {
         setIsDeleting(false);
         setGenreToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Genres</CardTitle>
               <CardDescription>Loading genres...</CardDescription>
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
                     <Tags className="h-5 w-5" />
                     Genres
                  </CardTitle>
                  <CardDescription>
                     Manage your bookstore's book genres ({genres.length} total)
                  </CardDescription>
               </div>
               <Button onClick={onCreate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Genre
               </Button>
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

            {/* Genres Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Genre Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredGenres.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={3} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No genres found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredGenres.map((genre) => (
                           <TableRow key={genre.genreID}>
                              <TableCell className="font-medium">
                                 {genre.genreID}
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {genre.genreName}
                                 </div>
                              </TableCell>
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
                                             onClick={() => onView(genre)}
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() => onEdit(genre)}
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() =>
                                             setGenreToDelete(genre)
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
            isOpen={!!genreToDelete}
            onOpenChange={() => setGenreToDelete(null)}
            onConfirm={() => genreToDelete && handleDelete(genreToDelete)}
            isDeleting={isDeleting}
            itemName={genreToDelete?.genreName || ""}
            itemType="genre"
         />
      </Card>
   );
}
