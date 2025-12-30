import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Users, Clipboard, Heart, Briefcase, Package, Gift, FileText, GraduationCap, PlayCircle,
  UserCheck, Building, AlertTriangle, FlaskConical, Dumbbell, CalendarHeart, ClipboardCheck,
  Shield, CheckSquare, Search, Clock, Cake, Megaphone, FileCheck, ShieldCheck, Scroll,
  AlertCircle, Phone, LayoutDashboard, Files, ExternalLink, Globe, GripVertical, LucideIcon, HeartPulse
} from 'lucide-react';
import { Service } from '@/types/dashboard';

interface DraggableServiceCardProps {
  service: Service;
  color?: string;
  isDragging?: boolean;
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
  'heart-pulse': HeartPulse,
};

export function DraggableServiceCard({ service, color = 'hsl(25, 45%, 45%)' }: DraggableServiceCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    '--card-accent': color,
  } as React.CSSProperties;

  const IconComponent = iconMap[service.icon] || Globe;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-md p-3 transition-all duration-200 cursor-pointer
        ${isDragging ? 'opacity-50 z-50 shadow-lg scale-[1.02]' : 'hover:shadow-md hover:-translate-y-0.5'}
        bg-card border border-border hover:border-[var(--card-accent)]/40
      `}
    >
      <div 
        className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 pl-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="p-2 rounded-md transition-colors shrink-0 bg-muted/60"
        >
          <IconComponent className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-foreground">{service.name}</h3>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity text-muted-foreground flex-shrink-0" />
          </div>
          {service.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {service.description}
            </p>
          )}
        </div>
      </a>
    </div>
  );
}
