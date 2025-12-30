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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - light theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl px-4 py-2 bg-background/80 backdrop-blur border border-border/50 shadow-sm">
              <span className="text-lg font-semibold text-foreground">
                敦仁醫院 服務入口
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-1 justify-end">
            <ServiceSearchBar services={config.services} />
            <Clock />
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

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground/60">
          <p>拖曳卡片可重新排序 | 按右上角齒輪自訂設定</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
