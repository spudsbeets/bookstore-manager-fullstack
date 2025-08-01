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
import GenresService from "@/services/GenresService";

// Enhanced schema with input sanitization
const genreSchema = z.object({
   genreID: z.number().optional(),
   genreName: z.string()
      .min(1, "Genre name is required")
      .max(50, "Genre name must be less than 50 characters")
      .regex(/^[a-zA-Z\s&-]+$/, "Genre name can only contain letters, spaces, and ampersands")
      .transform(val => val.trim()),
});

type GenreFormValues = z.infer<typeof genreSchema>;

interface GenresFormProps {
   mode: "create" | "edit" | "view";
   initialData?: GenreFormValues;
   onSave?: (data: GenreFormValues) => void;
   onDelete?: () => void;
}

export function GenresForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: GenresFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<GenreFormValues>({
      resolver: zodResolver(genreSchema),
      defaultValues: initialData || {
         genreName: "",
      },
   });

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: GenreFormValues) {
      setIsSubmitting(true);
      try {
         if (isCreateMode) {
            // Create new genre
            await GenresService.create(data);
         } else if (isEditMode && initialData?.genreID) {
            // Update existing genre
            await GenresService.update(initialData.genreID, data);
         }
         
         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving genre:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.genreID) {
            await GenresService.remove(initialData.genreID);
         }
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting genre:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Genre";
         case "edit":
            return "Edit Genre";
         case "view":
            return "View Genre";
         default:
            return "Genre";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new genre to your bookstore database";
         case "edit":
            return "Update genre information";
         case "view":
            return "View genre details";
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
                     Genre {isCreateMode ? "created" : "updated"} successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Genre ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.genreID && (
                     <FormField
                        control={form.control}
                        name="genreID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Genre ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this genre
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Genre Name */}
                  <FormField
                     control={form.control}
                     name="genreName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Genre Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter genre name"
                                 {...field}
                                 disabled={isViewMode}
                              />
                           </FormControl>
                           <FormDescription>
                              The name of the book genre
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
                              ? "Create Genre"
                              : "Update Genre"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Genre
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
            itemName={initialData?.genreName || ""}
            itemType="genre"
         />
      </Card>
   );
}
