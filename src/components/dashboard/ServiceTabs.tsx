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
    <div className="glass-card rounded-2xl overflow-hidden">
      <Tabs defaultValue={sortedCategories[0]?.id} className="w-full">
        <div className="border-b border-border/30 bg-background/30">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none">
            {sortedCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="relative px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-current data-[state=active]:bg-transparent transition-all"
                style={{ 
                  '--tw-border-opacity': '1',
                } as React.CSSProperties}
              >
                <span 
                  className="font-medium transition-colors data-[state=active]:font-semibold"
                  style={{ color: category.color }}
                >
                  {category.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {sortedCategories.map((category) => (
          <TabsContent 
            key={category.id} 
            value={category.id}
            className="mt-0 focus-visible:outline-none"
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
