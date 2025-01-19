import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express, { Express, Response } from 'express';
import cors from 'cors';
import { toolCapabilities } from '../tools/index.js';

export class McpServer {
    private server: Server;
    private app: Express;

    constructor(name: string, version: string) {
        // Create server with proper initialization and all capabilities
        this.server = new Server(
            { name, version },
            {
                capabilities: {
                    prompts: {
                        listChanged: true
                    },
                    tools: {
                        listChanged: false
                    },
                    resources: {
                        listChanged: true
                    }
                }
            }
        );

        // Initialize express app for SSE
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
    }

    getServer(): Server {
        return this.server;
    }

    getApp(): Express {
        return this.app;
    }

    async connectStdio(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
    }

    async connectSSE(port: number = 4000, path: string = '/'): Promise<void> {
        this.app.get(path, (_, res: Response) => {
            const transport = new SSEServerTransport(path, res);
            this.server.connect(transport).catch(error => {
                console.error('Failed to connect transport:', error);
                res.status(500).end();
            });
        });

        await new Promise<void>((resolve) => {
            this.app.listen(port, () => {
                console.info(`Server listening on port ${port}`);
                resolve();
            });
        });
    }
} 