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
import { Search, Plus, Eye, Edit, Trash2, Package, Loader2 } from "lucide-react";
import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { toast } from "sonner";

// Services
import OrderItemsService from "@/services/OrderItemsService";

interface OrderItem {
   orderItemID: number;
   orderID: number;
   bookID: number;
   quantity: number;
   price: number;
   title: string;
   orderDate: string;
   firstName: string;
   lastName: string;
}

interface OrderItemsListProps {
   orderID: number;
   onView?: (orderItem: OrderItem) => void;
   onEdit?: (orderItem: OrderItem) => void;
   onDelete?: (orderItem: OrderItem) => void;
   onAdd?: () => void;
   onCreateOrder?: () => void; // New prop for creating orders
}

export function OrderItemsList({
   orderID,
   onView,
   onEdit,
   onDelete,
   onAdd,
   onCreateOrder,
}: OrderItemsListProps) {
   const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [orderItemToDelete, setOrderItemToDelete] = useState<OrderItem | null>(
      null
   );
   const [isDeleting, setIsDeleting] = useState(false);

   useEffect(() => {
      const fetchOrderItems = async () => {
         setIsLoading(true);
         try {
            const response = await OrderItemsService.getAll();
            // Transform the API response to match our interface
            const transformedData = response.data.map((item: any) => ({
               orderItemID: item.orderItemID,
               orderID: item.orderID,
               bookID: item.bookID,
               quantity: item.quantity,
               price: item.price,
               title: item.title,
               orderDate: item.orderDate,
               firstName: item.firstName,
               lastName: item.lastName,
            }));
            setOrderItems(transformedData);
         } catch (error) {
            console.error("Error fetching order items:", error);
            toast.error("Failed to load order items", {
               description: "There was an error loading the order items. Please try again.",
               duration: Infinity,
            });
         } finally {
            setIsLoading(false);
         }
      };

      fetchOrderItems();
   }, [orderID]);

   const filteredOrderItems = orderItems.filter(
      (orderItem) =>
         orderItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         orderItem.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         orderItem.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         orderItem.orderItemID.toString().includes(searchTerm)
   );

   const handleDelete = async (orderItem: OrderItem) => {
      setIsDeleting(true);
      try {
         await OrderItemsService.remove(orderItem.orderItemID);
         setOrderItems(
            orderItems.filter(
               (oi) => oi.orderItemID !== orderItem.orderItemID
            )
         );
         toast.success("Order item deleted successfully!", {
            description: `${orderItem.title} has been removed from the order.`,
         });
         if (onDelete) {
            onDelete(orderItem);
         }
      } catch (error) {
         console.error("Error deleting order item:", error);
         toast.error("Failed to delete order item", {
            description: "There was an error deleting the order item. Please try again.",
            duration: Infinity,
         });
      } finally {
         setIsDeleting(false);
         setOrderItemToDelete(null);
      }
   };

   if (isLoading) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <TooltipProvider>
         <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Order Items</CardTitle>
                     <CardDescription>
                        Items in this order ({orderItems.length} total)
                     </CardDescription>
                  </div>
                  <div className="flex gap-2">
                     {onAdd && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button
                                 onClick={onAdd}
                                 className="flex items-center gap-2"
                              >
                                 <Plus className="h-4 w-4" />
                                 Add Item to Order
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Add a new item to this order</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                     {onCreateOrder && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button
                                 onClick={onCreateOrder}
                                 variant="outline"
                                 className="flex items-center gap-2"
                              >
                                 <Package className="h-4 w-4" />
                                 Create Order
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Create a new order</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                     <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           placeholder="Search order items..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-8"
                        />
                     </div>
                  </div>

                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Book</TableHead>
                           <TableHead>Customer</TableHead>
                           <TableHead>Quantity</TableHead>
                           <TableHead>Price</TableHead>
                           <TableHead>Order Date</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredOrderItems.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                 <div className="text-muted-foreground">
                                    {searchTerm
                                       ? "No order items found matching your search."
                                       : "No order items found."}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredOrderItems.map((orderItem) => (
                              <TableRow key={orderItem.orderItemID}>
                                 <TableCell>
                                    <HoverCard>
                                       <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer">
                                             <Package className="h-4 w-4 text-muted-foreground" />
                                             {orderItem.title}
                                          </div>
                                       </HoverCardTrigger>
                                       <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                             <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                   {orderItem.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                   Order Item ID: {orderItem.orderItemID}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                   Order ID: {orderItem.orderID}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                   Book ID: {orderItem.bookID}
                                                </p>
                                             </div>
                                          </div>
                                       </HoverCardContent>
                                    </HoverCard>
                                 </TableCell>
                                 <TableCell>
                                    {orderItem.firstName} {orderItem.lastName}
                                 </TableCell>
                                 <TableCell>
                                    <Badge variant="secondary">
                                       {orderItem.quantity}
                                    </Badge>
                                 </TableCell>
                                 <TableCell>${orderItem.price}</TableCell>
                                 <TableCell>
                                    {new Date(orderItem.orderDate).toLocaleDateString()}
                                 </TableCell>
                                 <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       {onView && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() => onView(orderItem)}
                                                >
                                                   <Eye className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>View order item details</p>
                                             </TooltipContent>
                                          </Tooltip>
                                       )}
                                       {onEdit && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() => onEdit(orderItem)}
                                                >
                                                   <Edit className="h-4 w-4" />
                                                </Button>
                                             </TooltipTrigger>
                                             <TooltipContent>
                                                <p>Edit order item</p>
                                             </TooltipContent>
                                          </Tooltip>
                                       )}
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                   setOrderItemToDelete(orderItem)
                                                }
                                                className="text-destructive hover:text-destructive"
                                             >
                                                <Trash2 className="h-4 w-4" />
                                             </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             <p>Delete order item</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </div>
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
               isOpen={!!orderItemToDelete}
               onOpenChange={() => setOrderItemToDelete(null)}
               onConfirm={() =>
                  orderItemToDelete && handleDelete(orderItemToDelete)
               }
               isDeleting={isDeleting}
               itemName={orderItemToDelete?.title || ""}
               itemType="order item"
            />
         </Card>
      </TooltipProvider>
   );
}

