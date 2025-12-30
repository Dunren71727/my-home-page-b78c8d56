import { useState, useEffect } from 'react';
import { DashboardConfig, Service, Category, Subcategory } from '@/types/dashboard';

const defaultCategories: Category[] = [
  { id: 'clinical', name: '臨床照護', icon: 'heart-pulse', color: 'hsl(200, 80%, 50%)', order: 0 },
  { id: 'admin', name: '行政營運', icon: 'briefcase', color: 'hsl(35, 90%, 50%)', order: 1 },
  { id: 'training', name: '教育訓練', icon: 'graduation-cap', color: 'hsl(145, 70%, 45%)', order: 2 },
  { id: 'simulation', name: '模擬操作', icon: 'play-circle', color: 'hsl(280, 70%, 55%)', order: 3 },
];

const defaultSubcategories: Subcategory[] = [
  // 臨床照護
  { id: 'patient', name: '病患動態', icon: 'users', color: 'hsl(200, 70%, 55%)', categoryId: 'clinical', order: 0 },
  { id: 'assessment', name: '病情與評估', icon: 'clipboard', color: 'hsl(180, 60%, 45%)', categoryId: 'clinical', order: 1 },
  { id: 'rehab', name: '復健與活動', icon: 'heart', color: 'hsl(340, 70%, 55%)', categoryId: 'clinical', order: 2 },
  
  // 行政營運
  { id: 'task', name: '任務管理', icon: 'briefcase', color: 'hsl(35, 85%, 55%)', categoryId: 'admin', order: 0 },
  { id: 'general', name: '總務', icon: 'package', color: 'hsl(85, 60%, 50%)', categoryId: 'admin', order: 1 },
  { id: 'welfare', name: '員工福利', icon: 'gift', color: 'hsl(45, 90%, 55%)', categoryId: 'admin', order: 2 },
  { id: 'admin-process', name: '行政處理', icon: 'file-text', color: 'hsl(15, 80%, 55%)', categoryId: 'admin', order: 3 },
  
  // 教育訓練
  { id: 'training-main', name: '教育訓練', icon: 'graduation-cap', color: 'hsl(145, 65%, 50%)', categoryId: 'training', order: 0 },
  
  // 模擬操作
  { id: 'simulation-main', name: '模擬操作', icon: 'play-circle', color: 'hsl(280, 65%, 60%)', categoryId: 'simulation', order: 0 },
];

