import { useState, useMemo } from 'react';
import { Settings, Plus, Trash2, RotateCcw, Palette, GripVertical, ChevronDown, ChevronUp, Globe, Pencil, Database } from 'lucide-react';
import { SqliteManager } from './SqliteManager';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Service, Category, Subcategory, DashboardConfig, ThemeType, ApiConfig } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface SortableCategoryItemProps {
  category: Category;
  colorPresets: string[];
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

function SortableCategoryItem({ category, colorPresets, onUpdateCategory, onDeleteCategory }: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 rounded-lg bg-muted/30"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-muted/50 p-1 rounded touch-none"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      <div 
        className="w-4 h-4 rounded-full shrink-0" 
        style={{ backgroundColor: category.color }}
      />
      <span className="flex-1 truncate text-sm">{category.name}</span>
      <div className="flex gap-1">
        {colorPresets.map((color) => (
          <button
            key={color}
            onClick={() => onUpdateCategory(category.id, { color })}
            className={`w-5 h-5 rounded border transition-all ${
              category.color === color ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteCategory(category.id)}
        className="text-destructive hover:text-destructive h-8 w-8"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface ConfigEditorProps {
  config: DashboardConfig;
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
  onAddSubcategory: (subcategory: Omit<Subcategory, 'id'>) => void;
  onUpdateSubcategory: (id: string, updates: Partial<Subcategory>) => void;
  onDeleteSubcategory: (id: string) => void;
  onReorderSubcategories: (subcategories: Subcategory[]) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (categories: Category[]) => void;
  onUpdateSettings: (updates: Partial<DashboardConfig>) => void;
  onReset: () => void;
}

interface SortableSubcategoryItemProps {
  subcategory: Subcategory;
  categories: Category[];
  onUpdateSubcategory: (id: string, updates: Partial<Subcategory>) => void;
  onDeleteSubcategory: (id: string) => void;
}

function SortableSubcategoryItem({ subcategory, categories, onUpdateSubcategory, onDeleteSubcategory }: SortableSubcategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subcategory.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 rounded-lg bg-muted/30"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-muted/50 p-1 rounded touch-none"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      <div 
        className="w-4 h-4 rounded-full shrink-0" 
        style={{ backgroundColor: subcategory.color }}
      />
      <div className="flex-1 min-w-0 space-y-1">
        <Input
          value={subcategory.name}
          onChange={(e) => onUpdateSubcategory(subcategory.id, { name: e.target.value })}
          className="h-7 text-sm px-2"
        />
        <Select
          value={subcategory.categoryId}
          onValueChange={(value) => onUpdateSubcategory(subcategory.id, { categoryId: value })}
        >
          <SelectTrigger className="h-6 text-xs text-muted-foreground border-none p-0 bg-transparent shadow-none hover:bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteSubcategory(subcategory.id)}
        className="text-destructive hover:text-destructive h-8 w-8"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

const iconOptions = [
  'play', 'code', 'activity', 'globe', 'tv', 'film', 
  'github', 'container', 'bar-chart-2', 'database', 'shield', 'server',
  'heart', 'briefcase', 'users', 'clipboard', 'package', 'gift',
  'file-text', 'graduation-cap', 'play-circle', 'heart-pulse'
];

const colorPresets = [
  'hsl(200, 80%, 50%)', // 藍
  'hsl(35, 90%, 50%)',  // 橙
  'hsl(145, 70%, 45%)', // 綠
  'hsl(280, 70%, 55%)', // 紫
  'hsl(340, 70%, 55%)', // 粉紅
  'hsl(45, 90%, 55%)',  // 黃
  'hsl(180, 60%, 45%)', // 青
  'hsl(15, 80%, 55%)',  // 紅橙
];

export function ConfigEditor({
  config,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
  onReorderSubcategories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onUpdateSettings,
  onReset,
}: ConfigEditorProps) {
  const { toast } = useToast();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedCategories = useMemo(() => {
    return [...config.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [config.categories]);

  const sortedSubcategories = useMemo(() => {
    return [...config.subcategories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [config.subcategories]);
  
  const [newService, setNewService] = useState<{
    name: string;
    url: string;
    icon: string;
    description: string;
    subcategory: string;
    apiConfig?: ApiConfig;
  }>({
    name: '',
    url: '',
    icon: 'globe',
    description: '',
    subcategory: config.subcategories[0]?.id || '',
  });
  
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingApiConfig, setEditingApiConfig] = useState<ApiConfig | undefined>(undefined);
  
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    icon: 'globe',
    color: colorPresets[0],
    categoryId: config.categories[0]?.id || '',
  });
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'globe',
    color: colorPresets[0],
  });

  const handleAddService = () => {
    if (!newService.name || !newService.url) {
      toast({ title: '請填寫名稱和網址', variant: 'destructive' });
      return;
    }
    onAddService(newService);
    setNewService({ name: '', url: '', icon: 'globe', description: '', subcategory: config.subcategories[0]?.id || '' });
    toast({ title: '服務已新增' });
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.name) {
      toast({ title: '請填寫子分類名稱', variant: 'destructive' });
      return;
    }
    onAddSubcategory(newSubcategory);
    setNewSubcategory({ name: '', icon: 'globe', color: colorPresets[0], categoryId: config.categories[0]?.id || '' });
    toast({ title: '子分類已新增' });
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({ title: '請填寫分類名稱', variant: 'destructive' });
      return;
    }
    onAddCategory(newCategory);
    setNewCategory({ name: '', icon: 'globe', color: colorPresets[0] });
    toast({ title: '分類已新增' });
  };

  const handleSubcategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSubcategories.findIndex((s) => s.id === active.id);
      const newIndex = sortedSubcategories.findIndex((s) => s.id === over.id);

      const newOrder = [...sortedSubcategories];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      const updatedSubcategories = newOrder.map((s, index) => ({ ...s, order: index }));
      onReorderSubcategories(updatedSubcategories);
    }
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedCategories.findIndex((c) => c.id === active.id);
      const newIndex = sortedCategories.findIndex((c) => c.id === over.id);

      const newOrder = [...sortedCategories];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);

      const updatedCategories = newOrder.map((c, index) => ({ ...c, order: index }));
      onReorderCategories(updatedCategories);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-md bg-secondary-foreground/10 border border-secondary-foreground/20 hover:bg-secondary-foreground/20 text-secondary-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>設定編輯器</SheetTitle>
          <SheetDescription>管理您的服務、分類和偏好設定</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="services" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="services">服務</TabsTrigger>
            <TabsTrigger value="subcategories">子分類</TabsTrigger>
            <TabsTrigger value="categories">主分類</TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              資料庫
            </TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
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
                  <Label>子分類</Label>
                  <Select
                    value={newService.subcategory}
                    onValueChange={(value) => setNewService(prev => ({ ...prev, subcategory: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.subcategories.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* API Configuration */}
                <Collapsible open={showApiConfig} onOpenChange={setShowApiConfig}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        API 設定（選填）
                      </span>
                      {showApiConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 mt-3 p-3 rounded-lg bg-muted/30">
                    <div>
                      <Label>API 端點</Label>
                      <Input
                        value={newService.apiConfig?.endpoint || ''}
                        onChange={(e) => setNewService(prev => ({
                          ...prev,
                          apiConfig: { ...prev.apiConfig, endpoint: e.target.value } as ApiConfig
                        }))}
                        placeholder="https://api.example.com/data"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>方法</Label>
                        <Select
                          value={newService.apiConfig?.method || 'GET'}
                          onValueChange={(value: 'GET' | 'POST') => setNewService(prev => ({
                            ...prev,
                            apiConfig: { ...prev.apiConfig, endpoint: prev.apiConfig?.endpoint || '', method: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>刷新間隔（秒）</Label>
                        <Input
                          type="number"
                          min="0"
                          value={newService.apiConfig?.refreshInterval || 0}
                          onChange={(e) => setNewService(prev => ({
                            ...prev,
                            apiConfig: { ...prev.apiConfig, endpoint: prev.apiConfig?.endpoint || '', refreshInterval: parseInt(e.target.value) || 0 }
                          }))}
                          placeholder="0（不自動刷新）"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>顯示欄位（JSON 路徑）</Label>
                      <Input
                        value={newService.apiConfig?.displayField || ''}
                        onChange={(e) => setNewService(prev => ({
                          ...prev,
                          apiConfig: { ...prev.apiConfig, endpoint: prev.apiConfig?.endpoint || '', displayField: e.target.value }
                        }))}
                        placeholder="例如: data.count 或 status"
                      />
                      <p className="text-xs text-muted-foreground mt-1">留空顯示完整回應</p>
                    </div>
                    <div>
                      <Label>Headers（JSON 格式）</Label>
                      <Textarea
                        value={newService.apiConfig?.headers ? JSON.stringify(newService.apiConfig.headers, null, 2) : ''}
                        onChange={(e) => {
                          try {
                            const headers = e.target.value ? JSON.parse(e.target.value) : undefined;
                            setNewService(prev => ({
                              ...prev,
                              apiConfig: { ...prev.apiConfig, endpoint: prev.apiConfig?.endpoint || '', headers }
                            }));
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                        placeholder='{"Authorization": "Bearer xxx"}'
                        className="font-mono text-xs"
                        rows={2}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button onClick={handleAddService} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  新增服務
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">現有服務</h4>
              {config.services.map(service => (
                <div key={service.id} className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                    <span className="flex-1 truncate text-sm">
                      {service.name}
                      {service.apiConfig?.endpoint && (
                        <span className="ml-2 text-xs text-primary">🔗 API</span>
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingServiceId(editingServiceId === service.id ? null : service.id);
                        setEditingApiConfig(service.apiConfig);
                      }}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteService(service.id)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Edit API Config for existing service */}
                  {editingServiceId === service.id && (
                    <div className="p-3 rounded-lg bg-muted/20 space-y-3 ml-4">
                      <h5 className="text-sm font-medium">編輯 API 設定</h5>
                      <div>
                        <Label className="text-xs">API 端點</Label>
                        <Input
                          value={editingApiConfig?.endpoint || ''}
                          onChange={(e) => setEditingApiConfig(prev => ({
                            ...prev,
                            endpoint: e.target.value
                          } as ApiConfig))}
                          placeholder="https://api.example.com/data"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">方法</Label>
                          <Select
                            value={editingApiConfig?.method || 'GET'}
                            onValueChange={(value: 'GET' | 'POST') => setEditingApiConfig(prev => ({
                              ...prev,
                              endpoint: prev?.endpoint || '',
                              method: value
                            }))}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">刷新間隔（秒）</Label>
                          <Input
                            type="number"
                            min="0"
                            value={editingApiConfig?.refreshInterval || 0}
                            onChange={(e) => setEditingApiConfig(prev => ({
                              ...prev,
                              endpoint: prev?.endpoint || '',
                              refreshInterval: parseInt(e.target.value) || 0
                            }))}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">顯示欄位</Label>
                        <Input
                          value={editingApiConfig?.displayField || ''}
                          onChange={(e) => setEditingApiConfig(prev => ({
                            ...prev,
                            endpoint: prev?.endpoint || '',
                            displayField: e.target.value
                          }))}
                          placeholder="例如: data.count"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            const apiConfig = editingApiConfig?.endpoint ? editingApiConfig : undefined;
                            onUpdateService(service.id, { apiConfig });
                            setEditingServiceId(null);
                            toast({ title: 'API 設定已更新' });
                          }}
                        >
                          儲存
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingServiceId(null);
                            setEditingApiConfig(undefined);
                          }}
                        >
                          取消
                        </Button>
                        {service.apiConfig?.endpoint && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              onUpdateService(service.id, { apiConfig: undefined });
                              setEditingServiceId(null);
                              toast({ title: 'API 設定已移除' });
                            }}
                          >
                            移除 API
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Subcategories Tab */}
          <TabsContent value="subcategories" className="space-y-4 mt-4">
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium">新增子分類</h4>
              <div className="grid gap-3">
                <div>
                  <Label>名稱</Label>
                  <Input
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="子分類名稱"
                  />
                </div>
                <div>
                  <Label>所屬主分類</Label>
                  <Select
                    value={newSubcategory.categoryId}
                    onValueChange={(value) => setNewSubcategory(prev => ({ ...prev, categoryId: value }))}
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
                <div>
                  <Label>顏色</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewSubcategory(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          newSubcategory.color === color ? 'border-foreground scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddSubcategory} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  新增子分類
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">現有子分類 <span className="text-xs text-muted-foreground">(拖曳排序)</span></h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSubcategoryDragEnd}
              >
                <SortableContext items={sortedSubcategories.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sortedSubcategories.map(sub => (
                      <SortableSubcategoryItem
                        key={sub.id}
                        subcategory={sub}
                        categories={config.categories}
                        onUpdateSubcategory={onUpdateSubcategory}
                        onDeleteSubcategory={onDeleteSubcategory}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium">新增主分類</h4>
              <div className="grid gap-3">
                <div>
                  <Label>名稱</Label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="分類名稱"
                  />
                </div>
                <div>
                  <Label>顏色</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          newCategory.color === color ? 'border-foreground scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  新增主分類
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">現有主分類 <span className="text-xs text-muted-foreground">(拖曳排序)</span></h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleCategoryDragEnd}
              >
                <SortableContext items={sortedCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sortedCategories.map(category => (
                      <SortableCategoryItem
                        key={category.id}
                        category={category}
                        colorPresets={colorPresets}
                        onUpdateCategory={onUpdateCategory}
                        onDeleteCategory={onDeleteCategory}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-4 mt-4">
            <SqliteManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label>主題配色</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    { id: 'default', name: '深藍金', colors: ['hsl(215, 65%, 38%)', 'hsl(45, 85%, 55%)'] },
                    { id: 'cartoon', name: '卡通繽紛', colors: ['hsl(280, 75%, 55%)', 'hsl(340, 80%, 60%)', 'hsl(45, 95%, 60%)'] },
                    { id: 'warm', name: '暖陽', colors: ['hsl(25, 85%, 50%)', 'hsl(45, 90%, 55%)', 'hsl(15, 80%, 55%)'] },
                    { id: 'aqua-gold', name: '水金', colors: ['hsl(185, 70%, 40%)', 'hsl(48, 90%, 55%)'] },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onUpdateSettings({ theme: theme.id as ThemeType })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        (config.theme || 'default') === theme.id
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex gap-1 mb-2 justify-center">
                        {theme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="destructive" onClick={onReset} className="w-full mt-4">
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
