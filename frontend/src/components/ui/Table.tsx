import type { ReactNode } from 'react';

export interface Column<T extends object> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
}

export default function Table<T extends object>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Nenhum registro encontrado',
  loading,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-velare-border rounded-lg mb-2" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-velare-panel rounded-lg mb-1" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-velare-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-velare-border">
      <table className="w-full">
        <thead>
          <tr className="bg-velare-bg-alt">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left text-sm font-semibold text-velare-text-muted ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-t border-velare-border hover:bg-velare-panel/50 transition-colors"
            >
              {columns.map((column) => {
                const value = (item as Record<string, unknown>)[String(column.key)];

                return (
                  <td
                    key={String(column.key)}
                    className={`px-4 py-3 text-sm text-velare-text ${column.className || ''}`}
                  >
                    {column.render ? column.render(item) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}