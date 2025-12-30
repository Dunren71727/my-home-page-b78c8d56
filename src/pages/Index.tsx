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
      {/* 米白暖土底色 + 微妙石材質感 */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* 深炭灰頂部導航 (金水) */}
        <header className="charcoal-nav text-secondary-foreground">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3.5">
            <div className="flex justify-between items-center gap-4">
              {/* 標題 - 俐落清晰 */}
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold tracking-tight">
                  敦仁醫院 服務入口
                </h1>
              </div>
              
              {/* 右側工具列 */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <ServiceSearchBar services={config.services} />
                
                {/* 時鐘區塊 */}
                <div className="px-3 py-1.5 rounded bg-white/5 border border-white/10">
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
          </div>
        </header>

        {/* Main content area */}
        <div className="p-4 md:p-6">
          <main className="max-w-[1600px] mx-auto">
            <ServiceTabs
              categories={config.categories}
              subcategories={config.subcategories}
              services={config.services}
              onReorderServices={reorderServices}
            />
          </main>

          {/* Footer */}
          <footer className="mt-10 text-center text-sm text-muted-foreground">
            <p className="tracking-wide">拖曳卡片可重新排序 | 按右上角齒輪自訂設定</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;