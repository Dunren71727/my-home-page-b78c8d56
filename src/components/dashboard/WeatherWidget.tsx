import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, MapPin } from 'lucide-react';
import { WeatherData } from '@/types/dashboard';

interface WeatherWidgetProps {
  location?: string;
}

// Simulated weather data - in production, connect to a real weather API
const getSimulatedWeather = (location: string): WeatherData => {
  const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
  const condition = conditions[Math.floor(Math.random() * 2)]; // Favor sunny/cloudy
  
  return {
    temperature: Math.floor(Math.random() * 15) + 15,
    condition,
    location,
    humidity: Math.floor(Math.random() * 40) + 40,
    wind: Math.floor(Math.random() * 20) + 5,
    icon: condition,
  };
};

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  switch (condition) {
    case 'sunny':
      return <Sun className={className} />;
    case 'rainy':
      return <CloudRain className={className} />;
    case 'snowy':
      return <CloudSnow className={className} />;
    default:
      return <Cloud className={className} />;
  }
};

const conditionLabels: Record<string, string> = {
  sunny: '晴朗',
  cloudy: '多雲',
  rainy: '下雨',
  snowy: '下雪',
};

export function WeatherWidget({ location = 'Taipei' }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeather(getSimulatedWeather(location));
      setLoading(false);
    }, 500);
  }, [location]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-24 bg-muted/20 rounded-lg" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{weather.location}</span>
          </div>
          <div className="text-5xl font-light mb-2">
            {weather.temperature}°C
          </div>
          <div className="text-muted-foreground">
            {conditionLabels[weather.condition] || weather.condition}
          </div>
        </div>
        <WeatherIcon 
          condition={weather.condition} 
          className="w-16 h-16 text-primary" 
        />
      </div>
      
      <div className="flex gap-6 mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-muted-foreground">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-muted-foreground">{weather.wind} km/h</span>
        </div>
      </div>
    </div>
  );
}
