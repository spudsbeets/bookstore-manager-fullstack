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
import { MapPin, Loader2, Trash2 } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";

// Services
import BookLocationsService from "@/services/BookLocationsService";
import BooksService from "@/services/BooksService";
import LocationsService from "@/services/LocationsService";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

const bookLocationSchema = z.object({
   title: z.string().min(1, "Book title is required"),
   location: z.string().min(1, "Location is required"),
   quantity: z.number().min(0, "Quantity must be at least 0"),
});

type BookLocationFormData = z.infer<typeof bookLocationSchema>;

interface BookLocationsFormProps {
   mode: "create" | "edit" | "view";
   bookID: number;
   initialData?: any;
   onSave: (data: BookLocationFormData) => void;
   onDelete?: () => void;
}

export function BookLocationsForm({
   mode,
   bookID,
   initialData,
   onSave,
   onDelete,
}: BookLocationsFormProps) {
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [currentBook, setCurrentBook] = useState<any | null>(null);
   const [locations, setLocations] = useState<any[]>([]);

   const form = useForm<BookLocationFormData>({
      resolver: zodResolver(bookLocationSchema),
      defaultValues: initialData
         ? {
              title: initialData.title || "",
              location: initialData.location || "",
              quantity: initialData.quantity || 0,
           }
         : {
              title: "",
              location: "",
              quantity: 0,
           },
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch book details
            const bookResult = await BooksService.get(bookID);
            setCurrentBook(bookResult.data);

            // Fetch locations for selection
            const locationsResult = await LocationsService.getAll();
            setLocations(locationsResult.data);

            // Set default title from book
            if (!initialData) {
               form.setValue("title", bookResult.data.title);
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
         if (mode === "create") {
            // Create new book-location relationship
            await BookLocationsService.create(data);
            toast.success("Book location relationship created successfully!", {
               description: `${data.location} has been added to ${data.title} with quantity ${data.quantity}.`,
            });
         } else if (mode === "edit" && initialData?.bookLocationID) {
            // Update existing book-location relationship
            await BookLocationsService.update(initialData.bookLocationID, data);
            toast.success("Book location relationship updated successfully!", {
               description: `${data.location} has been updated for ${data.title} with quantity ${data.quantity}.`,
            });
         }

         onSave(data);
      } catch (error) {
         console.error("Error saving book location:", error);
         toast.error("Failed to save book location relationship", {
            description:
               "There was an error saving the relationship. Please try again.",
            duration: Infinity,
         });
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
            description: `${initialData.location} has been removed from ${initialData.title}.`,
         });
         onDelete();
      } catch (error) {
         console.error("Error deleting book location:", error);
         toast.error("Failed to delete book location relationship", {
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

                     {/* Location Selection (Create mode only) */}
                     {mode === "create" && (
                        <FormField
                           control={form.control}
                           name="location"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Location</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={locations.map((location) => ({
                                          value: location.slocName,
                                          label: location.slocName,
                                       }))}
                                       value={field.value}
                                       onValueChange={field.onChange}
                                       placeholder="Select a location"
                                       searchPlaceholder="Search locations..."
                                       emptyMessage="No locations found."
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Display Location (Edit/View modes) */}
                     {(mode === "edit" || mode === "view") && (
                        <FormField
                           control={form.control}
                           name="location"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Location</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       disabled={mode === "view"}
                                       placeholder="Location name"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

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
            itemName={initialData?.location || ""}
            itemType="book location relationship"
         />
      </div>
   );
}
