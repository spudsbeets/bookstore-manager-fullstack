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
import { CheckCircle, Edit, Eye, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import OrdersService from "@/services/OrdersService";
import CustomersService from "@/services/CustomersService";
import SalesRateLocationsService from "@/services/SalesRateLocationsService";

// Enhanced schema with input sanitization
const orderSchema = z.object({
   orderID: z.number().optional(),
   customerID: z.number().min(1, "Customer is required"),
   orderDate: z.string().min(1, "Order date is required"),
   orderTime: z.string(),
   total: z.number().min(0, "Total must be positive"),
   taxRate: z.number().min(0, "Tax rate must be positive"),
   salesRateID: z.number().min(1, "Sales rate location is required"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

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
   const [customers, setCustomers] = useState<any[]>([]);
   const [salesRateLocations, setSalesRateLocations] = useState<any[]>([]);

   // Fetch customers and sales rate locations data
   useEffect(() => {
      const fetchData = async () => {
         try {
            const [customersResponse, salesRatesResponse] = await Promise.all([
               CustomersService.getAll(),
               SalesRateLocationsService.getAll(),
            ]);
            setCustomers(customersResponse.data);
            setSalesRateLocations(salesRatesResponse.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, []);

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
         if (isCreateMode) {
            // Create new order
            await OrdersService.create(data);
         } else if (isEditMode && initialData?.orderID) {
            // Update existing order
            await OrdersService.update(initialData.orderID, data);
         }

         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving order:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.orderID) {
            await OrdersService.remove(initialData.orderID);
         }
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting order:", error);
         // You might want to show an error message to the user here
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
                                    id="orderID"
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
                                    id="orderDate"
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
                                    id="orderTime"
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
                                    id="total"
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
                                    id="taxRate"
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
                                    options={customers.map((customer: any) => ({
                                       value: customer.customerID.toString(),
                                       label: `${customer.firstName} ${customer.lastName} - ${customer.email}`,
                                    }))}
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
                                    options={salesRateLocations.map(
                                       (location: any) => ({
                                          value: location.salesRateID.toString(),
                                          label: `${location.location} - ${location.taxRate}%`,
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
