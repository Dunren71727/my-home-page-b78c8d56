import { useState, useMemo } from 'react';
import { Settings, Plus, Trash2, RotateCcw, Palette, GripVertical } from 'lucide-react';
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
import { Service, Category, Subcategory, DashboardConfig } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

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
  colorPresets: string[];
  categories: Category[];
  onUpdateSubcategory: (id: string, updates: Partial<Subcategory>) => void;
  onDeleteSubcategory: (id: string) => void;
}

function SortableSubcategoryItem({ subcategory, colorPresets, categories, onUpdateSubcategory, onDeleteSubcategory }: SortableSubcategoryItemProps) {
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

  const categoryName = categories.find(c => c.id === subcategory.categoryId)?.name || '未分類';

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
      <div className="flex-1 min-w-0">
        <span className="truncate text-sm block">{subcategory.name}</span>
        <Select
          value={subcategory.categoryId}
          onValueChange={(value) => onUpdateSubcategory(subcategory.id, { categoryId: value })}
        >
          <SelectTrigger className="h-6 text-xs text-muted-foreground border-none p-0 bg-transparent shadow-none hover:bg-muted/50">
            <SelectValue placeholder={categoryName} />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-1">
        {colorPresets.map((color) => (
          <button
            key={color}
            onClick={() => onUpdateSubcategory(subcategory.id, { color })}
            className={`w-5 h-5 rounded border transition-all ${
              subcategory.color === color ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
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
  
  const [newService, setNewService] = useState({
    name: '',
    url: '',
    icon: 'globe',
    description: '',
    subcategory: config.subcategories[0]?.id || '',
  });
  
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">服務</TabsTrigger>
            <TabsTrigger value="subcategories">子分類</TabsTrigger>
            <TabsTrigger value="categories">主分類</TabsTrigger>
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
                  <span className="flex-1 truncate text-sm">{service.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteService(service.id)}
                    className="text-destructive hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                        colorPresets={colorPresets}
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

          {/* Settings Tab */}
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
