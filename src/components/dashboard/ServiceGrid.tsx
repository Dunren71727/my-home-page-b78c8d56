import { Service, Category } from '@/types/dashboard';
import { ServiceCard } from './ServiceCard';
import { 
  Play, Code, Activity, Globe, LucideIcon
} from 'lucide-react';

interface ServiceGridProps {
  services: Service[];
  categories: Category[];
}

const categoryIconMap: Record<string, LucideIcon> = {
  play: Play,
  code: Code,
  activity: Activity,
  globe: Globe,
};

export function ServiceGrid({ services, categories }: ServiceGridProps) {
  return (
    <div className="space-y-8">
      {categories.map(category => {
        const categoryServices = services.filter(s => s.category === category.id);
        if (categoryServices.length === 0) return null;

        const IconComponent = categoryIconMap[category.icon] || Globe;

        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
