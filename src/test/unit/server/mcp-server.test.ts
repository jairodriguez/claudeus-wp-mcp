import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { McpServer } from '../../../mcp/server.js';
import { TestTransport, JsonRpcMessage } from '../../utils/test-transport.js';

describe('MCP Server 🤘', () => {
let server: McpServer;
let transport: TestTransport;

    beforeEach(async () => {
        server = new McpServer('test', '1.0.0');
    transport = new TestTransport();
    transport.setServer(server);
        await server.getServer().connect(transport);
        await transport.start();
});

afterEach(async () => {
    await transport.close();
});

test('server initialization', async () => {
        const TIMEOUT = 1500;

try {
    const responsePromise = new Promise<JsonRpcMessage>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
                    reject(new Error('🔥 TIMEOUT: Server response took too long to shred! 🔥'));
    }, TIMEOUT);

    const messageHandler = (msg: JsonRpcMessage) => {
        if (msg.id === 1) {
        clearTimeout(timeoutId);
        resolve(msg);
        }
    };

    transport.on('response', messageHandler);
    });

    // Send initialize request
    const initMessage: JsonRpcMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
        capabilities: {
        prompts: { listChanged: true },
        tools: { listChanged: true },
        resources: { listChanged: true }
        }
    }
    };

    transport.emit('message', initMessage);

    const response = await responsePromise;

    expect(response).toBeTruthy();
    expect(response).toMatchObject({
    jsonrpc: '2.0',
    id: 1,
    result: {
        capabilities: expect.any(Object)
    }
    });
} catch (error) {
            throw new Error(`🔥 SERVER INITIALIZATION FAILED: ${error instanceof Error ? error.message : String(error)} 🔥`);
        }
    });

    test('server shutdown', async () => {
        const TIMEOUT = 1500;

        try {
            // Initialize the server first
            await new Promise<void>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('🔥 TIMEOUT: Initialization took too long to ignite! 🔥'));
                }, TIMEOUT);

                const initHandler = (msg: JsonRpcMessage) => {
                    if (msg.id === 1) {
                        clearTimeout(timeoutId);
                        transport.off('response', initHandler);
                        resolve();
                    }
                };

                transport.on('response', initHandler);

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'initialize',
                    params: {
                        capabilities: {
                            prompts: { listChanged: true },
                            tools: { listChanged: true },
                            resources: { listChanged: true }
                        }
                    }
                });
            });

            // Set up response promise for shutdown
            const responsePromise = new Promise<JsonRpcMessage>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('🔥 TIMEOUT: Server shutdown took too long! 🔥'));
                }, TIMEOUT);

                const shutdownHandler = (msg: JsonRpcMessage) => {
                    if (msg.id === 2) {
                        clearTimeout(timeoutId);
                        transport.off('response', shutdownHandler);
                        resolve(msg);
                    }
                };

                transport.on('response', shutdownHandler);

                // Send shutdown request
                const shutdownMessage: JsonRpcMessage = {
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'shutdown',
                    params: {}
                };

                transport.emit('message', shutdownMessage);
            });

            const response = await responsePromise;

            // Wait for transport to fully process shutdown
            await new Promise(resolve => setTimeout(resolve, 200));

            // Verify shutdown response
            expect(response).toBeTruthy();
            expect(response).toMatchObject({
                jsonrpc: '2.0',
                id: 2,
                result: { success: true }
            });

            // Verify transport state
            expect(transport.isConnected()).toBe(false);
        } catch (error) {
            throw new Error(`🔥 SERVER SHUTDOWN FAILED: ${error instanceof Error ? error.message : String(error)} 🔥`);
        }
    });

    describe('error handling', () => {
        test('handles invalid message format', async () => {
            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);
            });

            // Send invalid message
            transport.emit('message', {
                id: 3,
                method: 'test'
                // Missing jsonrpc version
            });

            const response = await responsePromise;
            expect(response).toMatchObject({
                jsonrpc: '2.0',
                id: 3,
                error: {
                    code: -32600,
                    message: expect.stringContaining('Invalid Request')
                }
            });
        });

        test('handles unknown method', async () => {
            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);
            });

            // Send unknown method
            transport.emit('message', {
                jsonrpc: '2.0',
                id: 4,
                method: 'nonexistentMethod'
            });

            const response = await responsePromise;
            expect(response).toMatchObject({
                jsonrpc: '2.0',
                id: 4,
                error: {
                    code: -32601,
                    message: expect.stringContaining('Method not found')
                }
            });
        });

        test('handles invalid parameters', async () => {
            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);
            });

            // Send initialize with invalid capabilities
            transport.emit('message', {
                jsonrpc: '2.0',
                id: 5,
                method: 'initialize',
                params: {
                    capabilities: 'invalid'  // Should be an object
                }
            });

            const response = await responsePromise;
            expect(response).toMatchObject({
                jsonrpc: '2.0',
                id: 5,
                error: {
                    code: -32602,
                    message: expect.stringContaining('Invalid params')
                }
            });
        });

        test('handles server error', async () => {
            // Set up response promise before any transport operations
            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);
            });

            // Send shutdown without initialization - should trigger error
            transport.emit('message', {
                jsonrpc: '2.0',
                id: 6,
                method: 'shutdown'
            });

            const response = await responsePromise;
            expect(response).toMatchObject({
                jsonrpc: '2.0',
                id: 6,
                error: {
                    code: -32603,
                    message: expect.stringContaining('Cannot shutdown before initialization')
                }
            });
        }, 1500);
    });

    describe('connection state', () => {
        test('manages connection state correctly', async () => {
            // Test initial state after setup
            expect(transport.isConnected()).toBe(true);
            expect(transport.isInitialized()).toBe(false);

            // Test after initialization
            const responsePromise = new Promise<void>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    if (msg.id === 9) {
                        transport.off('response', handler);
                        resolve();
                    }
                };
                transport.on('response', handler);

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 9,
                    method: 'initialize',
                    params: {
                        capabilities: {
                            prompts: { listChanged: true },
                            tools: { listChanged: true },
                            resources: { listChanged: true }
                        }
                    }
                });
            });

            await responsePromise;
            expect(transport.isConnected()).toBe(true);
            expect(transport.isInitialized()).toBe(true);
        });

        test('handles notifications (messages without id)', async () => {
            let notificationReceived = false;
            transport.onMessage = (msg) => {
                if (msg.method === 'testNotification') {
                    notificationReceived = true;
                }
            };

            transport.emit('message', {
                jsonrpc: '2.0',
                method: 'testNotification',
                params: { data: 'test' }
            });

            await new Promise(resolve => setTimeout(resolve, 100));
            expect(notificationReceived).toBe(true);
        });
    });

    describe('protocol compliance', () => {
        test('validates protocol version', async () => {
            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);

                transport.emit('message', {
                    jsonrpc: '1.0',  // Invalid version
                    id: 7,
                    method: 'initialize',
                    params: {
                        capabilities: {}
                    }
                });
            });

            const response = await responsePromise;
            expect(response).toMatchObject({
                jsonrpc: '2.0',
                id: 7,
                error: {
                    code: -32600,
                    message: expect.stringContaining('Invalid Request')
                }
            });
        }, 1500);

        test('negotiates capabilities correctly', async () => {
            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 8,
                    method: 'initialize',
                    params: {
                        capabilities: {
                            prompts: { listChanged: true },
                            tools: { listChanged: false },  // Different from server capability
                            resources: { listChanged: true }
                        }
                    }
                });
            });

            const response = await responsePromise;
            expect(response).toMatchObject({
                jsonrpc: '2.0',
                id: 8,
                result: {
                    capabilities: {
                        prompts: { listChanged: true },
                        tools: { listChanged: true },    // Server's actual capability
                        resources: { listChanged: true }
                    }
                }
            });
        }, 1500);
    });

    describe('message handling', () => {
        test('handles concurrent messages correctly', async () => {
            const responses: JsonRpcMessage[] = [];
            const responsePromise = new Promise<void>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    responses.push(msg);
                    if (responses.length === 2) {
                        transport.off('response', handler);
                        resolve();
                    }
                };
                transport.on('response', handler);

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 10,
                    method: 'nonexistentMethod1'
                });

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 11,
                    method: 'nonexistentMethod2'
                });
            });

            await responsePromise;
            expect(responses).toHaveLength(2);
            expect(responses[0].id).toBe(10);
            expect(responses[1].id).toBe(11);
            expect(responses[0].error?.code).toBe(-32601);
            expect(responses[1].error?.code).toBe(-32601);
        }, 1500);
    });

    describe('connection recovery', () => {
        test('handles unexpected disconnection', async () => {
            // Initialize server first
            const initPromise = new Promise<void>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    if (msg.id === 1) {
                        transport.off('response', handler);
                        resolve();
                    }
                };
                transport.on('response', handler);

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'initialize',
                    params: {
                        capabilities: {
                            prompts: { listChanged: true },
                            tools: { listChanged: true },
                            resources: { listChanged: true }
                        }
                    }
                });
            });

            await initPromise;

            // Simulate unexpected disconnection
            await transport.close();
            expect(transport.isConnected()).toBe(false);

            // Test reconnection
            await transport.start();
            expect(transport.isConnected()).toBe(true);
            expect(transport.isInitialized()).toBe(false); // Should require re-initialization
        });

        test('preserves state during reconnection', async () => {
            const responses: JsonRpcMessage[] = [];
            const responsePromise = new Promise<void>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    responses.push(msg);
                    if (responses.length === 2) {
                        transport.off('response', handler);
                        resolve();
                    }
                };
                transport.on('response', handler);
            });

            // First initialization
            transport.emit('message', {
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    capabilities: {
                        prompts: { listChanged: true },
                        tools: { listChanged: true },
                        resources: { listChanged: true }
                    }
                }
            });

            // Wait for first response
            await new Promise(resolve => setTimeout(resolve, 100));

            // Simulate disconnect and reconnect
            await transport.close();
            await transport.start();

            // Second initialization
            transport.emit('message', {
                jsonrpc: '2.0',
                id: 2,
                method: 'initialize',
                params: {
                    capabilities: {
                        prompts: { listChanged: true },
                        tools: { listChanged: true },
                        resources: { listChanged: true }
                    }
                }
            });

            // Wait for responses with a reasonable timeout
            await Promise.race([
                responsePromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for responses')), 1000))
            ]);

            // Verify responses
            expect(responses.length).toBe(2);
            expect(responses[0].id).toBe(1);
            expect(responses[1].id).toBe(2);
            expect(responses[0].result).toBeDefined();
            expect(responses[1].result).toBeDefined();
        }, 1500); // Set explicit test timeout
    });

    describe('message queue handling', () => {
        test('maintains message order under load', async () => {
            const responses: JsonRpcMessage[] = [];
            const messageCount = 5;
            
            // Set up response collection
            transport.on('response', (msg) => responses.push(msg));

            // Send multiple messages rapidly
            for (let i = 1; i <= messageCount; i++) {
                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: i,
                    method: 'nonexistentMethod',
                    params: { sequence: i }
                });
            }

            // Wait for all responses
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify order
            expect(responses).toHaveLength(messageCount);
            responses.forEach((response, index) => {
                expect(response.id).toBe(index + 1);
            });
        });

        test('handles messages during reconnection', async () => {
            const responses: JsonRpcMessage[] = [];
            transport.on('response', (msg) => responses.push(msg));

            // Initialize
            await transport.emit('message', {
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    capabilities: {
                        prompts: { listChanged: true },
                        tools: { listChanged: true },
                        resources: { listChanged: true }
                    }
                }
            });

            // Simulate disconnect during message processing
            await transport.close();

            // Try to send message while disconnected
            try {
                await transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'nonexistentMethod'
                });
            } catch (error) {
                expect(error instanceof Error).toBe(true);
                expect((error as Error).message).toContain('Transport not connected');
            }

            // Reconnect and verify state
            await transport.start();
            expect(transport.isConnected()).toBe(true);
            expect(transport.isInitialized()).toBe(false);
        });
    });

    describe('capability negotiation edge cases', () => {
        test('handles partial capability matches', async () => {
            const response = await new Promise<JsonRpcMessage>((resolve) => {
                transport.on('response', resolve);
                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'initialize',
                    params: {
                        capabilities: {
                            prompts: { listChanged: true },
                            tools: { listChanged: false },  // Different from server
                            resources: { unknownFeature: true }  // Unknown capability
                        }
                    }
                });
            });

            expect(response.result).toBeTruthy();
            const capabilities = (response.result as Record<string, unknown>).capabilities as Record<string, unknown>;
            expect(capabilities.prompts).toBeTruthy();
            expect(capabilities.tools).toBeTruthy();
            expect(capabilities.resources).toBeTruthy();
        });

        test('rejects invalid capability format', async () => {
            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'initialize',
                    params: {
                        capabilities: []  // Invalid format (array instead of object)
                    }
                });
            });

            const response = await responsePromise;
            expect(response.error).toBeTruthy();
            expect(response.error?.code).toBe(-32602);
            expect(response.error?.message).toContain('Invalid params');
        });
    });

    describe('resource management 💪', () => {
        test('cleans up event listeners after multiple reconnections', async () => {
            const reconnectCount = 5;
            const initialListenerCount = transport.listenerCount('response');

            for (let i = 0; i < reconnectCount; i++) {
                // Initialize
                const initPromise = new Promise<void>((resolve) => {
                    const handler = (msg: JsonRpcMessage) => {
                        if (msg.id === i + 1) {
                            transport.off('response', handler);
                            resolve();
                        }
                    };
                    transport.on('response', handler);

                    transport.emit('message', {
                        jsonrpc: '2.0',
                        id: i + 1,
                        method: 'initialize',
                        params: {
                            capabilities: {
                                prompts: { listChanged: true },
                                tools: { listChanged: true },
                                resources: { listChanged: true }
                            }
                        }
                    });
                });

                await initPromise;
                await transport.close();
                await transport.start();
            }

            // Verify no listener leaks
            expect(transport.listenerCount('response')).toBe(initialListenerCount);
            expect(transport.listenerCount('message')).toBe(1); // Only the base message handler
        });

        test('handles large messages within size limits', async () => {
            const largeCapabilities = {
                prompts: { listChanged: true },
                tools: { listChanged: true },
                resources: { listChanged: true },
                // Add large nested object
                extended: Array(100).fill(0).reduce((acc, _, i) => {
                    acc[`feature${i}`] = {
                        enabled: true,
                        config: { value: 'x'.repeat(100) }
                    };
                    return acc;
                }, {} as Record<string, unknown>)
            };

            const responsePromise = new Promise<JsonRpcMessage>((resolve) => {
                const handler = (msg: JsonRpcMessage) => {
                    transport.off('response', handler);
                    resolve(msg);
                };
                transport.on('response', handler);

                transport.emit('message', {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'initialize',
                    params: { capabilities: largeCapabilities }
                });
            });

            const response = await responsePromise;
            expect(response.error).toBeUndefined();
            expect(response.result).toBeDefined();
        });

        test('maintains performance under repeated reconnections', async () => {
            const iterations = 10;
            const timings: number[] = [];

            for (let i = 0; i < iterations; i++) {
                const startTime = Date.now();
                
                // Initialize
                const initPromise = new Promise<void>((resolve) => {
                    const handler = (msg: JsonRpcMessage) => {
                        if (msg.id === i + 1) {
                            transport.off('response', handler);
                            resolve();
                        }
                    };
                    transport.on('response', handler);

                    transport.emit('message', {
                        jsonrpc: '2.0',
                        id: i + 1,
                        method: 'initialize',
                        params: {
                            capabilities: {
                                prompts: { listChanged: true },
                                tools: { listChanged: true },
                                resources: { listChanged: true }
                            }
                        }
                    });
                });

                await initPromise;
                await transport.close();
                await transport.start();

                timings.push(Date.now() - startTime);
            }

            // Calculate performance metrics
            const avgTime = timings.reduce((a, b) => a + b) / timings.length;
            const maxTime = Math.max(...timings);

            // Verify performance remains consistent
            expect(avgTime).toBeLessThan(100); // Average reconnection should be fast
            expect(maxTime).toBeLessThan(200); // Even worst case should be reasonable
        });
});
}); 