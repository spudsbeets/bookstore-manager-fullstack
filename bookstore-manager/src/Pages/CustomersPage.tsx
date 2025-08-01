import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomersForm } from "@/components/forms/CustomersForm";
import { CustomerOrdersForm } from "@/components/forms/CustomerOrdersForm";
import { CustomerOrdersList } from "@/components/list-views/CustomerOrdersList";
import { CustomersList } from "@/components/list-views/CustomersList";
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
import { User, ShoppingCart } from "lucide-react";

export function CustomersPage() {
   const [currentView, setCurrentView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
   const [selectViewOption, setSelectViewOption] = useState("List Customers");
   const [activeTab, setActiveTab] = useState("details");
   const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for forcing re-render

   // State for customer orders
   const [customerOrderView, setCustomerOrderView] = useState<
      "list" | "create" | "edit" | "view"
   >("list");
   const [selectedCustomerOrder, setSelectedCustomerOrder] =
      useState<any>(null);

   const viewArray = [
      "List Customers",
      "Create Customer",
      "Edit Customer",
      "View Customer",
   ];

   const handleCreate = () => {
      setCurrentView("create");
      setSelectViewOption("Create Customer");
   };
   const handleEdit = (customer: any) => {
      setSelectedCustomer(customer);
      setCurrentView("edit");
      setSelectViewOption("Edit Customer");
      setActiveTab("details");
   };
   const handleView = (customer: any) => {
      setSelectedCustomer(customer);
      setCurrentView("view");
      setSelectViewOption("View Customer");
      setActiveTab("details");
   };
   const handleDelete = () => {
      console.log("Delete customer:", selectedCustomer);
      setCurrentView("list");
      setSelectViewOption("List Customers");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };
   const handleSave = (data: any) => {
      console.log("Save customer:", data);
      setCurrentView("list");
      setSelectViewOption("List Customers");
      setRefreshKey((prev) => prev + 1); // Trigger refresh
   };
   const handleBack = () => {
      setCurrentView("list");
      setSelectViewOption("List Customers");
   };

   const handleViewChange = (value: string) => {
      setSelectViewOption(value);
      switch (value) {
         case "List Customers":
            setCurrentView("list");
            break;
         case "Create Customer":
            setCurrentView("create");
            break;
         case "Edit Customer":
            if (selectedCustomer) {
               setCurrentView("edit");
            } else {
               setSelectViewOption("List Customers");
            }
            break;
         case "View Customer":
            if (selectedCustomer) {
               setCurrentView("view");
            } else {
               setSelectViewOption("List Customers");
            }
            break;
         default:
            setCurrentView("list");
      }
   };

   // Customer Order handlers
   const handleCustomerOrderDelete = (order: any) => {
      console.log("Delete customer order:", order);
   };

   const handleAddCustomerOrder = () => {
      setCustomerOrderView("create");
      setSelectedCustomerOrder(null);
   };

   const handleEditCustomerOrder = (order: any) => {
      setSelectedCustomerOrder(order);
      setCustomerOrderView("edit");
   };

   const handleViewCustomerOrder = (order: any) => {
      setSelectedCustomerOrder(order);
      setCustomerOrderView("view");
   };

   const handleCustomerOrderSave = (data: any) => {
      console.log("Save customer order:", data);
      setCustomerOrderView("list");
      setSelectedCustomerOrder(null);
   };

   const handleCustomerOrderBack = () => {
      setCustomerOrderView("list");
      setSelectedCustomerOrder(null);
   };

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-6">
               <h1 className="text-2xl font-bold mb-4">Customers Management</h1>
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
                        ← Back to Customers
                     </Button>
                  </div>
                  <CustomersForm mode="create" onSave={handleSave} />
               </div>
            )}

            {(currentView === "edit" || currentView === "view") &&
               selectedCustomer && (
                  <div className="space-y-6">
                     <div className="mb-4">
                        <Button variant="outline" onClick={handleBack}>
                           ← Back to Customers
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
                              <User className="h-4 w-4" />
                              Customer Details
                           </TabsTrigger>
                           <TabsTrigger
                              value="orders"
                              className="flex items-center gap-2"
                           >
                              <ShoppingCart className="h-4 w-4" />
                              Customer Orders
                           </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                           <Card>
                              <CardHeader>
                                 <CardTitle>Customer Details</CardTitle>
                                 <CardDescription>
                                    {currentView === "edit"
                                       ? "Edit customer information"
                                       : "View customer details"}
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 <CustomersForm
                                    mode={currentView}
                                    initialData={selectedCustomer}
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

                        <TabsContent value="orders" className="space-y-4">
                           {customerOrderView === "list" && (
                              <Card>
                                 <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                       <ShoppingCart className="h-5 w-5" />
                                       Customer Orders
                                    </CardTitle>
                                    <CardDescription>
                                       Orders placed by this customer
                                    </CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                    <CustomerOrdersList
                                       customerID={selectedCustomer.customerID}
                                       onDelete={handleCustomerOrderDelete}
                                       onAdd={handleAddCustomerOrder}
                                       onEdit={handleEditCustomerOrder}
                                       onView={handleViewCustomerOrder}
                                    />
                                 </CardContent>
                              </Card>
                           )}

                           {(customerOrderView === "create" ||
                              customerOrderView === "edit" ||
                              customerOrderView === "view") && (
                              <div className="max-w-2xl mx-auto">
                                 <div className="mb-4">
                                    <Button
                                       variant="outline"
                                       onClick={handleCustomerOrderBack}
                                    >
                                       ← Back to Customer Orders
                                    </Button>
                                 </div>
                                 <CustomerOrdersForm
                                    mode={customerOrderView}
                                    customerID={selectedCustomer.customerID}
                                    initialData={selectedCustomerOrder}
                                    onSave={handleCustomerOrderSave}
                                    onDelete={
                                       customerOrderView === "edit"
                                          ? () =>
                                               handleCustomerOrderDelete(
                                                  selectedCustomerOrder
                                               )
                                          : undefined
                                    }
                                 />
                              </div>
                           )}
                        </TabsContent>
                     </Tabs>
                  </div>
               )}

            {currentView === "list" && (
               <CustomersList
                  key={refreshKey}
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
