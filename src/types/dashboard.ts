export interface Service {
  id: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  subcategory: string;
  order?: number;
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

export interface DashboardConfig {
  services: Service[];
  subcategories: Subcategory[];
  categories: Category[];
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'custom';
  customSearchUrl?: string;
  showWeather: boolean;
  weatherLocation?: string;
}
