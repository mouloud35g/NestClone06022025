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
import { supabase } from "@/lib/supabase";
import { ProductDialog } from "./ProductDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useCategories";

interface Product {
  id: string;
  name: string;
  price: number;
  category_id: string;
  in_stock: boolean;
  created_at: string;
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { categories } = useCategories();

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const handleDelete = async () => {
    if (deleteProduct) {
      await supabase.from("products").delete().eq("id", deleteProduct.id);
      fetchProducts();
      setDeleteProduct(null);
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Products</h2>
          <Button onClick={() => setIsDialogOpen(true)}>Add Product</Button>
        </div>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products
              .filter(
                (product) =>
                  product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  categories
                    .find((c) => c.id === product.category_id)
                    ?.name.toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              )
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === product.category_id)?.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${product.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteProduct(product)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSuccess={() => {
          fetchProducts();
          setSelectedProduct(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
