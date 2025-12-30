import { Clock } from '@/components/dashboard/Clock';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { ServiceGrid } from '@/components/dashboard/ServiceGrid';
import { ConfigEditor } from '@/components/dashboard/ConfigEditor';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';

const Index = () => {
  const {
    config,
    addService,
    updateService,
    deleteService,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    resetConfig,
  } = useDashboardConfig();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      
      {/* Floating orbs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen p-6 md:p-10">
        {/* Header */}
        <header className="flex justify-between items-start mb-12">
          <div className="glass-card rounded-xl px-4 py-2">
            <span className="text-lg font-medium bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Dunren Homepage
            </span>
          </div>
          <ConfigEditor
            config={config}
            onAddService={addService}
            onUpdateService={updateService}
            onDeleteService={deleteService}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onUpdateSettings={updateSettings}
            onReset={resetConfig}
          />
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto space-y-12">
          {/* Clock */}
          <section className="py-8">
            <Clock />
          </section>

          {/* Search */}
          <section>
            <SearchBar 
              searchEngine={config.searchEngine} 
              customSearchUrl={config.customSearchUrl}
            />
          </section>

          {/* Weather & Quick Info */}
          {config.showWeather && (
            <section className="flex justify-center">
              <div className="w-full max-w-sm">
                <WeatherWidget location={config.weatherLocation} />
              </div>
            </section>
          )}

          {/* Services */}
          <section>
            <ServiceGrid 
              services={config.services} 
              categories={config.categories} 
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground/50">
          <p>按右上角齒輪自訂您的儀表板</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
