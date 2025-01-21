# Smithery Documentation

## Introduction

Smithery is a registry of Model Context Protocols (MCP) to help developers ship and find the right tools for agentic AI.

### Core Features

Smithery addresses this challenge by providing:
* A centralized hub for discovering and publishing MCP servers
* Standardized interfaces for tool integration and configs
* Community-driven protocol sharing and collaboration

## Model Context Protocol (MCP)

The Model Context Protocol (MCP) is an open protocol that enables seamless integration between LLMs and external data sources and tools. It is a universal standard for connecting AI systems with the context they need, eliminating information silos and fragmented integrations.

### Benefits

* Simplifies development and maintenance of agentic applications
* Provides a standard way to connect AI systems with data sources
* Makes it easier to build agents like intelligent IDEs, chat interfaces and custom AI workflows
* Eliminates need for custom implementations for each new data source
* Improves system maintainability and scalability

## CLI Tool

The Smithery CLI is a registry installer and manager for Model Context Protocol (MCP) servers, designed to be client-agnostic.

### Requirements

* NodeJS version 18 or above

### Installation & Usage

You can use the CLI tool directly with npx:
```bash
npx @smithery/cli <command>
```

### Available Commands

* `installed` - List installed servers (interactive browser)
* `install <server>` - Install a server
  * `--client <name>` - Specify LLM client (e.g. claude)
* `uninstall <server>` - Remove an installed server
* `view <server>` - Show server details
* `inspect` - Interactive server inspection tool

### Usage Examples

```bash
# Browse installed servers
npx @smithery/cli installed

# Install a server (defaults to --client claude)
npx @smithery/cli install mcp-obsidian

# Install for specific client
npx @smithery/cli install mcp-obsidian --client claude

# View server details
npx @smithery/cli view mcp-obsidian

# Remove a server
npx @smithery/cli uninstall mcp-obsidian

# Inspect installed servers
npx @smithery/cli inspect
```

### Important Notes

* Remember to restart Claude after uninstalling server
* Use the `inspect` command for interactive server testing
* Run without arguments to see the help menu

### Development Guide

If you want to contribute to the CLI tool:

1. Clone the repository:
```bash
git clone https://github.com/smithery-ai/cli
cd cli
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

#### Development Commands
```bash
# List all servers
npx . list

# Get details about a specific server
npx . get <server-id>

# Install a server
npx . install <server-name>
```

## TypeScript SDK

> ⚠️ The TypeScript SDK is currently in alpha and not recommended for production use yet.

The Smithery TypeScript SDK provides utilities to connect language models (LLMs) to Model Context Protocols (MCPs), enabling you to build agents that use resources and tools without being overwhelmed by JSON schemas.

### Key Features

* Connect to multiple MCPs with a single client
* Adapters to transform MCP responses for OpenAI and Anthropic clients
* Supports chaining tool calls until LLM completes

### Installation

```bash
npm install @smithery/sdk @modelcontextprotocol/sdk
```

### Basic Usage

Here's an example of connecting to an MCP server (using Exa search as an example):

```typescript
import { MultiClient } from "@smithery/sdk"
import { OpenAIChatAdapter } from "@smithery/sdk/integrations/llm/openai"
import { AnthropicChatAdapter } from "@smithery/sdk/integrations/llm/anthropic"
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js"
import { OpenAI } from "openai"
import Anthropic from "@anthropic-ai/sdk"
import EventSource from "eventsource"

// Patch event source for Node.js environment
global.EventSource = EventSource as any

// Create a new connection
const exaTransport = new SSEClientTransport(
  new URL("https://your-mcp-server.example.com/sse")
)

// Initialize a multi-client connection
const client = new MultiClient()
await client.connectAll({
  exa: exaTransport,
  // Add more connections here...
})

// Configure and authenticate
await client.clients.exa.request({
  method: "config",
  params: {
    config: {
      apiKey: process.env.EXA_API_KEY,
    },
  },
})
```

### Using with OpenAI

```typescript
// Initialize OpenAI client
const openai = new OpenAI()
const openaiAdapter = new OpenAIChatAdapter(client)

// Make a simple request
const openaiResponse = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "What AI events are happening in Singapore?" }],
  tools: await openaiAdapter.listTools(),
})
const openaiToolMessages = await openaiAdapter.callTool(openaiResponse)
```

### Advanced Usage: Conversation Loop

For complex interactions requiring multiple tool calls:

```typescript
let messages = [
  {
    role: "user",
    content: "What are some AI events happening in Singapore and how many days until the next one?",
  },
]
const adapter = new OpenAIChatAdapter(client)
let isDone = false

