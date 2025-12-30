import { 
  Users, Clipboard, Heart, Briefcase, Package, Gift, FileText, GraduationCap, PlayCircle,
  UserCheck, Building, AlertTriangle, FlaskConical, Dumbbell, CalendarHeart, ClipboardCheck,
  Shield, CheckSquare, Search, Clock, Cake, Megaphone, FileCheck, ShieldCheck, Scroll,
  AlertCircle, Phone, LayoutDashboard, Files, ExternalLink, Globe, LucideIcon
} from 'lucide-react';
import { Service } from '@/types/dashboard';

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
        </div>
      </div>
    </a>
  );
}
