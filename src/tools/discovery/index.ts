import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const discoveryTools: Tool[] = [{
  name: 'claudeus_wp_discover_endpoints',
  description: 'Discover available WordPress REST API endpoints',
  inputSchema: {
    type: 'object',
    required: [],
    properties: {
      site: { 
        type: 'string', 
        description: 'Site alias (defaults to default_test)',
        default: 'default_test'
      }
    }
  }
}]; 