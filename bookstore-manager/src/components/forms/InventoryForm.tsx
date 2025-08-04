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
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Package } from "lucide-react";

const criticalLevels = [
   { label: "Low", value: "low" },
   { label: "Medium", value: "medium" },
   { label: "High", value: "high" },
] as const;

const categories = [
   { label: "Fiction", value: "Fiction" },
   { label: "Non-Fiction", value: "Non-Fiction" },
   { label: "Classic", value: "Classic" },
   { label: "Fantasy", value: "Fantasy" },
   { label: "Science Fiction", value: "Science Fiction" },
   { label: "Mystery", value: "Mystery" },
   { label: "Romance", value: "Romance" },
   { label: "Biography", value: "Biography" },
   { label: "History", value: "History" },
   { label: "Other", value: "Other" },
] as const;

const inventoryFormSchema = z.object({
   itemName: z
      .string()
      .min(2, {
         message: "Item name must be at least 2 characters.",
      })
      .max(100, {
         message: "Item name must not be longer than 100 characters.",
      }),
   itemQuantity: z.number().min(0, {
      message: "Quantity must be at least 0.",
   }),
   category: z.string().min(1, {
      message: "Please select a category.",
   }),
   critical: z.string().min(1, {
      message: "Please select a critical level.",
   }),
   lotNumber: z.string().min(1, {
      message: "Lot number is required.",
   }),
   description: z
      .string()
      .max(500, {
         message: "Description must not be longer than 500 characters.",
      })
      .optional(),
   location: z.string().min(1, {
      message: "Location is required.",
   }),
   supplier: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

interface InventoryFormProps {
   mode?: "create" | "edit";
   initialData?: Partial<InventoryFormValues>;
   onSave?: (data: InventoryFormValues) => void;
   onCancel?: () => void;
}

export function InventoryForm({
   mode = "create",
   initialData,
   onSave,
   onCancel,
}: InventoryFormProps) {
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const form = useForm<InventoryFormValues>({
      resolver: zodResolver(inventoryFormSchema),
      defaultValues: initialData || {
         itemName: "",
         itemQuantity: 1,
         category: "",
         critical: "low",
         lotNumber: "",
         description: "",
         location: "",
         supplier: "",
      },
   });

   async function onSubmit(data: InventoryFormValues) {
      setIsSubmitting(true);
      try {
         console.log("Form submitted:", data);

         if (onSave) {
            await onSave(data);
         }

         setIsSubmitted(true);

         // Reset form after successful submission (only in create mode)
         if (mode === "create") {
            setTimeout(() => {
               form.reset();
               setIsSubmitted(false);
            }, 2000);
         }
      } catch (error) {
         console.error("Error saving inventory item:", error);
      } finally {
         setIsSubmitting(false);
      }
   }

   function handleReset() {
      form.reset();
      setIsSubmitted(false);
   }

   return (
      <div className="max-w-2xl mx-auto space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {mode === "create"
                     ? "Add Inventory Item"
                     : "Edit Inventory Item"}
               </CardTitle>
               <CardDescription>
                  {mode === "create"
                     ? "Add a new item to your inventory system"
                     : "Update the inventory item details"}
               </CardDescription>
            </CardHeader>
            <CardContent>
               {isSubmitted && (
                  <Alert className="mb-6">
                     <CheckCircle className="h-4 w-4" />
                     <AlertDescription>
                        {mode === "create"
                           ? "Item added successfully!"
                           : "Item updated successfully!"}
                     </AlertDescription>
                  </Alert>
               )}

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     {/* Item Name */}
                     <FormField
                        control={form.control}
                        name="itemName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter item name"
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 The name of the book or item being added.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Category and Critical Level */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="category"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Category</FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select a category" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {categories.map((category) => (
                                          <SelectItem
                                             key={category.value}
                                             value={category.value}
                                          >
                                             {category.label}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <FormDescription>
                                    Select the category that best describes this
                                    item.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="critical"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Critical Level</FormLabel>
                                 <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select critical level" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {criticalLevels.map((level) => (
                                          <SelectItem
                                             key={level.value}
                                             value={level.value}
                                          >
                                             {level.label}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <FormDescription>
                                    Priority level for stock management.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Quantity and Lot Number */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="itemQuantity"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Quantity</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="text"
                                       inputMode="numeric"
                                       placeholder="1"
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
                                 <FormDescription>
                                    Current stock quantity.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="lotNumber"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Lot Number</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter lot number"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Unique identifier for this batch.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Location and Supplier */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="location"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Location</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter storage location"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Physical storage location (e.g., Shelf A-1).
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="supplier"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Supplier (Optional)</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Enter supplier name"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Publisher or supplier information.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Description */}
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                 <Textarea
                                    placeholder="Enter item description..."
                                    className="resize-none"
                                    {...field}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Provide additional details about the item.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Action Buttons */}
                     <div className="flex gap-4">
                        <Button
                           type="submit"
                           className="flex-1"
                           disabled={isSubmitting}
                        >
                           {isSubmitting
                              ? "Saving..."
                              : mode === "create"
                              ? "Add Item"
                              : "Update Item"}
                        </Button>

                        {onCancel && (
                           <Button
                              type="button"
                              variant="outline"
                              onClick={onCancel}
                              disabled={isSubmitting}
                           >
                              Cancel
                           </Button>
                        )}

                        {isSubmitted && mode === "create" && (
                           <Button
                              type="button"
                              variant="outline"
                              onClick={handleReset}
                           >
                              Add Another
                           </Button>
                        )}
                     </div>
                  </form>
               </Form>
            </CardContent>
         </Card>
      </div>
   );
}
