import { useState, useEffect } from 'react';

// Clock component with bright gold styling

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="flex items-center gap-3 text-base font-bold tracking-wide" style={{ color: 'hsl(215 65% 35%)' }}>
      <span>📅 {formatDate(time)}</span>
      <span className="opacity-50">|</span>
      <span className="tabular-nums">⏰ {formatTime(time)}</span>
    </div>
  );
}