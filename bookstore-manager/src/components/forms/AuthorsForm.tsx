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
import AuthorsService from "@/services/AuthorsService";

// Enhanced schema with input sanitization
const authorSchema = z.object({
   authorID: z.number().optional(),
   firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .regex(
         /^[a-zA-Z\s'-]+$/,
         "First name can only contain letters, spaces, hyphens, and apostrophes"
      )
      .transform((val) => val.trim()),
   middleName: z
      .string()
      .max(50, "Middle name must be less than 50 characters")
      .regex(
         /^[a-zA-Z\s'-]*$/,
         "Middle name can only contain letters, spaces, hyphens, and apostrophes"
      )
      .transform((val) => val.trim())
      .nullable(),
   lastName: z
      .string()
      .max(50, "Last name must be less than 50 characters")
      .regex(
         /^[a-zA-Z\s'-]*$/,
         "Last name can only contain letters, spaces, hyphens, and apostrophes"
      )
      .transform((val) => val.trim())
      .nullable(),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

interface AuthorsFormProps {
   mode: "create" | "edit" | "view";
   initialData?: AuthorFormValues;
   onSave?: (data: AuthorFormValues) => void;
   onDelete?: () => void;
}

export function AuthorsForm({
   mode,
   initialData,
   onSave,
   onDelete,
}: AuthorsFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const form = useForm<AuthorFormValues>({
      resolver: zodResolver(authorSchema),
      defaultValues: initialData || {
         firstName: "",
         middleName: null,
         lastName: null,
      },
   });

   useEffect(() => {
      if (initialData) {
         form.reset(initialData);
      }
   }, [initialData, form]);

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: AuthorFormValues) {
      setIsSubmitting(true);
      try {
         if (isCreateMode) {
            // Create new author
            await AuthorsService.create(data);
         } else if (isEditMode && initialData?.authorID) {
            // Update existing author
            await AuthorsService.update(initialData.authorID, data);
         }

         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
         console.error("Error saving author:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.authorID) {
            await AuthorsService.remove(initialData.authorID);
         }
         if (onDelete) {
            onDelete();
         }
      } catch (error) {
         console.error("Error deleting author:", error);
         // You might want to show an error message to the user here
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Author";
         case "edit":
            return "Edit Author";
         case "view":
            return "View Author";
         default:
            return "Author";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new author to your bookstore database";
         case "edit":
            return "Update author information";
         case "view":
            return "View author details";
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
                     Author {isCreateMode ? "created" : "updated"} successfully!
                  </AlertDescription>
               </Alert>
            )}

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Author ID (read-only for edit/view) */}
                  {!isCreateMode && initialData?.authorID && (
                     <FormField
                        control={form.control}
                        name="authorID"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Author ID</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled
                                    className="bg-muted"
                                 />
                              </FormControl>
                              <FormDescription>
                                 Unique identifier for this author
                              </FormDescription>
                           </FormItem>
                        )}
                     />
                  )}

                  {/* Name Fields */}
                  <div className="grid grid-cols-3 gap-4">
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
                              <FormDescription>Required</FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Middle Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter middle name (optional)"
                                    {...field}
                                    value={field.value || ""}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
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
                                    value={field.value || ""}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormDescription>Optional</FormDescription>
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
                              ? "Create Author"
                              : "Update Author"}
                        </Button>
                        {isEditMode && (
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              className="flex items-center gap-2"
                           >
                              <Trash2 className="h-4 w-4" />
                              Delete Author
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
               initialData?.firstName && initialData?.lastName
                  ? `${initialData.firstName} ${initialData.lastName}`
                  : "this author"
            }
            itemType="author"
         />
      </Card>
   );
}
