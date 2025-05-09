import { LucideIcon, Utensils, TreePine, Hotel, ShoppingBag, Landmark, Fuel, ShoppingCart, CreditCard } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const CATEGORIES: Category[] = [
  { id: "restaurant", label: "Restaurants", icon: Utensils },
  { id: "park", label: "Parks", icon: TreePine },
  { id: "hotel", label: "Hotels", icon: Hotel },
  { id: "shop", label: "Shops", icon: ShoppingBag },
  { id: "museum", label: "Museums", icon: Landmark },
  { id: "gas_station", label: "Gas Stations", icon: Fuel },
  { id: "supermarket", label: "Supermarkets", icon: ShoppingCart },
  { id: "atm", label: "ATMs", icon: CreditCard },
]; 