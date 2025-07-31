import { useState } from "react";
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

// Sample data - define locally since they're not exported
const sampleBooks = [
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

const sampleGenres = [
   {
      genreID: 1,
      genreName: "Postmodern Fiction",
   },
   {
      genreID: 2,
      genreName: "Historical Fiction",
   },
   {
      genreID: 3,
      genreName: "Horror Fiction",
   },
   {
      genreID: 4,
      genreName: "Science Fiction",
   },
   {
      genreID: 5,
      genreName: "Fantasy Fiction",
   },
];

const bookGenreSchema = z.object({
   bookID: z.number(),
   genreID: z.number(),
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
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   const form = useForm<BookGenreFormData>({
      resolver: zodResolver(bookGenreSchema),
      defaultValues: {
         bookID: bookID,
         genreID: initialData?.genreID || 0,
      },
   });

   const onSubmit = (data: BookGenreFormData) => {
      console.log("Book genre data:", data);
      onSave(data);
   };

   const handleDelete = async () => {
      if (!onDelete) return;

      setIsDeleting(true);
      try {
         await onDelete();
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   };

   // Get the current book and genre details for display
   const currentBook = sampleBooks.find((book: any) => book.bookID === bookID);
   const selectedGenre = initialData
      ? sampleGenres.find((genre: any) => genre.genreID === initialData.genreID)
      : null;

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
                                       options={sampleGenres.map(
                                          (genre: any) => ({
                                             value: genre.genreID.toString(),
                                             label: genre.genreName,
                                          })
                                       )}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
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
                                       options={sampleGenres.map(
                                          (genre: any) => ({
                                             value: genre.genreID.toString(),
                                             label: genre.genreName,
                                          })
                                       )}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       placeholder="Select a new genre"
                                       searchPlaceholder="Search genres..."
                                       emptyMessage="No genres found."
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
                        <Button type="submit" disabled={mode === "view"}>
                           {mode === "create" && "Add Genre"}
                           {mode === "edit" && "Update Genre"}
                           {mode === "view" && "View Details"}
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
