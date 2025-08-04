/**
 * @date August 4, 2025
 * @based_on The page layouts and component compositions from the official shadcn/ui examples and a personal inventory project from CS 361.
 *
 * @degree_of_originality The core layout for these pages is adapted from shadcn/ui examples and patterns from a prior project. They have been modified to display this application's specific data and integrated with the project's data-fetching logic and state management.
 *
 * @source_url The official shadcn/ui examples (e.g., https://ui.shadcn.com/examples/dashboard) and a prior personal project for CS 361.
 *
 * @ai_tool_usage The page components were generated using Cursor. The generation was guided by adapting the official shadcn/ui examples and by providing code from a personal CS 361 inventory project as a template. The generated code was then refined and customized for this application.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OrderItemsForm } from "@/components/forms/OrderItemsForm";
import { OrderItemsList } from "@/components/list-views/OrderItemsList";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrdersService from "@/services/OrdersService";

export function OrderItemsPage() {
   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedOrderItem, setSelectedOrderItem] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Order Items");
   const [selectedOrder, setSelectedOrder] = useState<any>(null);
   const [orders, setOrders] = useState<any[]>([]);
   const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for list updates

   // Fetch real data from API
   useEffect(() => {
      const fetchData = async () => {
         try {
            const ordersResponse = await OrdersService.getAll();
            setOrders(ordersResponse.data);
         } catch (error) {
            console.error("Error fetching orders:", error);
         }
      };

      fetchData();
   }, []);

   // const handleCreate = () => {
   //    setCurrentView("create");
   //    setSelectViewOption("Create Order Item");
   //    setSelectedOrderItem(null);
   // };

   // const handleEdit = (orderItem: any) => {
   //    setSelectedOrderItem(orderItem);
   //    setCurrentView("edit");
   //    setSelectViewOption("Edit Order Item");
   // };

   // const handleView = (orderItem: any) => {
   //    setSelectedOrderItem(orderItem);
   //    setCurrentView("view");
   //    setSelectViewOption("View Order Item");
   // };

   // const handleDelete = () => {
   //    console.log("Delete operation");
   //    setCurrentView("list");
   //    setSelectViewOption("List Order Items");
   // };

   // const handleSave = (data: any) => {
   //    console.log("Save operation:", data);
   //    setCurrentView("list");
   //    setSelectViewOption("List Order Items");
   // };

   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Order Items");
      setSelectedOrderItem(null);
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Order Items":
            setCurrentView("list");
            break;
         case "Create Order Item":
            setCurrentView("create");
            setSelectedOrderItem(null);
            break;
         case "Edit Order Item":
            if (selectedOrderItem) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Order Items");
            }
            break;
         case "View Order Item":
            if (selectedOrderItem) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Order Items");
            }
            break;
      }
   };

   const handleOrderItemDelete = (orderItem: any) => {
      console.log("Delete order item:", orderItem);
      // In a real app, this would call an API
   };

   const handleAddOrderItem = () => {
      setCurrentView("create");
      setSelectViewOption("Create Order Item");
   };

   const handleCreateOrder = () => {
      // Navigate to Orders page to create a new order
      navigate("/orders");
   };

   const handleEditOrderItem = (orderItem: any) => {
      setSelectedOrderItem(orderItem);
      setCurrentView("edit");
      setSelectViewOption("Edit Order Item");
   };

   const handleViewOrderItem = (orderItem: any) => {
      setSelectedOrderItem(orderItem);
      setCurrentView("view");
      setSelectViewOption("View Order Item");
   };

   const handleOrderItemSave = (data: any) => {
      console.log("Save order item:", data);
      setCurrentView("list");
      setSelectViewOption("List Order Items");
      setSelectedOrderItem(null);
      setRefreshKey((prev) => prev + 1); // Refresh the list
   };

   // const handleOrderItemBack = () => {
   //    setCurrentView("list");
   //    setSelectViewOption("List Order Items");
   //    setSelectedOrderItem(null);
   // };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-3xl font-bold mb-2">
                  Order Items Management
               </h1>
               <p className="text-muted-foreground">
                  Manage the items within orders
               </p>
            </div>

            {/* View Selection Dropdown */}
            <div className="mb-6">
               <div className="flex items-center space-x-2">
                  <Label htmlFor="view-select">View:</Label>
                  <Select
                     value={selectViewOption}
                     onValueChange={handleViewChange}
                  >
                     <SelectTrigger className="w-64">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="List Order Items">
                           List Order Items
                        </SelectItem>
                        <SelectItem value="Create Order Item">
                           Create Order Item
                        </SelectItem>
                        <SelectItem value="Edit Order Item">
                           Edit Order Item
                        </SelectItem>
                        <SelectItem value="View Order Item">
                           View Order Item
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>

            {/* Create View */}
            {currentView === "create" && (
               <div className="space-y-6">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Order Items
                     </Button>
                  </div>
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Package className="h-5 w-5" />
                           Create Order Item
                        </CardTitle>
                        <CardDescription>
                           Add a new item to an order
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div>
                              <Label>Select Order</Label>
                              <Select
                                 onValueChange={(value) => {
                                    const order = orders.find(
                                       (o) => o.orderID === Number(value)
                                    );
                                    setSelectedOrder(order);
                                 }}
                              >
                                 <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Choose an order..." />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {orders.map((order) => (
                                       <SelectItem
                                          key={order.orderID}
                                          value={order.orderID.toString()}
                                       >
                                          Order #{order.orderID} - $
                                          {order.total}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                           {selectedOrder && (
                              <OrderItemsForm
                                 mode="create"
                                 orderID={selectedOrder.orderID}
                                 onSave={handleOrderItemSave}
                              />
                           )}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* Edit/View View */}
            {(currentView === "edit" || currentView === "view") &&
               selectedOrderItem && (
                  <div className="space-y-6">
                     <div className="mb-4">
                        <Button variant="outline" onClick={handleBack}>
                           ← Back to Order Items
                        </Button>
                     </div>
                     <OrderItemsForm
                        mode={currentView}
                        orderID={selectedOrderItem.orderID}
                        initialData={selectedOrderItem}
                        onSave={handleOrderItemSave}
                        onDelete={
                           currentView === "edit"
                              ? () => handleOrderItemDelete(selectedOrderItem)
                              : undefined
                        }
                     />
                  </div>
               )}

            {/* List View */}
            {currentView === "list" && (
               <Card key={refreshKey}>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Items
                     </CardTitle>
                     <CardDescription>
                        All order items in the system
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-semibold">
                              All Order Items
                           </h3>
                           <Button onClick={handleAddOrderItem}>
                              <Package className="h-4 w-4 mr-2" />
                              Add Order Item
                           </Button>
                        </div>
                        <OrderItemsList
                           orderID={0} // 0 means show all
                           refreshKey={refreshKey}
                           onDelete={handleOrderItemDelete}
                           onAdd={handleAddOrderItem}
                           onEdit={handleEditOrderItem}
                           onView={handleViewOrderItem}
                           onCreateOrder={handleCreateOrder}
                        />
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}
