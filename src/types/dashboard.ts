export interface ApiConfig {
  endpoint: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string;
  displayField?: string; // JSON path to the field to display (e.g., "data.count" or "status")
  refreshInterval?: number; // in seconds, 0 means no auto refresh
}

export interface Service {
  id: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  subcategory: string;
  order?: number;
  apiConfig?: ApiConfig;
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  categoryId: string;
  order?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order?: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  wind: number;
  icon: string;
}

export type ThemeType = 'default' | 'cartoon' | 'warm' | 'aqua-gold';

export interface DashboardConfig {
  services: Service[];
  subcategories: Subcategory[];
  categories: Category[];
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'custom';
  customSearchUrl?: string;
  showWeather: boolean;
  weatherLocation?: string;
  theme?: ThemeType;
}
