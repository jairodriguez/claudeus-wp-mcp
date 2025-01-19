export enum ConsentType {
  DATA_ACCESS = 'DATA_ACCESS',
  CONTENT_MODIFICATION = 'CONTENT_MODIFICATION',
  TOOL_EXECUTION = 'TOOL_EXECUTION',
  LLM_SAMPLING = 'LLM_SAMPLING'
}

export interface Operation {
  type: ConsentType;
  description: string;
  resource?: string;
  params?: Record<string, unknown>;
}

export interface OperationResult {
  success: boolean;
  timestamp: Date;
  operation: Operation;
  error?: Error;
}

export interface SecurityConfig {
  requireExplicitConsent: boolean;
  auditEnabled: boolean;
  privacyControls: {
    maskSensitiveData: boolean;
    allowExternalDataSharing: boolean;
  };
}

export interface ConsentRequest {
  operation: Operation;
  context?: unknown;
  timestamp: Date;
}

export interface ConsentResponse {
  granted: boolean;
  timestamp: Date;
  expiresAt?: Date;
  restrictions?: string[];
} 