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

const sampleLocations = [
   { slocID: 1, slocName: "Orchard" },
   { slocID: 2, slocName: "Sunwillow" },
];

const bookLocationSchema = z.object({
   bookID: z.number(),
   slocID: z.number(),
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

   // Get the current book and location details for display
   const currentBook = sampleBooks.find((book: any) => book.bookID === bookID);
   // const currentLocation = sampleLocations.find(
   //    (loc: any) => loc.slocID === form.watch("slocID")
   // ); // Commented out unused variable
   const selectedLocation = initialData
      ? sampleLocations.find((loc: any) => loc.slocID === initialData.slocID)
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
                           name="slocID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Storage Location</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={sampleLocations.map(
                                          (location: any) => ({
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

                     {/* Current Location (Edit/View mode) */}
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

                     {/* Quantity Field */}
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
                                    type="number"
                                    placeholder="Enter quantity"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(Number(e.target.value))
                                    }
                                    disabled={mode === "view"}
                                    min="0"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Number of books stored at this location
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Action Buttons */}
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
