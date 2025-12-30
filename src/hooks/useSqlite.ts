import { useState, useEffect, useCallback } from 'react';
import {
  initDatabase,
  executeQuery,
  runStatement,
  insertData,
  selectData,
  updateData,
  deleteData,
  getTables,
  getTableSchema,
  QueryResult
} from '@/lib/sqlite';

export function useSqlite() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => {
        setIsReady(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const query = useCallback(async (sql: string, params?: unknown[]): Promise<QueryResult[]> => {
    setError(null);
    try {
      return await executeQuery(sql, params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Query failed';
      setError(message);
      throw err;
    }
  }, []);

  const run = useCallback(async (sql: string, params?: unknown[]): Promise<{ changes: number }> => {
    setError(null);
    try {
      return await runStatement(sql, params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Statement failed';
      setError(message);
      throw err;
    }
  }, []);

  const insert = useCallback(async (table: string, data: Record<string, unknown>) => {
    setError(null);
    try {
      return await insertData(table, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Insert failed';
      setError(message);
      throw err;
    }
  }, []);

  const select = useCallback(async (table: string, where?: string, params?: unknown[]) => {
    setError(null);
    try {
      return await selectData(table, where, params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Select failed';
      setError(message);
      throw err;
    }
  }, []);

  const update = useCallback(async (table: string, data: Record<string, unknown>, where: string, params?: unknown[]) => {
    setError(null);
    try {
      return await updateData(table, data, where, params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setError(message);
      throw err;
    }
  }, []);

  const remove = useCallback(async (table: string, where: string, params?: unknown[]) => {
    setError(null);
    try {
      return await deleteData(table, where, params);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
      throw err;
    }
  }, []);

  const listTables = useCallback(async () => {
    setError(null);
    try {
      return await getTables();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to list tables';
      setError(message);
      throw err;
    }
  }, []);

  const describeTable = useCallback(async (tableName: string) => {
    setError(null);
    try {
      return await getTableSchema(tableName);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to describe table';
      setError(message);
      throw err;
    }
  }, []);

  return {
    isReady,
    isLoading,
    error,
    query,
    run,
    insert,
    select,
    update,
    remove,
    listTables,
    describeTable
  };
}
