import { Article } from '../types';

export interface BlogSectionConfigData {
  heading: string;
  description: string;
  updatedAt?: string;
}

export const BLOG_SECTION_CONFIG: BlogSectionConfigData = {
  "heading": "Latest News & Insights",
  "description": "Stay informed on the latest clinical advancements.",
  "updatedAt": "2026-11-07T14:22:15.032Z"
};

export const NEWS_ARTICLES: Article[] = [
  {
    "id": "news-1793980289624",
    "slug": "n",
    "type": "news",
    "status": "published",
    "title": "new",
    "description": "",
    "image": "",
    "imageAlt": "new — Face & Injectables at Age Reversal Clinic",
    "date": "November 6, 2026",
    "publishedAt": "2026-11-06T15:51:29.623Z",
    "updatedAt": "2026-11-06T15:51:44.483Z",
    "readingTime": "4 min read",
    "author": "Dr. Alistair Smith",
    "tag": "Face & Injectables",
    "category": "Face & Injectables",
    "seoTitle": "new | Age Reversal Clinic",
    "metaDescription": "new clinical insights at Age Reversal Clinic.",
    "focusKeywords": [],
    "canonicalUrl": "#article-news-1793980289624",
    "contentBlocks": [
      {
        "id": "block-1793980289624-1",
        "type": "h2",
        "headingLevel": "h2",
        "heading": ""
      },
      {
        "id": "block-1793980289624-2",
        "type": "paragraph",
        "text": ""
      }
    ],
    "faqItems": []
  },
  {
    "id": "news-1793979891666",
    "slug": "n",
    "type": "news",
    "status": "published",
    "title": "new blog",
    "description": "test new blog",
    "image": "/assets/blog/news-1793979891666.webp?v=1793979936902",
    "imageAlt": "new blog — Face & Injectables at Age Reversal Clinic",
    "date": "November 6, 2026",
    "publishedAt": "2026-11-06T15:44:51.665Z",
    "updatedAt": "2026-11-06T15:45:40.295Z",
    "readingTime": "4 min read",
    "author": "Dr. Alistair Smith",
    "tag": "Face & Injectables",
    "category": "Face & Injectables",
    "seoTitle": "new blog | Age Reversal Clinic",
    "metaDescription": "test new blog",
    "focusKeywords": [],
    "canonicalUrl": "#article-news-1793979891666",
    "contentBlocks": [
      {
        "id": "block-1793979891666-1",
        "type": "h2",
        "headingLevel": "h2",
        "heading": ""
      },
      {
        "id": "block-1793979891666-2",
        "type": "paragraph",
        "text": ""
      }
    ],
    "faqItems": []
  },
  {
    "id": "news-1793978477810",
    "slug": "h",
    "type": "news",
    "status": "published",
    "title": "hello world",
    "description": "hello world",
    "image": "",
    "imageAlt": "hello world — Face & Injectables at Age Reversal Clinic",
    "date": "November 6, 2026",
    "publishedAt": "2026-11-06T15:21:17.793Z",
    "updatedAt": "2026-11-06T15:21:42.190Z",
    "readingTime": "4 min read",
    "author": "Dr. Alistair Smith",
    "tag": "Face & Injectables",
    "category": "Face & Injectables",
    "seoTitle": "hello world | Age Reversal Clinic",
    "metaDescription": "hello world",
    "focusKeywords": [],
    "canonicalUrl": "#article-news-1793978477810",
    "contentBlocks": [
      {
        "id": "block-1793978477810-1",
        "type": "h2",
        "headingLevel": "h2",
        "heading": "hello world",
        "text": "hello world"
      },
      {
        "id": "block-1793978477810-2",
        "type": "paragraph",
        "text": ""
      }
    ],
    "faqItems": []
  }
];

export const STORY_ARTICLES: Article[] = [];
