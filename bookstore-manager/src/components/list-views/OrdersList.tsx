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
import { Badge } from "@/components/ui/badge";
import {
   Plus,
   Search,
   Edit,
   Eye,
   Trash2,
   ShoppingCart,
   MoreHorizontal,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Order {
   orderID: number;
   orderDate: string;
   orderTime: string;
   total: number;
   taxRate: number;
   customerID: number;
   salesRateID: number;
   customerName?: string;
   salesRateLocation?: string;
}

// Sample data - replace with actual API calls
const sampleOrders: Order[] = [
   {
      orderID: 1,
      orderDate: "2025-10-01",
      orderTime: "21:12:11",
      total: 45.61,
      taxRate: 4.2,
      customerID: 1,
      salesRateID: 1,
      customerName: "Reggie Reggerson",
      salesRateLocation: "Polk, Iowa",
   },
   {
      orderID: 2,
      orderDate: "2025-10-01",
      orderTime: "21:12:11",
      total: 61.21,
      taxRate: 5.1,
      customerID: 2,
      salesRateID: 2,
      customerName: "Gail Nightingstocks",
      salesRateLocation: "Jerome, Idaho",
   },
];

interface OrdersListProps {
   onView?: (order: Order) => void;
   onEdit?: (order: Order) => void;
   onDelete?: (order: Order) => void;
   onCreate?: () => void;
}

export function OrdersList({
   onView,
   onEdit,
   onDelete,
   onCreate,
}: OrdersListProps) {
   const [orders, setOrders] = useState<Order[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      // Simulate API call
      const fetchOrders = async () => {
         setIsLoading(true);
         try {
            // Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setOrders(sampleOrders);
         } catch (error) {
            console.error("Error fetching orders:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchOrders();
   }, []);

   const filteredOrders = orders.filter(
      (order) =>
         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.salesRateLocation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         order.orderID.toString().includes(searchTerm)
   );

   const handleDelete = async (order: Order) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setOrders(orders.filter((o) => o.orderID !== order.orderID));
         if (onDelete) {
            onDelete(order);
         }
      } catch (error) {
         console.error("Error deleting order:", error);
      } finally {
         setIsDeleting(false);
         setOrderToDelete(null);
      }
   };

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-US", {
         style: "currency",
         currency: "USD",
      }).format(price);
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   const formatTime = (timeString: string) => {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Orders</CardTitle>
               <CardDescription>Loading orders...</CardDescription>
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
                     <ShoppingCart className="h-5 w-5" />
                     Orders
                  </CardTitle>
                  <CardDescription>
                     Manage your bookstore's orders ({orders.length} total)
                  </CardDescription>
               </div>
               <Button onClick={onCreate} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Order
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            {/* Search Bar */}
            <div className="flex items-center space-x-2 mb-4">
               <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search orders by customer, location, or ID..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8"
                  />
               </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-md border">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredOrders.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={6} className="text-center py-8">
                              <div className="text-muted-foreground">
                                 No orders found.
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        filteredOrders.map((order) => (
                           <TableRow key={order.orderID}>
                              <TableCell className="font-medium">
                                 #{order.orderID}
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {order.customerName}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div>
                                    <div className="font-medium">
                                       {formatDate(order.orderDate)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                       {formatTime(order.orderTime)}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="font-medium">
                                    {formatPrice(order.total)}
                                 </div>
                                 <div className="text-sm text-muted-foreground">
                                    Tax: {order.taxRate}%
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline">
                                    {order.salesRateLocation}
                                 </Badge>
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
                                             onClick={() => onView(order)}
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View
                                          </DropdownMenuItem>
                                       )}
                                       {onEdit && (
                                          <DropdownMenuItem
                                             onClick={() => onEdit(order)}
                                          >
                                             <Edit className="mr-2 h-4 w-4" />
                                             Edit
                                          </DropdownMenuItem>
                                       )}
                                       <DropdownMenuItem
                                          onClick={() =>
                                             setOrderToDelete(order)
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
            isOpen={!!orderToDelete}
            onOpenChange={() => setOrderToDelete(null)}
            onConfirm={() => orderToDelete && handleDelete(orderToDelete)}
            isDeleting={isDeleting}
            itemName={`#${orderToDelete?.orderID}` || ""}
            itemType="order"
         />
      </Card>
   );
}
