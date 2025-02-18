import React from "react";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface FilterSidebarProps {
  onPriceChange?: (value: number[]) => void;
  onCategoryChange?: (category: string) => void;
  onColorChange?: (color: string) => void;
  onAvailabilityChange?: (inStock: boolean) => void;
}

const FilterSidebar = ({
  onPriceChange = (range) => {
    filterProducts({ minPrice: range[0], maxPrice: range[1] });
  },
  onCategoryChange = (category) => {
    filterProducts({ category });
  },
  onColorChange = (color) => {
    filterProducts({ color });
  },
  onAvailabilityChange = (inStock) => {
    filterProducts({ inStock });
  },
}: FilterSidebarProps) => {
  return (
    <aside className="w-[280px] h-full bg-white p-6 border-r">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                onValueChange={(value) => onPriceChange(value)}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              {["Living Room", "Bedroom", "Kitchen", "Office", "Outdoor"].map(
                (category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      onCheckedChange={() => onCategoryChange(category)}
                    />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                ),
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-2 pt-4">
              {[
                { name: "White", class: "bg-white border" },
                { name: "Black", class: "bg-black" },
                { name: "Gray", class: "bg-gray-400" },
                { name: "Brown", class: "bg-amber-800" },
                { name: "Blue", class: "bg-blue-500" },
                { name: "Green", class: "bg-green-500" },
                { name: "Red", class: "bg-red-500" },
                { name: "Yellow", class: "bg-yellow-400" },
              ].map((color) => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full ${color.class} hover:ring-2 ring-offset-2 ring-gray-300`}
                  onClick={() => onColorChange(color.name)}
                  title={color.name}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  onCheckedChange={(checked) =>
                    onAvailabilityChange(checked as boolean)
                  }
                />
                <Label htmlFor="in-stock">In Stock Only</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-6" />

      <button
        className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
        onClick={() => {
          onPriceChange([0, 1000]);
          onCategoryChange("");
          onColorChange("");
          onAvailabilityChange(false);
        }}
      >
        Clear All Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
