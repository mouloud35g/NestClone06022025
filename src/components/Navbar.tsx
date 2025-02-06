import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Heart, ShoppingCart, Search, Menu } from "lucide-react";

interface NavbarProps {
  onSearch?: (query: string) => void;
  cartItemCount?: number;
  favoritesCount?: number;
  categories?: { name: string; subcategories: string[] }[];
}

const Navbar = ({
  onSearch = () => {},
  cartItemCount = 0,
  favoritesCount = 0,
  categories = [
    {
      name: "Furniture",
      subcategories: ["Living Room", "Bedroom", "Dining Room", "Office"],
    },
    {
      name: "Decor",
      subcategories: ["Wall Art", "Lighting", "Rugs", "Mirrors"],
    },
    {
      name: "Kitchen",
      subcategories: ["Cookware", "Appliances", "Storage", "Dining"],
    },
  ],
}: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-gray-200 z-50 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">Nest</h1>
        </div>

        {/* Categories Menu */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {categories.map((category) => (
              <NavigationMenuItem key={category.name}>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {category.subcategories.map((subcategory) => (
                      <li
                        key={subcategory}
                        className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        {subcategory}
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-cart"))}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
