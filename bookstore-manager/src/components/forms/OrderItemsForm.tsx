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

"use client";

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
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Edit, Eye, Trash2, Loader2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";
import OrderItemsService from "@/services/OrderItemsService";
import BooksService from "@/services/BooksService";

// Enhanced schema with input sanitization
const orderItemSchema = z.object({
   orderItemID: z.number().optional(),
   orderID: z.number().min(1, "Order is required"),
   bookID: z.number().min(1, "Book is required"),
   quantity: z.number().min(1, "Quantity must be at least 1"),
   individualPrice: z.number().min(0, "Price must be positive"),
   subtotal: z.number().min(0, "Subtotal must be positive"),
});

type OrderItemFormValues = z.infer<typeof orderItemSchema>;

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
   const [isLoading, setIsLoading] = useState(true);
   const [books, setBooks] = useState<any[]>([]);

   const form = useForm<OrderItemFormValues>({
      resolver: zodResolver(orderItemSchema),
      defaultValues: {
         orderID: orderID,
         bookID: 0,
         quantity: 1,
         individualPrice: 0,
         subtotal: 0,
      },
   });

   // Update form values when initialData changes
   useEffect(() => {
      if (initialData && books.length > 0) {
         form.setValue("orderItemID", initialData.orderItemID || 0);
         form.setValue("bookID", initialData.bookID || 0);
         form.setValue("quantity", initialData.quantity || 1);

         const price =
            typeof initialData.individualPrice === "string"
               ? parseFloat(initialData.individualPrice)
               : initialData.individualPrice || 0;
         form.setValue("individualPrice", price);

         const subtotal =
            typeof initialData.subtotal === "string"
               ? parseFloat(initialData.subtotal)
               : initialData.subtotal || 0;
         form.setValue("subtotal", subtotal);
      }
   }, [initialData, books, form]);

   // Auto-calculate subtotal whenever quantity or price changes
   useEffect(() => {
      const subscription = form.watch((_, { name }) => {
         if (name === "quantity" || name === "individualPrice") {
            const quantity = form.getValues("quantity") || 0;
            const price = form.getValues("individualPrice") || 0;
            const subtotal = quantity * price;
            form.setValue("subtotal", subtotal);
         }
      });
      return () => subscription.unsubscribe();
   }, [form]);

   useEffect(() => {
      const fetchBooks = async () => {
         try {
            setIsLoading(true);
            const booksResponse = await BooksService.getAll();
            setBooks(booksResponse.data);
         } catch (error) {
            console.error("Error fetching books:", error);
            toast.error("Failed to load books", {
               description: "Please refresh the page and try again.",
            });
         } finally {
            setIsLoading(false);
         }
      };

      fetchBooks();
   }, []);

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: OrderItemFormValues) {
      setIsSubmitting(true);
      try {
         // Ensure subtotal is calculated correctly before submission
         const calculatedSubtotal = data.quantity * data.individualPrice;
         const submissionData = {
            ...data,
            subtotal: calculatedSubtotal,
         };

         if (isCreateMode) {
            // Create new order item
            await OrderItemsService.create(submissionData);
            toast.success("Order item created successfully!", {
               description: "The order item has been added to the order.",
            });
         } else if (isEditMode && initialData?.orderItemID) {
            // Update existing order item
            await OrderItemsService.update(
               initialData.orderItemID,
               submissionData
            );
            toast.success("Order item updated successfully!", {
               description: "The order item has been updated.",
            });
         }

         if (onSave) {
            onSave(submissionData);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving order item:", error);
         toast.error("Failed to save order item", {
            description:
               "There was an error saving the order item. Please try again.",
         });
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.orderItemID) {
            await OrderItemsService.remove(initialData.orderItemID);
            toast.success("Order item deleted successfully!", {
               description: "The order item has been removed from the order.",
            });
         }
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting order item:", error);
         toast.error("Failed to delete order item", {
            description:
               "There was an error deleting the order item. Please try again.",
         });
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

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
               </CardTitle>
               <CardDescription>Loading books data...</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
               </div>
            </CardContent>
         </Card>
      );
   }

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
                                    id="orderItemID"
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
                                 id="orderID"
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
                                 options={books.map((book) => ({
                                    value: book.bookID.toString(),
                                    label: `${book.title} - $${
                                       typeof book.price === "number"
                                          ? book.price.toFixed(2)
                                          : parseFloat(book.price).toFixed(2)
                                    }`,
                                 }))}
                                 value={field.value?.toString() || ""}
                                 onValueChange={(value) => {
                                    const bookID = Number(value);
                                    field.onChange(bookID);

                                    // Auto-populate price when book is selected
                                    const selectedBook = books.find(
                                       (book) => book.bookID === bookID
                                    );
                                    if (selectedBook) {
                                       const bookPrice =
                                          typeof selectedBook.price === "string"
                                             ? parseFloat(selectedBook.price)
                                             : selectedBook.price;
                                       form.setValue(
                                          "individualPrice",
                                          bookPrice
                                       );
                                       // Recalculate subtotal
                                       const quantity =
                                          form.getValues("quantity");
                                       form.setValue(
                                          "subtotal",
                                          bookPrice * quantity
                                       );
                                    }
                                 }}
                                 placeholder="Select a book"
                                 searchPlaceholder="Search books..."
                                 emptyMessage="No books found."
                                 disabled={isViewMode}
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
                                    id="quantity"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="1"
                                    value={field.value || ""}
                                    onChange={(e) => {
                                       const value = e.target.value;
                                       if (
                                          value === "" ||
                                          /^\d+$/.test(value)
                                       ) {
                                          const quantity =
                                             value === ""
                                                ? 0
                                                : parseInt(value) || 0;
                                          field.onChange(quantity);

                                          // Recalculate subtotal when quantity changes
                                          const price =
                                             form.getValues("individualPrice");
                                          form.setValue(
                                             "subtotal",
                                             price * quantity
                                          );
                                       }
                                    }}
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
                                    id="individualPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={
                                       field.value
                                          ? typeof field.value === "number"
                                             ? field.value.toFixed(2)
                                             : parseFloat(field.value).toFixed(
                                                  2
                                               )
                                          : "0.00"
                                    }
                                    onChange={(e) => {
                                       const value = e.target.value;
                                       // Allow decimal input with more permissive regex
                                       if (
                                          value === "" ||
                                          /^\d*\.?\d{0,2}$/.test(value) ||
                                          value === "."
                                       ) {
                                          const price =
                                             value === "" || value === "."
                                                ? 0
                                                : parseFloat(value) || 0;
                                          field.onChange(price);

                                          // Recalculate subtotal when price changes
                                          const quantity =
                                             form.getValues("quantity");
                                          form.setValue(
                                             "subtotal",
                                             price * quantity
                                          );
                                       }
                                    }}
                                    onKeyDown={(e) => {
                                       // Allow decimal point, backspace, delete, arrow keys, etc.
                                       if (
                                          e.key === "." ||
                                          e.key === "Backspace" ||
                                          e.key === "Delete" ||
                                          e.key === "ArrowLeft" ||
                                          e.key === "ArrowRight" ||
                                          e.key === "Tab" ||
                                          /^\d$/.test(e.key)
                                       ) {
                                          return;
                                       }
                                       e.preventDefault();
                                    }}
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
                                 id="subtotal"
                                 type="text"
                                 inputMode="decimal"
                                 placeholder="0.00"
                                 value={
                                    field.value
                                       ? typeof field.value === "number"
                                          ? field.value.toFixed(2)
                                          : parseFloat(field.value).toFixed(2)
                                       : "0.00"
                                 }
                                 disabled={true}
                                 className="bg-muted"
                              />
                           </FormControl>
                           <FormDescription>
                              Total for this item (quantity × price) -
                              calculated automatically
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
