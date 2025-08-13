/**
 * @date August 4, 2025
 * @based_on The form architecture from a CS 361 inventory application project. This includes the use of shadcn/ui components, TypeScript, Zod for schema validation, and React Hook Form for state management.
 *
 * @degree_of_originality The foundational pattern for creating forms—defining a Zod schema, using the zodResolver with react-hook-form, and composing the UI with shadcn/ui components—is adapted from the prior project. However, each form's specific schema, fields, and submission logic have been developed uniquely for this application's requirements.
 *
 * @source_url N/A - Based on a prior personal project for CS 361.
 *
 * @ai_tool_usage The form components were scaffolded using Cursor, an AI code editor, based on the established architecture and the specific data model for each page. The generated code was then refined and customized.
 *
 * @recent_fixes August 13, 2025 - Fixed publication date off-by-one issue caused by timezone handling in date-fns.
 *                Implemented local timezone-safe date handling using new Date(date.getFullYear(), date.getMonth(), date.getDate())
 *                to avoid UTC conversion issues. Enhanced error handling to show specific backend validation messages
 *                instead of generic "Failed to save book" errors. These fixes ensure proper date selection and
 *                better user feedback for validation failures.
 *
 * @ai_tool_usage_recent Cursor AI was used to implement the timezone-safe date handling and enhanced error message
 *                       display, addressing user-reported issues with date selection and validation feedback.
 * it didnt work on the first try and required refinement as the view and update crashed the website due it not formatting the date correctly
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
   useFormField,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";

import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
   CheckCircle,
   Edit,
   Eye,
   Trash2,
   CalendarIcon,
   Pencil,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import BooksService, {
   type Book,
   type CreateBookDTO,
} from "@/services/BooksService";
import PublishersService from "@/services/PublishersService";
import AuthorsService from "@/services/AuthorsService";
import GenresService from "@/services/GenresService";

const bookSchema = z.object({
   bookID: z.number().optional(),
   title: z.string().min(1, "Title is required"),
   publicationDate: z.string().min(1, "Publication date is required"),
   "isbn-10": z.string().nullable().optional(),
   "isbn-13": z.string().nullable().optional(),
   price: z.string().min(1, "Price is required"),
   inventoryQty: z.number().optional(), // Will be calculated automatically from BookLocations
   publisher: z.string().nullable().optional(),
   authors: z.string().nullable().optional(),
   genres: z.string().nullable().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

// Data interfaces
interface Publisher {
   publisherID: number;
   publisherName: string;
}

interface Author {
   authorID: number;
   fullName: string;
}

interface Genre {
   genreID: number;
   genreName: string;
}

interface BooksFormProps {
   mode: "create" | "edit" | "view";
   initialData?: Book;
   onSave?: (data: BookFormValues) => void;
   onDelete?: ((book: Book) => void) | (() => void);
   onEdit?: () => void; // <-- add this
}

export function BooksForm({
   mode,
   initialData,
   onSave,
   onDelete,
   onEdit,
}: BooksFormProps) {
   console.log("BooksForm rendered with:", {
      mode,
      initialData: initialData
         ? { bookID: initialData.bookID, title: initialData.title }
         : null,
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [publishers, setPublishers] = useState<Publisher[]>([]);
   const [authors, setAuthors] = useState<Author[]>([]);
   const [genres, setGenres] = useState<Genre[]>([]);
   const [isLoadingData, setIsLoadingData] = useState(true);

   // Normalize incoming date strings (ISO or yyyy-MM-dd) to yyyy-MM-dd in local time
   const normalizeToLocalDateString = (
      value?: string | Date | null
   ): string => {
      if (!value) return "";
      let dateObj: Date | null = null;
      if (value instanceof Date) {
         dateObj = value;
      } else if (typeof value === "string") {
         // Try ISO first
         const iso = new Date(value);
         if (!isNaN(iso.getTime())) {
            dateObj = iso;
         } else {
            // Try yyyy-MM-dd
            const parsed = parse(value, "yyyy-MM-dd", new Date());
            if (!isNaN(parsed.getTime())) {
               dateObj = parsed;
            }
         }
      }
      if (!dateObj) return "";
      const local = new Date(
         dateObj.getFullYear(),
         dateObj.getMonth(),
         dateObj.getDate()
      );
      return format(local, "yyyy-MM-dd");
   };

   // Fetch publishers, authors, and genres on component mount
   useEffect(() => {
      const fetchData = async () => {
         try {
            console.log("Fetching form data...");
            const [publishersRes, authorsRes, genresRes] = await Promise.all([
               PublishersService.getAll(),
               AuthorsService.getAll(),
               GenresService.getAll(),
            ]);
            console.log("Form data fetched successfully:", {
               publishers: publishersRes.data,
               authors: authorsRes.data,
               genres: genresRes.data,
            });
            setPublishers(publishersRes.data);
            setAuthors(authorsRes.data);
            setGenres(genresRes.data);
         } catch (error) {
            console.error("Error fetching form data:", error);
            toast.error("Failed to load form data", {
               description: "Please refresh the page and try again.",
               duration: 30000,
               dismissible: true,
            });
         } finally {
            setIsLoadingData(false);
         }
      };

      fetchData();
   }, []);

   // Helper function to find ID by display name
   const findIdByName = (
      name: string,
      items: any[],
      nameField: string,
      idField: string
   ) => {
      const item = items.find((item) => item[nameField] === name);
      return item ? item[idField].toString() : "";
   };

   const form = useForm<BookFormValues>({
      resolver: zodResolver(bookSchema),
      defaultValues: initialData
         ? {
              ...initialData,
              // Normalize publicationDate to yyyy-MM-dd for calendar parsing/render
              publicationDate: normalizeToLocalDateString(
                 initialData.publicationDate as unknown as string
              ),
              // Ensure price is a string
              price: initialData.price || "",
              // Map display names to IDs for dropdowns
              publisher: initialData.publisher
                 ? findIdByName(
                      initialData.publisher,
                      publishers,
                      "publisherName",
                      "publisherID"
                   )
                 : "",
              authors: initialData.authors || "",
              genres: initialData.genres || "",
              // Ensure other nullable fields are strings
              "isbn-10": initialData["isbn-10"] || "",
              "isbn-13": initialData["isbn-13"] || "",
           }
         : {
              title: "",
              publicationDate: "",
              "isbn-10": "",
              "isbn-13": "",
              price: "",
              inventoryQty: undefined, // Will be calculated automatically
              publisher: "",
              authors: "",
              genres: "",
           },
   });

   // Update form values when data is loaded and initialData is available
   useEffect(() => {
      console.log("Form values effect triggered:", {
         isLoadingData,
         hasInitialData: !!initialData,
         publishersLength: publishers.length,
         authorsLength: authors.length,
         genresLength: genres.length,
         initialData,
      });

      if (
         !isLoadingData &&
         initialData &&
         (publishers.length > 0 || authors.length > 0 || genres.length > 0)
      ) {
         try {
            console.log("Setting form values for:", initialData);
            // Ensure publicationDate is normalized for view/edit
            form.setValue(
               "publicationDate",
               normalizeToLocalDateString(
                  initialData.publicationDate as unknown as string
               )
            );
            form.setValue(
               "publisher",
               initialData.publisher
                  ? findIdByName(
                       initialData.publisher,
                       publishers,
                       "publisherName",
                       "publisherID"
                    )
                  : ""
            );
            form.setValue("authors", initialData.authors || "");
            form.setValue("genres", initialData.genres || "");
            console.log("Form values set successfully");
         } catch (error) {
            console.error("Error setting form values:", error);
            toast.error("Error loading book data", {
               description:
                  "There was an error loading the book information. Please try again.",
               duration: 30000,
               dismissible: true,
            });
         }
      }
   }, [isLoadingData, initialData, publishers, authors, genres, form]);

   const isCreateMode = mode === "create";
   const isEditMode = mode === "edit";
   const isViewMode = mode === "view";

   async function onSubmit(data: BookFormValues) {
      setIsSubmitting(true);
      try {
         // Transform data to match backend DTO types
         const createData: CreateBookDTO = {
            title: data.title,
            publicationDate: data.publicationDate,
            "isbn-10": data["isbn-10"] || null,
            "isbn-13": data["isbn-13"] || null,
            price: data.price, // Keep as string, let backend handle conversion
            inventoryQty: data.inventoryQty || 0, // Default to 0 if not provided
            publisherID: data.publisher ? parseInt(data.publisher) : null,
         };

         // Debug logging
         console.log("Submitting book data:", createData);
         console.log(
            "Price value:",
            createData.price,
            "Type:",
            typeof createData.price
         );

         if (isCreateMode) {
            // Create new book
            const result = await BooksService.create(createData);
            console.log("Create result:", result);
         } else if (isEditMode && initialData?.bookID) {
            // Update existing book
            const result = await BooksService.update(
               initialData.bookID,
               createData
            );
            console.log("Update result:", result);
         }

         if (onSave) {
            onSave(data);
         }
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);

         // Show success toast
         toast.success(
            `Book ${isCreateMode ? "created" : "updated"} successfully!`,
            {
               description: `${data.title} has been ${
                  isCreateMode ? "added to" : "updated in"
               } your catalog.`,
            }
         );
      } catch (error: any) {
         console.error("Error saving book:", error);

         // Show more specific error messages
         let errorMessage = "Failed to save book";
         let errorDescription =
            "There was an error saving the book. Please try again.";

         if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
            errorDescription =
               error.response.data.message ||
               "Please check your input and try again.";
         } else if (error.response?.status === 400) {
            errorMessage = "Validation Error";
            errorDescription =
               "Please check that all required fields are filled correctly. Required fields: Title, Publication Date, and Price.";
         } else if (error.response?.status === 500) {
            errorMessage = "Server Error";
            errorDescription =
               "There was a server error. Please try again later.";
         } else if (error.message) {
            errorMessage = "Error";
            errorDescription = error.message;
         }

         // Show error toast
         toast.error(errorMessage, {
            description: errorDescription,
            duration: 30000,
            dismissible: true,
         });
      } finally {
         setIsSubmitting(false);
      }
   }

   async function handleDelete() {
      setIsDeleting(true);
      try {
         if (initialData?.bookID) {
            await BooksService.remove(initialData.bookID);
         }
         if (onDelete && initialData) {
            if (typeof onDelete === "function") {
               onDelete(initialData);
            }
         }

         // Show success toast for deletion
         toast.success("Book deleted successfully!", {
            description: `${initialData?.title} has been removed from your catalog.`,
         });
      } catch (error) {
         console.error("Error deleting book:", error);
         // Show error toast
         toast.error("Failed to delete book", {
            description:
               "There was an error deleting the book. Please try again.",
            duration: 30000,
            dismissible: true,
         });
      } finally {
         setIsDeleting(false);
         setShowDeleteDialog(false);
      }
   }

   const getTitle = () => {
      switch (mode) {
         case "create":
            return "Add New Book";
         case "edit":
            return "Edit Book";
         case "view":
            return "View Book";
         default:
            return "Book";
      }
   };

   const getDescription = () => {
      switch (mode) {
         case "create":
            return "Add a new book to your bookstore catalog. Inventory quantities are managed through BookLocations.";
         case "edit":
            return "Update book information. Inventory quantities are managed through BookLocations.";
         case "view":
            return "View book details";
         default:
            return "";
      }
   };

   if (isLoadingData) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Loading...</CardTitle>
               <CardDescription>Loading form data...</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
            </CardContent>
         </Card>
      );
   }

   // Add error boundary for form rendering
   if (!initialData && (mode === "edit" || mode === "view")) {
      console.error("No initial data provided for edit/view mode");
      return (
         <Card>
            <CardHeader>
               <CardTitle>Error</CardTitle>
               <CardDescription>No book data available</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                     Unable to load book information. Please try again.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                     Reload Page
                  </Button>
               </div>
            </CardContent>
         </Card>
      );
   }

   try {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  {mode === "create" && <CheckCircle className="h-5 w-5" />}
                  {mode === "edit" && <Edit className="h-5 w-5" />}
                  {mode === "view" && <Eye className="h-5 w-5" />}
                  {getTitle()}
                  {mode === "view" && onEdit && (
                     <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Edit Book"
                        className="ml-2"
                        onClick={onEdit}
                     >
                        <Pencil className="h-4 w-4" />
                     </Button>
                  )}
               </CardTitle>
               <CardDescription>{getDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
               {showSuccess && (
                  <Alert className="mb-4">
                     <CheckCircle className="h-4 w-4" />
                     <AlertDescription>
                        Book {isCreateMode ? "created" : "updated"}{" "}
                        successfully!
                     </AlertDescription>
                  </Alert>
               )}

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     {/* Book ID (read-only for edit/view) */}
                     {!isCreateMode && initialData?.bookID && (
                        <FormField
                           control={form.control}
                           name="bookID"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Book ID</FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       value={field.value || ""}
                                       disabled
                                       className="bg-muted"
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Unique identifier for this book
                                 </FormDescription>
                              </FormItem>
                           )}
                        />
                     )}

                     {/* Title */}
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter book title"
                                    {...field}
                                    disabled={isViewMode}
                                 />
                              </FormControl>
                              <FormDescription>
                                 The title of the book
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Publication Date */}
                     <FormField
                        control={form.control}
                        name="publicationDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Publication Date</FormLabel>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <FormControl>
                                       <Button
                                          variant="outline"
                                          className={cn(
                                             "w-full justify-start text-left font-normal",
                                             !field.value &&
                                                "text-muted-foreground"
                                          )}
                                          disabled={isViewMode}
                                       >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {field.value ? (
                                             format(
                                                parse(
                                                   field.value,
                                                   "yyyy-MM-dd",
                                                   new Date()
                                                ),
                                                "PPP"
                                             )
                                          ) : (
                                             <span>Pick a date</span>
                                          )}
                                       </Button>
                                    </FormControl>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0">
                                    <Calendar
                                       mode="single"
                                       selected={
                                          field.value
                                             ? parse(
                                                  field.value,
                                                  "yyyy-MM-dd",
                                                  new Date()
                                               )
                                             : undefined
                                       }
                                       defaultMonth={
                                          field.value
                                             ? parse(
                                                  field.value,
                                                  "yyyy-MM-dd",
                                                  new Date()
                                               )
                                             : undefined
                                       }
                                       onSelect={(date) => {
                                          if (!date) {
                                             field.onChange("");
                                             return;
                                          }
                                          const localDate = new Date(
                                             date.getFullYear(),
                                             date.getMonth(),
                                             date.getDate()
                                          );
                                          field.onChange(
                                             format(localDate, "yyyy-MM-dd")
                                          );
                                       }}
                                       disabled={isViewMode}
                                       initialFocus
                                       captionLayout="dropdown"
                                    />
                                 </PopoverContent>
                              </Popover>
                              <FormDescription>
                                 When the book was published
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* ISBN Fields */}
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="isbn-10"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>ISBN-10</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="ISBN-10"
                                       {...field}
                                       value={field.value || ""}
                                       disabled={isViewMode}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="isbn-13"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>ISBN-13</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="ISBN-13"
                                       {...field}
                                       value={field.value || ""}
                                       disabled={isViewMode}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Publisher */}
                     <FormField
                        control={form.control}
                        name="publisher"
                        render={({ field }) => {
                           const { id } = useFormField();
                           return (
                              <FormItem>
                                 <FormLabel>Publisher</FormLabel>
                                 <FormControl>
                                    <SearchableSelect
                                       options={publishers.map((publisher) => ({
                                          value: publisher.publisherID.toString(),
                                          label: publisher.publisherName,
                                       }))}
                                       value={field.value?.toString()}
                                       onValueChange={(value) =>
                                          field.onChange(value)
                                       }
                                       placeholder="Select a publisher"
                                       searchPlaceholder="Search publishers..."
                                       emptyMessage="No publishers found."
                                       disabled={isViewMode}
                                       id={id}
                                       name="publisher"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           );
                        }}
                     />

                     {/* Price and Inventory */}
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="price"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Price</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="text"
                                       inputMode="decimal"
                                       placeholder="0.00"
                                       value={field.value || ""}
                                       onChange={(e) => {
                                          const value = e.target.value;
                                          if (
                                             value === "" ||
                                             /^\d*\.?\d*$/.test(value)
                                          ) {
                                             field.onChange(value);
                                          }
                                       }}
                                       disabled={isViewMode}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Inventory Quantity (Read-only, calculated from BookLocations) */}
                        <div className="space-y-2">
                           <Label>Inventory Quantity</Label>
                           <div className="p-3 bg-muted rounded-md">
                              <div className="text-sm text-muted-foreground">
                                 {initialData?.inventoryQty !== undefined
                                    ? `${initialData.inventoryQty} copies available`
                                    : "Inventory will be calculated from book locations"}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                 💡 Quantity is automatically calculated from
                                 BookLocations table
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     {!isViewMode && (
                        <div className="flex justify-between">
                           <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting
                                 ? "Saving..."
                                 : isCreateMode
                                 ? "Create Book"
                                 : "Update Book"}
                           </Button>
                           {isEditMode && (
                              <Button
                                 type="button"
                                 variant="destructive"
                                 onClick={() => setShowDeleteDialog(true)}
                                 className="flex items-center gap-2"
                              >
                                 <Trash2 className="h-4 w-4" />
                                 Delete Book
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
               itemName={initialData?.title || ""}
               itemType="book"
            />
         </Card>
      );
   } catch (error) {
      console.error("Error rendering BooksForm:", error);
      return (
         <Card>
            <CardHeader>
               <CardTitle>Error</CardTitle>
               <CardDescription>Failed to render book form</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                     An error occurred while rendering the form. Please try
                     refreshing the page.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                     Reload Page
                  </Button>
               </div>
            </CardContent>
         </Card>
      );
   }
}
