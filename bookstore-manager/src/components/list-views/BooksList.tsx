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
   Settings,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuCheckboxItem,
   DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import BooksService, { type Book } from "@/services/BooksService";
import BookAuthorsService from "@/services/BookAuthorsService";
import BookGenresService from "@/services/BookGenresService";

// Use the actual Book type from the API
type BookDisplay = Book;

// Column configuration
interface ColumnConfig {
   key: keyof BookDisplay;
   label: string;
   visible: boolean;
   sortable: boolean;
   searchable: boolean;
}

const defaultColumns: ColumnConfig[] = [
   {
      key: "bookID",
      label: "ID",
      visible: true,
      sortable: true,
      searchable: false,
   },
   {
      key: "title",
      label: "Title",
      visible: true,
      sortable: true,
      searchable: true,
   },
   {
      key: "publisher",
      label: "Publisher",
      visible: true,
      sortable: true,
      searchable: true,
   },
   {
      key: "authors",
      label: "Authors",
      visible: true,
      sortable: false,
      searchable: true,
   },
   {
      key: "genres",
      label: "Genres",
      visible: true,
      sortable: false,
      searchable: true,
   },
   {
      key: "price",
      label: "Price",
      visible: true,
      sortable: true,
      searchable: false,
   },
   {
      key: "inventoryQty",
      label: "Stock",
      visible: true,
      sortable: true,
      searchable: false,
   },
   {
      key: "publicationDate",
      label: "Published",
      visible: false,
      sortable: true,
      searchable: false,
   },
   {
      key: "isbn-10",
      label: "ISBN-10",
      visible: false,
      sortable: false,
      searchable: true,
   },
   {
      key: "isbn-13",
      label: "ISBN-13",
      visible: false,
      sortable: false,
      searchable: true,
   },
];

interface BooksListProps {
   onView?: (book: BookDisplay) => void;
   onEdit?: (book: BookDisplay) => void;
   onDelete?: (book: BookDisplay) => void;
   onCreate?: () => void;
}

