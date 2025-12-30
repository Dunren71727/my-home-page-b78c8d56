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
      {/* 明亮暖土漸層背景 */}
      <div className="fixed inset-0 warm-gradient" />
      <div 
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, hsl(var(--champagne-gold) / 0.4), transparent 45%),
                            radial-gradient(circle at 70% 80%, hsl(var(--burgundy) / 0.15), transparent 50%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* 酒紅色頂部導航 - 明亮優雅 */}
        <header className="warm-nav text-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
            <div className="flex justify-between items-center gap-4">
              {/* 標題 - 香檳金點綴 */}
              <div className="flex items-center gap-4">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'hsl(43 65% 70%)' }}>
                  🏥 敦仁醫院 服務入口
                </h1>
              </div>
              
              {/* 右側工具列 */}
              <div className="flex items-center gap-4 flex-1 justify-end">
                <ServiceSearchBar services={config.services} />
                
                {/* 時鐘區塊 - 玻璃金屬效果 */}
                <div className="glass-gold px-4 py-2">
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
        <div className="p-4 md:p-8">
          <main className="max-w-[1600px] mx-auto">
            <ServiceTabs
              categories={config.categories}
              subcategories={config.subcategories}
              services={config.services}
              onReorderServices={reorderServices}
            />
          </main>

          {/* Footer */}
          <footer className="mt-12 text-center text-base text-muted-foreground">
            <p className="tracking-wide">✦ 拖曳卡片可重新排序 | 按右上角齒輪自訂設定 ✦</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;