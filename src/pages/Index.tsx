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
    reorderCategories,
    updateSettings,
    resetConfig,
  } = useDashboardConfig();

  return (
    <div className="min-h-screen bg-background">
      {/* 明亮高級漸層背景 */}
      <div className="fixed inset-0 premium-gradient" />
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 15%, hsl(var(--bright-gold) / 0.5), transparent 40%),
                            radial-gradient(circle at 75% 85%, hsl(var(--navy) / 0.15), transparent 45%)`
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* 深藍頂部導航 - 高級明亮 */}
        <header className="premium-nav text-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
            <div className="flex justify-between items-center gap-4">
              {/* 標題 - 亮金色 */}
              <div className="flex items-center gap-4">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'hsl(45 90% 65%)' }}>
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
                  onReorderCategories={reorderCategories}
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