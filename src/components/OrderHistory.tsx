import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { UpdateOrderStatusDialog } from "./UpdateOrderStatusDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    country: string;
    postal_code: string;
  };
  items?: OrderItem[];
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateStatusOrder, setUpdateStatusOrder] = useState<Order | null>(
    null,
  );
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
          *,
          items:order_items(*, product:products(name, image))
        `,
        )
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders found</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status as any} />
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </Button>
                      {user?.email?.endsWith("@admin.com") && (
                        <Button
                          variant="outline"
                          onClick={() => setUpdateStatusOrder(order)}
                        >
                          Update Status
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{selectedOrder.shipping_address.name}</p>
                    <p>{selectedOrder.shipping_address.address}</p>
                    <p>
                      {selectedOrder.shipping_address.city},{" "}
                      {selectedOrder.shipping_address.country}
                    </p>
                    <p>{selectedOrder.shipping_address.postal_code}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Order ID: {selectedOrder.id.slice(0, 8)}</p>
                    <p>
                      Date:{" "}
                      {format(
                        new Date(selectedOrder.created_at),
                        "MMM d, yyyy",
                      )}
                    </p>
                    <p className="flex items-center gap-2">
                      Status:{" "}
                      <OrderStatusBadge status={selectedOrder.status as any} />
                    </p>
                    <p>Total: ${selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 py-4 border-b last:border-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.status_history &&
                selectedOrder.status_history.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Status History</h3>
                    <OrderStatusTimeline
                      history={selectedOrder.status_history}
                    />
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {updateStatusOrder && (
        <UpdateOrderStatusDialog
          open={!!updateStatusOrder}
          onOpenChange={(open) => !open && setUpdateStatusOrder(null)}
          orderId={updateStatusOrder.id}
          currentStatus={updateStatusOrder.status}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
