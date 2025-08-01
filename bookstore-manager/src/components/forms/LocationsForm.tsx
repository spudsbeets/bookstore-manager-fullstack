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
import LocationsService from "@/services/LocationsService";

// Enhanced schema with input sanitization
const locationSchema = z.object({
   locationID: z.number().optional(),
   locationName: z.string()
      .min(1, "Location name is required")
      .max(100, "Location name must be less than 100 characters")
      .regex(/^[a-zA-Z0-9\s&.,'-]+$/, "Location name can only contain letters, numbers, spaces, and common punctuation")
      .transform(val => val.trim()),
   address: z.string()
      .max(200, "Address must be less than 200 characters")
      .regex(/^[a-zA-Z0-9\s&.,'-]+$/, "Address can only contain letters, numbers, spaces, and common punctuation")
      .transform(val => val.trim())
      .optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationsFormProps {
   mode: "create" | "edit" | "view";
   initialData?: LocationFormValues;
   onSave?: (data: LocationFormValues) => void;
   onDelete?: () => void;
}

export function LocationsForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: LocationsFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<LocationFormValues>({
      resolver: zodResolver(locationSchema),
      defaultValues: initialData || {
         locationName: "",
      },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: LocationFormValues) {
      setIsSubmitting(true);
      try {
         if (isCreateMode) {
            // Create new location
            await LocationsService.create(data);
         } else if (isEditMode && initialData?.locationID) {
            // Update existing location
            await LocationsService.update(initialData.locationID, data);
         }
         
         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving location:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.locationID) {
            await LocationsService.remove(initialData.locationID);
         }
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting location:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Storage Location";
         case "edit":
            return "Edit Storage Location";
         case "view":
            return "View Storage Location";
         default:
            return "Storage Location";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new storage location to your bookstore database";
         case "edit":
            return "Update storage location information";
         case "view":
            return "View storage location details";
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
                     Storage location {isCreateMode ? "created" : "updated"}{" "}
                     successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Location ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.locationID && (
                     <FormField
                        control={form.control}
                        name="locationID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Location ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this storage location
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Location Name */}
                  <FormField
                     control={form.control}
                     name="locationName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Location Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter location name"
                                 {...field}
                                 disabled={isViewMode}
                              />
                           </FormControl>
                           <FormDescription>
                              The name of the storage location
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
                              ? "Create Location"
                              : "Update Location"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Location
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
            itemName={initialData?.locationName || ""}
            itemType="storage location"
         />
      </Card>
   );
}
