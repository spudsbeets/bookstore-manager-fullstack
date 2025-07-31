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
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/components/ui/hover-card";
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
   county?: string;
   state?: string;
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
      county: "Polk",
      state: "Iowa",
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
      county: "Jerome",
      state: "Idaho",
   },
];

interface CustomerOrdersListProps {
   customerID: number;
   onDelete?: (order: Order) => void;
   onAdd?: () => void;
   onEdit?: (order: Order) => void;
   onView?: (order: Order) => void;
}

export function CustomerOrdersList({
   customerID,
   onDelete,
   onAdd,
   onEdit,
   onView,
}: CustomerOrdersListProps) {
   const [orders, setOrders] = useState<Order[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchOrders = async () => {
         setIsLoading(true);
         try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Filter orders for this specific customer
            const customerOrders = sampleOrders.filter(
               (order) => order.customerID === customerID
            );
            setOrders(customerOrders);
         } catch (error) {
            console.error("Error fetching customer orders:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchOrders();
   }, [customerID]);

   const filteredOrders = orders.filter(
      (order) =>
         order.orderID.toString().includes(searchTerm) ||
         order.orderDate.includes(searchTerm) ||
         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         `${order.county}, ${order.state}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
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
      return new Date(dateString).toLocaleDateString();
   };

   const formatTime = (timeString: string) => {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   if (isLoading) {
      return (
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-semibold">
                  Customer Orders ({orders.length} total)
               </h3>
               <div className="flex items-center gap-2">
                  <Input
                     placeholder="Search orders..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-64"
                  />
                  {onAdd && (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button onClick={onAdd} size="sm">
                                 <Plus className="h-4 w-4" />
                                 Add Order
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Add new order for this customer</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  )}
               </div>
            </div>
            <div className="text-center py-8">Loading orders...</div>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
               Customer Orders ({orders.length} total)
            </h3>
            <div className="flex items-center gap-2">
               <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
               />
               {onAdd && (
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button onClick={onAdd} size="sm">
                              <Plus className="h-4 w-4" />
                              Add Order
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>Add new order for this customer</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         </div>

         {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
               {searchTerm
                  ? "No orders found matching your search."
                  : "No orders found for this customer."}
            </div>
         ) : (
            <div className="border rounded-lg">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Tax Rate</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredOrders.map((order) => (
                        <TableRow key={order.orderID}>
                           <TableCell className="font-medium">
                              #{order.orderID}
                           </TableCell>
                           <TableCell>{formatDate(order.orderDate)}</TableCell>
                           <TableCell>{formatTime(order.orderTime)}</TableCell>
                           <TableCell className="font-medium">
                              {formatPrice(order.total)}
                           </TableCell>
                           <TableCell>{order.taxRate}%</TableCell>
                           <TableCell>
                              <HoverCard>
                                 <HoverCardTrigger asChild>
                                    <Button
                                       variant="link"
                                       className="p-0 h-auto"
                                    >
                                       {order.county}, {order.state}
                                    </Button>
                                 </HoverCardTrigger>
                                 <HoverCardContent className="w-80">
                                    <div className="space-y-2">
                                       <h4 className="text-sm font-semibold">
                                          Sales Tax Location
                                       </h4>
                                       <p className="text-sm">
                                          <strong>County:</strong>{" "}
                                          {order.county}
                                       </p>
                                       <p className="text-sm">
                                          <strong>State:</strong> {order.state}
                                       </p>
                                       <p className="text-sm">
                                          <strong>Tax Rate:</strong>{" "}
                                          {order.taxRate}%
                                       </p>
                                    </div>
                                 </HoverCardContent>
                              </HoverCard>
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                 {onView && (
                                    <TooltipProvider>
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onView(order)}
                                             >
                                                <Eye className="h-4 w-4" />
                                             </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             <p>View order details</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 )}
                                 {onEdit && (
                                    <TooltipProvider>
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(order)}
                                             >
                                                <Edit className="h-4 w-4" />
                                             </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             <p>Edit order</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 )}
                                 {onDelete && (
                                    <TooltipProvider>
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                   setOrderToDelete(order)
                                                }
                                             >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                             </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             <p>Delete order</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 )}
                              </div>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         )}

         {orderToDelete && (
            <DeleteConfirmationDialog
               isOpen={!!orderToDelete}
               onOpenChange={(open) => !open && setOrderToDelete(null)}
               onConfirm={() => handleDelete(orderToDelete)}
               isDeleting={isDeleting}
               itemName={`Order #${orderToDelete.orderID}`}
               itemType="order"
            />
         )}
      </div>
   );
}
