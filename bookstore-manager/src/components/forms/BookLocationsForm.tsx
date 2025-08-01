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
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MapPin, Package } from "lucide-react";

import BooksService, { type Book } from "@/services/BooksService";

// Dummy fallback — replace with actual data from LocationsService
const sampleBooks = [
   { bookID: 1, title: "1984", "isbn-10": "1234567890" },
   { bookID: 2, title: "Brave New World", "isbn-10": "0987654321" },
];

const sampleLocations = [
   { slocID: 1, slocName: "Main Warehouse" },
   { slocID: 2, slocName: "Annex" },
];

// Use slocID instead of locationID to match the form field
const bookLocationSchema = z.object({
   bookID: z.number().min(1, "Book ID is required"),
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
}

export function BookLocationsForm({
   mode,
   bookID,
   initialData,
   onSave,
   onDelete,
}: BookLocationsFormProps) {
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [book, setBook] = useState<any>(null);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const bookResult = await BooksService.get(bookID);
            setBook(bookResult);
            setError(null);
         } catch (err) {
            setError("Failed to fetch book details.");
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [bookID]);

   const form = useForm<BookLocationFormData>({
      resolver: zodResolver(bookLocationSchema),
      defaultValues: {
         bookID: bookID,
         slocID: initialData?.slocID || 0,
         quantity: initialData?.quantity || 0,
      },
   });

   const onSubmit = (data: BookLocationFormData) => {
      console.log("Book location data:", data);
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

   const currentBook = sampleBooks.find((book) => book.bookID === bookID);
   const selectedLocation = initialData
      ? sampleLocations.find((loc) => loc.slocID === initialData.slocID)
      : null;

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
                  {mode === "create" &&
                     "Add a new storage location for this book"}
                  {mode === "edit" &&
                     "Modify the quantity for this book location"}
                  {mode === "view" && "View book location details"}
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
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

                     {mode === "create" && (
                        <FormField
                           control={form.control}
                           name="slocID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Storage Location</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={sampleLocations.map(
                                          (location) => ({
                                             value: location.slocID.toString(),
                                             label: location.slocName,
                                          })
                                       )}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(Number(value))
                                       }
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

                     {(mode === "edit" || mode === "view") &&
                        selectedLocation && (
                           <div className="space-y-2">
                              <Label>Storage Location</Label>
                              <div className="p-3 bg-muted rounded-md">
                                 <div className="font-medium">
                                    {selectedLocation.slocName}
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                    Location ID: {selectedLocation.slocID}
                                 </div>
                              </div>
                           </div>
                        )}

                     <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                 <Package className="h-4 w-4" />
                                 Quantity
                              </FormLabel>
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
                              <FormDescription>
                                 Number of books stored at this location
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={mode === "view"}>
                           {mode === "create" && "Add Location"}
                           {mode === "edit" && "Update Quantity"}
                           {mode === "view" && "View Details"}
                        </Button>

                        {mode === "edit" && onDelete && (
                           <DeleteConfirmationDialog
                              isOpen={showDeleteDialog}
                              onOpenChange={setShowDeleteDialog}
                              onConfirm={handleDelete}
                              isDeleting={isDeleting}
                              itemName={
                                 selectedLocation?.slocName || "this location"
                              }
                              itemType="book location"
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
