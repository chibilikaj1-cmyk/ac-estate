export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url: string;
  featured: boolean;
  virtual_tour_url?: string;
  total_units: number;
  available_units: number;
  project: string;
  images?: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  image_url: string;
  created_at: string;
}

export interface MaintenanceRequest {
  property_id: number;
  tenant_name: string;
  issue_description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PropertyApplication {
  id?: number;
  property_id: number;
  user_id?: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  status?: string;
  created_at?: string;
  property_title?: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'owner';
}
