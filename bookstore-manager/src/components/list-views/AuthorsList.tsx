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
   PenTool,
   MoreHorizontal,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import AuthorsService from "@/services/AuthorsService";

interface Author {
   authorID: number;
   firstName: string;
   middleName: string | null;
   lastName: string | null;
   fullName: string;
}

interface AuthorsListProps {
   onView?: (author: Author) => void;
   onEdit?: (author: Author) => void;
   onDelete?: (author: Author) => void;
   onCreate?: () => void;
}

export function AuthorsList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: AuthorsListProps) {
   const [authors, setAuthors] = useState<Author[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchAuthors = async () => {
         setIsLoading(true);
         try {
            const response = await AuthorsService.getAll();
            setAuthors(response.data);
         } catch (error) {
            console.error("Error fetching authors:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchAuthors();
   }, []);

   const filteredAuthors = authors.filter(
      (author) =>
         author.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         author.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         author.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         author.middleName?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleDelete = async (author: Author) => {
      setIsDeleting(true);
      try {
         await AuthorsService.remove(author.authorID);
         setAuthors(authors.filter((a) => a.authorID !== author.authorID));
         if (onDelete) {
            onDelete(author);
         }
      } catch (error) {
         console.error("Error deleting author:", error);
      } finally {
         setIsDeleting(false);
         setAuthorToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Authors</CardTitle>
               <CardDescription>Loading authors...</CardDescription>
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
                     <PenTool className="h-5 w-5" />
                     Authors
                  </CardTitle>
                  <CardDescription>
                     Manage your bookstore's authors ({authors.length} total)
                  </CardDescription>
               </div>
               <Button onClick={onCreate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Author
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            {/* Search Bar */}
            <div className="flex items-center space-x-2 mb-4">
               <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search authors by name..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
            </div>

            {/* Authors Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredAuthors.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={3} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No authors found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredAuthors.map((author) => (
                           <TableRow key={author.authorID}>
                              <TableCell className="font-medium">
                                 {author.authorID}
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {author.fullName}
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                    {author.firstName} {author.middleName}{" "}
                                    {author.lastName}
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
                                             onClick={() => onView(author)}
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() => onEdit(author)}
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() =>
                                             setAuthorToDelete(author)
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
            isOpen={!!authorToDelete}
            onOpenChange={() => setAuthorToDelete(null)}
            onConfirm={() => authorToDelete && handleDelete(authorToDelete)}
            isDeleting={isDeleting}
            itemName={authorToDelete?.fullName || ""}
            itemType="author"
         />
      </Card>
   );
}
