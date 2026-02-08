import React from "react";

interface Column<T> {
  header: string;
  key?: keyof T | string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
}

const DataTable = <T extends { id: string | number }>({
  columns,
  data,
  emptyMessage = "Data tidak ditemukan",
  isLoading,
}: DataTableProps<T>) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* Spinner sederhana pake CSS Tailwind */}
                    <div className="w-6 h-6 border-2 border-slate-200 border-t-green-600 rounded-full animate-spin"></div>
                    <span className="text-sm text-slate-500 font-medium">
                      Memuat data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-slate-700 text-sm"
                    >
                      {col.render
                        ? col.render(item, index)
                        : (item[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-400 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
