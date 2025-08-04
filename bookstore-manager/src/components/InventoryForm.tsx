"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { CheckCircle, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const sampleLocations = [
   { slocID: 1, slocName: "Orchard" },
   { slocID: 2, slocName: "Sunwillow" },
];

const samplePublishers = [
   { publisherID: 1, publisherName: "Vintage International" },
   { publisherID: 2, publisherName: "Penguin Books" },
   { publisherID: 3, publisherName: "Viking Press" },
   { publisherID: 4, publisherName: "William Morrow" },
];

// Updated schema to match database structure
const inventoryFormSchema = z.object({
   bookID: z.number().optional(),
   title: z
      .string()
      .min(2, {
         message: "Book title must be at least 2 characters.",
      })
      .max(255, {
         message: "Book title must not be longer than 255 characters.",
      }),
   inventoryQty: z.number().min(0, {
      message: "Inventory quantity must be at least 0.",
   }),
   price: z.number().min(0.01, {
      message: "Price must be greater than 0.",
   }),
   inStock: z.boolean(),
   publicationDate: z.string().min(1, {
      message: "Publication date is required.",
   }),
   isbn10: z
      .string()
      .length(13, {
         message: "ISBN-10 must be exactly 13 characters.",
      })
      .optional(),
   isbn13: z
      .string()
      .length(17, {
         message: "ISBN-13 must be exactly 17 characters.",
      })
      .optional(),
   publisherID: z.number().min(1, {
      message: "Please select a publisher.",
   }),
   slocID: z.number().min(1, {
      message: "Please select a storage location.",
   }),
   locationQuantity: z.number().min(0, {
      message: "Location quantity must be at least 0.",
   }),
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

const defaultValues: Partial<InventoryFormValues> = {
   bookID: undefined,
   title: "",
   inventoryQty: 0,
   price: 0.0,
   inStock: true,
   publicationDate: "",
   isbn10: "",
   isbn13: "",
   publisherID: 0,
   slocID: 0,
   locationQuantity: 0,
};

export function InventoryForm() {
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [submittedData, setSubmittedData] =
      useState<InventoryFormValues | null>(null);

   const form = useForm<InventoryFormValues>({
      resolver: zodResolver(inventoryFormSchema),
      defaultValues,
   });

   function onSubmit(data: InventoryFormValues) {
      setSubmittedData(data);
      setIsSubmitted(true);
      console.log("Form submitted:", data);

      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
   }

   function handleReset() {
      form.reset();
      setIsSubmitted(false);
      setSubmittedData(null);
   }

   return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Book Inventory Management
               </CardTitle>
               <CardDescription>
                  Add or update book inventory information
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     {/* Book Information */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="title"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Book Title</FormLabel>
                                 <FormControl>
                                    <input
                                       {...field}
                                       className="w-full p-2 border rounded-md"
                                       placeholder="Enter book title"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="price"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Price</FormLabel>
                                 <FormControl>
                                    <input
                                       type="text"
                                       inputMode="decimal"
                                       className="w-full p-2 border rounded-md"
                                       placeholder="0.00"
                                       value={field.value || ""}
                                       onChange={(e) => {
                                          const value = e.target.value;
                                          // Only allow numbers and one decimal point
                                          if (
                                             value === "" ||
                                             /^\d*\.?\d*$/.test(value)
                                          ) {
                                             field.onChange(
                                                value === ""
                                                   ? 0
                                                   : parseFloat(value) || 0
                                             );
                                          }
                                       }}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="inventoryQty"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Total Inventory Quantity</FormLabel>
                                 <FormControl>
                                    <input
                                       type="text"
                                       inputMode="numeric"
                                       className="w-full p-2 border rounded-md"
                                       placeholder="0"
                                       value={field.value || ""}
                                       onChange={(e) => {
                                          const value = e.target.value;
                                          // Only allow numbers
                                          if (
                                             value === "" ||
                                             /^\d+$/.test(value)
                                          ) {
                                             field.onChange(
                                                value === ""
                                                   ? 0
                                                   : parseInt(value) || 0
                                             );
                                          }
                                       }}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="publicationDate"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Publication Date</FormLabel>
                                 <FormControl>
                                    <input
                                       {...field}
                                       type="date"
                                       className="w-full p-2 border rounded-md"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="isbn10"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>ISBN-10</FormLabel>
                                 <FormControl>
                                    <input
                                       {...field}
                                       className="w-full p-2 border rounded-md"
                                       placeholder="978-0-000-00000-0"
                                       maxLength={13}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="isbn13"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>ISBN-13</FormLabel>
                                 <FormControl>
                                    <input
                                       {...field}
                                       className="w-full p-2 border rounded-md"
                                       placeholder="978-0-000-00000-0-0"
                                       maxLength={17}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="publisherID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Publisher</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={samplePublishers.map(
                                          (publisher) => ({
                                             value: publisher.publisherID.toString(),
                                             label: publisher.publisherName,
                                          })
                                       )}
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

                        <FormField
                           control={form.control}
                           name="inStock"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>In Stock</FormLabel>
                                 <Select
                                    onValueChange={(value) =>
                                       field.onChange(value === "true")
                                    }
                                    defaultValue={field.value?.toString()}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select stock status" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectItem value="true">Yes</SelectItem>
                                       <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Location Information */}
                     <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">
                           Storage Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                           <FormField
                              control={form.control}
                              name="locationQuantity"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Quantity at Location</FormLabel>
                                    <FormControl>
                                       <input
                                          type="text"
                                          inputMode="numeric"
                                          className="w-full p-2 border rounded-md"
                                          placeholder="0"
                                          value={field.value || ""}
                                          onChange={(e) => {
                                             const value = e.target.value;
                                             // Only allow numbers
                                             if (
                                                value === "" ||
                                                /^\d+$/.test(value)
                                             ) {
                                                field.onChange(
                                                   value === ""
                                                      ? 0
                                                      : parseInt(value) || 0
                                                );
                                             }
                                          }}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <Button type="submit" className="flex-1">
                           Save Inventory
                        </Button>
                        <Button
                           type="button"
                           variant="outline"
                           onClick={handleReset}
                        >
                           Reset Form
                        </Button>
                     </div>
                  </form>
               </Form>

               {isSubmitted && submittedData && (
                  <Alert className="mt-6">
                     <CheckCircle className="h-4 w-4" />
                     <AlertDescription>
                        Inventory information saved successfully! Book:{" "}
                        {submittedData.title}
                     </AlertDescription>
                  </Alert>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
