"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { listInfo, tableData } from "./state";
import { InferModel } from "drizzle-orm";
import { addressLists } from "@/lib/db/schema";
import { MonitoredAddress } from "./columns";
import { useControls } from "leva";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  list: InferModel<typeof addressLists>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  list,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const { traderMode } = useControls({
    traderMode: false,
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      winrate: false,
      roi: false,
    });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // sync list info with atom
  React.useEffect(() => {
    if (!table) return;

    listInfo.set({
      ...(list as any),
      selectedRows: table
        .getSelectedRowModel()
        .rows.map((el) => el.original as MonitoredAddress),
    });
    tableData.set(table);
  }, [table, rowSelection, list]);

  // sync favorites
  React.useEffect(() => {
    setRowSelection(
      (list.favorites as string[]).reduce(
        (
          acc: {
            [key: string]: boolean;
          },
          row,
        ) => {
          acc[
            (list.addresses as string[])
              .findIndex((el) => el === row)
              .toString()
          ] = true;
          return acc;
        },
        {},
      ),
    );
  }, [list.favorites, list.addresses]);

  React.useEffect(() => {
    if (traderMode) {
      setColumnVisibility({
        winrate: true,
        roi: true,
      });
    } else {
      setColumnVisibility({
        winrate: false,
        roi: false,
      });
    }
  }, [traderMode]);

  return (
    <div id="address-list" className="space-y-4">
      <DataTableToolbar listId={list.id} table={table} />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
