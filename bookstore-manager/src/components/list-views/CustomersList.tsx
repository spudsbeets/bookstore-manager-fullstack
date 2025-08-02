"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Plus,
   Search,
   Edit,
   Eye,
   Trash2,
   Users,
   MoreHorizontal,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import CustomersService from "@/services/CustomersService";

interface Customer {
   customerID: number;
   firstName: string;
   lastName: string;
   email: string | null;
   phoneNumber: string | null;
}

interface CustomersListProps {
   onView?: (customer: Customer) => void;
   onEdit?: (customer: Customer) => void;
   onDelete?: (customer: Customer) => void;
   onCreate?: () => void;
}

export function CustomersList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: CustomersListProps) {
   const [customers, setCustomers] = useState<Customer[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
      null
   );
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchCustomers = async () => {
         setIsLoading(true);
         try {
            const response = await CustomersService.getAll();
            setCustomers(response.data);
         } catch (error) {
            console.error("Error fetching customers:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchCustomers();
   }, []); // This will re-run when the component is re-mounted due to key change

   const filteredCustomers = customers.filter(
      (customer) =>
         customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         customer.phoneNumber?.includes(searchTerm)
   );

   const handleDelete = async (customer: Customer) => {
      setIsDeleting(true);
      try {
         await CustomersService.remove(customer.customerID);
         setCustomers(
            customers.filter((c) => c.customerID !== customer.customerID)
         );
         if (onDelete) {
            onDelete(customer);
         }
      } catch (error) {
         console.error("Error deleting customer:", error);
      } finally {
         setIsDeleting(false);
         setCustomerToDelete(null);
      }
   };

   const formatPhoneNumber = (phoneNumber: string | null) => {
      if (!phoneNumber) return "N/A";
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
         3,
         6
      )}-${phoneNumber.slice(6)}`;
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Customers</CardTitle>
               <CardDescription>Loading customers...</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="flex items-center gap-2">
                     <Users className="h-5 w-5" />
                     Customers
                  </CardTitle>
                  <CardDescription>
                     Manage your bookstore's customer database (
                     {customers.length} total)
                  </CardDescription>
               </div>
               <Button onClick={onCreate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Customer
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            {/* Search Bar */}
            <div className="flex items-center space-x-2 mb-4">
               <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search customers by name, email, or phone..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
            </div>

            {/* Customers Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredCustomers.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={5} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No customers found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredCustomers.map((customer) => (
                           <TableRow key={customer.customerID}>
                              <TableCell className="font-medium">
                                 {customer.customerID}
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {customer.firstName} {customer.lastName}
                                 </div>
                              </TableCell>
                              <TableCell>{customer.email || "N/A"}</TableCell>
                              <TableCell>
                                 {formatPhoneNumber(customer.phoneNumber)}
                              </TableCell>
                              <TableCell className="text-right">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                       {onView && (
                                          <DropdownMenuItem
                                             onClick={() => onView(customer)}
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() => onEdit(customer)}
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() =>
                                             setCustomerToDelete(customer)
                                          }
                                          className="text-destructive"
                                       >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>
         </CardContent>

         {/* Delete Confirmation Dialog */}
         <DeleteConfirmationDialog
            isOpen={!!customerToDelete}
            onOpenChange={() => setCustomerToDelete(null)}
            onConfirm={() => customerToDelete && handleDelete(customerToDelete)}
            isDeleting={isDeleting}
            itemName={
               `${customerToDelete?.firstName} ${customerToDelete?.lastName}` ||
               ""
            }
            itemType="customer"
         />
      </Card>
   );
}
