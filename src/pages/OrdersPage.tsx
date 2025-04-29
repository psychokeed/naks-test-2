
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Package, Route, Box, ShoppingBag } from "lucide-react";

// Mock data for orders - in a real app this would come from an API or database
const mockOrders = [
  {
    id: "ORD-001",
    date: "2025-04-25",
    total: 4500,
    status: "Delivered",
    items: 3,
  },
  {
    id: "ORD-002",
    date: "2025-04-27",
    total: 2800,
    status: "Processing",
    items: 1,
  },
  {
    id: "ORD-003",
    date: "2025-04-29",
    total: 6750,
    status: "Shipped",
    items: 5,
  },
];

// Order status component with appropriate color coding
const OrderStatus = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

// Order tracking details component
const OrderDetails = ({ orderId }: { orderId: string }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          Order #{orderId} Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-600">
                Jane Doe<br />
                123 Main Street<br />
                Apartment 4B<br />
                Nairobi, Kenya
              </p>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-2">Payment Method</h4>
              <p className="text-sm text-gray-600">M-Pesa</p>
              <p className="text-sm text-gray-600">Phone: +254 7XX XXX XXX</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Order Items</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  <div>
                    <p className="font-medium text-sm">Product Name</p>
                    <p className="text-xs text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <p className="text-sm">KSh 1,500.00</p>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded"></div>
                  <div>
                    <p className="font-medium text-sm">Product Name</p>
                    <p className="text-xs text-gray-600">Qty: 1</p>
                  </div>
                </div>
                <p className="text-sm">KSh 3,000.00</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Tracking Information</h4>
            <div className="relative border-l-2 border-primary pl-4 space-y-4 ml-2">
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-4 h-4 bg-primary rounded-full"></div>
                <p className="text-sm font-medium">Order Placed</p>
                <p className="text-xs text-gray-600">April 29, 2025 at 10:30 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-4 h-4 bg-primary rounded-full"></div>
                <p className="text-sm font-medium">Order Processed</p>
                <p className="text-xs text-gray-600">April 29, 2025 at 2:45 PM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-4 h-4 bg-gray-300 rounded-full"></div>
                <p className="text-sm font-medium text-gray-500">Out for Delivery</p>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-4 h-4 bg-gray-300 rounded-full"></div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Please sign in to view your orders</h1>
          <Button asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>KSh {order.total.toLocaleString()}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <OrderStatus status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                        >
                          {selectedOrderId === order.id ? "Hide Details" : "View Details"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>

        {selectedOrderId && <OrderDetails orderId={selectedOrderId} />}
        
        {mockOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
