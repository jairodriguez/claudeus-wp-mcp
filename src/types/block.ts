import { QueryParams } from '../api/base-client.js';

export interface BlockFilters extends QueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: string;
    slug?: string[];
    status?: string;
    [key: string]: string | number | boolean | Array<string | number> | null | undefined;
}

export interface BlockData extends Record<string, unknown> {
    title: string;
    content: string;
    status?: 'publish' | 'draft';
    slug?: string;
    template?: string;
    meta?: Record<string, any>;
}

export interface Block extends BlockData {
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