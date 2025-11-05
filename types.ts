import type { ReactNode } from 'react';

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export interface Location {
  country: string;
  state: string;
  city: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  /** This will now be a subcategory ID */
  category: string;
  location: Location;
  imageUrl: string;
  postDate: string; // ISO 8601 date string
  isFeatured?: boolean;
  seller: {
    username: string;
    joinDate: string;
  };
}