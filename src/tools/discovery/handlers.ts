import { WordPressClient } from '../../wordpress-client.js';
import axios from 'axios';

export async function handleDiscoveryTools(name: string, args: Record<string, unknown>, client: WordPressClient) {
  switch (name) {
    case 'claudeus_wp_discover_endpoints': {
      const baseUrl = client.site.url;
      const response = await axios.get(`${baseUrl}/wp-json/`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
    default:
      throw new Error(`Unknown discovery tool: ${name}`);
  }
} 