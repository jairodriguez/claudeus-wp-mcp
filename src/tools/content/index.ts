import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const contentTools: Tool[] = [{
  name: 'claudeus_wp_content__get_posts',
  description: 'Get a list of posts with optional filters',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      filters: {
        type: 'object',
        description: 'Optional filters for posts query',
        required: false
      }
    },
    required: ['site']
  }
}, {
  name: 'claudeus_wp_content__create_post',
  description: 'Create a new post',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      data: {
        type: 'object',
        description: 'Post data',
        required: true
      }
    },
    required: ['site', 'data']
  }
}, {
  name: 'claudeus_wp_content__update_post',
  description: 'Update an existing post',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      id: {
        type: 'number',
        description: 'Post ID',
        required: true
      },
      data: {
        type: 'object',
        description: 'Updated post data',
        required: true
      }
    },
    required: ['site', 'id', 'data']
  }
}, {
  name: 'claudeus_wp_content__delete_post',
  description: 'Delete a post',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      id: {
        type: 'number',
        description: 'Post ID',
        required: true
      }
    },
    required: ['site', 'id']
  }
}, {
  name: 'claudeus_wp_content__get_post_revisions',
  description: 'Get revisions of a post',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      id: {
        type: 'number',
        description: 'Post ID',
        required: true
      }
    },
    required: ['site', 'id']
  }
}, {
  name: 'claudeus_wp_content__get_pages',
  description: 'Get a list of pages with optional filters',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      filters: {
        type: 'object',
        description: 'Optional filters for pages query',
        required: false
      }
    },
    required: ['site']
  }
}, {
  name: 'claudeus_wp_content__create_page',
  description: 'Create a new page',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      data: {
        type: 'object',
        description: 'Page data',
        required: true
      }
    },
    required: ['site', 'data']
  }
}, {
  name: 'claudeus_wp_content__update_page',
  description: 'Update an existing page',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      id: {
        type: 'number',
        description: 'Page ID',
        required: true
      },
      data: {
        type: 'object',
        description: 'Updated page data',
        required: true
      }
    },
    required: ['site', 'id', 'data']
  }
}, {
  name: 'claudeus_wp_content__delete_page',
  description: 'Delete a page',
  inputSchema: {
    type: 'object',
    properties: {
      site: { type: 'string', description: 'Site alias' },
      id: {
        type: 'number',
        description: 'Page ID',
        required: true
      }
    },
    required: ['site', 'id']
  }
}]; 