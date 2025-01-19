import { BaseApiClient } from './base-client.js';
import { Block, BlockData, BlockFilters } from '../types/block.js';
import { Revision, Autosave } from '../types/post.js';

export class BlocksApiClient extends BaseApiClient {
    async getBlocks(filters?: BlockFilters): Promise<Block[]> {
        return this.get<Block[]>('/blocks', filters);
    }

    async createBlock(data: BlockData): Promise<Block> {
        return this.post<Block>('/blocks', data);
    }

    async updateBlock(id: number, data: Partial<BlockData>): Promise<Block> {
        return this.put<Block>(`/blocks/${id}`, data);
    }

    async deleteBlock(id: number): Promise<void> {
        return this.delete(`/blocks/${id}`);
    }

    async getBlockRevisions(id: number): Promise<Revision[]> {
        return this.get<Revision[]>(`/blocks/${id}/revisions`);
    }

    async getBlockAutosaves(id: number): Promise<Autosave[]> {
        return this.get<Autosave[]>(`/blocks/${id}/autosaves`);
    }
} 