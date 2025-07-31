"use client";

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
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Edit, Eye, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

const bookSchema = z.object({
   bookID: z.number().optional(),
   title: z.string().min(1, "Title is required"),
   publicationDate: z.string().min(1, "Publication date is required"),
   "isbn-10": z.string().optional(),
   "isbn-13": z.string().optional(),
   inStock: z.boolean(),
   price: z.number().min(0, "Price must be positive"),
   inventoryQty: z.number().min(0, "Inventory quantity must be positive"),
   publisherID: z.number().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

// Sample publishers data for dropdown
const samplePublishers: Array<{
   publisherID: number;
   publisherName: string;
}> = [
   {
      publisherID: 1,
      publisherName: "Vintage International",
   },
   {
      publisherID: 2,
      publisherName: "Penguin Books",
   },
   {
      publisherID: 3,
      publisherName: "Viking Press",
   },
   {
      publisherID: 4,
      publisherName: "William Morrow",
   },
];

interface BooksFormProps {
   mode: "create" | "edit" | "view";
   initialData?: BookFormValues;
   onSave?: (data: BookFormValues) => void;
   onDelete?: () => void;
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

   const form = useForm<BookFormValues>({
      resolver: zodResolver(bookSchema),
      defaultValues: initialData || {
         title: "",
         publicationDate: "",
         "isbn-10": "",
         "isbn-13": "",
         inStock: true,
         price: 0,
         inventoryQty: 0,
      },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: BookFormValues) {
      setIsSubmitting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 1000));
         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving book:", error);
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting book:", error);
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
                              <Input
                                 type="date"
                                 {...field}
                                 disabled={isViewMode}
                              />
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
                     name="publisherID"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Publisher</FormLabel>
                           <FormControl>
                              <SearchableSelect
                                 options={samplePublishers.map((publisher) => ({
                                    value: publisher.publisherID.toString(),
                                    label: publisher.publisherName,
                                 }))}
                                 value={field.value?.toString()}
                                 onValueChange={(value) =>
                                    field.onChange(Number(value))
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
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(
                                          parseFloat(e.target.value) || 0
                                       )
                                    }
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
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(
                                          parseInt(e.target.value) || 0
                                       )
                                    }
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
