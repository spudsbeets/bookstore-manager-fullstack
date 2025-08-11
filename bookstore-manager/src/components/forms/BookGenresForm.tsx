/**
 * @date August 4, 2025
 * @based_on The form architecture from a CS 361 inventory application project. This includes the use of shadcn/ui components, TypeScript, Zod for schema validation, and React Hook Form for state management.
 *
 * @degree_of_originality The foundational pattern for creating forms—defining a Zod schema, using the zodResolver with react-hook-form, and composing the UI with shadcn/ui components—is adapted from the prior project. However, each form's specific schema, fields, and submission logic have been developed uniquely for this application's requirements.
 *
 * @source_url N/A - Based on a prior personal project for CS 361.
 *
 * @ai_tool_usage The form components were scaffolded using Cursor, an AI code editor, based on the established architecture and the specific data model for each page. The generated code was then refined and customized.
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Loader2, Trash2 } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";

// Services
import BookGenresService from "@/services/BookGenresService";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

const bookGenreSchema = z.object({
   title: z.string().min(1, "Book title is required"),
   genre: z.string().min(1, "Genre is required"),
});

type BookGenreFormData = z.infer<typeof bookGenreSchema>;

interface BookGenresFormProps {
   mode: "create" | "edit" | "view";
   bookID: number;
   initialData?: any;
   onSave: (data: BookGenreFormData) => void;
   onDelete?: () => void;
}

export function BookGenresForm({
   mode,
   bookID,
   initialData,
   onSave,
   onDelete,
}: BookGenresFormProps) {
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [currentBook, setCurrentBook] = useState<any | null>(null);
   const [genres, setGenres] = useState<any[]>([]);
   const [booksResult, setBooksResult] = useState<any>(null);

   const form = useForm<BookGenreFormData>({
      resolver: zodResolver(bookGenreSchema),
      defaultValues: initialData
         ? {
              title: initialData.title || "",
              genre: initialData.genre || "",
           }
         : {
              title: "",
              genre: "",
           },
   });

   // Update form values when initialData changes
   useEffect(() => {
      if (initialData) {
         form.setValue("title", initialData.title || "");
         form.setValue("genre", initialData.genre || "");
      }
   }, [initialData, form]);

   // Update form values when initialData changes (for edit mode)
   useEffect(() => {
      if (initialData && (mode === "edit" || mode === "view")) {
         form.setValue("title", initialData.title || "");
         form.setValue("genre", initialData.genre || "");
      }
   }, [initialData, mode, form]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch books and genres for dropdowns
            const [booksResponse, genresResult] = await Promise.all([
               BookGenresService.getBooksForDropdown(),
               BookGenresService.getGenresForDropdown(),
            ]);

            setBooksResult(booksResponse);

            // Set current book if bookID is provided
            if (bookID > 0) {
               const currentBook = booksResponse.data.find(
                  (book) => book.bookID === bookID
               );
               setCurrentBook(currentBook);

               // For edit mode, use the initialData values
               if (initialData) {
                  form.setValue("title", initialData.title || "");
                  form.setValue("genre", initialData.genre || "");
               } else if (currentBook) {
                  // For create mode, use the current book
                  form.setValue("title", currentBook.title);
               }
            }

            setGenres(genresResult.data);
         } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load form data", {
               description: "Please refresh the page and try again.",
            });
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, [bookID, initialData, form]);

   const onSubmit = async (data: BookGenreFormData) => {
      setIsSubmitting(true);
      try {
         // Find the selected genre's name for display
         const selectedGenre = genres.find(
            (genre) => genre.genreID.toString() === data.genre
         );
         const genreName = selectedGenre?.genreName || data.genre;

         if (mode === "create") {
            // Create new book-genre relationship
            await BookGenresService.create({
               bookID: bookID,
               genreID: parseInt(data.genre), // Convert string genreID to number
            });
            toast.success("Book genre relationship created successfully!", {
               description: `${genreName} has been added to ${data.title}.`,
            });
         } else if (mode === "edit" && initialData?.bookGenreID) {
            // Update existing book-genre relationship
            await BookGenresService.update(initialData.bookGenreID, {
               bookID: bookID,
               genreID: parseInt(data.genre), // Convert string genreID to number
            });
            toast.success("Book genre relationship updated successfully!", {
               description: `${genreName} has been updated for ${data.title}.`,
            });
         }

         onSave(data);
      } catch (error: any) {
         console.error("Error saving book genre:", error);

         // Check if it's a duplicate relationship error
         if (error.response?.status === 409) {
            const errorData = error.response.data;
            toast.error(
               errorData.error || "Book genre relationship already exists",
               {
                  description:
                     errorData.suggestion ||
                     "Please choose a different genre or book.",
                  duration: 30000,
                  dismissible: true,
               }
            );
         } else {
            toast.error("Failed to save book genre relationship", {
               description:
                  "There was an error saving the relationship. Please try again.",
               duration: 30000,
               dismissible: true,
            });
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = async () => {
      if (!onDelete || !initialData?.bookGenreID) return;

      setIsDeleting(true);
      try {
         await BookGenresService.remove(initialData.bookGenreID);
         toast.success("Book genre relationship deleted successfully!", {
            description: `${initialData.genre} has been removed from ${initialData.title}.`,
         });
         onDelete();
      } catch (error) {
         console.error("Error deleting book genre:", error);
         toast.error("Failed to delete book genre relationship", {
            description:
               "There was an error deleting the relationship. Please try again.",
            duration: 30000,
            dismissible: true,
         });
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   };

   if (isLoading) {
      return (
         <div className="max-w-2xl mx-auto space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Tag className="h-5 w-5" />
                     Loading...
                  </CardTitle>
                  <CardDescription>
                     Loading book and genre data...
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
               </CardContent>
            </Card>
         </div>
      );
   }

   // Don't render form if data isn't loaded yet
   if (!booksResult?.data || genres.length === 0) {
      return (
         <div className="max-w-2xl mx-auto space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Tag className="h-5 w-5" />
                     Loading Data...
                  </CardTitle>
                  <CardDescription>
                     Please wait while we load the form data...
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="max-w-2xl mx-auto space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  {mode === "create" && "Add Book Genre"}
                  {mode === "edit" && "Edit Book Genre"}
                  {mode === "view" && "View Book Genre"}
               </CardTitle>
               <CardDescription>
                  {mode === "create" && "Add a genre to this book"}
                  {mode === "edit" && "Modify the genre for this book"}
                  {mode === "view" && "View book genre details"}
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     {/* Book Selection (Create and Edit modes) */}
                     {(mode === "create" || mode === "edit") &&
                        booksResult?.data && (
                           <FormField
                              control={form.control}
                              name="title"
                              render={() => (
                                 <FormItem>
                                    <FormLabel>Book</FormLabel>
                                    <FormControl>
                                       <SearchableSelect
                                          options={
                                             booksResult.data.map(
                                                (book: any) => ({
                                                   value: book.bookID.toString(),
                                                   label: book.title,
                                                })
                                             ) || []
                                          }
                                          value={
                                             initialData?.title
                                                ? booksResult?.data
                                                     ?.find(
                                                        (book: any) =>
                                                           book.title ===
                                                           initialData.title
                                                     )
                                                     ?.bookID?.toString() ||
                                                  bookID?.toString() ||
                                                  ""
                                                : bookID?.toString() || ""
                                          }
                                          onValueChange={(value) => {
                                             // Update the bookID when a different book is selected
                                             const newBookID = parseInt(value);
                                             if (newBookID !== bookID) {
                                                // This would need to be handled by the parent component
                                                // For now, we'll keep the current bookID
                                             }
                                          }}
                                          placeholder="Select a book"
                                          searchPlaceholder="Search books..."
                                          emptyMessage="No books found."
                                          disabled={false}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )}

                     {/* Book Information (View mode only) */}
                     {mode === "view" && (
                        <div className="space-y-2">
                           <Label>Book</Label>
                           <div className="p-3 bg-muted rounded-md">
                              <div className="font-medium">
                                 {currentBook?.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                 ID: {bookID} | ISBN: {currentBook?.["isbn-10"]}
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Genre Selection (Create and Edit modes) */}
                     {(mode === "create" || mode === "edit") &&
                        genres.length > 0 && (
                           <FormField
                              control={form.control}
                              name="genre"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Genre</FormLabel>
                                    <FormControl>
                                       <SearchableSelect
                                          options={genres.map((genre) => ({
                                             value: genre.genreID.toString(),
                                             label: genre.genreName,
                                          }))}
                                          value={
                                             field.value ||
                                             (initialData?.genre
                                                ? genres
                                                     .find(
                                                        (genre) =>
                                                           genre.genreName ===
                                                           initialData.genre
                                                     )
                                                     ?.genreID?.toString() || ""
                                                : "")
                                          }
                                          onValueChange={field.onChange}
                                          placeholder="Select a genre"
                                          searchPlaceholder="Search genres..."
                                          emptyMessage="No genres found."
                                          disabled={false}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )}

                     {/* Display Genre (View mode only) */}
                     {mode === "view" && (
                        <FormField
                           control={form.control}
                           name="genre"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Genre</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       disabled={true}
                                       placeholder="Genre name"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Action Buttons */}
                     <div className="flex gap-2">
                        <Button
                           type="submit"
                           disabled={isSubmitting || mode === "view"}
                           className="flex-1"
                        >
                           {isSubmitting && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           )}
                           {mode === "create" && "Add Genre to Book"}
                           {mode === "edit" && "Update Book Genre"}
                        </Button>

                        {mode !== "create" && onDelete && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              disabled={isDeleting}
                           >
                              {isDeleting && (
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                           </Button>
                        )}
                     </div>
                  </form>
               </Form>
            </CardContent>
         </Card>

         <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
            itemName={initialData?.genre || ""}
            itemType="book genre relationship"
         />
      </div>
   );
}
