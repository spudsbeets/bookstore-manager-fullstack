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
import { Users } from "lucide-react";

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

const sampleAuthors = [
   {
      authorID: 1,
      firstName: "Toni",
      middleName: null,
      lastName: "Morrison",
      fullName: "Toni Morrison",
   },
   {
      authorID: 2,
      firstName: "Thomas",
      middleName: null,
      lastName: "Pynchon",
      fullName: "Thomas Pynchon",
   },
   {
      authorID: 3,
      firstName: "Stephen",
      middleName: "Edwin",
      lastName: "King",
      fullName: "Stephen Edwin King",
   },
   {
      authorID: 4,
      firstName: "Peter",
      middleName: null,
      lastName: "Straub",
      fullName: "Peter Straub",
   },
   {
      authorID: 5,
      firstName: "Neil",
      middleName: "Richard",
      lastName: "Gaiman",
      fullName: "Neil Richard Gaiman",
   },
   {
      authorID: 6,
      firstName: "Terry",
      middleName: null,
      lastName: "Pratchett",
      fullName: "Terry Pratchett",
   },
];

const bookAuthorSchema = z.object({
   bookID: z.number(),
   authorID: z.number(),
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
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

   const form = useForm<BookAuthorFormData>({
      resolver: zodResolver(bookAuthorSchema),
      defaultValues: {
         bookID: bookID,
         authorID: initialData?.authorID || 0,
      },
   });

   const onSubmit = (data: BookAuthorFormData) => {
      console.log("Book author data:", data);
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

   // Get the current book and author details for display
   const currentBook = sampleBooks.find((book: any) => book.bookID === bookID);
   const selectedAuthor = initialData
      ? sampleAuthors.find(
           (author: any) => author.authorID === initialData.authorID
        )
      : null;

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
                                       options={sampleAuthors.map(
                                          (author: any) => ({
                                             value: author.authorID.toString(),
                                             label: author.fullName,
                                          })
                                       )}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
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
                                       options={sampleAuthors.map(
                                          (author: any) => ({
                                             value: author.authorID.toString(),
                                             label: author.fullName,
                                          })
                                       )}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
                                       placeholder="Select a new author"
                                       searchPlaceholder="Search authors..."
                                       emptyMessage="No authors found."
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
                        <Button type="submit" disabled={mode === "view"}>
                           {mode === "create" && "Add Author"}
                           {mode === "edit" && "Update Author"}
                           {mode === "view" && "View Details"}
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