const defaultServices: Service[] = [
  // 病患動態
  { id: '1', name: '外出外宿 (Demo)', url: 'http://192.168.62.102.nip.io:4173/#', icon: 'user-check', description: '患者外出外宿即時統計', subcategory: 'patient', order: 0 },
  { id: '2', name: '即時住院資訊更新', url: 'http://192.168.62.104:8000/api/v1/', icon: 'building', description: '即時住院資訊更新系統', subcategory: 'patient', order: 1 },
  
  // 病情與評估
  { id: '3', name: '觀察評估表', url: 'http://192.168.62.103:3030/', icon: 'clipboard', description: '觀察評估表系統', subcategory: 'assessment', order: 0 },
  { id: '4', name: '病情變化提報表', url: 'http://192.168.62.107/clinical-observation/', icon: 'alert-triangle', description: '病情變化提報表系統', subcategory: 'assessment', order: 1 },
  { id: '5', name: '信品檢驗作業流程', url: 'http://192.168.62.107/medical-examination/', icon: 'flask-conical', description: '信品檢驗作業流程系統', subcategory: 'assessment', order: 2 },
  
  // 復健與活動
  { id: '6', name: '復健工作記錄', url: 'http://192.168.62.102:5177/', icon: 'dumbbell', description: '復健工作記錄系統', subcategory: 'rehab', order: 0 },
  { id: '7', name: '24節氣復健儀表板', url: 'http://192.168.62.102:3000/', icon: 'calendar-heart', description: '節氣復健活動系統', subcategory: 'rehab', order: 1 },
  { id: '8', name: '職業復健評估系統', url: 'http://192.168.62.107/occupational-assessment/', icon: 'clipboard-check', description: '輔導與回饋工作儀表板', subcategory: 'rehab', order: 2 },
  { id: '9', name: '戶外安控儀表板', url: 'http://192.168.62.101:3077/', icon: 'shield', description: '戶外安控紀錄儀表板', subcategory: 'rehab', order: 3 },
  
  // 任務管理
  { id: '10', name: '專案管理中心', url: 'http://192.168.62.100:4000/', icon: 'briefcase', description: '專案管理系統', subcategory: 'task', order: 0 },
  { id: '11', name: '各項任務巡檢', url: 'http://192.168.62.102:5000/', icon: 'check-square', description: '各項任務巡檢系統', subcategory: 'task', order: 1 },
  
  // 總務
  { id: '12', name: '庫存管理', url: 'http://192.168.62.103:3000/', icon: 'package', description: '庫存管理系統', subcategory: 'general', order: 0 },
  { id: '13', name: '閒置物品查詢', url: 'http://192.168.62.103:3000/idle-items', icon: 'search', description: '閒置物品查詢系統', subcategory: 'general', order: 1 },
  { id: '14', name: '工務工時分析系統', url: 'http://192.168.62.107/dunren-ga/', icon: 'clock', description: '工時分析系統', subcategory: 'general', order: 2 },
  
  // 員工福利
  { id: '15', name: '🎂 生日書籍福利系統', url: 'http://192.168.62.100:6001/', icon: 'cake', description: '生日書籍福利系統', subcategory: 'welfare', order: 0 },
  
  // 行政處理
  { id: '16', name: '智慧化公告管理平台', url: 'http://192.168.62.100:5000/', icon: 'megaphone', description: '智慧化公告管理平台', subcategory: 'admin-process', order: 0 },
  { id: '17', name: '病歷品質審查', url: 'http://192.168.62.102:3200/', icon: 'file-check', description: '病歷品質審查系統', subcategory: 'admin-process', order: 1 },
  
  // 教育訓練
  { id: '18', name: '敦仁醫院防災演練 簽名管理版', url: 'http://192.168.62.100:5174/teams', icon: 'shield-check', description: '敦仁醫院防災演練管理系統', subcategory: 'training-main', order: 0 },
  { id: '19', name: '333演練劇本', url: 'http://59.125.53.218:333/scenario-333/', icon: 'scroll', description: '333演練劇本系統', subcategory: 'training-main', order: 1 },
  
  // 模擬操作
  { id: '20', name: '模擬情境醫療糾紛', url: 'http://192.168.62.107/scenario-medical-dispute/', icon: 'alert-circle', description: '模擬情境醫療糾紛系統', subcategory: 'simulation-main', order: 0 },
  { id: '21', name: '模擬情境家屬質疑電話', url: 'http://192.168.62.107/scenario-telephone-response/', icon: 'phone', description: '模擬情境家屬質疑電話系統', subcategory: 'simulation-main', order: 1 },
  { id: '22', name: '復健工作儀表板', url: 'http://192.168.62.107/rehabilitation-progress/', icon: 'layout-dashboard', description: '復健工作儀表板系統', subcategory: 'simulation-main', order: 2 },
  { id: '23', name: '住院個案資料彙整表', url: 'http://192.168.62.107/inpatient-summary/', icon: 'files', description: '住院個案資料彙整表系統', subcategory: 'simulation-main', order: 3 },
];

const defaultConfig: DashboardConfig = {
  services: defaultServices,
  subcategories: defaultSubcategories,
  categories: defaultCategories,
  searchEngine: 'google',
  showWeather: true,
  weatherLocation: 'Taipei',
};

const STORAGE_KEY = 'dashboard-config';
const CONFIG_VERSION = 3;

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedVersion = localStorage.getItem(STORAGE_KEY + '-version');
    
    if (storedVersion !== String(CONFIG_VERSION)) {
      localStorage.setItem(STORAGE_KEY + '-version', String(CONFIG_VERSION));
      return defaultConfig;
    }
    
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

  const reorderServices = (services: Service[]) => {
    setConfig(prev => ({
      ...prev,
      services,
    }));
  };

  const addSubcategory = (subcategory: Omit<Subcategory, 'id'>) => {
    const newSubcategory = { ...subcategory, id: Date.now().toString() };
    setConfig(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, newSubcategory],
    }));
  };

  const updateSubcategory = (id: string, updates: Partial<Subcategory>) => {
    setConfig(prev => ({
      ...prev,
      subcategories: prev.subcategories.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const deleteSubcategory = (id: string) => {
    setConfig(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s.id !== id),
      services: prev.services.filter(s => s.subcategory !== id),
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
    setConfig(prev => {
      const subcategoryIds = prev.subcategories.filter(s => s.categoryId === id).map(s => s.id);
      return {
        ...prev,
        categories: prev.categories.filter(c => c.id !== id),
        subcategories: prev.subcategories.filter(s => s.categoryId !== id),
        services: prev.services.filter(s => !subcategoryIds.includes(s.subcategory)),
      };
    });
  };

  const reorderCategories = (categories: Category[]) => {
    setConfig(prev => ({
      ...prev,
      categories,
    }));
  };

  const reorderSubcategories = (subcategories: Subcategory[]) => {
    setConfig(prev => ({
      ...prev,
      subcategories,
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
    reorderServices,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    reorderSubcategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    updateSettings,
    resetConfig,
  };
}
