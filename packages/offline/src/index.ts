export interface SyncEnvelope<T = unknown> {
  clientOperationId: string;
  entityType: string;
  entityId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: T;
  createdAt: string;
}

export interface OfflineStore {
  enqueue<T>(item: SyncEnvelope<T>): Promise<void>;
  listPending(): Promise<SyncEnvelope[]>;
}

// TODO: implement IndexedDB-backed queue with deterministic ordering,
// retries, conflict handling, backoff and exactly-once server application.
