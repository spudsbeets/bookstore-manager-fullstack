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

const publisherSchema = z.object({
   publisherID: z.number().optional(),
   publisherName: z.string().min(1, "Publisher name is required"),
});

type PublisherFormValues = z.infer<typeof publisherSchema>;

interface PublishersFormProps {
   mode: "create" | "edit" | "view";
   initialData?: PublisherFormValues;
   onSave?: (data: PublisherFormValues) => void;
   onDelete?: () => void;
}

export function PublishersForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: PublishersFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<PublisherFormValues>({
      resolver: zodResolver(publisherSchema),
      defaultValues: initialData || {
         publisherName: "",
      },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: PublisherFormValues) {
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
         console.error("Error saving publisher:", error);
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
         console.error("Error deleting publisher:", error);
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Publisher";
         case "edit":
            return "Edit Publisher";
         case "view":
            return "View Publisher";
         default:
            return "Publisher";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new publisher to your bookstore database";
         case "edit":
            return "Update publisher information";
         case "view":
            return "View publisher details";
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
                     Publisher {isCreateMode ? "created" : "updated"}{" "}
                     successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Publisher ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.publisherID && (
                     <FormField
                        control={form.control}
                        name="publisherID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Publisher ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this publisher
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Publisher Name */}
                  <FormField
                     control={form.control}
                     name="publisherName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Publisher Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter publisher name"
                                 {...field}
                                 disabled={isViewMode}
                              />
                           </FormControl>
                           <FormDescription>
                              The name of the publishing company
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
                              ? "Create Publisher"
                              : "Update Publisher"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Publisher
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
            itemName={initialData?.publisherName || ""}
            itemType="publisher"
         />
      </Card>
   );
}
