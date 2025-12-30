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
  isDragging?: boolean;
  index?: number;
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

// 隨機繽紛色彩
const colorVariants = [
  'from-vibrant-orange to-vibrant-pink',
  'from-vibrant-blue to-vibrant-purple', 
  'from-vibrant-cyan to-vibrant-blue',
  'from-vibrant-purple to-vibrant-pink',
  'from-vibrant-green to-vibrant-cyan',
];

export function DraggableServiceCard({ service, index = 0 }: DraggableServiceCardProps) {
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
    animationDelay: `${index * 0.05}s`,
  } as React.CSSProperties;

  const IconComponent = iconMap[service.icon] || Globe;
  const colorVariant = colorVariants[index % colorVariants.length];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl p-4 transition-all duration-300 cursor-pointer animate-fade-up
        ${isDragging 
          ? 'opacity-70 z-50 shadow-2xl scale-105 rotate-2' 
          : 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
        }
        bg-card border-2 border-border/50 hover:border-primary/50
      `}
    >
      {/* 拖曳手柄 */}
      <div 
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing transition-all duration-200"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-4 pl-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 圖標 - 繽紛漸層背景 */}
        <div className={`p-3 rounded-xl shrink-0 bg-gradient-to-br ${colorVariant} shadow-lg`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-200 text-primary flex-shrink-0" />
          </div>
          {service.description && (
            <p className="text-sm text-muted-foreground truncate mt-1.5">
              {service.description}
            </p>
          )}
        </div>
      </a>
    </div>
  );
}