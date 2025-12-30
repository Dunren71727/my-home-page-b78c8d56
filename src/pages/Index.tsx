import { Clock } from '@/components/dashboard/Clock';
import { ServiceSearchBar } from '@/components/dashboard/ServiceSearchBar';
import { ServiceTabs } from '@/components/dashboard/ServiceTabs';
import { ConfigEditor } from '@/components/dashboard/ConfigEditor';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';

const Index = () => {
  const {
    config,
    addService,
    updateService,
    deleteService,
    reorderServices,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    resetConfig,
  } = useDashboardConfig();

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle stone texture background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
      <div className="fixed inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        {/* Header - Brushed metal style */}
        <header className="flex justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md shadow-sm">
              <span className="text-lg font-medium tracking-tight">
                敦仁醫院 服務入口
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-1 justify-end">
            <ServiceSearchBar services={config.services} />
            <div className="px-3 py-1.5 rounded-md matte-card">
              <Clock />
            </div>
            <ConfigEditor
              config={config}
              onAddService={addService}
              onUpdateService={updateService}
              onDeleteService={deleteService}
              onAddSubcategory={addSubcategory}
              onUpdateSubcategory={updateSubcategory}
              onDeleteSubcategory={deleteSubcategory}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onUpdateSettings={updateSettings}
              onReset={resetConfig}
            />
          </div>
        </header>

        {/* Services in Tabs */}
        <main className="max-w-[1600px] mx-auto">
          <ServiceTabs
            categories={config.categories}
            subcategories={config.subcategories}
            services={config.services}
            onReorderServices={reorderServices}
          />
        </main>

        {/* Footer - Minimal */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>拖曳卡片可重新排序 | 按右上角齒輪自訂設定</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
