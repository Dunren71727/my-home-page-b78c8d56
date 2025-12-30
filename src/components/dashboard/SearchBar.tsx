import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'custom';
  customSearchUrl?: string;
}

const searchEngines = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
};

export function SearchBar({ searchEngine, customSearchUrl }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const baseUrl = searchEngine === 'custom' && customSearchUrl 
      ? customSearchUrl 
      : searchEngines[searchEngine];
    
    window.open(`${baseUrl}${encodeURIComponent(query)}`, '_blank');
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative glass-card rounded-2xl p-1">
          <div className="flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜尋網路..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
