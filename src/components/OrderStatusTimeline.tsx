import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface StatusHistoryItem {
  status: string;
  timestamp: number;
  note?: string;
}

export function OrderStatusTimeline({
  history,
}: {
  history: StatusHistoryItem[];
}) {
  return (
    <ScrollArea className="h-[200px]">
      <div className="relative pl-8 space-y-6">
        {history.map((item, index) => (
          <div key={index} className="relative">
            <div className="absolute left-[-2rem] mt-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background" />
            {index !== history.length - 1 && (
              <div className="absolute left-[-1.6rem] top-4 bottom-[-2rem] w-px bg-border" />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">{item.status}</span>
                <span className="text-sm text-muted-foreground">
                  {format(
                    new Date(item.timestamp * 1000),
                    "MMM d, yyyy h:mm a",
                  )}
                </span>
              </div>
              {item.note && (
                <p className="text-sm text-muted-foreground">{item.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