while (!isDone) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools: await adapter.listTools(),
  })
  
  // Handle tool calls
  const toolMessages = await adapter.callTool(response)

  // Append new messages
  messages.push(response.choices[0].message)
  messages.push(...toolMessages)
  isDone = toolMessages.length === 0
}
```

### Troubleshooting

#### EventSource Error
If you encounter this error:
```
Error: ReferenceError: EventSource is not defined
```

Install the required packages:
```bash
npm install eventsource
npm install -D @types/eventsource
```

Then patch the global EventSource object:
```typescript
import EventSource from "eventsource"
global.EventSource = EventSource as any
```

## Deployments

> Note: Deployments is in early preview and we're rapidly improving it. Please report bugs to our Discord!

Smithery Deployments allow you to host your STDIO MCP server as a server-side event (SSE) server on Smithery.

### Benefits of Hosting

* Smithery will show an MCP playground on your server page, allowing users to try your tool calls before installing
* Clients can use your server without needing to install dependencies
* Smithery will rank hosted servers higher in search results

### Deployment Process

1. Add your server to Smithery (or claim it if it's already listed)
2. Connect the server with your Github repository
3. Commit a Dockerfile and `smithery.yaml` to your connected repository
4. Click Deploy on Smithery Deployments tab on your server page (_only authenticated server owners can see this tab_)

### Required Files

#### 1. Dockerfile

Create a `Dockerfile` in your repository root that defines how to build your MCP server. Your Dockerfile should be created such that running your Docker image will start your STDIO server.

Example Dockerfile for a Node.js based MCP server:
```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production

# Make sure sh is available (required by Smithery)
RUN apk add --no-cache sh

# Start the STDIO server
CMD ["node", "dist/index.js"]
```

**Important Notes:**
- Only Linux Docker images on major distros (Alpine/Debian-based) are supported
- The container must have `sh` available
- Other distros are untested and may not deploy
- Use multi-stage builds to minimize image size
- Include only production dependencies in the final image

#### 2. smithery.yaml

Create a `smithery.yaml` file in your repository root. This file defines how your MCP server should be started.

Example `smithery.yaml` with configuration options:
```yaml
name: "Example MCP Server"
description: "An example MCP server with configuration options"
version: "1.0.0"

startCommand:
  type: stdio
  configSchema:
    type: object
    properties:
      PORT:
        type: number
        description: "Port number for the server"
        default: 3000
        minimum: 1024
        maximum: 65535
      DEBUG:
        type: boolean
        description: "Enable debug mode"
        default: false
      API_KEY:
        type: string
        description: "API key for external service"
    required: ["API_KEY"]
    additionalProperties: false

  commandFunction: |-
    (config) => {
      return {
        command: "node",
        args: ["dist/index.js"],
        env: {
          PORT: config.PORT?.toString() || "3000",
          DEBUG: config.DEBUG ? "true" : "false",
          API_KEY: config.API_KEY,
          MCP_STDIO: "true"
        },
        cwd: process.cwd()
      };
    }
```

The `startCommand` object consists of:
* `type: stdio`: Specifies that your repository is a standard I/O based MCP server
* `configSchema`: Defines the JSON Schema for your server's configuration options
  - Use proper JSON Schema validation rules
  - Include descriptive field descriptions
  - Set appropriate defaults where possible
  - Mark required fields
* `commandFunction`: A JavaScript function that returns the command and arguments to start your server
  - Returns an object with:
    - `command`: The executable to run
    - `args`: Array of command arguments
    - `env`: Environment variables
    - `cwd`: Working directory

### Subdirectories Support

For monorepos or packages not in the root directory:

1. Place `Dockerfile` and `smithery.yaml` in the package subdirectory
2. Set the base directory in server settings under Github integration
   * Example: For a server in `packages/mcp-server`, set base directory to `packages/mcp-server`

Example monorepo structure:
```
my-monorepo/
├── packages/
│   └── mcp-server/
│       ├── Dockerfile
│       ├── smithery.yaml
│       ├── package.json
│       └── src/
└── package.json
```

### Best Practices

1. **Testing**
   - Test your MCP server locally before deploying using MCP Inspector
   - Verify all configuration options work as expected
   - Test with different configuration combinations

2. **Configuration**
   - Use the `configSchema` to properly define and validate your server's configuration options
   - Include clear descriptions for all configuration fields
   - Set sensible defaults where appropriate
   - Mark sensitive fields (like API keys) as required

3. **Docker Optimization**
   - Use multi-stage builds to minimize image size
   - Include only production dependencies
   - Use appropriate base images (prefer Alpine for smaller size)
   - Remove unnecessary files and build artifacts

4. **Security**
   - Never include sensitive information in the Docker image
   - Use environment variables for secrets
   - Follow Docker security best practices
   - Regularly update dependencies

5. **Monitoring**
   - Implement health checks
   - Add appropriate logging
   - Monitor server performance
   - Set up alerts for critical issues

## Project Maintainers

### Henry Mao
* Lead maintainer

### Henry Wu
* GitHub: @calclavia

### Arjun Kumar
* GitHub: @arjunkmrm

## Resources

* GitHub: [Smithery GitHub](https://github.com/smithery-ai)
* Discord: [Smithery Discord](https://discord.gg/smithery)
* Documentation: [https://smithery.ai/docs](https://smithery.ai/docs)

---
*Note: This documentation is based on the available public information from Smithery.ai as of the documentation creation date. For the most up-to-date information, please visit [https://smithery.ai/docs](https://smithery.ai/docs)* 