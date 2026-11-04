"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchPaginatedBlogPosts,
  fetchBlogPostByIdOrSlug,
  saveBlogPost,
  toggleBlogPostStatus,
  deleteBlogPost,
  uploadBlogPostCoverImage,
  getLatestNewsConfig,
  saveLatestNewsConfig,
  getTeamLeadershipConfig,
  computeArticleSeoScore,
  slugifyArticleText,
  estimateArticleReadingTime,
} from '../lib/adminStore';
import {
  Article,
  ArticleType,
  ArticleStatus,
  ArticleContentBlock,
  ArticleBlockType,
  ArticleFaqItem,
  BlogCardSummary,
  BlogSortOption,
  TeamMember,
} from '../types';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit3,
  Globe,
  Eye,
  Copy,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Check,
  Calendar,
  User,
  Clock,
  ArrowUpDown,
  Settings2,
  HelpCircle,
  Quote,
  List,
  Heading2,
  Heading3,
  AlignLeft,
  Smartphone,
  Monitor,
  Tag,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LogoOutlineSkeleton from './LogoOutlineSkeleton';
import ArticleContent from './ArticleContent';

type FilterTab = 'all' | 'news' | 'stories' | 'drafts';
type EditorModalTab = 'write' | 'media' | 'seo';
type QuickPickerType = 'category' | 'author' | 'status-date' | null;

const CLINICAL_CATEGORIES = [
  'Face & Injectables',
  'Body Sculpting',
  'Advanced Facials',
  'Hair & Beauty',
  'IV Drips & Wellness',
  'Sports Medicine',
  'Patient Story',
  'Clinical Research',
  'Skincare Science',
];

const SUGGESTED_FOCUS_KEYWORDS = [
  'HydraFacial Lagos',
  'Laser Acne Scar Removal Abuja',
  'Body Contouring Victoria Island',
  'Microneedling Ikoyi',
  'PRP Hair Restoration Lagos',
  'Anti-Wrinkle Injectables Abuja',
];

interface SpecialistAuthorOption {
  name: string;
  role: string;
  credentials: string;
  image?: string;
}

const DEFAULT_SPECIALIST_AUTHORS: SpecialistAuthorOption[] = [
  {
    name: 'Adv. Faith Chris',
    role: 'Lead Aesthetic Practitioner & Founder',
    credentials: 'MSc Clinical Dermatology · E-E-A-T Verified Reviewer',
  },
  {
    name: 'Adv. Nuri',
    role: 'Senior Aesthetic & Laser Specialist',
    credentials: 'Advanced Laser & Cellular Rejuvenation',
  },
  {
    name: 'Dr. Sophia Chang',
    role: 'Consultant Cosmetic Dermatologist',
    credentials: 'MD, Board-Certified Dermatology',
  },
  {
    name: 'Mr Saj Afzal',
    role: 'Clinical Body Contouring Specialist',
    credentials: 'Non-Surgical Sculpting & Metabolic Protocols',
  },
  {
    name: 'Dr Ricardo José',
    role: 'Regenerative & Sports Medicine Lead',
    credentials: 'PRP, Exosome & Cellular Therapy',
  },
  {
    name: 'Clinical Editorial Team',
    role: 'Age Reversal Medical Board',
    credentials: 'Peer-Reviewed Clinical Journal',
  },
];

