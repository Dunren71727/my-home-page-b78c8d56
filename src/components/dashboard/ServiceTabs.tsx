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
      <div className="text-center py-16 text-xl text-muted-foreground glass-card">
        尚無分類，請在設定中新增 ✦
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-fade-up">
      <Tabs defaultValue={sortedCategories[0]?.id} className="w-full">
        {/* Tab header - 暖色調標籤 */}
        <div className="border-b border-secondary/30 bg-gradient-to-r from-warm-cream/50 via-warm-beige/40 to-warm-cream/50">
          <TabsList className="w-full justify-start h-auto p-1.5 bg-transparent rounded-none gap-2">
            {sortedCategories.map((category, index) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="relative px-6 py-3 rounded-xl
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80
                  data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
                  data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground 
                  data-[state=inactive]:hover:bg-secondary/15
                  transition-all duration-300 font-bold text-base tracking-wide"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
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
            className="mt-0 focus-visible:outline-none bg-card/60"
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