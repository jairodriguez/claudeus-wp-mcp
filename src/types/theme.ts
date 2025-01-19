import { QueryParams } from '../api/base-client.js';

export interface ThemeFilters extends QueryParams {
    status?: 'active' | 'inactive' | 'parent';
    per_page?: number;
    page?: number;
    search?: string;
    [key: string]: string | number | boolean | Array<string | number> | null | undefined;
}

export interface ThemeAuthor {
    name: string;
    url?: string;
}

export interface ThemeScreenshot {
    url: string;
    width: number;
    height: number;
}

export interface ThemeData {
    name: string;
    version?: string;
    status?: 'active' | 'inactive' | 'parent';
    template?: string;
    description?: string;
    tags?: string[];
    theme_supports?: Record<string, any>;
    theme_uri?: string;
    author?: ThemeAuthor;
    author_uri?: string;
    screenshot?: ThemeScreenshot;
    description_raw?: string;
    requires_php?: string;
    requires_wp?: string;
    textdomain?: string;
    stylesheet?: string;
}

export interface Theme extends ThemeData {
    stylesheet: string;  // Theme's directory name
    template: string;    // Parent theme's directory name if this is a child theme
    _links: Record<string, any>;
}

export interface ThemeCustomization {
    custom_css?: string;
    settings?: Record<string, any>;
    mods?: Record<string, any>;
}

export interface ThemeCustomizationUpdate extends Record<string, unknown> {
    custom_css?: string;
    settings?: Record<string, unknown>;
    mods?: {
        add?: Record<string, unknown>;
        remove?: string[];
    };
} 