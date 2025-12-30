import { useState, useEffect } from 'react';
import { DashboardConfig, Service, Category } from '@/types/dashboard';

const defaultCategories: Category[] = [
  { id: '1', name: '媒體', icon: 'play' },
  { id: '2', name: '開發工具', icon: 'code' },
  { id: '3', name: '監控', icon: 'activity' },
  { id: '4', name: '網路', icon: 'globe' },
];

const defaultServices: Service[] = [
  { id: '1', name: 'Plex', url: 'https://plex.tv', icon: 'tv', description: '媒體伺服器', category: '1' },
  { id: '2', name: 'Jellyfin', url: 'https://jellyfin.org', icon: 'film', description: '開源媒體系統', category: '1' },
  { id: '3', name: 'GitHub', url: 'https://github.com', icon: 'github', description: '程式碼託管', category: '2' },
  { id: '4', name: 'Portainer', url: 'https://portainer.io', icon: 'container', description: 'Docker 管理', category: '2' },
  { id: '5', name: 'Grafana', url: 'https://grafana.com', icon: 'bar-chart-2', description: '數據視覺化', category: '3' },
  { id: '6', name: 'Prometheus', url: 'https://prometheus.io', icon: 'database', description: '監控系統', category: '3' },
  { id: '7', name: 'Pi-hole', url: 'https://pi-hole.net', icon: 'shield', description: 'DNS 廣告攔截', category: '4' },
  { id: '8', name: 'Nginx', url: 'https://nginx.org', icon: 'server', description: '反向代理', category: '4' },
];

const defaultConfig: DashboardConfig = {
  services: defaultServices,
  categories: defaultCategories,
  searchEngine: 'google',
  showWeather: true,
  weatherLocation: 'Taipei',
};

const STORAGE_KEY = 'dashboard-config';

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    setConfig(prev => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const deleteService = (id: string) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id),
    }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setConfig(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const deleteCategory = (id: string) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
      services: prev.services.filter(s => s.category !== id),
    }));
  };

  const updateSettings = (updates: Partial<DashboardConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return {
    config,
    addService,
    updateService,
    deleteService,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    resetConfig,
  };
}
