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
import {
   Plus,
   Search,
   Edit,
   Eye,
   Trash2,
   BookOpen,
   MoreHorizontal,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Book {
   bookID: number;
   title: string;
   publicationDate: string;
   "isbn-10"?: string;
   "isbn-13"?: string;
   inStock: boolean;
   price: number;
   inventoryQty: number;
   publisherID?: number;
   publisherName?: string;
}

// Sample data - replace with actual API calls
const sampleBooks: Book[] = [
   {
      bookID: 1,
      title: "Inherent Vice",
      publicationDate: "2009-08-04",
      "isbn-10": "0143126850",
      "isbn-13": "9780143126850",
      inStock: true,
      price: 15.99,
      inventoryQty: 5,
      publisherID: 2,
      publisherName: "Penguin Books",
   },
   {
      bookID: 2,
      title: "Beloved",
      publicationDate: "1987-09-01",
      "isbn-10": "1400033416",
      "isbn-13": "9781400033416",
      inStock: true,
      price: 17.99,
      inventoryQty: 7,
      publisherID: 1,
      publisherName: "Vintage International",
   },
   {
      bookID: 3,
      title: "The Talisman",
      publicationDate: "1984-11-08",
      "isbn-10": "0670691992",
      "isbn-13": "9780670691999",
      inStock: true,
      price: 18.99,
      inventoryQty: 6,
      publisherID: 3,
      publisherName: "Viking Press",
   },
   {
      bookID: 4,
      title: "Good Omens",
      publicationDate: "2006-11-28",
      "isbn-10": "0060853980",
      "isbn-13": "9780060853983",
      inStock: true,
      price: 16.99,
      inventoryQty: 8,
      publisherID: 4,
      publisherName: "William Morrow",
   },
];

interface BooksListProps {
   onView?: (book: Book) => void;
   onEdit?: (book: Book) => void;
   onDelete?: (book: Book) => void;
   onCreate?: () => void;
}

export function BooksList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: BooksListProps) {
   const [books, setBooks] = useState<Book[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      // Simulate API call
      const fetchBooks = async () => {
         setIsLoading(true);
         try {
            // Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setBooks(sampleBooks);
         } catch (error) {
            console.error("Error fetching books:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBooks();
   }, []);

   const filteredBooks = books.filter(
      (book) =>
         book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         book.publisherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         book["isbn-10"]?.includes(searchTerm) ||
         book["isbn-13"]?.includes(searchTerm)
   );

   const handleDelete = async (book: Book) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setBooks(books.filter((b) => b.bookID !== book.bookID));
         if (onDelete) {
            onDelete(book);
         }
      } catch (error) {
         console.error("Error deleting book:", error);
      } finally {
         setIsDeleting(false);
         setBookToDelete(null);
      }
   };

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-US", {
         style: "currency",
         currency: "USD",
      }).format(price);
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Books</CardTitle>
               <CardDescription>Loading books...</CardDescription>
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
                     <BookOpen className="h-5 w-5" />
                     Books
                  </CardTitle>
                  <CardDescription>
                     Manage your bookstore's book catalog ({books.length} total)
                  </CardDescription>
               </div>
               <Button onClick={onCreate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Book
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            {/* Search Bar */}
            <div className="flex items-center space-x-2 mb-4">
               <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search books by title, publisher, or ISBN..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
            </div>

            {/* Books Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Publisher</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredBooks.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={6} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No books found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredBooks.map((book) => (
                           <TableRow key={book.bookID}>
                              <TableCell className="font-medium">
                                 {book.bookID}
                              </TableCell>
                              <TableCell>
                                 <div>
                                    <div className="font-medium">
                                       {book.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                       {formatDate(book.publicationDate)}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>{book.publisherName}</TableCell>
                              <TableCell>{formatPrice(book.price)}</TableCell>
                              <TableCell>
                                 <Badge
                                    variant={
                                       book.inStock ? "default" : "secondary"
                                    }
                                 >
                                    {book.inStock ? "In Stock" : "Out of Stock"}
                                 </Badge>
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
                                             onClick={() => onView(book)}
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() => onEdit(book)}
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() => setBookToDelete(book)}
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
            isOpen={!!bookToDelete}
            onOpenChange={() => setBookToDelete(null)}
            onConfirm={() => bookToDelete && handleDelete(bookToDelete)}
            isDeleting={isDeleting}
            itemName={bookToDelete?.title || ""}
            itemType="book"
         />
      </Card>
   );
}
