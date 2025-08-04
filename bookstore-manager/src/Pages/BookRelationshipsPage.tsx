/**
 * @date August 4, 2025
 * @based_on The page layouts and component compositions from the official shadcn/ui examples.
 *
 * @degree_of_originality The core layout for these pages is adapted from the shadcn/ui examples. They have been modified to display this application's specific data and integrated with the project's data-fetching logic and state management.
 *
 * @source_url The official shadcn/ui examples, such as the one found at https://ui.shadcn.com/examples/dashboard
 *
 * @ai_tool_usage The page components were generated using Cursor by adapting the official shadcn/ui examples. The generated code was then refined and customized for this application.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import AuthorsService from "@/services/AuthorsService";
import GenresService from "@/services/GenresService";
import BooksService from "@/services/BooksService";
import BookAuthorsService from "@/services/BookAuthorsService";
import BookGenresService from "@/services/BookGenresService";
import { toast } from "sonner";

interface Author {
   authorID: number;
   fullName: string;
}

interface Genre {
   genreID: number;
   genreName: string;
}

interface Book {
   bookID: number;
   title: string;
}

export default function BookRelationshipsPage() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const [book, setBook] = useState<Book | null>(null);
   const [authors, setAuthors] = useState<Author[]>([]);
   const [genres, setGenres] = useState<Genre[]>([]);
   const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
   const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setIsLoading(true);
            const bookId = parseInt(id!);

            // Fetch book details
            const bookResponse = await BooksService.get(bookId);
            setBook(bookResponse.data);

            // Fetch all authors and genres for selection
            const [authorsResponse, genresResponse] = await Promise.all([
               AuthorsService.getAll(),
               GenresService.getAll(),
            ]);
            setAuthors(authorsResponse.data);
            setGenres(genresResponse.data);

            // Fetch current book authors and genres
            const [bookAuthorsResponse, bookGenresResponse] = await Promise.all(
               [
                  BookAuthorsService.getByBookId(bookId),
                  BookGenresService.getByBookId(bookId),
               ]
            );

            setSelectedAuthors(
               bookAuthorsResponse.data.map((ba: any) => ba.authorID.toString())
            );
            setSelectedGenres(
               bookGenresResponse.data.map((bg: any) => bg.genreID.toString())
            );
         } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load book relationships");
         } finally {
            setIsLoading(false);
         }
      };

      if (id) {
         fetchData();
      }
   }, [id]);

   const handleSave = async () => {
      if (!book) return;

      try {
         setIsSaving(true);
         const bookId = parseInt(id!);

         // Update book authors
         await BookAuthorsService.updateForBook(
            bookId,
            selectedAuthors.map((id) => parseInt(id))
         );

         // Update book genres
         await BookGenresService.updateForBook(
            bookId,
            selectedGenres.map((id) => parseInt(id))
         );

         toast.success("Book relationships updated successfully");
      } catch (error) {
         console.error("Error saving relationships:", error);
         toast.error("Failed to update book relationships");
      } finally {
         setIsSaving(false);
      }
   };

   if (isLoading) {
      return (
         <div className="container mx-auto p-6">
            <div className="flex items-center justify-center h-64">
               <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                     Loading book relationships...
                  </p>
               </div>
            </div>
         </div>
      );
   }

   if (!book) {
      return (
         <div className="container mx-auto p-6">
            <div className="text-center">
               <p className="text-muted-foreground">Book not found</p>
               <Button onClick={() => navigate("/books")} className="mt-4">
                  Back to Books
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-6">
         <div className="flex items-center gap-4 mb-6">
            <Button
               variant="outline"
               onClick={() => navigate(`/books/${id}`)}
               className="flex items-center gap-2"
            >
               <ArrowLeft className="h-4 w-4" />
               Back to Book
            </Button>
            <div>
               <h1 className="text-2xl font-bold">Book Relationships</h1>
               <p className="text-muted-foreground">{book.title}</p>
            </div>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Manage Authors and Genres</CardTitle>
               <CardDescription>
                  Select the authors and genres associated with this book
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Authors</label>
                  <MultiSelect
                     options={authors.map((author) => ({
                        value: author.authorID.toString(),
                        label: author.fullName,
                     }))}
                     selected={selectedAuthors}
                     onChange={setSelectedAuthors}
                     placeholder="Select authors..."
                     searchPlaceholder="Search authors..."
                     emptyMessage="No authors found."
                  />
                  <p className="text-sm text-muted-foreground">
                     Selected: {selectedAuthors.length} author(s)
                  </p>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Genres</label>
                  <MultiSelect
                     options={genres.map((genre) => ({
                        value: genre.genreID.toString(),
                        label: genre.genreName,
                     }))}
                     selected={selectedGenres}
                     onChange={setSelectedGenres}
                     placeholder="Select genres..."
                     searchPlaceholder="Search genres..."
                     emptyMessage="No genres found."
                  />
                  <p className="text-sm text-muted-foreground">
                     Selected: {selectedGenres.length} genre(s)
                  </p>
               </div>

               <div className="flex justify-end gap-2 pt-4">
                  <Button
                     variant="outline"
                     onClick={() => navigate(`/books/${id}`)}
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleSave}
                     disabled={isSaving}
                     className="flex items-center gap-2"
                  >
                     <Save className="h-4 w-4" />
                     {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
