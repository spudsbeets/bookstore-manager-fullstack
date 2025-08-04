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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { ShoppingCart } from "lucide-react";
import CustomersService from "@/services/CustomersService";
import SalesRateLocationsService from "@/services/SalesRateLocationsService";

const customerOrderSchema = z.object({
   customerID: z.number(),
   orderDate: z.string(),
   orderTime: z.string(),
   total: z.number().min(0, "Total must be at least 0"),
   taxRate: z.number().min(0, "Tax rate must be at least 0"),
   salesRateID: z.number(),
});

type CustomerOrderFormData = z.infer<typeof customerOrderSchema>;

interface CustomerOrdersFormProps {
   mode: "create" | "edit" | "view";
   customerID: number;
   initialData?: any;
   onSave: (data: CustomerOrderFormData) => void;
   onDelete?: () => void;
}

export function CustomerOrdersForm({
   mode,
   customerID,
   initialData,
   onSave,
   onDelete,
}: CustomerOrdersFormProps) {
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [customers, setCustomers] = useState<any[]>([]);
   const [salesRates, setSalesRates] = useState<any[]>([]);

   // Fetch customers and sales rates data
   useEffect(() => {
      const fetchData = async () => {
         try {
            const [customersResponse, salesRatesResponse] = await Promise.all([
               CustomersService.getAll(),
               SalesRateLocationsService.getAll(),
            ]);
            setCustomers(customersResponse.data);
            setSalesRates(salesRatesResponse.data);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, []);

   const form = useForm<CustomerOrderFormData>({
      resolver: zodResolver(customerOrderSchema),
      defaultValues: {
         customerID: customerID,
         orderDate:
            initialData?.orderDate || new Date().toISOString().split("T")[0],
         orderTime:
            initialData?.orderTime || new Date().toTimeString().split(" ")[0],
         total: initialData?.total || 0,
         taxRate: initialData?.taxRate || 0,
         salesRateID: initialData?.salesRateID || 0,
      },
   });

   const onSubmit = (data: CustomerOrderFormData) => {
      console.log("Customer order data:", data);
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

   // Get the current customer and sales rate details for display
   const currentCustomer = customers.find(
      (customer: any) => customer.customerID === customerID
   );
   const selectedSalesRate = initialData
      ? salesRates.find(
           (rate: any) => rate.salesRateID === initialData.salesRateID
        )
      : null;

   return (
      <div className="max-w-2xl mx-auto space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  {mode === "create" && "Add Customer Order"}
                  {mode === "edit" && "Edit Customer Order"}
                  {mode === "view" && "View Customer Order"}
               </CardTitle>
               <CardDescription>
                  {mode === "create" && "Create a new order for this customer"}
                  {mode === "edit" && "Modify the order details"}
                  {mode === "view" && "View order details"}
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     {/* Customer Information (Read-only) */}
                     <div className="space-y-2">
                        <Label>Customer</Label>
                        <div className="p-3 bg-muted rounded-md">
                           <div className="font-medium">
                              {currentCustomer?.firstName}{" "}
                              {currentCustomer?.lastName}
                           </div>
                           <div className="text-sm text-muted-foreground">
                              ID: {customerID} | Email: {currentCustomer?.email}
                           </div>
                        </div>
                     </div>

                     {/* Order Date */}
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
                                    disabled={mode === "view"}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Order Time */}
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
                                    disabled={mode === "view"}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Total Amount */}
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
                                       field.onChange(Number(e.target.value))
                                    }
                                    disabled={mode === "view"}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Total order amount in USD
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Sales Rate Selection (Create mode only) */}
                     {mode === "create" && (
                        <FormField
                           control={form.control}
                           name="salesRateID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Sales Tax Location</FormLabel>
                                 <Select
                                    onValueChange={(value) =>
                                       field.onChange(Number(value))
                                    }
                                    defaultValue={field.value?.toString()}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Select a location" />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {salesRates.map((rate: any) => (
                                          <SelectItem
                                             key={rate.salesRateID}
                                             value={rate.salesRateID.toString()}
                                          >
                                             {rate.location} ({rate.taxRate}%)
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Current Sales Rate (Edit/View mode) */}
                     {(mode === "edit" || mode === "view") &&
                        selectedSalesRate && (
                           <div className="space-y-2">
                              <Label>Sales Tax Location</Label>
                              <div className="p-3 bg-muted rounded-md">
                                 <div className="font-medium">
                                    {selectedSalesRate.location}
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                    Tax Rate: {selectedSalesRate.taxRate}%
                                 </div>
                              </div>
                           </div>
                        )}

                     {/* Tax Rate (Auto-populated from sales rate) */}
                     <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Tax Rate (%)</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    step="0.0001"
                                    placeholder="0.0000"
                                    {...field}
                                    onChange={(e) =>
                                       field.onChange(Number(e.target.value))
                                    }
                                    disabled={mode === "view"}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Tax rate for this order
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Action Buttons */}
                     <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={mode === "view"}>
                           {mode === "create" && "Create Order"}
                           {mode === "edit" && "Update Order"}
                           {mode === "view" && "View Details"}
                        </Button>

                        {mode === "edit" && onDelete && (
                           <DeleteConfirmationDialog
                              isOpen={showDeleteDialog}
                              onOpenChange={setShowDeleteDialog}
                              onConfirm={handleDelete}
                              isDeleting={isDeleting}
                              itemName={`Order #${
                                 initialData?.orderID || "this order"
                              }`}
                              itemType="customer order"
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
