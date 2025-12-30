import { useMemo } from 'react';
import { Grid3X3 } from 'lucide-react';
import { Category, Subcategory, Service } from '@/types/dashboard';
import { SubcategoryColumn } from './SubcategoryColumn';

interface CategoryTabContentProps {
  category: Category;
  subcategories: Subcategory[];
  services: Service[];
  onReorderServices: (services: Service[]) => void;
}

export function CategoryTabContent({ 
  category, 
  subcategories, 
  services,
  onReorderServices,
}: CategoryTabContentProps) {
  const categorySubcategories = useMemo(() => {
    return subcategories
      .filter(s => s.categoryId === category.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [subcategories, category.id]);

  const getServicesForSubcategory = (subcategoryId: string) => {
    return services.filter(s => s.subcategory === subcategoryId);
  };

  const handleReorderInSubcategory = (subcategoryId: string, reorderedServices: Service[]) => {
    const otherServices = services.filter(s => s.subcategory !== subcategoryId);
    onReorderServices([...otherServices, ...reorderedServices]);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Grid3X3 className="w-5 h-5" style={{ color: category.color }} />
        <h2 className="text-xl font-semibold" style={{ color: category.color }}>
          {category.name}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: categorySubcategories.length <= 3 ? `repeat(${categorySubcategories.length}, 1fr)` : undefined }}>
        {categorySubcategories.map((subcategory, index) => (
          <SubcategoryColumn
            key={subcategory.id}
            subcategory={subcategory}
            services={getServicesForSubcategory(subcategory.id)}
            onReorderServices={(reordered) => handleReorderInSubcategory(subcategory.id, reordered)}
            columnIndex={index}
          />
        ))}
      </div>
    </div>
  );
}
