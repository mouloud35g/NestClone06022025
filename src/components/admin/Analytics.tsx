import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export function Analytics() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    topProducts: [],
    recentOrders: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total orders and revenue
        const { data: orders } = await supabase.from("orders").select("total");
        const totalOrders = orders?.length || 0;
        const totalRevenue =
          orders?.reduce((sum, order) => sum + order.total, 0) || 0;
        const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

        // Get total products
        const { count: totalProducts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        // Get top selling products
        const { data: topProducts } = await supabase
          .from("order_items")
          .select("product_id, product:products(name), quantity")
          .limit(5);

        // Get recent orders
        const { data: recentOrders } = await supabase
          .from("orders")
          .select("id, total, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalOrders,
          totalRevenue,
          averageOrderValue,
          totalProducts: totalProducts || 0,
          topProducts:
            topProducts?.map((item: any) => ({
              name: item.product.name,
              total_sold: item.quantity,
            })) || [],
          recentOrders: recentOrders || [],
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchStats();

    // Subscribe to changes
    const ordersSubscription = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        fetchStats,
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.averageOrderValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm font-medium">
                    {product.total_sold} sold
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm">Order #{order.id.slice(0, 8)}</span>
                  <div className="text-sm">
                    <span className="font-medium">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
