import { useState } from 'react';
import { Settings, Plus, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Service, Category, DashboardConfig } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

interface ConfigEditorProps {
  config: DashboardConfig;
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateSettings: (updates: Partial<DashboardConfig>) => void;
  onReset: () => void;
}

const iconOptions = [
  'play', 'code', 'activity', 'globe', 'tv', 'film', 
  'github', 'container', 'bar-chart-2', 'database', 'shield', 'server'
];

export function ConfigEditor({
  config,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateSettings,
  onReset,
}: ConfigEditorProps) {
  const { toast } = useToast();
  const [newService, setNewService] = useState({
    name: '',
    url: '',
    icon: 'globe',
    description: '',
    category: config.categories[0]?.id || '',
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'globe',
  });

  const handleAddService = () => {
    if (!newService.name || !newService.url) {
      toast({ title: '請填寫名稱和網址', variant: 'destructive' });
      return;
    }
    onAddService(newService);
    setNewService({ name: '', url: '', icon: 'globe', description: '', category: config.categories[0]?.id || '' });
    toast({ title: '服務已新增' });
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({ title: '請填寫分類名稱', variant: 'destructive' });
      return;
    }
    onAddCategory(newCategory);
    setNewCategory({ name: '', icon: 'globe' });
    toast({ title: '分類已新增' });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="glass-card rounded-xl hover-lift">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>設定編輯器</SheetTitle>
          <SheetDescription>管理您的服務、分類和偏好設定</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="services" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">服務</TabsTrigger>
            <TabsTrigger value="categories">分類</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4 mt-4">
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium">新增服務</h4>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>名稱</Label>
                    <Input
                      value={newService.name}
                      onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="服務名稱"
                    />
                  </div>
                  <div>
                    <Label>圖示</Label>
                    <Select
                      value={newService.icon}
                      onValueChange={(value) => setNewService(prev => ({ ...prev, icon: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>網址</Label>
                  <Input
                    value={newService.url}
                    onChange={(e) => setNewService(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>描述（選填）</Label>
                  <Input
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="簡短描述"
                  />
                </div>
                <div>
                  <Label>分類</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) => setNewService(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddService} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  新增服務
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">現有服務</h4>
              {config.services.map(service => (
                <div key={service.id} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <span className="flex-1 truncate">{service.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteService(service.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium">新增分類</h4>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>名稱</Label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="分類名稱"
                    />
                  </div>
                  <div>
                    <Label>圖示</Label>
                    <Select
                      value={newCategory.icon}
                      onValueChange={(value) => setNewCategory(prev => ({ ...prev, icon: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  新增分類
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">現有分類</h4>
              {config.categories.map(category => (
                <div key={category.id} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <span className="flex-1 truncate">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCategory(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label>搜尋引擎</Label>
                <Select
                  value={config.searchEngine}
                  onValueChange={(value: 'google' | 'bing' | 'duckduckgo' | 'custom') => 
                    onUpdateSettings({ searchEngine: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="bing">Bing</SelectItem>
                    <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                    <SelectItem value="custom">自訂</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.searchEngine === 'custom' && (
                <div>
                  <Label>自訂搜尋網址</Label>
                  <Input
                    value={config.customSearchUrl || ''}
                    onChange={(e) => onUpdateSettings({ customSearchUrl: e.target.value })}
                    placeholder="https://search.example.com/?q="
                    className="mt-2"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>顯示天氣 Widget</Label>
                <Switch
                  checked={config.showWeather}
                  onCheckedChange={(checked) => onUpdateSettings({ showWeather: checked })}
                />
              </div>

              {config.showWeather && (
                <div>
                  <Label>天氣地點</Label>
                  <Input
                    value={config.weatherLocation || ''}
                    onChange={(e) => onUpdateSettings({ weatherLocation: e.target.value })}
                    placeholder="城市名稱"
                    className="mt-2"
                  />
                </div>
              )}

              <Button variant="destructive" onClick={onReset} className="w-full mt-6">
                <RotateCcw className="w-4 h-4 mr-2" />
                重置為預設值
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
