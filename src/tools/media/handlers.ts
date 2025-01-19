import { WordPressClient } from '../../wordpress-client.js';
import { MediaFilters, MediaData } from '../../types/index.js';

export async function handleMediaTools(name: string, args: Record<string, unknown>, client: WordPressClient) {
    switch (name) {
        case 'claudeus_wp_media__get_media': {
            const media = await client.get<any[]>('/wp/v2/media', args.filters as MediaFilters);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(media, null, 2)
                }]
            };
        }
        case 'claudeus_wp_media__upload': {
            const media = await client.post<any>('/wp/v2/media', args.data as MediaData);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(media, null, 2)
                }]
            };
        }
        case 'claudeus_wp_media__update': {
            const media = await client.put<any>(`/wp/v2/media/${args.id}`, args.data as Partial<MediaData>);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(media, null, 2)
                }]
            };
        }
        case 'claudeus_wp_media__delete': {
            await client.delete(`/wp/v2/media/${args.id}`);
            return {
                content: [{
                    type: "text",
                    text: "Media deleted successfully"
                }]
            };
        }
        default:
            throw new Error(`Unknown media tool: ${name}`);
    }
} 