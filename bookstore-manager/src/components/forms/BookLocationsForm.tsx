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
import { MapPin, Loader2, Trash2 } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";

// Services
import BookLocationsService from "@/services/BookLocationsService";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

const bookLocationSchema = z.object({
   bookID: z.number().min(1, "Book is required"),
   slocID: z.number().min(1, "Location is required"),
   quantity: z.number().min(0, "Quantity must be at least 0"),
});

type BookLocationFormData = z.infer<typeof bookLocationSchema>;

interface BookLocationsFormProps {
   mode: "create" | "edit" | "view";
   bookID: number;
   initialData?: any;
   onSave: (data: BookLocationFormData) => void;
   onDelete?: () => void;
   onRefreshBook?: () => void; // New prop for refreshing parent book data
}

export function BookLocationsForm({
   mode,
   bookID,
   initialData,
   onSave,
   onDelete,
   onRefreshBook,
}: BookLocationsFormProps) {
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [books, setBooks] = useState<any[]>([]);
   const [locations, setLocations] = useState<any[]>([]);

   const form = useForm<BookLocationFormData>({
      resolver: zodResolver(bookLocationSchema),
      defaultValues: {
         bookID: 0,
         slocID: 0,
         quantity: 0,
      },
   });

   // Update form values when initialData changes
   useEffect(() => {
      if (initialData && books.length > 0 && locations.length > 0) {
         // Find the bookID by matching the title
         const matchingBook = books.find(
            (book) => book.title === initialData.title
         );
         const bookIDValue = matchingBook?.bookID || 0;

         // Find the slocID by matching the slocName
         const matchingLocation = locations.find(
            (location) => location.slocName === initialData.slocName
         );
         const slocIDValue = matchingLocation?.slocID || 0;

         form.setValue("bookID", bookIDValue);
         form.setValue("slocID", slocIDValue);
         form.setValue("quantity", initialData.quantity || 0);
      }
   }, [initialData, books, locations, form]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch books and locations for dropdowns
            const [booksResponse, locationsResponse] = await Promise.all([
               BookLocationsService.getBooks(),
               BookLocationsService.getLocations(),
            ]);

            setBooks(booksResponse.data);
            setLocations(locationsResponse.data);

            // Set default values for create mode
            if (!initialData && bookID > 0) {
               form.setValue("bookID", bookID);
            }
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

   const onSubmit = async (data: BookLocationFormData) => {
      setIsSubmitting(true);
      try {
         // Find the selected book and location names for display
         const selectedBook = books.find((book) => book.bookID === data.bookID);
         const selectedLocation = locations.find(
            (location) => location.slocID === data.slocID
         );
         const bookTitle = selectedBook?.title || "";
         const locationName = selectedLocation?.slocName || "";

         if (mode === "create") {
            // Create new book-location relationship
            await BookLocationsService.create(data);
            toast.success("Book location relationship created successfully!", {
               description: `${locationName} has been added to ${bookTitle} with quantity ${data.quantity}.`,
            });
         } else if (mode === "edit" && initialData?.bookLocationID) {
            // Update existing book-location relationship
            await BookLocationsService.update(initialData.bookLocationID, data);
            toast.success("Book location relationship updated successfully!", {
               description: `${locationName} has been updated for ${bookTitle} with quantity ${data.quantity}.`,
            });
         }

         onSave(data);
         // Refresh parent book data to show updated inventory quantity
         if (onRefreshBook) {
            onRefreshBook();
         }
      } catch (error: any) {
         console.error("Error saving book location:", error);

         // Check if it's a duplicate relationship error
         if (error.response?.status === 409) {
            const errorData = error.response.data;
            toast.error(errorData.error || "Book location already exists", {
               description:
                  errorData.suggestion ||
                  "Please update the existing entry instead.",
               duration: 30000,
               dismissible: true,
            });
         } else {
            toast.error("Failed to save book location relationship", {
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
      if (!onDelete || !initialData?.bookLocationID) return;

      setIsDeleting(true);
      try {
         await BookLocationsService.remove(initialData.bookLocationID);
         toast.success("Book location relationship deleted successfully!", {
            description: `${initialData.slocName} has been removed from ${initialData.title}.`,
         });
         onDelete();
         // Refresh parent book data to show updated inventory quantity
         if (onRefreshBook) {
            onRefreshBook();
         }
      } catch (error) {
         console.error("Error deleting book location:", error);
         toast.error("Failed to delete book location relationship", {
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
                     <MapPin className="h-5 w-5" />
                     Loading...
                  </CardTitle>
                  <CardDescription>
                     Loading book and location data...
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
                  <MapPin className="h-5 w-5" />
                  {mode === "create" && "Add Book Location"}
                  {mode === "edit" && "Edit Book Location"}
                  {mode === "view" && "View Book Location"}
               </CardTitle>
               <CardDescription>
                  {mode === "create" && "Add a location to this book"}
                  {mode === "edit" && "Modify the location for this book"}
                  {mode === "view" && "View book location details"}
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     {/* Book Selection */}
                     <FormField
                        control={form.control}
                        name="bookID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Book</FormLabel>
                              <FormControl>
                                 <SearchableSelect
                                    options={books.map((book) => ({
                                       value: book.bookID.toString(),
                                       label: book.title,
                                    }))}
                                    value={field.value?.toString() || ""}
                                    onValueChange={(value) => {
                                       field.onChange(Number(value));
                                    }}
                                    placeholder="Choose a book..."
                                    searchPlaceholder="Search books..."
                                    emptyMessage="No books found."
                                    disabled={mode === "view"}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Location Selection */}
                     <FormField
                        control={form.control}
                        name="slocID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                 <SearchableSelect
                                    options={locations.map((location) => ({
                                       value: location.slocID.toString(),
                                       label: location.slocName,
                                    }))}
                                    value={field.value?.toString() || ""}
                                    onValueChange={(value) => {
                                       field.onChange(Number(value));
                                    }}
                                    placeholder="Choose a location..."
                                    searchPlaceholder="Search locations..."
                                    emptyMessage="No locations found."
                                    disabled={mode === "view"}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Quantity Input */}
                     <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                 <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter quantity"
                                    value={field.value || ""}
                                    onChange={(e) => {
                                       const value = e.target.value;
                                       if (
                                          value === "" ||
                                          /^\d+$/.test(value)
                                       ) {
                                          field.onChange(
                                             value === "" ? 0 : Number(value)
                                          );
                                       }
                                    }}
                                    disabled={mode === "view"}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

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
                           {mode === "create" && "Add Location to Book"}
                           {mode === "edit" && "Update Book Location"}
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
            itemName="book location relationship"
            itemType="book location relationship"
         />
      </div>
   );
}
