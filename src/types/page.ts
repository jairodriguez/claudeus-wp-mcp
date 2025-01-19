import { QueryParams } from '../api/base-client.js';

export interface PageFilters extends QueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    author?: number;
    author_exclude?: number[];
    before?: string;
    exclude?: number[];
    include?: number[];
    menu_order?: number;
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: string;
    parent?: number[];
    parent_exclude?: number[];
    slug?: string[];
    status?: string;
    [key: string]: string | number | boolean | Array<string | number> | null | undefined;
}

export interface PageData extends Record<string, unknown> {
    title: string;
    content: string;
    author?: number;
    excerpt?: string;
    featured_media?: number;
    comment_status?: 'open' | 'closed';
    ping_status?: 'open' | 'closed';
    menu_order?: number;
    meta?: Record<string, any>;
    parent?: number;
    template?: string;
}

export interface Page extends PageData {
    id: number;
    date: string;
    date_gmt: string;
    guid: { rendered: string };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    _links: Record<string, any>;
} 