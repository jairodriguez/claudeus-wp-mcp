export interface Tool {
    name: string;
    description: string;
    disabled?: boolean;
    status?: 'enabled' | 'disabled';  // For UI representation
    inputSchema: {
        type: string;
        required?: string[];
        properties?: Record<string, unknown>;
    };
}

export interface ListToolsResponse {
    tools: Tool[];
}

export interface CallToolResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
} 