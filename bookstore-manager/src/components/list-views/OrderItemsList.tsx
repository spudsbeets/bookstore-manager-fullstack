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
import { Search, Plus, Eye, Edit, Trash2, Package } from "lucide-react";
// import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"; // Commented out unused imports
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

interface OrderItem {
   orderItemID: number;
   orderID: number;
   bookID: number;
   quantity: number;
   individualPrice: number;
   subtotal: number;
   bookTitle?: string; // For display purposes
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

   // Sample data for order items
   const sampleOrderItems: OrderItem[] = [
      {
         orderItemID: 1,
         orderID: orderID,
         bookID: 1,
         quantity: 2,
         individualPrice: 17.99,
         subtotal: 35.98,
         bookTitle: "Beloved",
      },
      {
         orderItemID: 2,
         orderID: orderID,
         bookID: 2,
         quantity: 1,
         individualPrice: 15.99,
         subtotal: 15.99,
         bookTitle: "Inherent Vice",
      },
   ];

   useEffect(() => {
      const fetchOrderItems = async () => {
         setIsLoading(true);
         try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            setOrderItems(sampleOrderItems);
         } catch (error) {
            console.error("Error fetching order items:", error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchOrderItems();
   }, [orderID]);

   const filteredOrderItems = orderItems.filter(
      (orderItem) =>
         orderItem.bookTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         orderItem.orderItemID.toString().includes(searchTerm)
   );

   const handleDelete = async (orderItem: OrderItem) => {
      setIsDeleting(true);
      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 500));
         setOrderItems(
            orderItems.filter((oi) => oi.orderItemID !== orderItem.orderItemID)
         );
         if (onDelete) {
            onDelete(orderItem);
         }
      } catch (error) {
         console.error("Error deleting order item:", error);
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
               <div className="text-center py-8 text-muted-foreground">
                  Loading order items...
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
                        Items in order #{orderID} ({orderItems.length} total)
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
                                 Add Order Item to Order
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Add an existing item to this order</p>
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
                                 <Plus className="h-4 w-4" />
                                 Add Order Item
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Create a new order item record</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               {/* Search Bar */}
               <div className="flex items-center space-x-2 mb-4">
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

               {/* Order Items Table */}
               <div className="rounded-md border">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>ID</TableHead>
                           <TableHead>Book</TableHead>
                           <TableHead>Quantity</TableHead>
                           <TableHead>Price</TableHead>
                           <TableHead>Subtotal</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredOrderItems.length === 0 ? (
                           <TableRow>
                              <TableCell
                                 colSpan={6}
                                 className="text-center py-8"
                              >
                                 <div className="text-muted-foreground">
                                    No order items found.
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredOrderItems.map((orderItem) => (
                              <TableRow key={orderItem.orderItemID}>
                                 <TableCell>
                                    <Badge variant="secondary">
                                       #{orderItem.orderItemID}
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="font-medium">
                                    <HoverCard>
                                       <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer">
                                             <Package className="h-4 w-4 text-muted-foreground" />
                                             {orderItem.bookTitle}
                                          </div>
                                       </HoverCardTrigger>
                                       <HoverCardContent className="w-80">
                                          <div className="flex justify-between space-x-4">
                                             <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                   {orderItem.bookTitle}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                   Book ID: {orderItem.bookID}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                   Order Item ID:{" "}
                                                   {orderItem.orderItemID}
                                                </p>
                                             </div>
                                          </div>
                                       </HoverCardContent>
                                    </HoverCard>
                                 </TableCell>
                                 <TableCell>{orderItem.quantity}</TableCell>
                                 <TableCell>
                                    ${orderItem.individualPrice.toFixed(2)}
                                 </TableCell>
                                 <TableCell>
                                    ${orderItem.subtotal.toFixed(2)}
                                 </TableCell>
                                 <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       {onView && (
                                          <Tooltip>
                                             <TooltipTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   onClick={() =>
                                                      onView(orderItem)
                                                   }
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
                                                   onClick={() =>
                                                      onEdit(orderItem)
                                                   }
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
                                                   setOrderItemToDelete(
                                                      orderItem
                                                   )
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
               itemName={orderItemToDelete?.bookTitle || ""}
               itemType="order item"
            />
         </Card>
      </TooltipProvider>
   );
}
