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
import { toast } from "sonner";
import GenresService from "@/services/GenresService";

// Enhanced schema with input sanitization
const genreSchema = z.object({
   genreID: z.number().optional(),
   genreName: z
      .string()
      .min(1, "Genre name is required")
      .max(50, "Genre name must be less than 50 characters")
      .regex(
         /^[a-zA-Z\s&-]+$/,
         "Genre name can only contain letters, spaces, and ampersands"
      )
      .transform((val) => val.trim()),
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
      } catch (error: any) {
         console.error("Error saving genre:", error);

         // Check if it's a duplicate genre error
         if (error.response?.status === 409) {
            const errorData = error.response.data;
            toast.error(errorData.error || "Genre already exists", {
               description:
                  errorData.suggestion ||
                  "Please choose a different genre name.",
               duration: Infinity,
            });
         } else {
            toast.error("Failed to save genre", {
               description:
                  "There was an error saving the genre. Please try again.",
               duration: Infinity,
            });
         }
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
