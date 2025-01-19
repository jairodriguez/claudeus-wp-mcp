import { QueryParams } from '../api/base-client.js';

export interface MediaFilters extends QueryParams {
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
    parent?: number[];
    parent_exclude?: number[];
    slug?: string[];
    status?: string;
    media_type?: string;
    mime_type?: string;
    [key: string]: string | number | boolean | Array<string | number> | null | undefined;
}

export interface MediaData extends Record<string, unknown> {
    title?: string;
    caption?: string;
    alt_text?: string;
    description?: string;
    post?: number;
    author?: number;
    comment_status?: 'open' | 'closed';
    ping_status?: 'open' | 'closed';
    meta?: Record<string, any>;
}

export interface Media {
    id: number;
    date: string;
    date_gmt: string;
    guid: { rendered: string; raw?: string };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: { rendered: string; raw?: string };
    author: number;
    comment_status: string;
    ping_status: string;
    template: string;
    meta: Record<string, any>;
    description: { rendered: string; raw?: string };
    caption: { rendered: string; raw?: string };
    alt_text: string;
    media_type: string;
    mime_type: string;
    media_details: {
        width?: number;
        height?: number;
        file?: string;
        sizes?: Record<string, {
            file: string;
            width: number;
            height: number;
            mime_type: string;
            source_url: string;
        }>;
        image_meta?: {
            aperture?: string;
            credit?: string;
            camera?: string;
            caption?: string;
            created_timestamp?: string;
            copyright?: string;
            focal_length?: string;
            iso?: string;
            shutter_speed?: string;
            title?: string;
            orientation?: string;
            keywords?: string[];
        };
        length?: number;
        bitrate?: number;
        fileformat?: string;
        dataformat?: string;
    };
    post?: number;
    source_url: string;
    _links: Record<string, any>;
} 