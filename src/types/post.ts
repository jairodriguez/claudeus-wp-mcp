import { QueryParams } from '../api/base-client.js';

export interface PostFilters extends QueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    author?: number;
    author_exclude?: number[];
    before?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: string;
    slug?: string[];
    status?: string;
    categories?: number[];
    categories_exclude?: number[];
    tags?: number[];
    tags_exclude?: number[];
    sticky?: boolean;
    [key: string]: string | number | boolean | Array<string | number> | null | undefined;
}

// Input data for creating/updating posts
export interface PostData extends Record<string, unknown> {
    // These fields will be automatically wrapped in {raw: value} by the handler
    title: string;
    content: string;
    excerpt?: string;
    
    // Standard WordPress fields
    status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
    categories?: number[];
    tags?: number[];
    featured_media?: number;
    comment_status?: 'open' | 'closed';
    ping_status?: 'open' | 'closed';
    format?: string;
    meta?: Record<string, any>;
    sticky?: boolean;
    template?: string;
}

// WordPress API response format
export interface Post {
    id: number;
    date: string;
    date_gmt: string;
    guid: { rendered: string };
    modified: string;
    modified_gmt: string;
    slug: string;
    type: string;
    link: string;
    author: number;
    title: {
        raw?: string;
        rendered: string;
    };
    content: {
        raw?: string;
        rendered: string;
        protected?: boolean;
    };
    excerpt: {
        raw?: string;
        rendered: string;
        protected?: boolean;
    };
    status: string;
    categories?: number[];
    tags?: number[];
    featured_media?: number;
    comment_status: 'open' | 'closed';
    ping_status: 'open' | 'closed';
    format: string;
    meta: Record<string, any>;
    sticky: boolean;
    template: string;
    _links: Record<string, any>;
}

export interface Revision {
    id: number;
    author: number;
    date: string;
    date_gmt: string;
    parent: number;
    modified: string;
    modified_gmt: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    guid: { rendered: string };
}

export interface Autosave {
    id: number;
    author: number;
    date: string;
    date_gmt: string;
    parent: number;
    modified: string;
    modified_gmt: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    preview_link: string;
} 