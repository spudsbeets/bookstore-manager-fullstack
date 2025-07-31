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

const orderItemSchema = z.object({
   orderItemID: z.number().optional(),
   orderID: z.number(),
   bookID: z.number().min(1, "Book is required"),
   quantity: z.number().min(1, "Quantity must be at least 1"),
   individualPrice: z.number().min(0, "Price must be positive"),
   subtotal: z.number().min(0, "Subtotal must be positive"),
});

type OrderItemFormValues = z.infer<typeof orderItemSchema>;

// Sample books data for dropdown
const sampleBooks: Array<{
   bookID: number;
   title: string;
   price: number;
   inventoryQty: number;
}> = [
   {
      bookID: 1,
      title: "Inherent Vice",
      price: 15.99,
      inventoryQty: 5,
   },
   {
      bookID: 2,
      title: "Beloved",
      price: 17.99,
      inventoryQty: 7,
   },
   {
      bookID: 3,
      title: "The Talisman",
      price: 18.99,
      inventoryQty: 6,
   },
   {
      bookID: 4,
      title: "Good Omens",
      price: 16.99,
      inventoryQty: 8,
   },
];

interface OrderItemsFormProps {
   mode: "create" | "edit" | "view";
   orderID: number;
   initialData?: OrderItemFormValues;
   onSave?: (data: OrderItemFormValues) => void;
   onDelete?: () => void;
}

export function OrderItemsForm({
   mode,
   orderID,
   initialData,
   onSave,
   onDelete,
}: OrderItemsFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<OrderItemFormValues>({
      resolver: zodResolver(orderItemSchema),
      defaultValues: initialData || {
         orderID: orderID,
         bookID: 0,
         quantity: 1,
         individualPrice: 0,
         subtotal: 0,
      },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: OrderItemFormValues) {
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
         console.error("Error saving order item:", error);
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
         console.error("Error deleting order item:", error);
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Order Item";
         case "edit":
            return "Edit Order Item";
         case "view":
            return "View Order Item";
         default:
            return "Order Item";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new item to order #" + orderID;
         case "edit":
            return "Update order item information";
         case "view":
            return "View order item details";
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
                     Order item {isCreateMode ? "created" : "updated"}{" "}
                     successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Order Item ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.orderItemID && (
                     <FormField
                        control={form.control}
                        name="orderItemID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Order Item ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this order item
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Order ID */}
                  <FormField
                     control={form.control}
                     name="orderID"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Order ID</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 value={field.value || ""}
                                 disabled
                                 className="bg-muted"
                              />
                           </FormControl>
                           <FormDescription>
                              The order this item belongs to
                           </FormDescription>
                        </FormItem>
                     )}
                  />

                  {/* Book Selection */}
                  <FormField
                     control={form.control}
                     name="bookID"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Book</FormLabel>
                           <FormControl>
                              <SearchableSelect
                                 options={sampleBooks.map((book) => ({
                                    value: book.bookID.toString(),
                                    label: `${book.title} - $${book.price}`,
                                 }))}
                                 value={field.value?.toString()}
                                 onValueChange={(value) =>
                                    field.onChange(Number(value))
                                 }
                                 placeholder="Select a book"
                                 searchPlaceholder="Search books..."
                                 emptyMessage="No books found."
                              />
                           </FormControl>
                           <FormDescription>
                              Select the book for this order item
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Quantity and Price */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="1"
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

                     <FormField
                        control={form.control}
                        name="individualPrice"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Price per Unit</FormLabel>
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
                  </div>

                  {/* Subtotal */}
                  <FormField
                     control={form.control}
                     name="subtotal"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Subtotal</FormLabel>
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
                           <FormDescription>
                              Total for this item (quantity × price)
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Action Buttons */}
                  {!isViewMode && (
                     <div className="flex justify-between">
                        <Button type="submit" disabled={isSubmitting}>
                           {isSubmitting
                              ? "Saving..."
                              : isCreateMode
                              ? "Create Order Item"
                              : "Update Order Item"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Order Item
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
            itemName={`Order Item #${initialData?.orderItemID}` || ""}
            itemType="order item"
         />
      </Card>
   );
}
