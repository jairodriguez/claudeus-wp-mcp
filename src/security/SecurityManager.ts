import { SecurityConfig, ConsentType, Operation } from '../types/security.js';
import { UserConsentManager } from './UserConsentManager.js';
import { DataPrivacyManager } from './DataPrivacyManager.js';
import { ToolSafetyController } from './ToolSafetyController.js';

interface Resource {
    id: string | number;
    type: string;
    [key: string]: unknown;
}

interface Context {
    userId?: string | number;
    operation?: string;
    [key: string]: unknown;
}

interface ExecutionResult<T = unknown> {
    success: boolean;
    result?: T;
    error?: Error;
}

interface AuditLogEntry {
    timestamp: string;
    type: string;
    operation: string;
    status: 'success' | 'failure';
    details: Record<string, unknown>;
}

export class SecurityManager {
    private readonly consentManager: UserConsentManager;
    private readonly privacyManager: DataPrivacyManager;
    private readonly toolController: ToolSafetyController;

    constructor(config: SecurityConfig) {
        this.consentManager = new UserConsentManager();
        this.privacyManager = new DataPrivacyManager(this.consentManager, config);
        this.toolController = new ToolSafetyController(this.consentManager);
    }

    // Resource Access Control
    async authorizeResourceAccess(resource: Resource, context?: Context): Promise<boolean> {
        return this.privacyManager.exposeResource(resource, context);
    }

    // Tool Execution Control
    async authorizeToolExecution(
        tool: string,
        params: Record<string, unknown>
    ): Promise<boolean> {
        const validation = await this.toolController.validateToolExecution(tool, params);
        return validation.valid;
    }

    async executeToolSafely<T = unknown>(
        tool: string,
        params: Record<string, unknown>,
        executor: () => Promise<T>
    ): Promise<ExecutionResult<T>> {
        return this.toolController.executeWithSafety(tool, params, executor);
    }

    // Data Privacy Control
    maskSensitiveData<T extends Record<string, unknown>>(data: T): T {
        return this.privacyManager.maskSensitiveData(data);
    }

    // Consent Management
    async requestConsent(operation: Operation, context?: Context): Promise<boolean> {
        return this.consentManager.requestConsent(operation, context);
    }

    async canShareExternally(resource: Resource): Promise<boolean> {
        return this.privacyManager.canShareExternally(resource);
    }

    hasConsent(type: ConsentType): boolean {
        return this.consentManager.hasConsent(type);
    }

    // Audit & Logging
    getConsentAuditLog(): Array<AuditLogEntry> {
        return this.consentManager.getAuditLog();
    }

    getToolExecutionLog(): Array<AuditLogEntry> {
        return this.toolController.getExecutionLog();
    }
} 