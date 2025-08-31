export class CamundaValidationError extends Error {
  side: 'request' | 'response';
  operationId?: string;
  summary: string;
  issues: string[];
  constructor(params: { side: 'request' | 'response'; operationId?: string; message: string; summary: string; issues: string[] }) {
    super(params.message);
    this.name = 'CamundaValidationError';
    this.side = params.side;
    this.operationId = params.operationId;
    this.summary = params.summary;
    this.issues = params.issues;
  }
}