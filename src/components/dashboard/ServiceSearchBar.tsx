import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Service } from '@/types/dashboard';

interface ServiceSearchBarProps {
  services: Service[];
  onServiceClick?: (service: Service) => void;
}

export function ServiceSearchBar({ services, onServiceClick }: ServiceSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredServices = useMemo(() => {
    if (!query.trim()) return [];
    const searchTerm = query.toLowerCase();
    return services.filter(
      s => s.name.toLowerCase().includes(searchTerm) || 
           s.description?.toLowerCase().includes(searchTerm)
    ).slice(0, 8);
  }, [query, services]);

  const handleServiceClick = (service: Service) => {
    window.open(service.url, '_blank');
    setQuery('');
    onServiceClick?.(service);
  };

  const showResults = isFocused && query.trim() && filteredServices.length > 0;

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 border-2 border-white/40 backdrop-blur-sm shadow-lg">
          <Search className="w-5 h-5 text-white" />
          <Input
            type="text"
            placeholder="搜尋服務..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="flex-1 border-0 bg-transparent h-7 text-sm text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-md bg-card border border-border shadow-lg overflow-hidden z-50">
          {filteredServices.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex flex-col gap-0.5"
            >
              <span className="text-sm font-medium text-foreground">{service.name}</span>
              {service.description && (
                <span className="text-xs text-muted-foreground truncate">
                  {service.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {isFocused && query.trim() && filteredServices.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-md bg-card border border-border shadow-lg p-4 z-50">
          <p className="text-sm text-muted-foreground text-center">找不到相關服務</p>
        </div>
      )}
    </div>
  );
}
