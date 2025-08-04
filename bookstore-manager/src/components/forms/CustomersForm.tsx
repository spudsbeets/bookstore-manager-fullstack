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
import CustomersService from "@/services/CustomersService";

// Enhanced schema with input sanitization
const customerSchema = z.object({
   customerID: z.number().optional(),
   firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .regex(
         /^[a-zA-Z\s'-]+$/,
         "First name can only contain letters, spaces, hyphens, and apostrophes"
      )
      .transform((val) => val.trim()),
   lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .regex(
         /^[a-zA-Z\s'-]+$/,
         "Last name can only contain letters, spaces, hyphens, and apostrophes"
      )
      .transform((val) => val.trim()),
   email: z
      .string()
      .email("Invalid email address")
      .max(100, "Email must be less than 100 characters")
      .transform((val) => val.trim().toLowerCase())
      .nullable(),
   phoneNumber: z
      .string()
      .regex(
         /^[\d\s\-\(\)\+]*$/,
         "Phone number can only contain digits, spaces, hyphens, parentheses, and plus signs"
      )
      .max(20, "Phone number must be less than 20 characters")
      .transform((val) => val.trim())
      .nullable(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomersFormProps {
   mode: "create" | "edit" | "view";
   initialData?: CustomerFormValues;
   onSave?: (data: CustomerFormValues) => void;
   onDelete?: () => void;
}

export function CustomersForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: CustomersFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<CustomerFormValues>({
      resolver: zodResolver(customerSchema),
      defaultValues: initialData || {
         firstName: "",
         lastName: "",
         email: null,
         phoneNumber: null,
      },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: CustomerFormValues) {
      setIsSubmitting(true);
      try {
         if (isCreateMode) {
            // Create new customer
            await CustomersService.create(data);
         } else if (isEditMode && initialData?.customerID) {
            // Update existing customer
            await CustomersService.update(initialData.customerID, data);
         }

         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving customer:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.customerID) {
            await CustomersService.remove(initialData.customerID);
         }
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting customer:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Customer";
         case "edit":
            return "Edit Customer";
         case "view":
            return "View Customer";
         default:
            return "Customer";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new customer to your bookstore database";
         case "edit":
            return "Update customer information";
         case "view":
            return "View customer details";
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
                     Customer {isCreateMode ? "created" : "updated"}{" "}
                     successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Customer ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.customerID && (
                     <FormField
                        control={form.control}
                        name="customerID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Customer ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this customer
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter first name"
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
                        name="lastName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter last name"
                                    {...field}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    {...field}
                                    value={field.value || ""}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Customer's email address (optional)
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter phone number"
                                    {...field}
                                    value={field.value || ""}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormDescription>
                                 Customer's phone number (optional)
                              </FormDescription>
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
                              ? "Create Customer"
                              : "Update Customer"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Customer
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
            itemName={
               `${initialData?.firstName} ${initialData?.lastName}` || ""
            }
            itemType="customer"
         />
      </Card>
   );
}
