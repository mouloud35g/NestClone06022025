import { Badge } from "@/components/ui/badge";

type StatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusStyles: Record<StatusType, { color: string; background: string }> =
  {
    pending: { color: "text-yellow-700", background: "bg-yellow-100" },
    processing: { color: "text-blue-700", background: "bg-blue-100" },
    shipped: { color: "text-purple-700", background: "bg-purple-100" },
    delivered: { color: "text-green-700", background: "bg-green-100" },
    cancelled: { color: "text-red-700", background: "bg-red-100" },
  };

export function OrderStatusBadge({ status }: { status: StatusType }) {
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <Badge
      className={`${style.color} ${style.background} border-0`}
      variant="outline"
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
