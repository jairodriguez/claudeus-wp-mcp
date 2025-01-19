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

export interface PostData extends Record<string, unknown> {
    title: string;
    content: string;
    excerpt?: string;
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

export interface Post extends PostData {
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