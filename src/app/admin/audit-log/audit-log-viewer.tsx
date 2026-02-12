'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminAuditLog } from '@/types/database';
import { formatDateTime } from '@/lib/dates';

type AuditLogRow = AdminAuditLog & { actorEmail: string };

interface AuditLogViewerProps {
  logs: AuditLogRow[];
}

const PAGE_SIZE = 25;

const actionTypes = [
  'all',
  'company.approve',
  'company.reject',
  'company.suspend',
  'pricing.update',
  'credit.adjustment',
  'credit.refund',
  'credit_pack.update',
  'content.create',
  'content.update',
];

const entityTypes = [
  'all',
  'company',
  'pricing_rule',
  'credit_ledger',
  'credit_pack',
  'cms_content',
];

function actionBadgeVariant(action: string) {
  if (action.includes('approve') || action.includes('create')) return 'success' as const;
  if (action.includes('reject') || action.includes('suspend')) return 'danger' as const;
  if (action.includes('refund')) return 'warning' as const;
  if (action.includes('update')) return 'info' as const;
  if (action.includes('adjustment')) return 'primary' as const;
  return 'default' as const;
}

export function AuditLogViewer({ logs }: AuditLogViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesEntity = entityFilter === 'all' || log.entity_type === entityFilter;
      return matchesAction && matchesEntity;
    });
  }, [logs, actionFilter, entityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedLogs = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function toggleRow(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function goToPage(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    setExpandedRows(new Set());
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-muted flex-shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            {actionTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Actions' : type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            {entityTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Entities' : type}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-text-muted self-center">
          {filtered.length} entr{filtered.length !== 1 ? 'ies' : 'y'} found
        </p>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="w-8 px-4 py-3"></th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Timestamp</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Actor</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Action</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Entity Type</th>
                <th className="text-left text-text-muted font-medium px-6 py-3">Entity ID</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    No audit log entries found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const isExpanded = expandedRows.has(log.id);
                  const hasData = log.before_data || log.after_data;

                  return (
                    <>
                      <tr
                        key={log.id}
                        className={`border-b border-border/50 transition-colors ${
                          hasData ? 'cursor-pointer hover:bg-surface-alt/50' : ''
                        } ${isExpanded ? 'bg-surface-alt/30' : ''}`}
                        onClick={() => hasData && toggleRow(log.id)}
                      >
                        <td className="px-4 py-3">
                          {hasData && (
                            <span className="text-text-muted">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-text-secondary text-xs whitespace-nowrap">
                          {formatDateTime(log.created_at)}
                        </td>
                        <td className="px-4 py-3 text-text-primary text-xs">
                          {log.actorEmail}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={actionBadgeVariant(log.action)}>
                            {log.action}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {log.entity_type}
                        </td>
                        <td className="px-6 py-3 text-text-muted font-mono text-xs">
                          {log.entity_id ? (
                            log.entity_id.length > 12
                              ? log.entity_id.slice(0, 12) + '...'
                              : log.entity_id
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                      {isExpanded && hasData && (
                        <tr key={`${log.id}-detail`} className="bg-surface-alt/20">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                              {log.before_data && (
                                <div>
                                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                                    Before
                                  </p>
                                  <pre className="bg-surface p-3 rounded-lg text-xs text-danger/80 overflow-x-auto border border-border">
                                    {JSON.stringify(log.before_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.after_data && (
                                <div>
                                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                                    After
                                  </p>
                                  <pre className="bg-surface p-3 rounded-lg text-xs text-accent/80 overflow-x-auto border border-border">
                                    {JSON.stringify(log.after_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
