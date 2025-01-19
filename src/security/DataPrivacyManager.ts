import { ConsentType, Operation, SecurityConfig } from '../types/security.js';
import { UserConsentManager } from './UserConsentManager.js';

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

export class DataPrivacyManager {
    constructor(
        private readonly consentManager: UserConsentManager,
        private readonly config: SecurityConfig
    ) {}

    async exposeResource(resource: Resource, context?: Context): Promise<boolean> {
        const operation: Operation = {
            type: ConsentType.DATA_ACCESS,
            description: `Access resource: ${resource.type}`,
            resource: String(resource.id),
            params: { context }
        };

        const hasConsent = await this.consentManager.requestConsent(operation, context);
        if (!hasConsent) {
            return false;
        }

        if (this.config.privacyControls.maskSensitiveData) {
            resource = this.maskSensitiveData(resource);
        }

        return true;
    }

    maskSensitiveData<T extends Record<string, unknown>>(data: T): T {
        if (!data) return data;

        // Deep clone to avoid modifying original
        const masked = JSON.parse(JSON.stringify(data)) as T;

        // Mask sensitive fields
        const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth'];
        this.recursiveMask(masked, sensitiveFields);

        return masked;
    }

    private recursiveMask(obj: Record<string, unknown>, sensitiveFields: string[]): void {
        if (typeof obj !== 'object' || obj === null) return;

        for (const key in obj) {
            if (sensitiveFields.includes(key.toLowerCase())) {
                obj[key] = '***MASKED***';
            } else if (typeof obj[key] === 'object') {
                this.recursiveMask(obj[key] as Record<string, unknown>, sensitiveFields);
            }
        }
    }

    async canShareExternally(_resource: Resource): Promise<boolean> {
        // TODO: Implement external sharing permission check
        return false;
    }
} 