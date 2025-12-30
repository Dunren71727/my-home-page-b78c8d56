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

// 暖色系跳色 - 酒紅、香檳金、古銅金循環
const cardVariants = [
  'card-variant-1',
  'card-variant-2',
  'card-variant-3',
];

// 圖標背景色 - 酒紅與香檳金交替
const iconBgVariants = [
  'bg-primary/15',  // 酒紅淡色
  'bg-secondary/20', // 香檳金淡色
  'bg-accent/15',    // 古銅金淡色
];

const iconColorVariants = [
  'text-primary',    // 酒紅
  'text-secondary',  // 香檳金
  'text-accent',     // 古銅金
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
  const cardVariant = cardVariants[index % cardVariants.length];
  const iconBg = iconBgVariants[index % iconBgVariants.length];
  const iconColor = iconColorVariants[index % iconColorVariants.length];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl p-4 transition-all duration-300 cursor-pointer animate-fade-up hover-lift
        ${isDragging 
          ? 'opacity-70 z-50 shadow-2xl scale-105 rotate-1' 
          : ''
        }
        ${cardVariant}
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
        {/* 圖標 - 暖色系背景 */}
        <div className={`p-3 rounded-xl shrink-0 ${iconBg} transition-colors duration-300 group-hover:scale-105`}>
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-200 text-secondary flex-shrink-0" />
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