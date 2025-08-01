"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Edit, Eye, Trash2, CalendarIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import BooksService, {
   type Book,
   type CreateBookDTO,
   type UpdateBookDTO,
} from "@/services/BooksService";
import PublishersService from "@/services/PublishersService";
import AuthorsService from "@/services/AuthorsService";
import GenresService from "@/services/GenresService";

const bookSchema = z.object({
   bookID: z.number().optional(),
   title: z.string().min(1, "Title is required"),
   publicationDate: z.string().min(1, "Publication date is required"),
   "isbn-10": z.string().nullable().optional(),
   "isbn-13": z.string().nullable().optional(),
   price: z.string().min(1, "Price is required"),
   inventoryQty: z.number().min(0, "Inventory quantity must be positive"),
   publisher: z.string().nullable().optional(),
   authors: z.string().nullable().optional(),
   genres: z.string().nullable().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

// Data interfaces
interface Publisher {
   publisherID: number;
   publisherName: string;
}

interface Author {
   authorID: number;
   fullName: string;
}

interface Genre {
   genreID: number;
   genreName: string;
}

interface BooksFormProps {
   mode: "create" | "edit" | "view";
   initialData?: Book;
   onSave?: (data: BookFormValues) => void;
   onDelete?: ((book: Book) => void) | (() => void);
}

export function BooksForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: BooksFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [publishers, setPublishers] = useState<Publisher[]>([]);
   const [authors, setAuthors] = useState<Author[]>([]);
   const [genres, setGenres] = useState<Genre[]>([]);
   const [isLoadingData, setIsLoadingData] = useState(true);

   // Fetch publishers, authors, and genres on component mount
   useEffect(() => {
      const fetchData = async () => {
         try {
            const [publishersRes, authorsRes, genresRes] = await Promise.all([
               PublishersService.getAll(),
               AuthorsService.getAll(),
               GenresService.getAll(),
            ]);
            setPublishers(publishersRes.data);
            setAuthors(authorsRes.data);
            setGenres(genresRes.data);
         } catch (error) {
            console.error("Error fetching form data:", error);
            toast.error("Failed to load form data", {
               description: "Please refresh the page and try again.",
            });
         } finally {
            setIsLoadingData(false);
         }
      };

      fetchData();
   }, []);

   const form = useForm<BookFormValues>({
      resolver: zodResolver(bookSchema),
      defaultValues: initialData
         ? {
              ...initialData,
              // Ensure price is a string
              price: initialData.price || "",
              // Ensure publisher is a string
              publisher: initialData.publisher || "",
              // Ensure other nullable fields are strings
              "isbn-10": initialData["isbn-10"] || "",
              "isbn-13": initialData["isbn-13"] || "",
              authors: initialData.authors || "",
              genres: initialData.genres || "",
           }
         : {
              title: "",
              publicationDate: "",
              "isbn-10": "",
              "isbn-13": "",
              price: "",
              inventoryQty: 0,
              publisher: "",
              authors: "",
              genres: "",
           },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: BookFormValues) {
      setIsSubmitting(true);
      try {
         // Transform data to match backend DTO types
         const createData: CreateBookDTO = {
            title: data.title,
            publicationDate: data.publicationDate,
            "isbn-10": data["isbn-10"] || null,
            "isbn-13": data["isbn-13"] || null,
            price: data.price,
            inventoryQty: data.inventoryQty,
            publisherID: data.publisher ? parseInt(data.publisher) : null,
         };

         if (isCreateMode) {
            // Create new book
            await BooksService.create(createData);
         } else if (isEditMode && initialData?.bookID) {
            // Update existing book
            await BooksService.update(initialData.bookID, createData);
         }

         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);

         // Show success toast
         toast.success(
            `Book ${isCreateMode ? "created" : "updated"} successfully!`,
            {
               description: `${data.title} has been ${
                  isCreateMode ? "added to" : "updated in"
               } your catalog.`,
            }
         );
      } catch (error) {
         console.error("Error saving book:", error);
         // Show error toast
         toast.error("Failed to save book", {
            description:
               "There was an error saving the book. Please try again.",
            duration: Infinity,
         });
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.bookID) {
            await BooksService.remove(initialData.bookID);
         }
         if (onDelete && initialData) {
            if (typeof onDelete === "function") {
               onDelete(initialData);
            }
         }

         // Show success toast for deletion
         toast.success("Book deleted successfully!", {
            description: `${initialData?.title} has been removed from your catalog.`,
         });
      } catch (error) {
         console.error("Error deleting book:", error);
         // Show error toast
         toast.error("Failed to delete book", {
            description:
               "There was an error deleting the book. Please try again.",
            duration: Infinity,
         });
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Book";
         case "edit":
            return "Edit Book";
         case "view":
            return "View Book";
         default:
            return "Book";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new book to your bookstore catalog";
         case "edit":
            return "Update book information";
         case "view":
            return "View book details";
         default:
            return "";
      }
   };

   if (isLoadingData) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Loading...</CardTitle>
               <CardDescription>Loading form data...</CardDescription>
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
            <CardTitle className="flex items-center gap-2">
               {mode === "create" && <CheckCircle className="h-5 w-5" />}
               {mode === "edit" && <Edit className="h-5 w-5" />}
               {mode === "view" && <Eye className="h-5 w-5" />}
               {getTitle()}
            </CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
         </CardHeader>
         <CardContent>
            {showSuccess && (
               <Alert className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                     Book {isCreateMode ? "created" : "updated"} successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Book ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.bookID && (
                     <FormField
                        control={form.control}
                        name="bookID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Book ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this book
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Title */}
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Title</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter book title"
                                 {...field}
                                 disabled={isViewMode}
                              />
                           </FormControl>
                           <FormDescription>
                              The title of the book
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Publication Date */}
                  <FormField
                     control={form.control}
                     name="publicationDate"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Publication Date</FormLabel>
                           <FormControl>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="outline"
                                       className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !field.value &&
                                             "text-muted-foreground"
                                       )}
                                       disabled={isViewMode}
                                    >
                                       <CalendarIcon className="mr-2 h-4 w-4" />
                                       {field.value ? (
                                          format(new Date(field.value), "PPP")
                                       ) : (
                                          <span>Pick a date</span>
                                       )}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0">
                                    <Calendar
                                       mode="single"
                                       selected={
                                          field.value
                                             ? new Date(field.value)
                                             : undefined
                                       }
                                       onSelect={(date) => {
                                          field.onChange(
                                             date
                                                ? format(date, "yyyy-MM-dd")
                                                : ""
                                          );
                                       }}
                                       disabled={isViewMode}
                                       initialFocus
                                       captionLayout="dropdown"
                                    />
                                 </PopoverContent>
                              </Popover>
                           </FormControl>
                           <FormDescription>
                              When the book was published
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* ISBN Fields */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="isbn-10"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>ISBN-10</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="ISBN-10"
                                    {...field}
                                    value={field.value || ""}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="isbn-13"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>ISBN-13</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="ISBN-13"
                                    {...field}
                                    value={field.value || ""}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Publisher */}
                  <FormField
                     control={form.control}
                     name="publisher"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Publisher</FormLabel>
                           <FormControl>
                              <SearchableSelect
                                 options={publishers.map((publisher) => ({
                                    value: publisher.publisherID.toString(),
                                    label: publisher.publisherName,
                                 }))}
                                 value={field.value?.toString()}
                                 onValueChange={(value) =>
                                    field.onChange(value)
                                 }
                                 placeholder="Select a publisher"
                                 searchPlaceholder="Search publishers..."
                                 emptyMessage="No publishers found."
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Authors */}
                  <FormField
                     control={form.control}
                     name="authors"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Authors</FormLabel>
                           <FormControl>
                              <SearchableSelect
                                 options={authors.map((author) => ({
                                    value: author.authorID.toString(),
                                    label: author.fullName,
                                 }))}
                                 value={field.value?.toString()}
                                 onValueChange={(value) =>
                                    field.onChange(value)
                                 }
                                 placeholder="Select an author"
                                 searchPlaceholder="Search authors..."
                                 emptyMessage="No authors found."
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Genres */}
                  <FormField
                     control={form.control}
                     name="genres"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Genres</FormLabel>
                           <FormControl>
                              <SearchableSelect
                                 options={genres.map((genre) => ({
                                    value: genre.genreID.toString(),
                                    label: genre.genreName,
                                 }))}
                                 value={field.value?.toString()}
                                 onValueChange={(value) =>
                                    field.onChange(value)
                                 }
                                 placeholder="Select a genre"
                                 searchPlaceholder="Search genres..."
                                 emptyMessage="No genres found."
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Price and Inventory */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={field.value || ""}
                                    onChange={(e) => {
                                       const value = e.target.value;
                                       if (
                                          value === "" ||
                                          /^\d*\.?\d*$/.test(value)
                                       ) {
                                          field.onChange(value);
                                       }
                                    }}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="inventoryQty"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Inventory Quantity</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    value={field.value || ""}
                                    onChange={(e) => {
                                       const value = e.target.value;
                                       if (
                                          value === "" ||
                                          /^\d+$/.test(value)
                                       ) {
                                          field.onChange(
                                             value === ""
                                                ? 0
                                                : parseInt(value) || 0
                                          );
                                       }
                                    }}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Action Buttons */}
                  {!isViewMode && (
                     <div className="flex justify-between">
                        <Button type="submit" disabled={isSubmitting}>
                           {isSubmitting
                              ? "Saving..."
                              : isCreateMode
                              ? "Create Book"
                              : "Update Book"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Book
                           </Button>
                        )}
                     </div>
                  )}
               </form>
            </Form>
         </CardContent>

         {/* Delete Confirmation Dialog */}
         <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            itemName={initialData?.title || ""}
            itemType="book"
         />
      </Card>
   );
}
