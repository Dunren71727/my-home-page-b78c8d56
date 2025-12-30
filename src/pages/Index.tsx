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
      {/* Warm earth texture background with subtle granite feel */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header - Deep charcoal navigation bar */}
        <header className="bg-secondary text-secondary-foreground px-4 md:px-6 py-3">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-medium tracking-tight text-secondary-foreground">
                敦仁醫院 服務入口
              </h1>
            </div>
            
            <div className="flex items-center gap-3 flex-1 justify-end">
              <ServiceSearchBar services={config.services} />
              <div className="px-3 py-1.5 rounded-md bg-secondary-foreground/10 border border-secondary-foreground/20">
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
          </div>
        </header>

        {/* Main content area */}
        <div className="p-4 md:p-6">
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
    </div>
  );
};

export default Index;
