import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category, Subcategory, Service } from '@/types/dashboard';
import { CategoryTabContent } from './CategoryTabContent';

interface ServiceTabsProps {
  categories: Category[];
  subcategories: Subcategory[];
  services: Service[];
  onReorderServices: (services: Service[]) => void;
}

export function ServiceTabs({ categories, subcategories, services, onReorderServices }: ServiceTabsProps) {
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories]);

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        尚無分類，請在設定中新增
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-orange-100">
      <Tabs defaultValue={sortedCategories[0]?.id} className="w-full">
        <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none">
            {sortedCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="relative px-6 py-4 rounded-none border-b-3 border-transparent data-[state=active]:border-current data-[state=active]:bg-white/50 transition-all font-semibold"
                style={{ 
                  color: category.color,
                  borderBottomWidth: '3px',
                } as React.CSSProperties}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {sortedCategories.map((category) => (
          <TabsContent 
            key={category.id} 
            value={category.id}
            className="mt-0 focus-visible:outline-none bg-gradient-to-b from-white/50 to-transparent"
          >
            <CategoryTabContent
              category={category}
              subcategories={subcategories}
              services={services}
              onReorderServices={onReorderServices}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
