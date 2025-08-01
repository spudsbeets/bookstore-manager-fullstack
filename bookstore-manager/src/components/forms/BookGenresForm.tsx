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
import { Tags } from "lucide-react";
import BookGenresService from "@/services/BookGenresService";
import BooksService, { type Book } from "@/services/BooksService";
import GenresService from "@/services/GenresService";

// Enhanced schema with input sanitization
const bookGenreSchema = z.object({
   bookID: z.number().min(1, "Book ID is required"),
   genreID: z.number().min(1, "Genre is required"),
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
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [currentBook, setCurrentBook] = useState<any>(null);
   const [genres, setGenres] = useState<any[]>([]);
   const [selectedGenre, setSelectedGenre] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);

   // Fetch book and genres data
   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         try {
            // Fetch book details
            const bookResponse = await BooksService.get(bookID);
            setCurrentBook(bookResponse.data);

            // Fetch all genres for dropdown
            const genresResponse = await GenresService.getAll();
            setGenres(genresResponse.data);

            // If editing, get the current genre details
            if (initialData?.genreID) {
               const genreResponse = await GenresService.get(
                  initialData.genreID
               );
               setSelectedGenre(genreResponse.data);
            }
         } catch (error) {
            console.error("Error fetching data:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, [bookID, initialData?.genreID]);

   const form = useForm<BookGenreFormData>({
      resolver: zodResolver(bookGenreSchema),
      defaultValues: {
         bookID: bookID,
         genreID: initialData?.genreID || 0,
      },
   });

   const onSubmit = async (data: BookGenreFormData) => {
      setIsSubmitting(true);
      try {
         if (mode === "create") {
            // Create new book-genre relationship
            await BookGenresService.create(data);
         } else if (mode === "edit" && initialData?.bookGenreID) {
            // Update existing book-genre relationship
            await BookGenresService.update(initialData.bookGenreID, data);
         }

         onSave(data);
      } catch (error) {
         console.error("Error saving book genre:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = async () => {
      if (!onDelete || !initialData?.bookGenreID) return;

      setIsDeleting(true);
      try {
         await BookGenresService.remove(initialData.bookGenreID);
         onDelete();
      } catch (error) {
         console.error("Error deleting book genre:", error);
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
                     <Tags className="h-5 w-5" />
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

   return (
      <div className="max-w-2xl mx-auto space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
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

                     {/* Genre Selection (Create mode only) */}
                     {mode === "create" && (
                        <FormField
                           control={form.control}
                           name="genreID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Genre</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={genres.map((genre: any) => ({
                                          value: genre.genreID.toString(),
                                          label: genre.genreName,
                                       }))}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       placeholder="Select a genre"
                                       searchPlaceholder="Search genres..."
                                       emptyMessage="No genres found."
                                       disabled={isLoading}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Genre Update (Edit mode) */}
                     {mode === "edit" && (
                        <FormField
                           control={form.control}
                           name="genreID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Update Genre</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={genres.map((genre: any) => ({
                                          value: genre.genreID.toString(),
                                          label: genre.genreName,
                                       }))}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       placeholder="Select a new genre"
                                       searchPlaceholder="Search genres..."
                                       emptyMessage="No genres found."
                                       disabled={isLoading}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Choose a new genre to replace the current
                                    one
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Current Genre (Edit/View mode) */}
                     {(mode === "edit" || mode === "view") && selectedGenre && (
                        <div className="space-y-2">
                           <Label>Genre</Label>
                           <div className="p-3 bg-muted rounded-md">
                              <div className="font-medium">
                                 {selectedGenre.genreName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                 Genre ID: {selectedGenre.genreID}
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
                                 {mode === "create" && "Add Genre"}
                                 {mode === "edit" && "Update Genre"}
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
                                 selectedGenre?.genreName || "this genre"
                              }
                              itemType="book genre"
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
