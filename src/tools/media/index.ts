import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const mediaTools: Tool[] = [{
  name: 'claudeus_wp_media__get_media',
  description: 'Get a list of media items with optional filters',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      filters: {
        type: 'object',
        description: 'Optional filters for media query',
        required: false
      }
    },
    required: ['site']
  }
}, {
  name: 'claudeus_wp_media__upload',
  description: 'Upload a new media item',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      file: {
        type: 'string',
        description: 'Base64 encoded file content',
        required: true
      },
      filename: {
        type: 'string',
        description: 'Name of the file',
        required: true
      },
      data: {
        type: 'object',
        description: 'Additional media data',
        required: false
      }
    },
    required: ['site', 'file', 'filename']
  }
}, {
  name: 'claudeus_wp_media__update',
  description: 'Update an existing media item',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      id: {
        type: 'number',
        description: 'Media ID',
        required: true
      },
      data: {
        type: 'object',
        description: 'Updated media data',
        required: true
      }
    },
    required: ['site', 'id', 'data']
  }
}, {
  name: 'claudeus_wp_media__delete',
  description: 'Delete a media item',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      id: {
        type: 'number',
        description: 'Media ID',
        required: true
      },
      force: {
        type: 'boolean',
        description: 'Whether to bypass trash and force deletion',
        required: false
      }
    },
    required: ['site', 'id']
  }
}]; 