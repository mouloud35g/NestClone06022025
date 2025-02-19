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
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function CategoriesTable() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Categories</h2>
          <Button onClick={() => setIsDialogOpen(true)}>Add Category</Button>
        </div>
        <Input
          placeholder="Search categories..."
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
              <TableHead>Slug</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories
              .filter((category) =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === category.parent_id)?.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteCategory(category)}
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

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
      />

      <DeleteConfirmDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        onConfirm={async () => {
          if (deleteCategory) {
            await supabase
              .from("categories")
              .delete()
              .eq("id", deleteCategory.id);
            setDeleteCategory(null);
            fetchCategories();
          }
        }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteCategory?.name}"? This will also delete all subcategories. This action cannot be undone.`}
      />
    </div>
  );
}
