import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { OrderStatusBadge } from "../OrderStatusBadge";
import { UpdateOrderStatusDialog } from "../UpdateOrderStatusDialog";
import { OrderDetails } from "../OrderDetails";
import { Input } from "@/components/ui/input";

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  user: {
    email: string;
  };
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select(
        `
        *,
        user:user_id(email),
        items:order_items(*, product:products(name, image))
      `,
      )
      .order("created_at", { ascending: false });
    setOrders(data || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Input
          placeholder="Search by order ID or customer email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders
              .filter(
                (order) =>
                  order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  order.user.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              )
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{order.user.email}</TableCell>
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
                        size="sm"
                        onClick={() => setViewingOrder(order)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <UpdateOrderStatusDialog
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          orderId={selectedOrder.id}
          currentStatus={selectedOrder.status}
          onSuccess={fetchOrders}
        />
      )}

      <OrderDetails
        open={!!viewingOrder}
        onOpenChange={(open) => !open && setViewingOrder(null)}
        order={viewingOrder}
        onStatusUpdate={fetchOrders}
      />
    </div>
  );
}
