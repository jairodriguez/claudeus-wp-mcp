import { ConsentType, Operation } from '../types/security.js';
import { UserConsentManager } from './UserConsentManager.js';

interface ToolValidationResult {
  valid: boolean;
  errors?: string[];
}

interface ToolExecutionResult<T = unknown> {
  success: boolean;
  result?: T;
  error?: Error;
}

interface ExecutionLogEntry {
  timestamp: string;
  type: string;
  operation: string;
  status: 'success' | 'failure';
  details: Record<string, unknown>;
  tool: string;
  params: Record<string, unknown>;
}

export class ToolSafetyController {
  private executionLog: ExecutionLogEntry[] = [];

  constructor(
    private readonly consentManager: UserConsentManager,
    private readonly rateLimiter: Map<string, number> = new Map()
  ) {}

  async validateToolExecution(
    tool: string,
    params: unknown
  ): Promise<ToolValidationResult> {
    // Check rate limiting
    if (this.isRateLimited(tool)) {
      return {
        valid: false,
        errors: ['Rate limit exceeded for this tool']
      };
    }

    // Check user consent
    const operation: Operation = {
      type: ConsentType.TOOL_EXECUTION,
      description: `Execute tool: ${tool}`,
      params: params as Record<string, unknown>
    };

    const hasConsent = await this.consentManager.requestConsent(operation);
    if (!hasConsent) {
      return {
        valid: false,
        errors: ['User consent not granted for tool execution']
      };
    }

    // Validate parameters
    const validationErrors = this.validateParameters(params);
    if (validationErrors.length > 0) {
      return {
        valid: false,
        errors: validationErrors
      };
    }

    return { valid: true };
  }

  async executeWithSafety<T = unknown>(
    tool: string,
    params: unknown,
    executor: () => Promise<T>
  ): Promise<ToolExecutionResult<T>> {
    try {
      // Validate before execution
      const validation = await this.validateToolExecution(tool, params);
      if (!validation.valid) {
        return {
          success: false,
          error: new Error(validation.errors?.join(', '))
        };
      }

      // Execute in try-catch
      const result = await executor();
      
      // Record successful execution
      this.logExecution(tool, params as Record<string, unknown>, true, undefined);
      
      return {
        success: true,
        result
      };
    } catch (error) {
      // Record failed execution
      this.logExecution(tool, params as Record<string, unknown>, false, error as Error);
      
      return {
        success: false,
        error: error as Error
      };
    }
  }

  private validateParameters(params: unknown): string[] {
    const errors: string[] = [];
    
    if (!params) {
      return errors;
    }

    // Add parameter validation logic here
    // Example: Check for dangerous commands, invalid paths, etc.
    
    return errors;
  }

  private isRateLimited(tool: string): boolean {
    const now = Date.now();
    const lastExecution = this.rateLimiter.get(tool) || 0;
    const minInterval = 1000; // 1 second minimum between executions
    
    if (now - lastExecution < minInterval) {
      return true;
    }
    
    this.rateLimiter.set(tool, now);
    return false;
  }

  private logExecution(tool: string, params: Record<string, unknown>, success: boolean, error?: Error): void {
    this.executionLog.push({
      timestamp: new Date().toISOString(),
      type: 'tool_execution',
      operation: 'execute',
      status: success ? 'success' : 'failure',
      details: {
        error: error?.message
      },
      tool,
      params
    });
  }

  getExecutionLog(): ExecutionLogEntry[] {
    return this.executionLog;
  }
} 