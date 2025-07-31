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

const orderSchema = z.object({
   orderID: z.number().optional(),
   orderDate: z.string().min(1, "Order date is required"),
   orderTime: z.string().min(1, "Order time is required"),
   total: z.number().min(0, "Total must be positive"),
   taxRate: z.number().min(0, "Tax rate must be positive"),
   customerID: z.number().min(1, "Customer is required"),
   salesRateID: z.number().min(1, "Sales rate location is required"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

// Sample data for dropdowns
const sampleCustomers: Array<{
   customerID: number;
   firstName: string;
   lastName: string;
   email: string;
}> = [
   {
      customerID: 1,
      firstName: "Reggie",
      lastName: "Reggerson",
      email: "regreg@reg.com",
   },
   {
      customerID: 2,
      firstName: "Gail",
      lastName: "Nightingstocks",
      email: "gailsmail@gmail.com",
   },
   {
      customerID: 3,
      firstName: "Filipe",
      lastName: "Redsky",
      email: "filipe@hotmail.com",
   },
];

const sampleSalesRateLocations: Array<{
   salesRateID: number;
   county: string;
   state: string;
   taxRate: number;
}> = [
   {
      salesRateID: 1,
      county: "Polk",
      state: "Iowa",
      taxRate: 4.2,
   },
   {
      salesRateID: 2,
      county: "Jerome",
      state: "Idaho",
      taxRate: 5.1,
   },
   {
      salesRateID: 3,
      county: "San Francisco",
      state: "California",
      taxRate: 8.625,
   },
];

interface OrdersFormProps {
   mode: "create" | "edit" | "view";
   initialData?: OrderFormValues;
   onSave?: (data: OrderFormValues) => void;
   onDelete?: () => void;
}

export function OrdersForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: OrdersFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<OrderFormValues>({
      resolver: zodResolver(orderSchema),
      defaultValues: initialData || {
         orderDate: "",
         orderTime: "",
         total: 0,
         taxRate: 0,
         customerID: 0,
         salesRateID: 0,
      },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: OrderFormValues) {
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
         console.error("Error saving order:", error);
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
         console.error("Error deleting order:", error);
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Order";
         case "edit":
            return "Edit Order";
         case "view":
            return "View Order";
         default:
            return "Order";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new order to your bookstore database";
         case "edit":
            return "Update order information";
         case "view":
            return "View order details";
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
                     Order {isCreateMode ? "created" : "updated"} successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Order ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.orderID && (
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
                                 Unique identifier for this order
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="orderDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Order Date</FormLabel>
                              <FormControl>
                                 <Input
                                    type="date"
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
                        name="orderTime"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Order Time</FormLabel>
                              <FormControl>
                                 <Input
                                    type="time"
                                    {...field}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Financial Fields */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="total"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Total Amount</FormLabel>
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
                        name="taxRate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Tax Rate (%)</FormLabel>
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

                  {/* Customer and Location */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="customerID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Customer</FormLabel>
                              <FormControl>
                                 <SearchableSelect
                                    options={sampleCustomers.map(
                                       (customer) => ({
                                          value: customer.customerID.toString(),
                                          label: `${customer.firstName} ${customer.lastName} - ${customer.email}`,
                                       })
                                    )}
                                    value={field.value?.toString()}
                                    onValueChange={(value) =>
                                       field.onChange(Number(value))
                                    }
                                    placeholder="Select a customer"
                                    searchPlaceholder="Search customers..."
                                    emptyMessage="No customers found."
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="salesRateID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Sales Rate Location</FormLabel>
                              <FormControl>
                                 <SearchableSelect
                                    options={sampleSalesRateLocations.map(
                                       (location) => ({
                                          value: location.salesRateID.toString(),
                                          label: `${location.county}, ${location.state} - ${location.taxRate}%`,
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
                  </div>

                  {/* Action Buttons */}
                  {!isViewMode && (
                     <div className="flex justify-between">
                        <Button type="submit" disabled={isSubmitting}>
                           {isSubmitting
                              ? "Saving..."
                              : isCreateMode
                              ? "Create Order"
                              : "Update Order"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Order
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
            itemName={`#${initialData?.orderID}` || ""}
            itemType="order"
         />
      </Card>
   );
}
