export interface Service {
  id: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
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
  categories: Category[];
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'custom';
  customSearchUrl?: string;
  showWeather: boolean;
  weatherLocation?: string;
}
