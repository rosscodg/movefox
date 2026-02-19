'use client';

import { useState, useMemo, useTransition } from 'react';
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
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CmsContent } from '@/types/database';
import { formatDate } from '@/lib/dates';
import { updateContent, createContent } from '@/app/admin/actions';

interface ContentManagerProps {
  content: CmsContent[];
}

type ContentTab = 'page' | 'faq' | 'blog';

const tabs: { value: ContentTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'page', label: 'Pages', icon: FileText },
  { value: 'faq', label: 'FAQs', icon: HelpCircle },
  { value: 'blog', label: 'Blog Posts', icon: BookOpen },
];

const BLOG_CATEGORIES = ['Moving Tips', 'Guides', 'Industry News', 'Checklists'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ContentManager({ content }: ContentManagerProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>('page');
  const [editingItem, setEditingItem] = useState<CmsContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formPublished, setFormPublished] = useState(false);
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formSlug, setFormSlug] = useState('');
  const [formMetaDescription, setFormMetaDescription] = useState('');
  // Blog-specific fields
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formFeaturedImageUrl, setFormFeaturedImageUrl] = useState('');
  const [formReadTimeMinutes, setFormReadTimeMinutes] = useState<number | ''>('');
  const [formFaqs, setFormFaqs] = useState<{ question: string; answer: string }[]>([]);

  const filtered = useMemo(() => {
    return content.filter((c) => c.content_type === activeTab);
  }, [content, activeTab]);

  function startEdit(item: CmsContent) {
    setEditingItem(item);
    setIsCreating(false);
    setSaveError(null);
    setFormTitle(item.title);
    setFormBody(item.body);
    setFormPublished(item.published);
    setFormSortOrder(item.sort_order);
    setFormSlug(item.slug);
    setFormMetaDescription(item.meta_description ?? '');
    setFormAuthor(item.author ?? '');
    setFormCategory(item.category ?? '');
    setFormExcerpt(item.excerpt ?? '');
    setFormFeaturedImageUrl(item.featured_image_url ?? '');
    setFormReadTimeMinutes(item.read_time_minutes ?? '');
    setFormFaqs(item.faqs ?? []);
  }

  function startCreate() {
    setEditingItem(null);
    setIsCreating(true);
    setSaveError(null);
    setFormTitle('');
    setFormBody('');
    setFormPublished(false);
    setFormSortOrder(filtered.length + 1);
    setFormSlug('');
    setFormMetaDescription('');
    setFormAuthor('');
    setFormCategory('');
    setFormExcerpt('');
    setFormFeaturedImageUrl('');
    setFormReadTimeMinutes('');
    setFormFaqs([]);
  }

  function cancelEdit() {
    setEditingItem(null);
    setIsCreating(false);
    setSaveError(null);
  }

  function handleTitleChange(value: string) {
    setFormTitle(value);
    // Auto-generate slug for new items
    if (isCreating) {
      setFormSlug(slugify(value));
    }
  }

  function handleSave() {
    setSaveError(null);

    const blogFields = activeTab === 'blog' ? {
      author: formAuthor || null,
      category: formCategory || null,
      excerpt: formExcerpt || null,
      featured_image_url: formFeaturedImageUrl || null,
      read_time_minutes: formReadTimeMinutes === '' ? null : Number(formReadTimeMinutes),
      faqs: formFaqs.length > 0 ? formFaqs.filter(f => f.question && f.answer) : null,
    } : {};

    startTransition(async () => {
      if (editingItem) {
        const result = await updateContent(editingItem.id, {
          title: formTitle,
          body: formBody,
          published: formPublished,
          sort_order: formSortOrder,
          slug: formSlug,
          meta_description: formMetaDescription || null,
          ...blogFields,
        });
        if (!result.success) {
          setSaveError(result.error ?? 'Failed to save');
          return;
        }
      } else if (isCreating) {
        const result = await createContent({
          slug: formSlug || slugify(formTitle),
          content_type: activeTab,
          title: formTitle,
          body: formBody,
          published: formPublished,
          sort_order: formSortOrder,
          meta_description: formMetaDescription || null,
          ...blogFields,
        });
        if (!result.success) {
          setSaveError(result.error ?? 'Failed to create');
          return;
        }
      }
      cancelEdit();
    });
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

              {saveError && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
                  {saveError}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="content-title" className="block text-sm font-medium text-text-primary">
                    Title
                  </label>
                  <input
                    id="content-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Content title..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="content-slug" className="block text-sm font-medium text-text-primary">
                    Slug
                  </label>
                  <input
                    id="content-slug"
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-mono text-sm"
                    placeholder="url-slug"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="content-meta" className="block text-sm font-medium text-text-primary">
                    Meta Description
                  </label>
                  <textarea
                    id="content-meta"
                    rows={2}
                    value={formMetaDescription}
                    onChange={(e) => setFormMetaDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y text-sm"
                    placeholder="SEO meta description..."
                  />
                </div>

                {/* Blog-specific fields */}
                {activeTab === 'blog' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="content-author" className="block text-sm font-medium text-text-primary">
                          Author
                        </label>
                        <input
                          id="content-author"
                          type="text"
                          value={formAuthor}
                          onChange={(e) => setFormAuthor(e.target.value)}
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="Author name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="content-category" className="block text-sm font-medium text-text-primary">
                          Category
                        </label>
                        <select
                          id="content-category"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        >
                          <option value="">Select category...</option>
                          {BLOG_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="content-excerpt" className="block text-sm font-medium text-text-primary">
                        Excerpt
                      </label>
                      <textarea
                        id="content-excerpt"
                        rows={2}
                        value={formExcerpt}
                        onChange={(e) => setFormExcerpt(e.target.value)}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y text-sm"
                        placeholder="Short summary for blog cards..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="content-image" className="block text-sm font-medium text-text-primary">
                          Featured Image URL
                        </label>
                        <input
                          id="content-image"
                          type="url"
                          value={formFeaturedImageUrl}
                          onChange={(e) => setFormFeaturedImageUrl(e.target.value)}
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="content-readtime" className="block text-sm font-medium text-text-primary">
                          Read Time (min)
                        </label>
                        <input
                          id="content-readtime"
                          type="number"
                          min="1"
                          value={formReadTimeMinutes}
                          onChange={(e) => setFormReadTimeMinutes(e.target.value ? parseInt(e.target.value) : '')}
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="5"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* FAQ Editor (blog only) */}
                {activeTab === 'blog' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-text-primary">
                        FAQs <span className="text-text-muted font-normal">(for AEO/GEO schema)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormFaqs([...formFaqs, { question: '', answer: '' }])}
                        className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add FAQ
                      </button>
                    </div>
                    {formFaqs.map((faq, idx) => (
                      <div key={idx} className="p-3 bg-surface-alt rounded-xl border border-border space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const updated = [...formFaqs];
                                updated[idx] = { ...updated[idx], question: e.target.value };
                                setFormFaqs(updated);
                              }}
                              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                              placeholder="Question..."
                            />
                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => {
                                const updated = [...formFaqs];
                                updated[idx] = { ...updated[idx], answer: e.target.value };
                                setFormFaqs(updated);
                              }}
                              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm resize-y"
                              placeholder="Answer..."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormFaqs(formFaqs.filter((_, i) => i !== idx))}
                            className="text-text-muted hover:text-danger transition-colors mt-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {formFaqs.length === 0 && (
                      <p className="text-xs text-text-muted">No FAQs added. Add Q&amp;A pairs to generate FAQPage schema for AI search engines.</p>
                    )}
                  </div>
                )}

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
                  <Button variant="primary" className="gap-2" onClick={handleSave} disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isCreating ? 'Create' : 'Save Changes'}
                  </Button>
                  <Button variant="ghost" onClick={cancelEdit} disabled={isPending}>
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
