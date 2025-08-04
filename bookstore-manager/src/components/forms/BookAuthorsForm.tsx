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
import { Users, Loader2, Trash2 } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";

// Services
import BookAuthorsService from "@/services/BookAuthorsService";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

const bookAuthorSchema = z.object({
   title: z.string().min(1, "Book title is required"),
   author: z.string().min(1, "Author is required"), // This will be authorID as string
});

type BookAuthorFormData = z.infer<typeof bookAuthorSchema>;

interface BookAuthorsFormProps {
   mode: "create" | "edit" | "view";
   bookID: number;
   initialData?: any;
   onSave: (data: BookAuthorFormData) => void;
   onDelete?: () => void;
}

export function BookAuthorsForm({
   mode,
   bookID,
   initialData,
   onSave,
   onDelete,
}: BookAuthorsFormProps) {
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [currentBook, setCurrentBook] = useState<any | null>(null);
   const [authors, setAuthors] = useState<any[]>([]);
   const [booksResult, setBooksResult] = useState<any>(null);

   const form = useForm<BookAuthorFormData>({
      resolver: zodResolver(bookAuthorSchema),
      defaultValues: initialData
         ? {
              title: initialData.title || "",
              author: initialData.author || "", // This will be author name in edit/view mode
           }
         : {
              title: "",
              author: "",
           },
   });

   // Update form values when initialData changes
   useEffect(() => {
      if (initialData) {
         form.setValue("title", initialData.title || "");
         // Don't set author here - it will be handled by the dropdown value logic
      }
   }, [initialData, form]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch books and authors for dropdowns
            const [booksResponse, authorsResult] = await Promise.all([
               BookAuthorsService.getBooksForDropdown(),
               BookAuthorsService.getAuthorsForDropdown(),
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
                  // Don't set author here - it will be handled by the dropdown value logic
               } else if (currentBook) {
                  // For create mode, use the current book
                  form.setValue("title", currentBook.title);
               }
            }

            setAuthors(authorsResult.data);
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

   const onSubmit = async (data: BookAuthorFormData) => {
      setIsSubmitting(true);
      try {
         // Find the selected author's name for display
         const selectedAuthor = authors.find(
            (author) => author.authorID.toString() === data.author
         );
         const authorName = selectedAuthor?.fullName || data.author;

         if (mode === "create") {
            // Create new book-author relationship
            await BookAuthorsService.create({
               bookID: bookID,
               authorID: parseInt(data.author), // Convert string authorID to number
            });
            toast.success("Book author relationship created successfully!", {
               description: `${authorName} has been added to ${data.title}.`,
            });
         } else if (mode === "edit" && initialData?.bookAuthorID) {
            // Update existing book-author relationship
            await BookAuthorsService.update(initialData.bookAuthorID, {
               bookID: bookID,
               authorID: parseInt(data.author), // Convert string authorID to number
            });
            toast.success("Book author relationship updated successfully!", {
               description: `${authorName} has been updated for ${data.title}.`,
            });
         }

         onSave(data);
      } catch (error: any) {
         console.error("Error saving book author:", error);

         // Check if it's a duplicate relationship error
         if (error.response?.status === 409) {
            const errorData = error.response.data;
            toast.error(
               errorData.error || "Book author relationship already exists",
               {
                  description:
                     errorData.suggestion ||
                     "Please choose a different author or book.",
                  duration: Infinity,
               }
            );
         } else {
            toast.error("Failed to save book author relationship", {
               description:
                  "There was an error saving the relationship. Please try again.",
               duration: Infinity,
            });
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = async () => {
      if (!onDelete || !initialData?.bookAuthorID) return;

      setIsDeleting(true);
      try {
         await BookAuthorsService.remove(initialData.bookAuthorID);
         toast.success("Book author relationship deleted successfully!", {
            description: `${initialData.author} has been removed from ${initialData.title}.`,
         });
         onDelete();
      } catch (error) {
         console.error("Error deleting book author:", error);
         toast.error("Failed to delete book author relationship", {
            description:
               "There was an error deleting the relationship. Please try again.",
            duration: Infinity,
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
                     <Users className="h-5 w-5" />
                     Loading...
                  </CardTitle>
                  <CardDescription>
                     Loading book and author data...
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
                  <Users className="h-5 w-5" />
                  {mode === "create" && "Add Book Author"}
                  {mode === "edit" && "Edit Book Author"}
                  {mode === "view" && "View Book Author"}
               </CardTitle>
               <CardDescription>
                  {mode === "create" && "Add an author to this book"}
                  {mode === "edit" && "Modify the author for this book"}
                  {mode === "view" && "View book author details"}
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

                     {/* Author Selection (Create and Edit modes) */}
                     {(mode === "create" || mode === "edit") &&
                        authors.length > 0 && (
                           <FormField
                              control={form.control}
                              name="author"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                       <SearchableSelect
                                          options={authors.map((author) => ({
                                             value: author.authorID.toString(),
                                             label: author.fullName,
                                          }))}
                                          value={
                                             field.value ||
                                             (initialData?.author
                                                ? authors
                                                     .find(
                                                        (author) =>
                                                           author.fullName ===
                                                           initialData.author
                                                     )
                                                     ?.authorID?.toString() ||
                                                  ""
                                                : "")
                                          }
                                          onValueChange={field.onChange}
                                          placeholder="Select an author"
                                          searchPlaceholder="Search authors..."
                                          emptyMessage="No authors found."
                                          disabled={false}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        )}

                     {/* Display Author (View mode only) */}
                     {mode === "view" && (
                        <FormField
                           control={form.control}
                           name="author"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Author</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       disabled={true}
                                       placeholder="Author name"
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
                           {mode === "create" && "Add Author to Book"}
                           {mode === "edit" && "Update Book Author"}
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
            itemName={initialData?.author || ""}
            itemType="book author relationship"
         />
      </div>
   );
}
