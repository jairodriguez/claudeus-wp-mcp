import { BaseApiClient } from './base-client.js';
import { Page, PageData, PageFilters } from '../types/page.js';
import { Revision, Autosave } from '../types/post.js';

export class PagesApiClient extends BaseApiClient {
    async getPages(filters?: PageFilters): Promise<Page[]> {
        return this.get<Page[]>('/pages', filters);
    }

    async createPage(data: PageData): Promise<Page> {
        const cleanData = { ...data };
        if (cleanData.template === undefined || cleanData.template === null) {
            delete cleanData.template;
        }
        return this.post<Page>('/pages', cleanData);
    }

    async updatePage(id: number, data: Partial<PageData>): Promise<Page> {
        const cleanData = { ...data };
        if (cleanData.template === undefined || cleanData.template === null) {
            delete cleanData.template;
        }
        return this.put<Page>(`/pages/${id}`, cleanData);
    }

    async deletePage(id: number): Promise<void> {
        return this.delete(`/pages/${id}`);
    }

    async getPageRevisions(id: number): Promise<Revision[]> {
        return this.get<Revision[]>(`/pages/${id}/revisions`);
    }

    async getPageAutosaves(id: number): Promise<Autosave[]> {
        return this.get<Autosave[]>(`/pages/${id}/autosaves`);
    }
} 