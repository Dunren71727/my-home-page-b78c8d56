import { useState, useEffect } from 'react';
import { useSqlite } from '@/hooks/useSqlite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Play, Table, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TableInfo {
  name: string;
  schema: { name: string; type: string }[];
}

export function SqliteManager() {
  const { isReady, isLoading, error, query, run, listTables, describeTable } = useSqlite();
  const [sqlInput, setSqlInput] = useState('');
  const [queryResult, setQueryResult] = useState<{ columns: string[]; values: unknown[][] } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const loadTables = async () => {
    try {
      const tableNames = await listTables();
      const tablesWithSchema = await Promise.all(
        tableNames.map(async (name) => ({
          name,
          schema: await describeTable(name)
        }))
      );
      setTables(tablesWithSchema);
    } catch (err) {
      console.error('Failed to load tables:', err);
    }
  };

  useEffect(() => {
    if (isReady) {
      loadTables();
    }
  }, [isReady]);

  const executeSQL = async () => {
    if (!sqlInput.trim()) return;
    
    setIsExecuting(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      const sql = sqlInput.trim().toUpperCase();
      if (sql.startsWith('SELECT') || sql.startsWith('PRAGMA')) {
        const results = await query(sqlInput);
        if (results.length > 0) {
          setQueryResult(results[0]);
        } else {
          setQueryResult({ columns: [], values: [] });
        }
        toast.success('查詢執行成功');
      } else {
        const result = await run(sqlInput);
        toast.success(`執行成功，影響 ${result.changes} 筆資料`);
        loadTables();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '執行失敗';
      setQueryError(message);
      toast.error('SQL 執行錯誤');
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">初始化 SQLite...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-destructive">
        <AlertCircle className="h-6 w-6 mr-2" />
        <span>SQLite 初始化失敗: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* SQL Editor */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            SQL 編輯器
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="輸入 SQL 語句... 例如: SELECT * FROM api_logs"
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            className="font-mono text-sm min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button onClick={executeSQL} disabled={isExecuting || !sqlInput.trim()}>
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              執行
            </Button>
            <Button variant="outline" onClick={loadTables}>
              <RefreshCw className="h-4 w-4 mr-2" />
              重新載入表格
            </Button>
          </div>

          {queryError && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {queryError}
            </div>
          )}

          {queryResult && (
            <div className="border rounded-md overflow-hidden">
              <ScrollArea className="max-h-[300px]">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {queryResult.columns.map((col, i) => (
                        <th key={i} className="px-3 py-2 text-left font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.values.length === 0 ? (
                      <tr>
                        <td colSpan={queryResult.columns.length || 1} className="px-3 py-4 text-center text-muted-foreground">
                          無資料
                        </td>
                      </tr>
                    ) : (
                      queryResult.values.map((row, i) => (
                        <tr key={i} className="border-t">
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 font-mono">
                              {cell === null ? <span className="text-muted-foreground">NULL</span> : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </ScrollArea>
              {queryResult.values.length > 0 && (
                <div className="px-3 py-2 bg-muted text-xs text-muted-foreground border-t">
                  共 {queryResult.values.length} 筆資料
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tables List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Table className="h-5 w-5" />
            資料表 ({tables.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tables.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無資料表</p>
          ) : (
            <div className="space-y-3">
              {tables.map((table) => (
                <div key={table.name} className="border rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{table.name}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSqlInput(`SELECT * FROM ${table.name} LIMIT 100`);
                      }}
                    >
                      查詢
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {table.schema.map((col) => (
                      <Badge key={col.name} variant="outline" className="text-xs font-mono">
                        {col.name}: {col.type}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
