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
import SalesRateLocationsService from "@/services/SalesRateLocationsService";
import { toast } from "sonner";

const salesRateLocationSchema = z.object({
   salesRateID: z.number().optional(),
   county: z.string().min(1, "County is required"),
   state: z.string().min(1, "State is required"),
   taxRate: z.string().min(1, "Tax rate is required"),
});

type SalesRateLocationFormValues = z.infer<typeof salesRateLocationSchema>;

interface SalesRateLocationsFormProps {
   mode: "create" | "edit" | "view";
   initialData?: SalesRateLocationFormValues & { location?: string };
   onSave?: (data: SalesRateLocationFormValues) => void;
   onDelete?: () => void;
}

export function SalesRateLocationsForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: SalesRateLocationsFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<SalesRateLocationFormValues>({
      resolver: zodResolver(salesRateLocationSchema),
      defaultValues: initialData
         ? {
              ...initialData,
              // Parse location into county and state if it exists
              county: initialData.location
                 ? initialData.location.split(", ")[0] || ""
                 : "",
              state: initialData.location
                 ? initialData.location.split(", ")[1] || ""
                 : "",
           }
         : {
              county: "",
              state: "",
              taxRate: "",
           },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: SalesRateLocationFormValues) {
      setIsSubmitting(true);
      try {
         // Convert separate fields to location format for API
         const apiData = {
            location: `${data.county}, ${data.state}`,
            taxRate: data.taxRate,
         };

         if (isCreateMode) {
            // Create new sales rate location
            await SalesRateLocationsService.create(apiData);
            toast.success("Sales rate location created successfully!");
         } else if (isEditMode && initialData?.salesRateID) {
            // Update existing sales rate location
            await SalesRateLocationsService.update(
               initialData.salesRateID,
               apiData
            );
            toast.success("Sales rate location updated successfully!");
         }

         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving sales rate location:", error);
         toast.error("Failed to save sales rate location. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.salesRateID) {
            await SalesRateLocationsService.remove(initialData.salesRateID);
            toast.success("Sales rate location deleted successfully!");
         }
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting sales rate location:", error);
         toast.error("Failed to delete sales rate location. Please try again.");
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Sales Rate Location";
         case "edit":
            return "Edit Sales Rate Location";
         case "view":
            return "View Sales Rate Location";
         default:
            return "Sales Rate Location";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new sales rate location to your bookstore database";
         case "edit":
            return "Update sales rate location information";
         case "view":
            return "View sales rate location details";
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
                     Sales rate location {isCreateMode ? "created" : "updated"}{" "}
                     successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Sales Rate ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.salesRateID && (
                     <FormField
                        control={form.control}
                        name="salesRateID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Sales Rate ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this sales rate location
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* County Field */}
                  <FormField
                     control={form.control}
                     name="county"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>County</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter county"
                                 {...field}
                                 disabled={isViewMode}
                              />
                           </FormControl>
                           <FormDescription>
                              The county for this location
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* State Field */}
                  <FormField
                     control={form.control}
                     name="state"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>State</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter state"
                                 {...field}
                                 disabled={isViewMode}
                              />
                           </FormControl>
                           <FormDescription>
                              The state for this location
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Tax Rate */}
                  <FormField
                     control={form.control}
                     name="taxRate"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Tax Rate (%)</FormLabel>
                           <FormControl>
                              <Input
                                 type="text"
                                 inputMode="decimal"
                                 placeholder="0.00"
                                 {...field}
                                 disabled={isViewMode}
                              />
                           </FormControl>
                           <FormDescription>
                              The tax rate for this location
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
                              ? "Create Sales Rate Location"
                              : "Update Sales Rate Location"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Sales Rate Location
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
            itemName={initialData?.county || ""}
            itemType="sales rate location"
         />
      </Card>
   );
}
