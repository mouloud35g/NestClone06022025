import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { UpdateOrderStatusDialog } from "./UpdateOrderStatusDialog";
import { useAuth } from "@/contexts/AuthContext";

interface OrderDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onStatusUpdate?: () => void;
}

export function OrderDetails({
  open,
  onOpenChange,
  order,
  onStatusUpdate,
}: OrderDetailsProps) {
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = React.useState(false);
  const { user } = useAuth();

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id.slice(0, 8)}</span>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{order.shipping_address.name}</p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.country}
              </p>
              <p>{order.shipping_address.postal_code}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Date: {format(new Date(order.created_at), "MMM d, yyyy")}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              {order.user?.email && <p>Customer: {order.user.email}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-4">Items</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {order.items?.map((item: any) => (
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
          </ScrollArea>
        </div>

        {order.status_history && order.status_history.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-4">Status History</h3>
            <OrderStatusTimeline history={order.status_history} />
          </div>
        )}

        {user?.email?.endsWith("@admin.com") && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsUpdateStatusOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Update Status
            </button>
          </div>
        )}
      </DialogContent>

      <UpdateOrderStatusDialog
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        orderId={order.id}
        currentStatus={order.status}
        onSuccess={() => {
          setIsUpdateStatusOpen(false);
          onStatusUpdate?.();
        }}
      />
    </Dialog>
  );
}
