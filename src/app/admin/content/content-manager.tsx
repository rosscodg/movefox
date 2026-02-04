'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Save,
  X,
  FileText,
  HelpCircle,
  BookOpen,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CmsContent } from '@/types/database';

interface ContentManagerProps {
  content: CmsContent[];
}

type ContentTab = 'page' | 'faq' | 'blog';

const tabs: { value: ContentTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'page', label: 'Pages', icon: FileText },
  { value: 'faq', label: 'FAQs', icon: HelpCircle },
  { value: 'blog', label: 'Blog Posts', icon: BookOpen },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ContentManager({ content }: ContentManagerProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>('page');
  const [editingItem, setEditingItem] = useState<CmsContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for editing/creating
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formPublished, setFormPublished] = useState(false);
  const [formSortOrder, setFormSortOrder] = useState(0);

  const filtered = useMemo(() => {
    return content.filter((c) => c.content_type === activeTab);
  }, [content, activeTab]);

  function startEdit(item: CmsContent) {
    setEditingItem(item);
    setIsCreating(false);
    setFormTitle(item.title);
    setFormBody(item.body);
    setFormPublished(item.published);
    setFormSortOrder(item.sort_order);
  }

  function startCreate() {
    setEditingItem(null);
    setIsCreating(true);
    setFormTitle('');
    setFormBody('');
    setFormPublished(false);
    setFormSortOrder(filtered.length + 1);
  }

  function cancelEdit() {
    setEditingItem(null);
    setIsCreating(false);
  }

  function handleSave() {
    if (editingItem) {
      // In production:
      // await supabase.from('cms_content').update({
      //   title: formTitle,
      //   body: formBody,
      //   published: formPublished,
      //   sort_order: formSortOrder,
      //   updated_at: new Date().toISOString(),
      // }).eq('id', editingItem.id);
      alert(`Updated content item: ${editingItem.id} — wire up server action`);
    } else if (isCreating) {
      // In production:
      // const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      // await supabase.from('cms_content').insert({
      //   slug,
      //   content_type: activeTab,
      //   title: formTitle,
      //   body: formBody,
      //   published: formPublished,
      //   sort_order: formSortOrder,
      // });
      alert(`Create new ${activeTab} — wire up server action`);
    }
    cancelEdit();
  }

  const showForm = editingItem !== null || isCreating;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  cancelEdit();
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <Button variant="primary" className="gap-2" onClick={startCreate}>
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      <div className={`grid ${showForm ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Content Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt/50">
                  <th className="text-left text-text-muted font-medium px-6 py-3">Title</th>
                  <th className="text-center text-text-muted font-medium px-4 py-3">Published</th>
                  <th className="text-center text-text-muted font-medium px-4 py-3">Order</th>
                  <th className="text-left text-text-muted font-medium px-4 py-3">Updated</th>
                  <th className="text-right text-text-muted font-medium px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                      No content items found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border/50 hover:bg-surface-alt/50 transition-colors ${
                        editingItem?.id === item.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="text-text-primary font-medium">{item.title}</p>
                        <p className="text-xs text-text-muted font-mono mt-0.5">/{item.slug}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {item.published ? (
                          <Badge variant="success">
                            <Eye className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="default">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-text-secondary">
                        {item.sort_order}
                      </td>
                      <td className="px-4 py-4 text-text-muted text-xs">
                        {formatDate(item.updated_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1"
                          onClick={() => startEdit(item)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Edit/Create Form */}
        {showForm && (
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {isCreating ? `New ${activeTab === 'faq' ? 'FAQ' : activeTab === 'blog' ? 'Blog Post' : 'Page'}` : 'Edit Content'}
                </h3>
                <button
                  onClick={cancelEdit}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="content-title" className="block text-sm font-medium text-text-primary">
                    Title
                  </label>
                  <input
                    id="content-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Content title..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="content-body" className="block text-sm font-medium text-text-primary">
                    Body
                  </label>
                  <textarea
                    id="content-body"
                    rows={10}
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y font-mono text-sm"
                    placeholder="HTML content..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="content-sort" className="block text-sm font-medium text-text-primary">
                      Sort Order
                    </label>
                    <input
                      id="content-sort"
                      type="number"
                      min="0"
                      value={formSortOrder}
                      onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-primary">Published</label>
                    <button
                      type="button"
                      onClick={() => setFormPublished(!formPublished)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors w-full ${
                        formPublished
                          ? 'bg-accent/10 border-accent/30 text-accent'
                          : 'bg-surface border-border text-text-muted'
                      }`}
                    >
                      {formPublished ? (
                        <>
                          <Eye className="h-4 w-4" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Draft
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="primary" className="gap-2" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                    {isCreating ? 'Create' : 'Save Changes'}
                  </Button>
                  <Button variant="ghost" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