function BlogCardThumbnail({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);
  const cleanSrc = (src || '').trim();

  useEffect(() => {
    setHasError(false);
  }, [cleanSrc]);

  if (!cleanSrc || hasError) {
    return (
      <div className="w-full h-full bg-[#faf8f5] flex items-center justify-center">
        <LogoOutlineSkeleton size="sm" showLabel={false} className="w-full h-full border-0" />
      </div>
    );
  }

  return (
    <img
      src={cleanSrc}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}

export default function LatestNewsEditor() {
  // Paginated list & filter states
  const [items, setItems] = useState<BlogCardSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<BlogSortOption>('newest');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [counts, setCounts] = useState({
    all: 0,
    news: 0,
    stories: 0,
    published: 0,
    drafts: 0,
  });

  // Menus & Supportive UI states
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);
  const [mobileActionSheetCard, setMobileActionSheetCard] = useState<BlogCardSummary | null>(null);
  const [deleteConfirmCard, setDeleteConfirmCard] = useState<BlogCardSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Section header settings modal
  const [isSectionSettingsOpen, setIsSectionSettingsOpen] = useState<boolean>(false);
  const [sectionHeading, setSectionHeading] = useState<string>('Latest News & Insights');
  const [sectionDescription, setSectionDescription] = useState<string>(
    'Stay informed on the latest clinical advancements.'
  );

  // Post Composer Modal & Dedicated SEO Drawer states
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [composerTab, setComposerTab] = useState<EditorModalTab>('write');
  const [isSeoDrawerOpen, setIsSeoDrawerOpen] = useState<boolean>(false);
  const [serpDevice, setSerpDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [editingPost, setEditingPost] = useState<Article | null>(null);
  const [isSavingPost, setIsSavingPost] = useState<boolean>(false);
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const [isDraggingOverMedia, setIsDraggingOverMedia] = useState<boolean>(false);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [draggingOverBlockId, setDraggingOverBlockId] = useState<string | null>(null);
  const [newlyAddedBlockId, setNewlyAddedBlockId] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState<string>('');
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Quick Picker Bottom Modals (Task 4C: Category & Tag, Author / Reviewer E-E-A-T, Status & Publish Date)
  const [activeQuickPicker, setActiveQuickPicker] = useState<QuickPickerType>(null);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [specialistAuthors, setSpecialistAuthors] =
    useState<SpecialistAuthorOption[]>(DEFAULT_SPECIALIST_AUTHORS);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerScrollContainerRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? '' : prev));
    }, 2800);
  }, []);

  const scrollToAddedBlock = useCallback((domId: string, blockId: string) => {
    setNewlyAddedBlockId(blockId);
    setTimeout(() => {
      const targetEl = document.getElementById(domId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = targetEl.querySelector<HTMLElement>(
          'input[type="text"], textarea'
        );
        if (focusable) {
          setTimeout(() => {
            focusable.focus({ preventScroll: true });
          }, 220);
        }
      }
    }, 50);
    setTimeout(() => {
      setNewlyAddedBlockId((prev) => (prev === blockId ? null : prev));
    }, 1800);
  }, []);

  // Load clinic specialists from Team Leadership store for Google E-E-A-T Author/Reviewer picker
  useEffect(() => {
    try {
      const teamConfig = getTeamLeadershipConfig();
      if (teamConfig && Array.isArray(teamConfig.members) && teamConfig.members.length > 0) {
        const mapped: SpecialistAuthorOption[] = teamConfig.members.map((m: TeamMember) => ({
          name: m.name,
          role: m.role || 'Clinical Specialist',
          credentials: m.bio
            ? m.bio.slice(0, 68) + (m.bio.length > 68 ? '...' : '')
            : 'Verified Clinic Specialist (E-E-A-T)',
          image: m.image,
        }));
        const existingNames = new Set(mapped.map((m) => m.name.toLowerCase()));
        const merged = [
          ...mapped,
          ...DEFAULT_SPECIALIST_AUTHORS.filter(
            (d) => !existingNames.has(d.name.toLowerCase())
          ),
        ];
        setSpecialistAuthors(merged);
      }
    } catch {
      // Keep default specialist authors
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close desktop popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setIsSortMenuOpen(false);
      }
      const target = e.target as HTMLElement;
      if (!target.closest('[data-card-menu]')) {
        setActiveCardMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load paginated summary cards (exact summary columns only)
  const loadPaginatedPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const typeParam: 'all' | ArticleType =
        activeFilterTab === 'news'
          ? 'news'
          : activeFilterTab === 'stories'
          ? 'stories'
          : 'all';
      const statusParam: 'all' | ArticleStatus =
        activeFilterTab === 'drafts' ? 'draft' : 'all';

      const res = await fetchPaginatedBlogPosts({
        page,
        limit,
        type: typeParam,
        status: statusParam,
        search: debouncedSearch,
        sort: sortBy,
      });

      setItems(res.items);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setCounts(res.counts);
      if (res.heading) setSectionHeading(res.heading);
      if (res.description) setSectionDescription(res.description);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, activeFilterTab, debouncedSearch, sortBy]);

  useEffect(() => {
    loadPaginatedPosts();
  }, [loadPaginatedPosts]);

  // Listen for external blog store updates
  useEffect(() => {
    const handleUpdated = () => {
      loadPaginatedPosts();
    };
    window.addEventListener('blog_posts_updated', handleUpdated);
    return () => window.removeEventListener('blog_posts_updated', handleUpdated);
  }, [loadPaginatedPosts]);

  // Open new post modal
  const handleOpenNewPost = () => {
    const defaultType: ArticleType = activeFilterTab === 'stories' ? 'stories' : 'news';
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    setEditingPost({
      id: `${defaultType === 'stories' ? 'story' : 'news'}-${Date.now()}`,
      slug: '',
      type: defaultType,
      status: 'published',
      title: '',
      description: '',
      image: '',
      imageAlt: '',
      date: formattedDate,
      publishedAt: nowIso,
      updatedAt: nowIso,
      readingTime: '4 min read',
      author: specialistAuthors[0]?.name || 'Adv. Faith Chris',
      tag: defaultType === 'stories' ? 'Patient Story' : 'Face & Injectables',
      category: defaultType === 'stories' ? 'Patient Story' : 'Face & Injectables',
      seoTitle: '',
      metaDescription: '',
      focusKeywords: [],
      canonicalUrl: '',
      contentBlocks: [
        {
          id: `block-${Date.now()}-1`,
          type: 'h2',
          headingLevel: 'h2',
          heading: '',
        },
        {
          id: `block-${Date.now()}-2`,
          type: 'paragraph',
          text: '',
        },
      ],
      faqItems: [],
    });
    setComposerTab('write');
    setIsSeoDrawerOpen(false);
    setIsComposerOpen(true);
  };

  // Open existing post on-demand (fetches full contentBlocks, faqItems & SEO fields)
  const handleOpenEditPost = async (
    card: BlogCardSummary,
    initialTab: EditorModalTab = 'write',
    standaloneSeoDrawer = false
  ) => {
    setActiveCardMenuId(null);
    setMobileActionSheetCard(null);
    const fullPost = await fetchBlogPostByIdOrSlug(card.id);
    if (fullPost) {
      setEditingPost({
        ...fullPost,
        contentBlocks: Array.isArray(fullPost.contentBlocks) ? fullPost.contentBlocks : [],
        faqItems: Array.isArray(fullPost.faqItems) ? fullPost.faqItems : [],
        focusKeywords: Array.isArray(fullPost.focusKeywords) ? fullPost.focusKeywords : [],
      });
      if (standaloneSeoDrawer) {
        setIsComposerOpen(false);
        setIsSeoDrawerOpen(true);
      } else {
        setComposerTab(initialTab);
        setIsSeoDrawerOpen(false);
        setIsComposerOpen(true);
      }
    }
  };

  // Preview single post on-demand
  const handlePreviewPost = async (card: BlogCardSummary) => {
    setActiveCardMenuId(null);
    setMobileActionSheetCard(null);
    const fullPost = await fetchBlogPostByIdOrSlug(card.id);
    if (fullPost) {
      setPreviewArticle(fullPost);
    }
  };

  // Toggle status ('published' | 'draft')
  const handleToggleStatus = async (card: BlogCardSummary) => {
    setActiveCardMenuId(null);
    setMobileActionSheetCard(null);
    const nextStatus: ArticleStatus = card.status === 'draft' ? 'published' : 'draft';
    const res = await toggleBlogPostStatus(card.id, nextStatus);
    if (res.success) {
      showToast(nextStatus === 'published' ? 'Post published' : 'Moved to drafts');
      loadPaginatedPosts();
    }
  };

  // Duplicate post on-demand
  const handleDuplicatePost = async (card: BlogCardSummary) => {
    setActiveCardMenuId(null);
    setMobileActionSheetCard(null);
    const fullPost = await fetchBlogPostByIdOrSlug(card.id);
    if (!fullPost) return;

    const copyTitle = `${fullPost.title} (Copy)`;
    const newId = `${fullPost.type === 'stories' ? 'story' : 'news'}-${Date.now()}`;
    const res = await saveBlogPost({
      ...fullPost,
      id: newId,
      title: copyTitle,
      slug: slugifyArticleText(copyTitle, newId),
      status: 'draft',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (res.success) {
      showToast('Post duplicated as draft');
      loadPaginatedPosts();
    }
  };

  // Confirm delete post
  const handleConfirmDelete = async () => {
    if (!deleteConfirmCard) return;
    setIsDeleting(true);
    try {
      const res = await deleteBlogPost(deleteConfirmCard.id);
      if (res.success) {
        showToast('Post deleted');
        setDeleteConfirmCard(null);
        loadPaginatedPosts();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Save section header settings
  const handleSaveSectionHeader = () => {
    const current = getLatestNewsConfig();
    saveLatestNewsConfig({
      ...current,
      heading: sectionHeading.trim() || 'Latest News & Insights',
      description: sectionDescription.trim() || 'Stay informed on the latest clinical advancements.',
    });
    setIsSectionSettingsOpen(false);
    showToast('Section header updated');
  };

  // Save post from composer modal or standalone SEO drawer
  const handleSaveComposerPost = async (overrideStatus?: ArticleStatus) => {
    if (!editingPost || !editingPost.title.trim()) {
      showToast('Please enter a post title');
      return;
    }
    setIsSavingPost(true);
    try {
      const cleanSlug =
        editingPost.slug?.trim() || slugifyArticleText(editingPost.title, editingPost.id);
      const computedReadingTime = estimateArticleReadingTime(editingPost);
      const payload: Partial<Article> & { title: string } = {
        ...editingPost,
        title: editingPost.title.trim(),
        slug: cleanSlug,
        readingTime: editingPost.readingTime || computedReadingTime,
        status: overrideStatus || editingPost.status || 'published',
        tag: editingPost.category || editingPost.tag || 'Clinical News',
        category: editingPost.category || editingPost.tag || 'Clinical News',
        seoTitle:
          editingPost.seoTitle?.trim() || `${editingPost.title.trim()} | Age Reversal Clinic`,
        metaDescription:
          editingPost.metaDescription?.trim() || editingPost.description.trim(),
        canonicalUrl: editingPost.canonicalUrl?.trim() || `#article-${editingPost.id}`,
      };

      const res = await saveBlogPost(payload);
      if (res.success) {
        showToast('Post saved & SEO synced');
        setIsComposerOpen(false);
        setIsSeoDrawerOpen(false);
        setActiveQuickPicker(null);
        setEditingPost(null);
        loadPaginatedPosts();
      }
    } finally {
      setIsSavingPost(false);
    }
  };

  // Process cover file upload (via click or drag-and-drop) and save as /assets/blog/${id}${ext}?v=${Date.now()}
  const processCoverFile = async (file: File) => {
    if (!file || !editingPost) return;
    setIsUploadingCover(true);
    try {
      const postId = editingPost.id || `news-${Date.now()}`;
      const res = await uploadBlogPostCoverImage(postId, file, {
        previousUrl: editingPost.image,
        imageAlt: editingPost.imageAlt || editingPost.title,
      });
      if (res.success && (res.imagePath || res.url)) {
        const primaryKw = editingPost.focusKeywords?.[0] || editingPost.category || 'Clinical';
        const savedUrl = res.imagePath || res.url || '';
        setEditingPost((prev) =>
          prev
            ? {
                ...prev,
                id: prev.id || postId,
                image: savedUrl,
                imageAlt:
                  prev.imageAlt?.trim() ||
                  `${prev.title || primaryKw} — ${prev.category || 'Clinical Protocol'} at Age Reversal Clinic`,
              }
            : prev
        );
        showToast(`Saved to ${savedUrl.split('?')[0]}`);
      } else {
        showToast(res.error || 'Could not upload cover image');
      }
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCoverFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processCoverFile(file);
  };

  const handleCoverDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverMedia(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processCoverFile(file);
    }
  };

  // Content block helpers in composer
  const handleAddBlock = (type: ArticleBlockType) => {
    if (!editingPost) return;
    const primaryKw = editingPost.focusKeywords?.[0] || editingPost.category || 'Clinical';
    const newBlockId = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newBlock: ArticleContentBlock = {
      id: newBlockId,
      type,
      headingLevel: type === 'h2' ? 'h2' : type === 'h3' ? 'h3' : undefined,
      heading: '',
      text: '',
      calloutQuote: '',
      calloutAttribution: editingPost.author || 'Adv. Faith Chris',
      bulletPoints: type === 'bullets' ? [''] : undefined,
      imageUrl: type === 'image' ? '' : undefined,
      imageAlt:
        type === 'image'
          ? `${editingPost.title || primaryKw} — Clinical visual at Age Reversal Clinic`
          : undefined,
      imageCaption: type === 'image' ? '' : undefined,
    };
    setEditingPost({
      ...editingPost,
      contentBlocks: [...(editingPost.contentBlocks || []), newBlock],
    });
    scrollToAddedBlock(`composer-block-${newBlockId}`, newBlockId);
  };

  // Upload and convert an inline block image to /assets/blog/${id}${ext}?v=${Date.now()}
  const handleBlockImageUpload = async (blockIndex: number, file: File) => {
    if (!file || !editingPost) return;
    const targetBlock = editingPost.contentBlocks?.[blockIndex];
    if (!targetBlock) return;
    const blockKey = targetBlock.id || `block-${blockIndex + 1}`;
    setUploadingBlockId(blockKey);
    try {
      const postId = editingPost.id || `news-${Date.now()}`;
      const blockAssetId = `${postId}-${blockKey}`;
      const res = await uploadBlogPostCoverImage(blockAssetId, file, {
        previousUrl: targetBlock.imageUrl,
        imageAlt: targetBlock.imageAlt || editingPost.title,
        parentPostId: postId,
        blockId: blockKey,
      });
      if (res.success && (res.imagePath || res.url)) {
        const nextUrl = res.imagePath || res.url || '';
        const primaryKw = editingPost.focusKeywords?.[0] || editingPost.category || 'Clinical';
        setEditingPost((prev) => {
          if (!prev) return prev;
          const nextBlocks = [...(prev.contentBlocks || [])];
          const matchIdx = nextBlocks.findIndex(
            (b, idx) => (b.id && b.id === blockKey) || idx === blockIndex
          );
          const idxToUpdate = matchIdx !== -1 ? matchIdx : blockIndex;
          const current = nextBlocks[idxToUpdate];
          if (!current) return prev;
          nextBlocks[idxToUpdate] = {
            ...current,
            id: blockKey,
            type: 'image',
            imageUrl: nextUrl,
            imageAlt:
              current.imageAlt?.trim() ||
              `${prev.title || primaryKw} — ${prev.category || 'Clinical Protocol'} illustration`,
          };
          return { ...prev, id: prev.id || postId, contentBlocks: nextBlocks };
        });
        showToast(`Saved to ${nextUrl.split('?')[0]}`);
      } else {
        showToast(res.error || 'Could not upload inline image');
      }
    } finally {
      setUploadingBlockId(null);
    }
  };

  // Add paired Heading + Paragraph section in 1 click
  const handleAddHeadingSection = () => {
    if (!editingPost) return;
    const stamp = Date.now();
    const h2Id = `block-${stamp}-h2`;
    const h2Block: ArticleContentBlock = {
      id: h2Id,
      type: 'h2',
      headingLevel: 'h2',
      heading: '',
      text: '',
    };
    const pBlock: ArticleContentBlock = {
      id: `block-${stamp}-p`,
      type: 'paragraph',
      text: '',
      paragraphs: [''],
    };
    setEditingPost({
      ...editingPost,
      contentBlocks: [...(editingPost.contentBlocks || []), h2Block, pBlock],
    });
    scrollToAddedBlock(`composer-block-${h2Id}`, h2Id);
  };

  const handleUpdateBlock = (index: number, patch: Partial<ArticleContentBlock>) => {
    if (!editingPost) return;
    const next = [...(editingPost.contentBlocks || [])];
    next[index] = { ...next[index], ...patch };
    setEditingPost({ ...editingPost, contentBlocks: next });
  };

  const handleMoveBlock = (index: number, direction: -1 | 1) => {
    if (!editingPost) return;
    const blocks = [...(editingPost.contentBlocks || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const temp = blocks[index];
    blocks[index] = blocks[targetIdx];
    blocks[targetIdx] = temp;
    setEditingPost({ ...editingPost, contentBlocks: blocks });
  };

  const handleRemoveBlock = (index: number) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      contentBlocks: (editingPost.contentBlocks || []).filter((_, i) => i !== index),
    });
  };

  const handleAddFaq = () => {
    if (!editingPost) return;
    const faqId = `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const nextFaq: ArticleFaqItem = {
      id: faqId,
      question: '',
      answer: '',
    };
    setEditingPost({
      ...editingPost,
      faqItems: [...(editingPost.faqItems || []), nextFaq],
    });
    scrollToAddedBlock(`composer-faq-${faqId}`, faqId);
  };

  const handleAddKeyword = (rawKw?: string) => {
    if (!editingPost) return;
    const clean = (rawKw ?? keywordInput).trim();
    if (!clean) return;
    const existing = editingPost.focusKeywords || [];
    if (!existing.some((k) => k.toLowerCase() === clean.toLowerCase())) {
      setEditingPost({
        ...editingPost,
        focusKeywords: [...existing, clean],
      });
    }
    if (!rawKw) setKeywordInput('');
  };

  const liveSeo = editingPost ? computeArticleSeoScore(editingPost) : null;

  const sortLabels: Record<BlogSortOption, string> = {
    newest: 'Newest First',
    oldest: 'Oldest First',
    'seo-desc': 'Highest SEO Score',
    'title-asc': 'Title A–Z',
  };

  // Shared SEO & Search Ranking Panel (rendered inside Composer's SEO tab AND inside the Standalone SEO Drawer)
  const renderSeoWorkspacePanel = () => {
    if (!editingPost || !liveSeo) return null;
    const effectiveTitle =
      editingPost.seoTitle?.trim() ||
      `${editingPost.title || 'Clinical Article Title'} | Age Reversal Clinic`;
    const effectiveMeta =
      editingPost.metaDescription?.trim() ||
      editingPost.description?.trim() ||
      'Discover evidence-based aesthetic and regenerative medicine protocols at Age Reversal Clinic.';
    const effectiveSlug =
      editingPost.slug || slugifyArticleText(editingPost.title || 'clinical-article');

    const checklistItems = [
      {
        label: `Title length (${effectiveTitle.length}/60 chars)`,
        shortLabel: 'Title 50–60 chars',
        ok: liveSeo.checks.titleLength,
      },
      {
        label: `Meta description (${effectiveMeta.length}/155 chars)`,
        shortLabel: 'Meta 120–155 chars',
        ok: liveSeo.checks.metaLength,
      },
      {
        label: 'Keyword in Title',
        shortLabel: 'Keyword in Title',
        ok: liveSeo.checks.keywordInTitle,
      },
      {
        label: 'Keyword in URL Slug',
        shortLabel: 'Keyword in Slug',
        ok: liveSeo.checks.keywordInSlug,
      },
      {
        label: 'Keyword in 1st Paragraph',
        shortLabel: 'Keyword in 1st Para',
        ok: liveSeo.checks.keywordInFirstParagraph,
      },
      {
        label: 'Cover image Alt set',
        shortLabel: 'Cover Image Alt',
        ok: liveSeo.checks.imageAlt,
      },
    ];

    return (
      <div className="space-y-4">
        {/* 1. Live Google Search Preview Card (Mobile / Desktop SERP Toggle) */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Google SERP Preview
              </span>
              <div className="inline-flex items-center p-0.5 bg-slate-200/80 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSerpDevice('mobile')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer ${
                    serpDevice === 'mobile'
                      ? 'bg-white text-[#003334] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="h-3 w-3" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice('desktop')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold inline-flex items-center gap-1 cursor-pointer ${
                    serpDevice === 'desktop'
                      ? 'bg-white text-[#003334] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Monitor className="h-3 w-3" />
                  <span>Desktop</span>
                </button>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1 text-xs font-bold ${
                liveSeo.grade === 'optimized' ? 'text-emerald-700' : 'text-amber-600'
              }`}
            >
              {liveSeo.grade === 'optimized' ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              )}
              <span>{liveSeo.score}% SEO</span>
            </span>
          </div>

          {/* SERP Card Box */}
          <div
            className={`bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-1 transition-all ${
              serpDevice === 'mobile' ? 'max-w-sm' : 'w-full'
            }`}
          >
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <div className="w-5 h-5 rounded-full bg-[#003334] text-[#c5a880] flex items-center justify-center font-serif font-bold text-[10px] shrink-0">
                AR
              </div>
              <div className="truncate">
                <div className="font-medium text-slate-800 leading-none">Age Reversal Clinic</div>
                <div className="text-[10px] text-emerald-800 font-mono truncate mt-0.5">
                  agereversalclinic.com › blog › {effectiveSlug}
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#1a0dab] hover:underline line-clamp-1 pt-0.5">
              {effectiveTitle}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              <span className="text-slate-400">{editingPost.date || 'Today'} — </span>
              {effectiveMeta}
            </p>

            {/* Rich Snippet FAQ Preview if FAQs exist */}
            {Array.isArray(editingPost.faqItems) &&
              editingPost.faqItems.filter((f) => f.question.trim()).length > 0 && (
                <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                  {editingPost.faqItems
                    .filter((f) => f.question.trim())
                    .slice(0, 2)
                    .map((faq, idx) => (
                      <div
                        key={faq.id || idx}
                        className="flex items-center justify-between text-[11px] text-slate-700 py-0.5"
                      >
                        <span className="truncate pr-2">{faq.question}</span>
                        <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>

        {/* 2. Compact Visual SEO Checklist Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {checklistItems.map((chk) => (
            <div
              key={chk.shortLabel}
              className={`px-2.5 py-2 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 ${
                chk.ok
                  ? 'border-emerald-200/80 bg-emerald-50/50 text-emerald-900'
                  : 'border-amber-200/80 bg-amber-50/50 text-amber-900'
              }`}
              title={chk.label}
            >
              {chk.ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              )}
              <span className="truncate">{chk.shortLabel}</span>
            </div>
          ))}
        </div>

        {/* 3. Focus Keywords Input + Quick-Add Local Clinical Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Focus Keywords (Target Search Queries)
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {(editingPost.focusKeywords || []).length} active
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
              placeholder='e.g. "HydraFacial Lagos", "Laser Acne Scar Removal Abuja"'
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#003334]"
            />
            <button
              type="button"
              onClick={() => handleAddKeyword()}
              className="px-3.5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer shrink-0"
            >
              Add
            </button>
          </div>

          {/* Active Keyword Chips */}
          {(editingPost.focusKeywords || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(editingPost.focusKeywords || []).map((kw, idx) => (
                <span
                  key={kw}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    idx === 0
                      ? 'bg-[#003334] text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {idx === 0 && <Sparkles className="h-3 w-3 text-[#c5a880]" />}
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPost({
                        ...editingPost,
                        focusKeywords: (editingPost.focusKeywords || []).filter((k) => k !== kw),
                      })
                    }
                    className="opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Quick-Add Suggested Local Search Terms */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[10px] text-slate-400 shrink-0">Suggestions:</span>
            {SUGGESTED_FOCUS_KEYWORDS.map((sug) => {
              const alreadyAdded = (editingPost.focusKeywords || []).some(
                (k) => k.toLowerCase() === sug.toLowerCase()
              );
              if (alreadyAdded) return null;
              return (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddKeyword(sug)}
                  className="px-2 py-0.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[10px] text-slate-600 whitespace-nowrap cursor-pointer"
                >
                  + {sug}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SEO Title, Meta Description & URL Slug */}
        <div className="grid grid-cols-1 gap-3 pt-1">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>SEO Title Tag</span>
              <span
                className={
                  effectiveTitle.length >= 40 && effectiveTitle.length <= 65
                    ? 'text-emerald-600 font-mono'
                    : 'text-amber-600 font-mono'
                }
              >
                {effectiveTitle.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={editingPost.seoTitle || ''}
              onChange={(e) => setEditingPost({ ...editingPost, seoTitle: e.target.value })}
              placeholder={`${editingPost.title || 'Article Title'} | Age Reversal Clinic`}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#003334]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Meta Description</span>
              <span
                className={
                  effectiveMeta.length >= 110 && effectiveMeta.length <= 165
                    ? 'text-emerald-600 font-mono'
                    : 'text-amber-600 font-mono'
                }
              >
                {effectiveMeta.length}/155 chars
              </span>
            </div>
            <textarea
              rows={2}
              value={editingPost.metaDescription || ''}
              onChange={(e) => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
              placeholder={
                editingPost.description ||
                'Compelling summary (120–155 chars) with primary focus keyword...'
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#003334] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={editingPost.slug || ''}
                onChange={(e) =>
                  setEditingPost({
                    ...editingPost,
                    slug: slugifyArticleText(e.target.value, editingPost.id),
                  })
                }
                placeholder="seo-friendly-url-slug"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#003334]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Cover Image Alt Attribute
              </label>
              <input
                type="text"
                value={editingPost.imageAlt || ''}
                onChange={(e) => setEditingPost({ ...editingPost, imageAlt: e.target.value })}
                placeholder="Descriptive alt text for Google Images..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#003334]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Compact Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-5 right-5 z-50 bg-[#003334] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold border border-[#c5a880]/40"
          >
            <CheckCircle2 className="h-4 w-4 text-[#c5a880]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          1. MINIMALIST TOP ACTION BAR
          ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'all', label: 'All', count: counts.all },
                { id: 'news', label: 'Clinical News', count: counts.news },
                { id: 'stories', label: 'Patient Stories', count: counts.stories },
                { id: 'drafts', label: 'Drafts', count: counts.drafts },
              ] as const
            ).map((tab) => {
              const active = activeFilterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilterTab(tab.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-white text-[#003334] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      active ? 'text-[#003334]' : 'text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Search Input + Compact Sort/Filter Menu + Primary "+ New Post" Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56 md:w-64">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#003334] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Compact Sort / View Menu Dropdown */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setIsSortMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shrink-0"
                title="Sort and display options"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
              </button>

              <AnimatePresence>
                {isSortMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-40 text-xs"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Sort By
                    </div>
                    {(['newest', 'oldest', 'seo-desc', 'title-asc'] as BlogSortOption[]).map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setPage(1);
                            setIsSortMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                        >
                          <span>{sortLabels[option]}</span>
                          {sortBy === option && <Check className="h-3.5 w-3.5 text-[#003334]" />}
                        </button>
                      )
                    )}

                    <div className="my-1 border-t border-slate-100" />
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Batch Size
                    </div>
                    {[6, 9].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setLimit(size);
                          setPage(1);
                          setIsSortMenuOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                      >
                        <span>{size} posts per page</span>
                        {limit === size && <Check className="h-3.5 w-3.5 text-[#003334]" />}
                      </button>
                    ))}

                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        setIsSortMenuOpen(false);
                        setIsSectionSettingsOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                    >
                      <Settings2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Section Heading</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary "+ New Post" Button */}
            <button
              onClick={handleOpenNewPost}
              className="inline-flex items-center gap-1.5 bg-[#003334] hover:bg-[#16494a] text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5 text-[#c5a880]" />
              <span>New Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. PAGINATED ARTICLE CARD GRID
          ===================================================================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/10] bg-slate-100" />
              <div className="p-4 space-y-2.5">
                <div className="h-3 w-28 bg-slate-100 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 py-14 px-4 text-center space-y-3">
          <p className="text-sm font-medium text-slate-700">No blog posts match the current filter.</p>
          <button
            onClick={handleOpenNewPost}
            className="inline-flex items-center gap-1.5 bg-[#003334] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#c5a880]" />
            <span>Create First Post</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((card) => {
            const isOptimized = card.seoGrade === 'optimized';
            const isMenuOpen = activeCardMenuId === card.id;

            return (
              <div
                key={card.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col relative overflow-visible"
              >
                {/* Cover Thumbnail (or Clinic Logo Outline Fallback) */}
                <div
                  onClick={() => handleOpenEditPost(card, 'write', false)}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-[#faf8f5] cursor-pointer border-b border-slate-100"
                >
                  <BlogCardThumbnail src={card.image} alt={card.imageAlt || card.title} />
                </div>

                {/* Card Body: Essential Visual Cues Only */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    {/* Unboxed Metadata Row: Category · Status · SEO Readiness */}
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-500 truncate">
                        <span className="font-semibold text-[#003334] truncate">
                          {card.category || card.tag}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              card.status === 'draft' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span className="capitalize">{card.status}</span>
                        </span>
                      </div>

                      {/* SEO Readiness Indicator (Opens Dedicated SEO & Search Ranking Drawer/Modal) */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditPost(card, 'seo', true)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold shrink-0 cursor-pointer transition-opacity hover:opacity-80 ${
                          isOptimized ? 'text-emerald-700' : 'text-amber-600'
                        }`}
                        title="Open Dedicated SEO & Search Ranking Modal"
                      >
                        {isOptimized ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span>{isOptimized ? 'Optimized' : 'Needs SEO'}</span>
                        <span className="font-mono text-[10px] opacity-75">({card.seoScore}%)</span>
                      </button>
                    </div>

                    {/* Title */}
                    <h4
                      onClick={() => handleOpenEditPost(card, 'write', false)}
                      className="font-serif font-semibold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug hover:text-[#003334] transition-colors cursor-pointer"
                    >
                      {card.title}
                    </h4>
                  </div>

                  {/* Bottom Bar: Date & Author + ••• Action Menu */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                      <span>{card.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{card.author}</span>
                    </div>

                    {/* Card ••• Action Button (Popover on Desktop, Bottom Sheet on Mobile) */}
                    <div className="relative" data-card-menu>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.innerWidth < 640) {
                            setMobileActionSheetCard(card);
                          } else {
                            setActiveCardMenuId(isMenuOpen ? null : card.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Post options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Desktop Popover Menu */}
                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.97 }}
                            transition={{ duration: 0.12 }}
                            className="hidden sm:block absolute right-0 bottom-9 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-40 text-xs"
                          >
                            <button
                              onClick={() => handleOpenEditPost(card, 'write', false)}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                              <span>Edit Post</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditPost(card, 'seo', true)}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                            >
                              <Globe className="h-3.5 w-3.5 text-[#003334]" />
                              <span>SEO & Search Settings</span>
                            </button>
                            <button
                              onClick={() => handlePreviewPost(card)}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              <span>Preview Article</span>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(card)}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                              <span>
                                {card.status === 'draft' ? 'Publish Post' : 'Move to Draft'}
                              </span>
                            </button>
                            <button
                              onClick={() => handleDuplicatePost(card)}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5 text-slate-500" />
                              <span>Duplicate</span>
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              onClick={() => {
                                setActiveCardMenuId(null);
                                setDeleteConfirmCard(card);
                              }}
                              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-rose-50 text-rose-600 font-medium cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          3. PAGINATION BAR
          ===================================================================== */}
      {totalCount > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{(page - 1) * limit + 1}</strong>–
            <strong className="text-slate-800">{Math.min(page * limit, totalCount)}</strong> of{' '}
            <strong className="text-slate-800">{totalCount}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pNum = idx + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    page === pNum
                      ? 'bg-[#003334] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MOBILE BOTTOM-SHEET ACTION MENU (For Card ••• on Mobile)
          ===================================================================== */}
      <AnimatePresence>
        {mobileActionSheetCard && (
          <div className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) setMobileActionSheetCard(null);
              }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-white rounded-t-3xl p-4 space-y-2 shadow-2xl"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2" />
              <div className="px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                <p className="font-serif font-semibold text-sm text-slate-900 truncate pr-3">
                  {mobileActionSheetCard.title}
                </p>
                <button
                  onClick={() => setMobileActionSheetCard(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1 text-xs">
                <button
                  onClick={() => handleOpenEditPost(mobileActionSheetCard, 'write', false)}
                  className="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-50 text-slate-800 font-semibold"
                >
                  <Edit3 className="h-4 w-4 text-slate-500" />
                  <span>Edit Post</span>
                </button>
                <button
                  onClick={() => handleOpenEditPost(mobileActionSheetCard, 'seo', true)}
                  className="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-50 text-slate-800 font-semibold"
                >
                  <Globe className="h-4 w-4 text-[#003334]" />
                  <span>SEO & Search Settings</span>
                </button>
                <button
                  onClick={() => handlePreviewPost(mobileActionSheetCard)}
                  className="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-50 text-slate-800 font-semibold"
                >
                  <Eye className="h-4 w-4 text-slate-500" />
                  <span>Preview Article</span>
                </button>
                <button
                  onClick={() => handleToggleStatus(mobileActionSheetCard)}
                  className="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-50 text-slate-800 font-semibold"
                >
                  <CheckCircle2 className="h-4 w-4 text-slate-500" />
                  <span>
                    {mobileActionSheetCard.status === 'draft' ? 'Publish Post' : 'Move to Draft'}
                  </span>
                </button>
                <button
                  onClick={() => handleDuplicatePost(mobileActionSheetCard)}
                  className="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-50 text-slate-800 font-semibold"
                >
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => {
                    const target = mobileActionSheetCard;
                    setMobileActionSheetCard(null);
                    setDeleteConfirmCard(target);
                  }}
                  className="w-full px-3.5 py-3 rounded-xl flex items-center gap-3 hover:bg-rose-50 text-rose-600 font-semibold"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Post</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          DELETE CONFIRMATION MODAL / MOBILE BOTTOM SHEET
          ===================================================================== */}
      <AnimatePresence>
        {deleteConfirmCard && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900">Delete Post?</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    "{deleteConfirmCard.title}" will be permanently removed.
                  </p>
                </div>
                <button
                  onClick={() => setDeleteConfirmCard(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmCard(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          SECTION HEADING COMPACT MODAL
          ===================================================================== */}
      <AnimatePresence>
        {isSectionSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-serif font-bold text-base text-[#003334]">
                  Section Header Settings
                </h4>
                <button
                  onClick={() => setIsSectionSettingsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={sectionHeading}
                    onChange={(e) => setSectionHeading(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#003334]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Subheading
                  </label>
                  <textarea
                    rows={2}
                    value={sectionDescription}
                    onChange={(e) => setSectionDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#003334] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsSectionSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSectionHeader}
                  className="px-4 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold hover:bg-[#16494a] cursor-pointer"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          4A. POST COMPOSER MODAL (Tabbed Header: Write | Media | SEO)
          Centered Dialog on Desktop, Swipeable Bottom-Sheet Modal on Mobile
          ===================================================================== */}
      <AnimatePresence>
        {isComposerOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              className="bg-white w-full sm:max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Mobile Swipe Handle */}
              <div className="sm:hidden pt-2.5 pb-1 bg-slate-50/70 flex justify-center">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* Modal Top Bar with Segmented Tabs: Write | Media | SEO */}
              <div className="px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70 shrink-0">
                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
                  {(
                    [
                      { id: 'write', label: 'Write', icon: FileText },
                      { id: 'media', label: 'Media', icon: ImageIcon },
                      {
                        id: 'seo',
                        label: `SEO (${liveSeo?.score ?? 0}%)`,
                        icon: Globe,
                      },
                    ] as const
                  ).map((t) => {
                    const Icon = t.icon;
                    const active = composerTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setComposerTab(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-[#003334] shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewArticle(editingPost)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 inline-flex items-center gap-1 cursor-pointer"
                    title="Preview article layout"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsComposerOpen(false);
                      setEditingPost(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Content */}
              <div
                ref={composerScrollContainerRef}
                className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 scroll-smooth"
              >
                {/* -----------------------------------------------------------------
                    TAB 1: WRITE
                    ----------------------------------------------------------------- */}
                {composerTab === 'write' && (
                  <div className="space-y-4">
                    {/* Title Input & Auto-Slug Preview */}
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => {
                          const nextTitle = e.target.value;
                          setEditingPost({
                            ...editingPost,
                            title: nextTitle,
                            slug:
                              editingPost.slug ||
                              slugifyArticleText(nextTitle, editingPost.id),
                          });
                        }}
                        placeholder="Article headline..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-lg font-serif font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003334]"
                      />
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <span className="font-mono shrink-0">agereversalclinic.com/blog/</span>
                          <input
                            type="text"
                            value={editingPost.slug || ''}
                            onChange={(e) =>
                              setEditingPost({
                                ...editingPost,
                                slug: slugifyArticleText(e.target.value, editingPost.id),
                              })
                            }
                            placeholder="auto-slug-preview"
                            className="flex-1 bg-transparent border-b border-transparent focus:border-slate-300 text-slate-600 font-mono focus:outline-none truncate"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingPost({
                              ...editingPost,
                              slug: slugifyArticleText(editingPost.title, editingPost.id),
                            })
                          }
                          className="text-[10px] font-semibold text-slate-500 hover:text-[#003334] inline-flex items-center gap-1 shrink-0 cursor-pointer"
                          title="Regenerate slug from title"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Sync Slug</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Picker Triggers Row (Opens Bottom-Sheet / Quick Picker Modals on Click) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Picker 1: Category & Tag */}
                      <button
                        type="button"
                        onClick={() => setActiveQuickPicker('category')}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-[#003334] bg-slate-50/60 hover:bg-white text-left transition-all flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Category & Feed
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate block mt-0.5">
                            {editingPost.category || editingPost.tag} ·{' '}
                            {editingPost.type === 'stories' ? 'Story' : 'News'}
                          </span>
                        </div>
                        <Tag className="h-4 w-4 text-[#003334] shrink-0" />
                      </button>

                      {/* Picker 2: Author / Medical Reviewer (E-E-A-T) */}
                      <button
                        type="button"
                        onClick={() => setActiveQuickPicker('author')}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-[#003334] bg-slate-50/60 hover:bg-white text-left transition-all flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Author / E-E-A-T Reviewer
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate block mt-0.5">
                            {editingPost.author || 'Adv. Faith Chris'}
                          </span>
                        </div>
                        <ShieldCheck className="h-4 w-4 text-[#003334] shrink-0" />
                      </button>

                      {/* Picker 3: Status & Publish Date */}
                      <button
                        type="button"
                        onClick={() => setActiveQuickPicker('status-date')}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-[#003334] bg-slate-50/60 hover:bg-white text-left transition-all flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Status & Date
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                editingPost.status === 'draft' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                            />
                            <span className="capitalize">{editingPost.status || 'published'}</span>
                            <span>·</span>
                            <span className="text-slate-500 font-normal">{editingPost.date}</span>
                          </span>
                        </div>
                        <Calendar className="h-4 w-4 text-[#003334] shrink-0" />
                      </button>
                    </div>

                    {/* Excerpt / Opening Lead Paragraph (Styled like live Blog Page lead) */}
                    <div className="p-4 sm:p-5 rounded-2xl border border-[#e8dcc8] bg-[#faf8f5]/60 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#003334]/70">
                        <span>Opening Lead / Excerpt</span>
                        {liveSeo?.checks.keywordInFirstParagraph && (
                          <span className="text-emerald-600 inline-flex items-center gap-1">
                            <Check className="h-3 w-3" /> Focus keyword detected
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        value={editingPost.description}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, description: e.target.value })
                        }
                        placeholder="Write the opening lead paragraph in editorial italic serif (include primary focus keyword)..."
                        className="w-full bg-transparent text-base sm:text-lg font-serif italic text-luxury-text leading-relaxed focus:outline-none resize-none placeholder:text-slate-400/80"
                      />
                    </div>

                    {/* Modular Section Blocks — Live Blog Page WYSIWYG Canvas */}
                    <div className="space-y-3.5 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#003334]">
                            Modular Content Blocks
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#faf8f5] border border-[#e8dcc8] text-[10px] font-medium text-[#7a7a7a]">
                            Live Blog Canvas
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleAddHeadingSection}
                            className="px-2.5 py-1.5 rounded-lg bg-[#003334]/5 hover:bg-[#003334]/10 border border-[#003334]/20 text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Heading2 className="h-3.5 w-3.5" />
                            <span>+ Section</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('paragraph')}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <AlignLeft className="h-3.5 w-3.5 text-slate-500" />
                            <span>+ Paragraph</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('image')}
                            className="px-2.5 py-1.5 rounded-lg border border-[#c5a880]/60 bg-[#faf8f5] hover:bg-[#f3ede2] text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon className="h-3.5 w-3.5 text-[#003334]" />
                            <span>+ Image</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('bullets')}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <List className="h-3.5 w-3.5 text-slate-500" />
                            <span>+ Takeaway</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('callout')}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Quote className="h-3.5 w-3.5 text-slate-500" />
                            <span>+ Quote</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleAddFaq}
                            className="px-2.5 py-1.5 rounded-lg border border-[#c5a880]/50 bg-[#faf8f5] hover:bg-[#f3ede2] text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <HelpCircle className="h-3.5 w-3.5 text-[#003334]" />
                            <span>+ FAQ</span>
                          </button>
                        </div>
                      </div>

                      {/* Blog Article Canvas Container */}
                      <div className="rounded-2xl border border-[#e8dcc8] bg-white p-4 sm:p-6 shadow-xs space-y-5">
                        {(editingPost.contentBlocks || []).length === 0 && (
                          <div className="py-8 text-center space-y-2">
                            <p className="text-sm font-serif italic text-luxury-muted">
                              No article blocks yet — add a Section, Paragraph, Image, Quote, or Key Takeaway above.
                            </p>
                          </div>
                        )}

                        {(editingPost.contentBlocks || []).map((block, bIdx) => {
                          const blockKey = block.id || `block-${bIdx}`;
                          const isUploadingThisBlock = uploadingBlockId === blockKey;
                          const isDraggingThisBlock = draggingOverBlockId === blockKey;
                          const isNewlyAdded = newlyAddedBlockId === blockKey;

                          return (
                            <div
                              key={blockKey}
                              id={`composer-block-${blockKey}`}
                              data-block-id={blockKey}
                              className={`group relative rounded-2xl border p-3 sm:p-4 transition-all duration-300 space-y-2 scroll-mt-6 ${
                                isNewlyAdded
                                  ? 'border-[#003334] bg-[#faf8f5] ring-2 ring-[#c5a880]/50 shadow-sm'
                                  : 'border-transparent hover:border-[#e8dcc8] focus-within:border-[#c5a880] bg-white hover:bg-[#faf8f5]/35 focus-within:bg-[#faf8f5]/40'
                              }`}
                            >
                              {/* Subtle Top Block Control Bar */}
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-[#faf8f5] border border-[#e8dcc8] text-[#003334] text-[9px] tracking-widest">
                                    {block.type === 'bullets'
                                      ? 'KEY TAKEAWAYS'
                                      : block.type === 'callout'
                                      ? 'CLINICAL QUOTE'
                                      : block.type === 'image'
                                      ? 'INLINE FIGURE'
                                      : block.type === 'paragraph'
                                      ? 'PARAGRAPH'
                                      : block.type.toUpperCase()}
                                  </span>
                                  {(block.type === 'h2' || block.type === 'h3') && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateBlock(bIdx, {
                                          type: block.type === 'h2' ? 'h3' : 'h2',
                                          headingLevel: block.type === 'h2' ? 'h3' : 'h2',
                                        })
                                      }
                                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-[#003334]/40 text-[9px] text-slate-600 cursor-pointer"
                                    >
                                      Switch to {block.type === 'h2' ? 'H3' : 'H2'}
                                    </button>
                                  )}
                                </div>

                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveBlock(bIdx, -1)}
                                    disabled={bIdx === 0}
                                    className="p-1 rounded-md text-slate-400 hover:text-[#003334] hover:bg-white disabled:opacity-30 cursor-pointer"
                                    title="Move block up"
                                  >
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveBlock(bIdx, 1)}
                                    disabled={bIdx === (editingPost.contentBlocks?.length || 1) - 1}
                                    className="p-1 rounded-md text-slate-400 hover:text-[#003334] hover:bg-white disabled:opacity-30 cursor-pointer"
                                    title="Move block down"
                                  >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBlock(bIdx)}
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    title="Remove block"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* H2 / H3 BLOCK — Matches ArticleContent.tsx serif heading */}
                              {(block.type === 'h2' || block.type === 'h3') && (
                                <input
                                  type="text"
                                  value={block.heading || block.text || ''}
                                  onChange={(e) =>
                                    handleUpdateBlock(bIdx, {
                                      heading: e.target.value,
                                      text: e.target.value,
                                    })
                                  }
                                  placeholder={
                                    block.type === 'h2'
                                      ? 'Section H2 Heading (include target search keyword)...'
                                      : 'Subsection H3 Heading...'
                                  }
                                  className={`w-full bg-transparent font-serif text-luxury-text font-normal leading-snug tracking-tight focus:outline-none placeholder:text-slate-300 ${
                                    block.type === 'h2'
                                      ? 'text-xl sm:text-2xl md:text-[26px]'
                                      : 'text-lg sm:text-xl md:text-[22px]'
                                  }`}
                                />
                              )}

                              {/* PARAGRAPH BLOCK — Matches ArticleContent.tsx editorial body */}
                              {block.type === 'paragraph' && (
                                <textarea
                                  rows={3}
                                  value={
                                    block.text ||
                                    (Array.isArray(block.paragraphs)
                                      ? block.paragraphs.join('\n\n')
                                      : '')
                                  }
                                  onChange={(e) =>
                                    handleUpdateBlock(bIdx, {
                                      text: e.target.value,
                                      paragraphs: [e.target.value],
                                    })
                                  }
                                  placeholder="Write clinical body paragraph as it appears on the blog page..."
                                  className="w-full bg-transparent text-sm sm:text-base md:text-[17px] text-luxury-subtext font-light leading-relaxed focus:outline-none resize-y placeholder:text-slate-300"
                                />
                              )}

                              {/* INLINE IMAGE BLOCK — Matches ArticleContent.tsx <figure> + <figcaption> */}
                              {block.type === 'image' && (
                                <figure className="space-y-2.5 pt-1">
                                  <div
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDraggingOverBlockId(blockKey);
                                    }}
                                    onDragLeave={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDraggingOverBlockId((prev) =>
                                        prev === blockKey ? null : prev
                                      );
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDraggingOverBlockId(null);
                                      const file = e.dataTransfer.files?.[0];
                                      if (file && file.type.startsWith('image/')) {
                                        handleBlockImageUpload(bIdx, file);
                                      }
                                    }}
                                    className={`relative rounded-2xl overflow-hidden border transition-all bg-[#faf8f5] shadow-xs ${
                                      isDraggingThisBlock
                                        ? 'border-2 border-dashed border-[#003334] ring-4 ring-[#003334]/10'
                                        : 'border-[#e8dcc8]'
                                    }`}
                                  >
                                    {block.imageUrl?.trim() ? (
                                      <div className="relative group/img">
                                        <img
                                          key={block.imageUrl}
                                          src={block.imageUrl}
                                          alt={block.imageAlt || editingPost.title || 'Article image'}
                                          className="w-full max-h-[380px] object-cover block"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-95 sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity">
                                          <label className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#003334] text-[11px] font-semibold shadow-md inline-flex items-center gap-1.5 cursor-pointer">
                                            <Upload className="h-3.5 w-3.5" />
                                            <span>
                                              {isUploadingThisBlock ? 'Converting...' : 'Replace WebP'}
                                            </span>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              disabled={isUploadingThisBlock}
                                              onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) handleBlockImageUpload(bIdx, f);
                                                e.currentTarget.value = '';
                                              }}
                                            />
                                          </label>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleUpdateBlock(bIdx, { imageUrl: '' })
                                            }
                                            className="p-1.5 rounded-xl bg-white/95 hover:bg-rose-50 text-rose-600 shadow-md cursor-pointer"
                                            title="Remove image"
                                          >
                                            <X className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="relative h-52 sm:h-60 flex flex-col items-center justify-center p-4 text-center">
                                        <div className="absolute inset-0 opacity-55 pointer-events-none">
                                          <LogoOutlineSkeleton
                                            size="md"
                                            showLabel={false}
                                            className="w-full h-full border-0"
                                          />
                                        </div>
                                        <div className="relative z-10 flex flex-col items-center gap-2 bg-white/90 backdrop-blur-xs px-5 py-3.5 rounded-2xl border border-[#e8dcc8] shadow-xs">
                                          <label className="px-3.5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#002627] cursor-pointer shadow-xs">
                                            <Upload className="h-3.5 w-3.5" />
                                            <span>
                                              {isUploadingThisBlock
                                                ? 'Converting to WebP...'
                                                : 'Upload Inline Image (.webp)'}
                                            </span>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              disabled={isUploadingThisBlock}
                                              onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) handleBlockImageUpload(bIdx, f);
                                                e.currentTarget.value = '';
                                              }}
                                            />
                                          </label>
                                          <span className="text-[10px] text-slate-500">
                                            Or drag & drop an image anywhere in this frame
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Figcaption Input — Exact match to ArticleContent.tsx <figcaption> */}
                                  <input
                                    type="text"
                                    value={block.imageCaption || ''}
                                    onChange={(e) =>
                                      handleUpdateBlock(bIdx, { imageCaption: e.target.value })
                                    }
                                    placeholder="Add figure caption (displays in centered italic serif below image)..."
                                    className="w-full text-center text-xs sm:text-sm text-luxury-muted italic font-serif bg-transparent border-b border-transparent focus:border-[#c5a880] focus:outline-none py-1 placeholder:text-slate-300"
                                  />

                                  {/* Compact SEO Alt Text + Optional Direct Image URL */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#e8dcc8]/80">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#003334] shrink-0">
                                        SEO Alt
                                      </span>
                                      <input
                                        type="text"
                                        value={block.imageAlt || ''}
                                        onChange={(e) =>
                                          handleUpdateBlock(bIdx, { imageAlt: e.target.value })
                                        }
                                        placeholder="Descriptive alt text for Google Images..."
                                        className="w-full bg-transparent text-[11px] text-slate-700 focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#e8dcc8]/80">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                                        URL
                                      </span>
                                      <input
                                        type="text"
                                        value={block.imageUrl || ''}
                                        onChange={(e) =>
                                          handleUpdateBlock(bIdx, { imageUrl: e.target.value })
                                        }
                                        placeholder="/assets/blog/... or https://..."
                                        className="w-full bg-transparent text-[11px] font-mono text-slate-600 focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                </figure>
                              )}

                              {/* CLINICAL QUOTE / CALLOUT BLOCK — Exact match to ArticleContent.tsx blockquote */}
                              {block.type === 'callout' && (
                                <blockquote className="border-l-4 border-[#c5a880] pl-5 sm:pl-6 bg-[#faf8f5] py-4 sm:py-5 pr-5 rounded-r-2xl space-y-2.5">
                                  <textarea
                                    rows={2}
                                    value={block.calloutQuote || block.text || ''}
                                    onChange={(e) =>
                                      handleUpdateBlock(bIdx, {
                                        calloutQuote: e.target.value,
                                        text: e.target.value,
                                      })
                                    }
                                    placeholder="“Enter clinical callout or specialist quote...”"
                                    className="w-full bg-transparent italic text-base sm:text-lg text-luxury-text font-serif leading-relaxed focus:outline-none resize-none placeholder:text-slate-400"
                                  />
                                  <footer className="flex items-center gap-1.5 not-italic font-sans text-xs sm:text-sm font-medium text-luxury-muted">
                                    <span>—</span>
                                    <input
                                      type="text"
                                      value={block.calloutAttribution || ''}
                                      onChange={(e) =>
                                        handleUpdateBlock(bIdx, {
                                          calloutAttribution: e.target.value,
                                        })
                                      }
                                      placeholder="Specialist Attribution (e.g. Adv. Faith Chris)"
                                      className="w-full bg-transparent text-xs sm:text-sm font-medium text-luxury-muted focus:outline-none placeholder:text-slate-300"
                                    />
                                  </footer>
                                </blockquote>
                              )}

                              {/* KEY TAKEAWAYS / BULLETS BLOCK — Exact match to ArticleContent.tsx gold-marker list */}
                              {block.type === 'bullets' && (
                                <div className="space-y-2 pt-1">
                                  <ul className="space-y-2 pl-2">
                                    {(block.bulletPoints && block.bulletPoints.length > 0
                                      ? block.bulletPoints
                                      : ['']
                                    ).map((point, pIdx) => (
                                      <li
                                        key={pIdx}
                                        className="flex items-start gap-2.5 text-sm sm:text-base md:text-[17px] text-luxury-subtext font-light leading-relaxed"
                                      >
                                        <span className="text-[#c5a880] font-bold text-lg leading-snug select-none mt-0.5">
                                          •
                                        </span>
                                        <input
                                          type="text"
                                          value={point}
                                          onChange={(e) => {
                                            const currentPoints =
                                              block.bulletPoints && block.bulletPoints.length > 0
                                                ? [...block.bulletPoints]
                                                : [''];
                                            currentPoints[pIdx] = e.target.value;
                                            handleUpdateBlock(bIdx, {
                                              bulletPoints: currentPoints,
                                            });
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              e.preventDefault();
                                              const currentPoints =
                                                block.bulletPoints && block.bulletPoints.length > 0
                                                  ? [...block.bulletPoints]
                                                  : [''];
                                              currentPoints.splice(pIdx + 1, 0, '');
                                              handleUpdateBlock(bIdx, {
                                                bulletPoints: currentPoints,
                                              });
                                            } else if (
                                              e.key === 'Backspace' &&
                                              !point &&
                                              (block.bulletPoints?.length || 0) > 1
                                            ) {
                                              e.preventDefault();
                                              const currentPoints = (
                                                block.bulletPoints || []
                                              ).filter((_, idx) => idx !== pIdx);
                                              handleUpdateBlock(bIdx, {
                                                bulletPoints:
                                                  currentPoints.length > 0 ? currentPoints : [''],
                                              });
                                            }
                                          }}
                                          placeholder={`Key clinical takeaway #${pIdx + 1} (press Enter for next bullet)...`}
                                          className="w-full bg-transparent text-sm sm:text-base md:text-[17px] text-luxury-subtext font-light leading-relaxed focus:outline-none placeholder:text-slate-300"
                                        />
                                        {(block.bulletPoints?.length || 0) > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const currentPoints = (
                                                block.bulletPoints || []
                                              ).filter((_, idx) => idx !== pIdx);
                                              handleUpdateBlock(bIdx, {
                                                bulletPoints:
                                                  currentPoints.length > 0 ? currentPoints : [''],
                                              });
                                            }}
                                            className="p-1 text-slate-300 hover:text-rose-500 cursor-pointer shrink-0"
                                            title="Remove bullet point"
                                          >
                                            <X className="h-3.5 w-3.5" />
                                          </button>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentPoints =
                                        block.bulletPoints && block.bulletPoints.length > 0
                                          ? [...block.bulletPoints, '']
                                          : ['', ''];
                                      handleUpdateBlock(bIdx, { bulletPoints: currentPoints });
                                    }}
                                    className="ml-6 text-[11px] font-semibold text-[#003334] hover:underline inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span>Add bullet point</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* FAQ Items for Google Rich Snippets — Styled like ArticleContent.tsx FAQ section */}
                        {Array.isArray(editingPost.faqItems) && editingPost.faqItems.length > 0 && (
                          <div className="pt-5 border-t border-[#e8dcc8] space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg sm:text-xl font-serif text-luxury-text font-normal">
                                Frequently Asked Clinical Questions
                              </h3>
                              <span className="px-2 py-0.5 rounded-full bg-[#faf8f5] border border-[#e8dcc8] text-[10px] font-bold uppercase tracking-wider text-[#003334]">
                                Google FAQ Schema ({editingPost.faqItems.length})
                              </span>
                            </div>
                            <div className="space-y-3">
                              {editingPost.faqItems.map((faq, fIdx) => {
                                const faqKey = faq.id || `faq-${fIdx}`;
                                const isFaqNewlyAdded = newlyAddedBlockId === faqKey;
                                return (
                                  <div
                                    key={faqKey}
                                    id={`composer-faq-${faqKey}`}
                                    className={`rounded-2xl border p-4 sm:p-5 space-y-2 transition-all duration-300 scroll-mt-6 ${
                                      isFaqNewlyAdded
                                        ? 'border-[#003334] bg-[#faf8f5] ring-2 ring-[#c5a880]/50 shadow-sm'
                                        : 'border-[#e8dcc8] bg-[#faf8f5]/60'
                                    }`}
                                  >
                                  <div className="flex items-start justify-between gap-2">
                                    <input
                                      type="text"
                                      value={faq.question}
                                      onChange={(e) => {
                                        const next = [...(editingPost.faqItems || [])];
                                        next[fIdx] = { ...next[fIdx], question: e.target.value };
                                        setEditingPost({ ...editingPost, faqItems: next });
                                      }}
                                      placeholder="Patient search question (e.g. How many sessions are needed?)..."
                                      className="w-full bg-transparent text-base sm:text-lg font-serif font-medium text-luxury-text focus:outline-none placeholder:text-slate-400"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingPost({
                                          ...editingPost,
                                          faqItems: editingPost.faqItems?.filter(
                                            (_, i) => i !== fIdx
                                          ),
                                        })
                                      }
                                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                                      title="Remove FAQ item"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <textarea
                                    rows={2}
                                    value={faq.answer}
                                    onChange={(e) => {
                                      const next = [...(editingPost.faqItems || [])];
                                      next[fIdx] = { ...next[fIdx], answer: e.target.value };
                                      setEditingPost({ ...editingPost, faqItems: next });
                                    }}
                                    placeholder="Direct, authoritative clinical answer for Google FAQ rich results..."
                                    className="w-full bg-transparent text-sm sm:text-base text-luxury-subtext font-light leading-relaxed focus:outline-none resize-none placeholder:text-slate-400"
                                  />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Bottom Quick-Insert Block Bar for smooth long-article editing */}
                        <div className="pt-3 border-t border-dashed border-[#e8dcc8] flex flex-wrap items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleAddHeadingSection}
                            className="px-2.5 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f3ede2] border border-[#e8dcc8] text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Heading2 className="h-3.5 w-3.5" />
                            <span>+ Section</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('paragraph')}
                            className="px-2.5 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f3ede2] border border-[#e8dcc8] text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <AlignLeft className="h-3.5 w-3.5" />
                            <span>+ Paragraph</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('image')}
                            className="px-2.5 py-1.5 rounded-lg bg-[#003334]/5 hover:bg-[#003334]/10 border border-[#003334]/25 text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>+ Image</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('bullets')}
                            className="px-2.5 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f3ede2] border border-[#e8dcc8] text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <List className="h-3.5 w-3.5" />
                            <span>+ Takeaway</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('callout')}
                            className="px-2.5 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f3ede2] border border-[#e8dcc8] text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Quote className="h-3.5 w-3.5" />
                            <span>+ Quote</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleAddFaq}
                            className="px-2.5 py-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#f3ede2] border border-[#e8dcc8] text-[11px] font-semibold text-[#003334] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>+ FAQ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -----------------------------------------------------------------
                    TAB 2: MEDIA (Drag-and-drop WebP Uploader + Required Image Alt Text)
                    ----------------------------------------------------------------- */}
                {composerTab === 'media' && (
                  <div className="space-y-4">
                    {/* Drag & Drop Cover Uploader */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingOverMedia(true);
                      }}
                      onDragLeave={() => setIsDraggingOverMedia(false)}
                      onDrop={handleCoverDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`aspect-[16/9] w-full max-w-lg mx-auto rounded-2xl overflow-hidden border-2 border-dashed transition-all relative cursor-pointer group ${
                        isDraggingOverMedia
                          ? 'border-[#003334] bg-[#003334]/5 scale-[1.01]'
                          : 'border-slate-300 hover:border-[#003334] bg-[#faf8f5]'
                      }`}
                    >
                      <BlogCardThumbnail
                        src={editingPost.image}
                        alt={editingPost.imageAlt || editingPost.title || 'Cover preview'}
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                        <Upload className="h-6 w-6 text-[#c5a880] mb-1.5" />
                        <span className="text-xs font-semibold">
                          Drag & drop cover image here, or click to browse
                        </span>
                        <span className="text-[10px] text-white/80 mt-0.5">
                          Auto-optimizes & saves as .webp in /public/assets/blog/
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingCover}
                        className="inline-flex items-center gap-1.5 bg-[#003334] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="h-3.5 w-3.5 text-[#c5a880]" />
                        <span>
                          {isUploadingCover ? 'Converting to WebP...' : 'Upload Cover (.webp)'}
                        </span>
                      </button>
                      {editingPost.image && (
                        <button
                          type="button"
                          onClick={() => setEditingPost({ ...editingPost, image: '' })}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          Use Clinic Logo Fallback
                        </button>
                      )}
                    </div>

                    {/* Required Image Alt Text Input for Google Image Search Ranking */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Image Alt Text (Required for Google Image Search)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const kw =
                              editingPost.focusKeywords?.[0] ||
                              editingPost.category ||
                              'Clinical Aesthetic Protocol';
                            setEditingPost({
                              ...editingPost,
                              imageAlt: `${editingPost.title || kw} — ${
                                editingPost.category || 'Specialist Care'
                              } at Age Reversal Clinic`,
                            });
                          }}
                          className="text-[10px] font-semibold text-[#003334] hover:underline cursor-pointer"
                        >
                          Auto-generate from Title & Keyword
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editingPost.imageAlt || ''}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, imageAlt: e.target.value })
                        }
                        placeholder="e.g. HydraFacial MD platinum skin resurfacing session at Age Reversal Clinic Lagos..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#003334]"
                      />
                    </div>
                  </div>
                )}

                {/* -----------------------------------------------------------------
                    TAB 3: SEO & SEARCH RANKING
                    ----------------------------------------------------------------- */}
                {composerTab === 'seo' && renderSeoWorkspacePanel()}
              </div>

              {/* Modal Footer */}
              <div className="px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSaveComposerPost('draft')}
                  disabled={isSavingPost}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Save Draft
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsComposerOpen(false);
                      setEditingPost(null);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveComposerPost('published')}
                    disabled={isSavingPost}
                    className="px-4 py-2 rounded-xl bg-[#003334] hover:bg-[#16494a] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5 text-[#c5a880]" />
                    <span>{isSavingPost ? 'Saving...' : 'Publish & Save'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          4B. DEDICATED SEO & SEARCH RANKING DRAWER / MOBILE BOTTOM-SHEET MODAL
          (Opened directly from Card SEO Badge or ••• -> SEO & Search Settings)
          ===================================================================== */}
      <AnimatePresence>
        {isSeoDrawerOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 40, y: 20 }}
              className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:max-h-none sm:h-full rounded-t-3xl sm:rounded-none sm:rounded-l-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Mobile Swipe Handle */}
              <div className="sm:hidden pt-2.5 pb-1 bg-slate-50 flex justify-center">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* Drawer Header */}
              <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003334]">
                    <Globe className="h-4 w-4 text-[#c5a880]" />
                    <span>SEO & Search Ranking Studio</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {editingPost.title || 'Untitled Post'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSeoDrawerOpen(false);
                      setComposerTab('write');
                      setIsComposerOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Full Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSeoDrawerOpen(false);
                      setEditingPost(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-5 overflow-y-auto flex-1">{renderSeoWorkspacePanel()}</div>

              {/* Drawer Footer */}
              <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSeoDrawerOpen(false);
                    setEditingPost(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveComposerPost()}
                  disabled={isSavingPost}
                  className="px-4 py-2 rounded-xl bg-[#003334] hover:bg-[#16494a] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5 text-[#c5a880]" />
                  <span>{isSavingPost ? 'Saving SEO...' : 'Save SEO Settings'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          4C. MOBILE BOTTOM MODALS / QUICK PICKERS
          1. Category & Tag Selection Bottom Sheet
          2. Author / Medical Reviewer (E-E-A-T) Bottom Sheet
          3. Status & Publish Date Picker Bottom Sheet
          ===================================================================== */}
      <AnimatePresence>
        {activeQuickPicker && editingPost && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) setActiveQuickPicker(null);
              }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[82vh] flex flex-col"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />

              {/* PICKER 1: CATEGORY & TAG SELECTION */}
              {activeQuickPicker === 'category' && (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#003334]">
                        Category & Journal Feed
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Select article feed and primary clinical category
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveQuickPicker(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Journal Feed Toggle */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                    {(
                      [
                        { id: 'news', label: 'Clinical News' },
                        { id: 'stories', label: 'Patient Stories' },
                      ] as const
                    ).map((feed) => (
                      <button
                        key={feed.id}
                        type="button"
                        onClick={() =>
                          setEditingPost({
                            ...editingPost,
                            type: feed.id,
                          })
                        }
                        className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          (editingPost.type || 'news') === feed.id
                            ? 'bg-white text-[#003334] shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {feed.label}
                      </button>
                    ))}
                  </div>

                  {/* Category Chips Grid */}
                  <div className="overflow-y-auto space-y-1.5 pr-1">
                    {CLINICAL_CATEGORIES.map((cat) => {
                      const selected = (editingPost.category || editingPost.tag) === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setEditingPost({
                              ...editingPost,
                              category: cat,
                              tag: cat,
                            });
                            setActiveQuickPicker(null);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            selected
                              ? 'bg-[#003334] text-white'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span>{cat}</span>
                          {selected && <Check className="h-3.5 w-3.5 text-[#c5a880]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Category Input */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Or custom category tag..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customCategoryInput.trim()) {
                          const clean = customCategoryInput.trim();
                          setEditingPost({
                            ...editingPost,
                            category: clean,
                            tag: clean,
                          });
                          setCustomCategoryInput('');
                          setActiveQuickPicker(null);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}

              {/* PICKER 2: AUTHOR / MEDICAL REVIEWER (GOOGLE E-E-A-T) */}
              {activeQuickPicker === 'author' && (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#003334]">
                        Clinical Author & Reviewer (E-E-A-T)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Link post to a clinic specialist for medical search authority
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveQuickPicker(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="overflow-y-auto space-y-2 pr-1">
                    {specialistAuthors.map((spec) => {
                      const selected = editingPost.author === spec.name;
                      return (
                        <button
                          key={spec.name}
                          type="button"
                          onClick={() => {
                            setEditingPost({
                              ...editingPost,
                              author: spec.name,
                            });
                            setActiveQuickPicker(null);
                          }}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                            selected
                              ? 'border-[#003334] bg-[#003334]/5'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-[#003334] text-[#c5a880] flex items-center justify-center font-serif font-bold text-xs shrink-0 overflow-hidden">
                              {spec.image ? (
                                <img
                                  src={spec.image}
                                  alt={spec.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                spec.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {spec.name}
                              </div>
                              <div className="text-[11px] font-medium text-[#003334] truncate">
                                {spec.role}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {spec.credentials}
                              </div>
                            </div>
                          </div>
                          {selected && <CheckCircle2 className="h-4 w-4 text-[#003334] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* PICKER 3: STATUS & PUBLISH DATE PICKER */}
              {activeQuickPicker === 'status-date' && (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#003334]">
                        Publication Status & Date
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Control visibility and structured publication timestamp
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveQuickPicker(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Status Segmented Picker */}
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          {
                            id: 'published',
                            label: 'Published',
                            desc: 'Live & indexed',
                            dot: 'bg-emerald-500',
                          },
                          {
                            id: 'draft',
                            label: 'Draft',
                            desc: 'Hidden from public',
                            dot: 'bg-amber-500',
                          },
                        ] as const
                      ).map((st) => {
                        const active = (editingPost.status || 'published') === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              setEditingPost({
                                ...editingPost,
                                status: st.id,
                              })
                            }
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              active
                                ? 'border-[#003334] bg-[#003334]/5'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                              <span>{st.label}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">{st.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Publish Date Input */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        value={
                          editingPost.publishedAt
                            ? editingPost.publishedAt.slice(0, 10)
                            : new Date().toISOString().slice(0, 10)
                        }
                        onChange={(e) => {
                          const rawVal = e.target.value;
                          if (!rawVal) return;
                          const parsed = new Date(`${rawVal}T12:00:00`);
                          if (!isNaN(parsed.getTime())) {
                            setEditingPost({
                              ...editingPost,
                              publishedAt: parsed.toISOString(),
                              date: parsed.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              }),
                            });
                          }
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                      />
                    </div>

                    {/* Reading Time Input */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Estimated Reading Time
                      </label>
                      <input
                        type="text"
                        value={editingPost.readingTime || ''}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, readingTime: e.target.value })
                        }
                        placeholder="e.g. 4 min read"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveQuickPicker(null)}
                      className="px-4 py-2 rounded-xl bg-[#003334] text-white text-xs font-semibold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          ARTICLE PREVIEW MODAL
          ===================================================================== */}
      <AnimatePresence>
        {previewArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-[#003334]">Article Preview</span>
                  <span>·</span>
                  <span>{previewArticle.readingTime || '4 min read'}</span>
                </div>
                <button
                  onClick={() => setPreviewArticle(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <div className="bg-[#fbf8f3] px-6 py-8 border-b border-slate-200">
                  <div className="max-w-3xl mx-auto space-y-3">
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-[#003334]">
                        {previewArticle.category || previewArticle.tag}
                      </span>
                      <span>·</span>
                      <span>{previewArticle.date}</span>
                      <span>·</span>
                      <span>{previewArticle.author}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-slate-900">
                      {previewArticle.title}
                    </h1>
                  </div>
                </div>
                <ArticleContent article={previewArticle} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
