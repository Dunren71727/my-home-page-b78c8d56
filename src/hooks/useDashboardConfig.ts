import { useState, useEffect } from 'react';
import { DashboardConfig, Service, Category } from '@/types/dashboard';

const defaultCategories: Category[] = [
  { id: 'patient', name: '病患動態', icon: 'users' },
  { id: 'assessment', name: '病情與評估', icon: 'clipboard' },
  { id: 'rehab', name: '復健與活動', icon: 'heart' },
  { id: 'task', name: '任務管理', icon: 'briefcase' },
  { id: 'general', name: '總務', icon: 'package' },
  { id: 'welfare', name: '員工福利', icon: 'gift' },
  { id: 'admin', name: '行政處理', icon: 'file-text' },
  { id: 'training', name: '教育訓練', icon: 'graduation-cap' },
  { id: 'simulation', name: '模擬操作', icon: 'play-circle' },
];

const defaultServices: Service[] = [
  // 病患動態
  { 
    id: '1', 
    name: '外出外宿 (Demo)', 
    url: 'http://192.168.62.102.nip.io:4173/#', 
    icon: 'user-check', 
    description: '患者外出外宿即時統計', 
    category: 'patient' 
  },
  { 
    id: '2', 
    name: '即時住院資訊更新', 
    url: 'http://192.168.62.104:8000/api/v1/', 
    icon: 'building', 
    description: '即時住院資訊更新系統', 
    category: 'patient' 
  },
  
  // 病情與評估
  { 
    id: '3', 
    name: '觀察評估表', 
    url: 'http://192.168.62.103:3030/', 
    icon: 'clipboard', 
    description: '觀察評估表系統', 
    category: 'assessment' 
  },
  { 
    id: '4', 
    name: '病情變化提報表', 
    url: 'http://192.168.62.107/clinical-observation/', 
    icon: 'alert-triangle', 
    description: '病情變化提報表系統', 
    category: 'assessment' 
  },
  { 
    id: '5', 
    name: '信品檢驗作業流程', 
    url: 'http://192.168.62.107/medical-examination/', 
    icon: 'flask-conical', 
    description: '信品檢驗作業流程系統', 
    category: 'assessment' 
  },
  
  // 復健與活動
  { 
    id: '6', 
    name: '復健工作記錄', 
    url: 'http://192.168.62.102:5177/', 
    icon: 'dumbbell', 
    description: '復健工作記錄系統', 
    category: 'rehab' 
  },
  { 
    id: '7', 
    name: '24節氣復健儀表板', 
    url: 'http://192.168.62.102:3000/', 
    icon: 'calendar-heart', 
    description: '節氣復健活動系統', 
    category: 'rehab' 
  },
  { 
    id: '8', 
    name: '職業復健評估系統', 
    url: 'http://192.168.62.107/occupational-assessment/', 
    icon: 'clipboard-check', 
    description: '輔導與回饋工作儀表板', 
    category: 'rehab' 
  },
  { 
    id: '9', 
    name: '戶外安控儀表板', 
    url: 'http://192.168.62.101:3077/', 
    icon: 'shield', 
    description: '戶外安控紀錄儀表板', 
    category: 'rehab' 
  },
  
  // 任務管理
  { 
    id: '10', 
    name: '專案管理中心', 
    url: 'http://192.168.62.100:4000/', 
    icon: 'briefcase', 
    description: '專案管理系統', 
    category: 'task' 
  },
  { 
    id: '11', 
    name: '各項任務巡檢', 
    url: 'http://192.168.62.102:5000/', 
    icon: 'check-square', 
    description: '各項任務巡檢系統', 
    category: 'task' 
  },
  
  // 總務
  { 
    id: '12', 
    name: '庫存管理', 
    url: 'http://192.168.62.103:3000/', 
    icon: 'package', 
    description: '庫存管理系統', 
    category: 'general' 
  },
  { 
    id: '13', 
    name: '閒置物品查詢', 
    url: 'http://192.168.62.103:3000/idle-items', 
    icon: 'search', 
    description: '閒置物品查詢系統', 
    category: 'general' 
  },
  { 
    id: '14', 
    name: '工務工時分析系統', 
    url: 'http://192.168.62.107/dunren-ga/', 
    icon: 'clock', 
    description: '工時分析系統', 
    category: 'general' 
  },
  
  // 員工福利
  { 
    id: '15', 
    name: '🎂 生日書籍福利系統', 
    url: 'http://192.168.62.100:6001/', 
    icon: 'cake', 
    description: '生日書籍福利系統', 
    category: 'welfare' 
  },
  
  // 行政處理
  { 
    id: '16', 
    name: '智慧化公告管理平台', 
    url: 'http://192.168.62.100:5000/', 
    icon: 'megaphone', 
    description: '智慧化公告管理平台', 
    category: 'admin' 
  },
  { 
    id: '17', 
    name: '病歷品質審查', 
    url: 'http://192.168.62.102:3200/', 
    icon: 'file-check', 
    description: '病歷品質審查系統', 
    category: 'admin' 
  },
  
  // 教育訓練
  { 
    id: '18', 
    name: '敦仁醫院防災演練 簽名管理版', 
    url: 'http://192.168.62.100:5174/teams', 
    icon: 'shield-check', 
    description: '敦仁醫院防災演練管理系統', 
    category: 'training' 
  },
  { 
    id: '19', 
    name: '333演練劇本', 
    url: 'http://59.125.53.218:333/scenario-333/', 
    icon: 'scroll', 
    description: '333演練劇本系統', 
    category: 'training' 
  },
  
  // 模擬操作
  { 
    id: '20', 
    name: '模擬情境醫療糾紛', 
    url: 'http://192.168.62.107/scenario-medical-dispute/', 
    icon: 'alert-circle', 
    description: '模擬情境醫療糾紛系統', 
    category: 'simulation' 
  },
  { 
    id: '21', 
    name: '模擬情境家屬質疑電話', 
    url: 'http://192.168.62.107/scenario-telephone-response/', 
    icon: 'phone', 
    description: '模擬情境家屬質疑電話系統', 
    category: 'simulation' 
  },
  { 
    id: '22', 
    name: '復健工作儀表板', 
    url: 'http://192.168.62.107/rehabilitation-progress/', 
    icon: 'layout-dashboard', 
    description: '復健工作儀表板系統', 
    category: 'simulation' 
  },
  { 
    id: '23', 
    name: '住院個案資料彙整表', 
    url: 'http://192.168.62.107/inpatient-summary/', 
    icon: 'files', 
    description: '住院個案資料彙整表系統', 
    category: 'simulation' 
  },
];

const defaultConfig: DashboardConfig = {
  services: defaultServices,
  categories: defaultCategories,
  searchEngine: 'google',
  showWeather: true,
  weatherLocation: 'Taipei',
};

const STORAGE_KEY = 'dashboard-config';
const CONFIG_VERSION = 2; // 增加版本號以強制更新

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedVersion = localStorage.getItem(STORAGE_KEY + '-version');
    
    // 如果版本不符，使用預設設定
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