export function BooksList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: BooksListProps) {
   const [books, setBooks] = useState<BookDisplay[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [bookToDelete, setBookToDelete] = useState<BookDisplay | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);
   const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
   const [sortColumn, setSortColumn] = useState<keyof BookDisplay | null>(null);
   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
   const [bookAuthors, setBookAuthors] = useState<{ [bookId: number]: any[] }>(
      {}
   );
   const [bookGenres, setBookGenres] = useState<{ [bookId: number]: any[] }>(
      {}
   );

   useEffect(() => {
      const fetchBooks = async () => {
         setIsLoading(true);
         try {
            const response = await BooksService.getAll();
            console.log("Books API response:", response.data);
            setBooks(response.data);

            // Fetch book authors and genres for each book
            const authorsMap: { [bookId: number]: any[] } = {};
            const genresMap: { [bookId: number]: any[] } = {};

            for (const book of response.data) {
               try {
                  const authorsResponse = await BookAuthorsService.getByBookId(
                     book.bookID
                  );
                  authorsMap[book.bookID] = authorsResponse.data;

                  const genresResponse = await BookGenresService.getByBookId(
                     book.bookID
                  );
                  genresMap[book.bookID] = genresResponse.data;
               } catch (error) {
                  console.error(
                     `Error fetching relationships for book ${book.bookID}:`,
                     error
                  );
                  authorsMap[book.bookID] = [];
                  genresMap[book.bookID] = [];
               }
            }

            setBookAuthors(authorsMap);
            setBookGenres(genresMap);
         } catch (error) {
            console.error("Error fetching books:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBooks();
   }, []);

   // Enhanced filtering with multiple criteria
   const filteredBooks = books.filter((book) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
         book.title.toLowerCase().includes(searchLower) ||
         book.publisher?.toLowerCase().includes(searchLower) ||
         book.authors?.toLowerCase().includes(searchLower) ||
         book.genres?.toLowerCase().includes(searchLower) ||
         book["isbn-10"]?.includes(searchTerm) ||
         book["isbn-13"]?.includes(searchTerm) ||
         book.bookID.toString().includes(searchTerm)
      );
   });

   // Sorting functionality
   const sortedBooks = [...filteredBooks].sort((a, b) => {
      if (!sortColumn) return 0;

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
         comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
         comparison = aValue - bValue;
      } else {
         comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
   });

   const handleSort = (column: keyof BookDisplay) => {
      if (sortColumn === column) {
         setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
         setSortColumn(column);
         setSortDirection("asc");
      }
   };

   const toggleColumn = (columnKey: keyof BookDisplay) => {
      setColumns((prev) =>
         prev.map((col) =>
            col.key === columnKey ? { ...col, visible: !col.visible } : col
         )
      );
   };

   // Render cell content based on column type
   const renderCell = (book: BookDisplay, columnKey: keyof BookDisplay) => {
      const value = book[columnKey];

      switch (columnKey) {
         case "bookID":
            return <span className="font-medium">{value}</span>;

         case "title":
            return (
               <div>
                  <div className="font-medium">{value}</div>
                  {book.publicationDate && (
                     <div className="text-sm text-muted-foreground">
                        {formatDate(book.publicationDate)}
                     </div>
                  )}
               </div>
            );

         case "price":
            return (
               <span className="font-medium">
                  {formatPrice(parseFloat(value as string))}
               </span>
            );

         case "inventoryQty":
            const qty = value as number;
            return (
               <Badge variant={qty > 0 ? "default" : "secondary"}>
                  {qty > 0 ? "In Stock" : "Out of Stock"}
               </Badge>
            );

         case "authors":
            const authors = bookAuthors[book.bookID] || [];
            if (authors.length === 0) {
               return <span className="text-muted-foreground">—</span>;
            }

            return (
               <div className="flex flex-wrap gap-1 max-w-xs">
                  {authors.slice(0, 2).map((author, index) => (
                     <Badge key={index} variant="secondary" className="text-xs">
                        {author.author}
                     </Badge>
                  ))}
                  {authors.length > 2 && (
                     <Badge variant="outline" className="text-xs">
                        +{authors.length - 2} more
                     </Badge>
                  )}
               </div>
            );

         case "genres":
            const genres = bookGenres[book.bookID] || [];
            if (genres.length === 0) {
               return <span className="text-muted-foreground">—</span>;
            }

            return (
               <div className="flex flex-wrap gap-1 max-w-xs">
                  {genres.slice(0, 2).map((genre, index) => (
                     <Badge key={index} variant="secondary" className="text-xs">
                        {genre.genre}
                     </Badge>
                  ))}
                  {genres.length > 2 && (
                     <Badge variant="outline" className="text-xs">
                        +{genres.length - 2} more
                     </Badge>
                  )}
               </div>
            );

         case "publicationDate":
            return value ? formatDate(value as string) : "—";

         case "isbn-10":
         case "isbn-13":
            return value ? (
               <code className="text-sm bg-muted px-1 py-0.5 rounded">
                  {value}
               </code>
            ) : (
               <span className="text-muted-foreground">—</span>
            );

         default:
            return value ? String(value) : "—";
      }
   };

   const handleDelete = async (book: BookDisplay) => {
      setIsDeleting(true);
      try {
         await BooksService.remove(book.bookID);
         setBooks(books.filter((b) => b.bookID !== book.bookID));
         if (onDelete) {
            onDelete(book);
         }
      } catch (error) {
         console.error("Error deleting book:", error);
         // You might want to show an error message to the user here
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
            {/* Search and Controls Bar */}
            <div className="flex items-center justify-between mb-4">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search books by title, publisher, authors, genres, or ISBN..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>

               {/* Column Customization */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                     >
                        <Settings className="h-4 w-4" />
                        Customize Columns
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                     <DropdownMenuItem disabled className="text-sm font-medium">
                        Show/Hide Columns
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     {columns.map((column) => (
                        <DropdownMenuCheckboxItem
                           key={column.key}
                           checked={column.visible}
                           onCheckedChange={() => toggleColumn(column.key)}
                        >
                           {column.label}
                        </DropdownMenuCheckboxItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-muted-foreground mb-4">
               Showing {sortedBooks.length} of {books.length} books
               {searchTerm && ` matching "${searchTerm}"`}
            </div>

            {/* Books Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        {columns.map(
                           (column) =>
                              column.visible && (
                                 <TableHead
                                    key={column.key}
                                    className={
                                       column.sortable
                                          ? "cursor-pointer hover:bg-muted"
                                          : ""
                                    }
                                    onClick={() =>
                                       column.sortable && handleSort(column.key)
                                    }
                                 >
                                    <div className="flex items-center gap-1">
                                       {column.label}
                                       {column.sortable &&
                                          sortColumn === column.key && (
                                             <span className="text-xs">
                                                {sortDirection === "asc"
                                                   ? "↑"
                                                   : "↓"}
                                             </span>
                                          )}
                                    </div>
                                 </TableHead>
                              )
                        )}
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {sortedBooks.length === 0 ? (
                        <TableRow>
                           <TableCell
                              colSpan={
                                 columns.filter((c) => c.visible).length + 1
                              }
                              className="text-center py-8"
                           >
                              <div className="text-muted-foreground">
                                 {searchTerm
                                    ? "No books found matching your search."
                                    : "No books found."}
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        sortedBooks.map((book) => (
                           <TableRow key={book.bookID}>
                              {columns.map(
                                 (column) =>
                                    column.visible && (
                                       <TableCell key={column.key}>
                                          {renderCell(book, column.key)}
                                       </TableCell>
                                    )
                              )}
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
