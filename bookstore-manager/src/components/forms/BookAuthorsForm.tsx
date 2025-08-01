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
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Users } from "lucide-react";
import BookAuthorsService from "@/services/BookAuthorsService";
import BooksService, { type Book } from "@/services/BooksService";
import AuthorsService from "@/services/AuthorsService";

// Enhanced schema with input sanitization
const bookAuthorSchema = z.object({
   bookID: z.number().min(1, "Book ID is required"),
   authorID: z.number().min(1, "Author is required"),
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
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [currentBook, setCurrentBook] = useState<any>(null);
   const [authors, setAuthors] = useState<any[]>([]);
   const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);

   // Fetch book and authors data
   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         try {
            // Fetch book details
            const bookResponse = await BooksService.get(bookID);
            setCurrentBook(bookResponse.data);

            // Fetch all authors for dropdown
            const authorsResponse = await AuthorsService.getAll();
            setAuthors(authorsResponse.data);

            // If editing, get the current author details
            if (initialData?.authorID) {
               const authorResponse = await AuthorsService.get(
                  initialData.authorID
               );
               setSelectedAuthor(authorResponse.data);
            }
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, [bookID, initialData?.authorID]);

   const form = useForm<BookAuthorFormData>({
      resolver: zodResolver(bookAuthorSchema),
      defaultValues: {
         bookID: bookID,
         authorID: initialData?.authorID || 0,
      },
   });

   const onSubmit = async (data: BookAuthorFormData) => {
      setIsSubmitting(true);
      try {
         if (mode === "create") {
            // Create new book-author relationship
            await BookAuthorsService.create(data);
         } else if (mode === "edit" && initialData?.bookAuthorID) {
            // Update existing book-author relationship
            await BookAuthorsService.update(initialData.bookAuthorID, data);
         }

         onSave(data);
      } catch (error) {
         console.error("Error saving book author:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = async () => {
      if (!onDelete || !initialData?.bookAuthorID) return;

      setIsDeleting(true);
      try {
         await BookAuthorsService.remove(initialData.bookAuthorID);
         onDelete();
      } catch (error) {
         console.error("Error deleting book author:", error);
         // You might want to show an error message to the user here
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
                     {/* Book Information (Read-only) */}
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

                     {/* Author Selection (Create mode only) */}
                     {mode === "create" && (
                        <FormField
                           control={form.control}
                           name="authorID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Author</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={authors.map((author: any) => ({
                                          value: author.authorID.toString(),
                                          label:
                                             author.fullName ||
                                             `${author.firstName} ${author.lastName}`,
                                       }))}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       placeholder="Select an author"
                                       searchPlaceholder="Search authors..."
                                       emptyMessage="No authors found."
                                       disabled={isLoading}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Author Update (Edit mode) */}
                     {mode === "edit" && (
                        <FormField
                           control={form.control}
                           name="authorID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Update Author</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={authors.map((author: any) => ({
                                          value: author.authorID.toString(),
                                          label:
                                             author.fullName ||
                                             `${author.firstName} ${author.lastName}`,
                                       }))}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       placeholder="Select a new author"
                                       searchPlaceholder="Search authors..."
                                       emptyMessage="No authors found."
                                       disabled={isLoading}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Choose a new author to replace the current
                                    one
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Current Author (Edit/View mode) */}
                     {(mode === "edit" || mode === "view") &&
                        selectedAuthor && (
                           <div className="space-y-2">
                              <Label>Author</Label>
                              <div className="p-3 bg-muted rounded-md">
                                 <div className="font-medium">
                                    {selectedAuthor.fullName}
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                    Author ID: {selectedAuthor.authorID}
                                 </div>
                              </div>
                           </div>
                        )}

                     {/* Action Buttons */}
                     <div className="flex gap-2 pt-4">
                        <Button
                           type="submit"
                           disabled={mode === "view" || isSubmitting}
                        >
                           {isSubmitting ? (
                              "Saving..."
                           ) : (
                              <>
                                 {mode === "create" && "Add Author"}
                                 {mode === "edit" && "Update Author"}
                                 {mode === "view" && "View Details"}
                              </>
                           )}
                        </Button>

                        {mode === "edit" && onDelete && (
                           <DeleteConfirmationDialog
                              isOpen={showDeleteDialog}
                              onOpenChange={setShowDeleteDialog}
                              onConfirm={handleDelete}
                              isDeleting={isDeleting}
                              itemName={
                                 selectedAuthor?.fullName || "this author"
                              }
                              itemType="book author"
                           />
                        )}
                     </div>
                  </form>
               </Form>
            </CardContent>
         </Card>
      </div>
   );
}
