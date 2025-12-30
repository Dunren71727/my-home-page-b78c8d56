import { 
  Play, Code, Activity, Globe, Tv, Film, Github, Container, 
  BarChart2, Database, Shield, Server, ExternalLink, LucideIcon
} from 'lucide-react';
import { Service } from '@/types/dashboard';

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, LucideIcon> = {
  play: Play,
  code: Code,
  activity: Activity,
  globe: Globe,
  tv: Tv,
  film: Film,
  github: Github,
  container: Container,
  'bar-chart-2': BarChart2,
  database: Database,
  shield: Shield,
  server: Server,
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
            <h3 className="font-medium truncate">{service.name}</h3>
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
