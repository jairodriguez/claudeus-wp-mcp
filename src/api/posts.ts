import { BaseApiClient } from './base-client.js';
import { Post, PostData, PostFilters, Revision, Autosave } from '../types/post.js';

export class PostsApiClient extends BaseApiClient {
    async getPosts(filters?: PostFilters): Promise<Post[]> {
        return this.get<Post[]>('/posts', filters);
    }

    async createPost(data: PostData): Promise<Post> {
        return this.post<Post>('/posts', data);
    }

    async updatePost(id: number, data: Partial<PostData>): Promise<Post> {
        return this.put<Post>(`/posts/${id}`, data);
    }

    async deletePost(id: number): Promise<void> {
        return this.delete(`/posts/${id}`);
    }

    async getPostRevisions(id: number): Promise<Revision[]> {
        return this.get<Revision[]>(`/posts/${id}/revisions`);
    }

    async getPostAutosaves(id: number): Promise<Autosave[]> {
        return this.get<Autosave[]>(`/posts/${id}/autosaves`);
    }
} 