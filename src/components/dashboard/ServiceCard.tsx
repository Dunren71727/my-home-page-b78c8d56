import { 
  Users, Clipboard, Heart, Briefcase, Package, Gift, FileText, GraduationCap, PlayCircle,
  UserCheck, Building, AlertTriangle, FlaskConical, Dumbbell, CalendarHeart, ClipboardCheck,
  Shield, CheckSquare, Search, Clock, Cake, Megaphone, FileCheck, ShieldCheck, Scroll,
  AlertCircle, Phone, LayoutDashboard, Files, ExternalLink, Globe, LucideIcon, RefreshCw, Loader2
} from 'lucide-react';
import { Service } from '@/types/dashboard';
import { useApiData } from '@/hooks/useApiData';
import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  clipboard: Clipboard,
  heart: Heart,
  briefcase: Briefcase,
  package: Package,
  gift: Gift,
  'file-text': FileText,
  'graduation-cap': GraduationCap,
  'play-circle': PlayCircle,
  'user-check': UserCheck,
  building: Building,
  'alert-triangle': AlertTriangle,
  'flask-conical': FlaskConical,
  dumbbell: Dumbbell,
  'calendar-heart': CalendarHeart,
  'clipboard-check': ClipboardCheck,
  shield: Shield,
  'check-square': CheckSquare,
  search: Search,
  clock: Clock,
  cake: Cake,
  megaphone: Megaphone,
  'file-check': FileCheck,
  'shield-check': ShieldCheck,
  scroll: Scroll,
  'alert-circle': AlertCircle,
  phone: Phone,
  'layout-dashboard': LayoutDashboard,
  files: Files,
  globe: Globe,
};

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Globe;
  const { data, loading, error, refresh } = useApiData(service.apiConfig);

  const formatDisplayValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    refresh();
  };

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass-card rounded-xl p-4 hover-lift block transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium whitespace-nowrap">{service.name}</h3>
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          {service.description && (
            <p className="text-sm text-muted-foreground truncate mt-1">
              {service.description}
            </p>
          )}
          
          {/* API Data Display */}
          {service.apiConfig?.endpoint && (
            <div className="mt-2 flex items-center gap-2">
              {loading && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  載入中...
                </Badge>
              )}
              {error && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </Badge>
              )}
              {!loading && !error && data !== null && (
                <Badge variant="outline" className="gap-1 bg-primary/5 border-primary/20 text-primary">
                  {formatDisplayValue(data)}
                </Badge>
              )}
              <button
                onClick={handleRefresh}
                className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                title="重新整理"
              >
                <RefreshCw className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
