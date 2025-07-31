import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrdersForm } from "@/components/forms/OrdersForm";
import { OrderItemsForm } from "@/components/forms/OrderItemsForm";
import { OrdersList } from "@/components/list-views/OrdersList";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package } from "lucide-react";

export function OrdersPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedOrder, setSelectedOrder] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Orders");
   const [activeTab, setActiveTab] = useState("details");
   const [orderItemView, setOrderItemView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedOrderItem, setSelectedOrderItem] = useState<any>(null);

   const viewArray = [
      "List Orders",
      "Create Order",
      "Edit Order",
      "View Order",
   ];

   const handleCreate = () => {
      setCurrentView("create");
      setSelectViewOption("Create Order");
   };
   const handleEdit = (order: any) => {
      setSelectedOrder(order);
      setCurrentView("edit");
      setSelectViewOption("Edit Order");
      setActiveTab("details");
   };
   const handleView = (order: any) => {
      setSelectedOrder(order);
      setCurrentView("view");
      setSelectViewOption("View Order");
      setActiveTab("details");
   };
   const handleDelete = () => {
      console.log("Delete order:", selectedOrder);
      setCurrentView("list");
      setSelectViewOption("List Orders");
   };
   const handleSave = (data: any) => {
      console.log("Save order:", data);
      setCurrentView("list");
      setSelectViewOption("List Orders");
   };
   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Orders");
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Orders":
            setCurrentView("list");
            break;
         case "Create Order":
            setCurrentView("create");
            break;
         case "Edit Order":
            if (selectedOrder) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Orders");
            }
            break;
         case "View Order":
            if (selectedOrder) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Orders");
            }
            break;
         default:
            setCurrentView("list");
      }
   };

   const handleOrderItemDelete = (orderItem: any) => {
      console.log("Delete order item:", orderItem);
   };

   const handleAddOrderItem = () => {
      setOrderItemView("create");
      setSelectedOrderItem(null);
   };

   const handleEditOrderItem = (orderItem: any) => {
      setSelectedOrderItem(orderItem);
      setOrderItemView("edit");
   };

   const handleViewOrderItem = (orderItem: any) => {
      setSelectedOrderItem(orderItem);
      setOrderItemView("view");
   };

   const handleOrderItemSave = (data: any) => {
      console.log("Save order item:", data);
      setOrderItemView("list");
      setSelectedOrderItem(null);
   };

   const handleOrderItemBack = () => {
      setOrderItemView("list");
      setSelectedOrderItem(null);
   };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
               <div className="flex flex-col items-start gap-2">
                  <Label>View Options</Label>
                  <Select
                     value={selectViewOption}
                     onValueChange={handleViewChange}
                  >
                     <SelectTrigger className="w-[200px]">
                        <SelectValue>{selectViewOption}</SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                        {viewArray.map((view) => (
                           <SelectItem key={view} value={view}>
                              {view}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            {currentView === "create" && (
               <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                     <Button variant="outline" onClick={handleBack}>
                        ← Back to Orders
                     </Button>
                  </div>
                  <OrdersForm mode="create" onSave={handleSave} />
               </div>
            )}

            {(currentView === "edit" || currentView === "view") &&
               selectedOrder && (
                  <div className="space-y-6">
                     <div className="mb-4">
                        <Button variant="outline" onClick={handleBack}>
                           ← Back to Orders
                        </Button>
                     </div>

                     <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                     >
                        <TabsList className="grid w-full grid-cols-2">
                           <TabsTrigger
                              value="details"
                              className="flex items-center gap-2"
                           >
                              <ShoppingCart className="h-4 w-4" />
                              Order Details
                           </TabsTrigger>
                           <TabsTrigger
                              value="items"
                              className="flex items-center gap-2"
                           >
                              <Package className="h-4 w-4" />
                              Order Items
                           </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                           <Card>
                              <CardHeader>
                                 <CardTitle>Order Details</CardTitle>
                                 <CardDescription>
                                    {currentView === "edit"
                                       ? "Edit order information"
                                       : "View order details"}
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 <OrdersForm
                                    mode={currentView}
                                    initialData={selectedOrder}
                                    onSave={handleSave}
                                    onDelete={
                                       currentView === "edit"
                                          ? handleDelete
                                          : undefined
                                    }
                                 />
                              </CardContent>
                           </Card>
                        </TabsContent>

                        <TabsContent value="items" className="space-y-4">
                           {orderItemView === "list" && (
                              <OrderItemsList
                                 orderID={selectedOrder.orderID}
                                 onDelete={handleOrderItemDelete}
                                 onAdd={handleAddOrderItem}
                                 onEdit={handleEditOrderItem}
                                 onView={handleViewOrderItem}
                              />
                           )}

                           {(orderItemView === "create" ||
                              orderItemView === "edit" ||
                              orderItemView === "view") && (
                              <div className="max-w-2xl mx-auto">
                                 <div className="mb-4">
                                    <Button
                                       variant="outline"
                                       onClick={handleOrderItemBack}
                                    >
                                       ← Back to Order Items
                                    </Button>
                                 </div>
                                 <OrderItemsForm
                                    mode={orderItemView}
                                    orderID={selectedOrder.orderID}
                                    initialData={selectedOrderItem}
                                    onSave={handleOrderItemSave}
                                 />
                              </div>
                           )}
                        </TabsContent>
                     </Tabs>
                  </div>
               )}

            {currentView === "list" && (
               <OrdersList
                  onCreate={handleCreate}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
               />
            )}
         </div>
      </div>
   );
}
