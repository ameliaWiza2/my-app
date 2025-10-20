import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiClient from '../ApiClient';
import { BloodPressureEntry, FetalMovementEntry, HealthMetrics, NoteEntry, UUID, WeightEntry, emptyMetrics, sortByDateDesc } from './health';

export type StorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const DefaultStorage: StorageAdapter = {
  getItem: (k: string) => AsyncStorage.getItem(k),
  setItem: (k: string, v: string) => AsyncStorage.setItem(k, v),
  removeItem: (k: string) => AsyncStorage.removeItem(k),
};

export type MetricType = 'weight' | 'bloodPressure' | 'fetalMovement' | 'notes';

export type PendingOperation =
  | { type: 'create'; metric: MetricType; entry: any }
  | { type: 'update'; metric: MetricType; id: UUID; patch: any }
  | { type: 'delete'; metric: MetricType; id: UUID };

export class HealthMetricsService {
  private storage: StorageAdapter;
  private outboxKey = 'health:outbox';
  private cacheKey = 'health:metrics';

  constructor(storage: StorageAdapter = DefaultStorage) {
    this.storage = storage;
  }

  async getCachedMetrics(): Promise<HealthMetrics> {
    const raw = await this.storage.getItem(this.cacheKey);
    if (!raw) return emptyMetrics();
    try {
      const parsed = JSON.parse(raw) as HealthMetrics;
      return parsed;
    } catch {
      return emptyMetrics();
    }
  }

  private async setCached(metrics: HealthMetrics): Promise<void> {
    await this.storage.setItem(this.cacheKey, JSON.stringify(metrics));
  }

  private async enqueue(op: PendingOperation): Promise<void> {
    const raw = (await this.storage.getItem(this.outboxKey)) || '[]';
    const arr: PendingOperation[] = JSON.parse(raw);
    arr.push(op);
    await this.storage.setItem(this.outboxKey, JSON.stringify(arr));
  }

  async getOutbox(): Promise<PendingOperation[]> {
    const raw = (await this.storage.getItem(this.outboxKey)) || '[]';
    try {
      return JSON.parse(raw) as PendingOperation[];
    } catch {
      return [];
    }
  }

  private async setOutbox(arr: PendingOperation[]): Promise<void> {
    await this.storage.setItem(this.outboxKey, JSON.stringify(arr));
  }

  // Remote sync wrappers
  private async fetchRemote(): Promise<HealthMetrics> {
    try {
      const data = await ApiClient.get<HealthMetrics>('/health/metrics');
      return data;
    } catch (e) {
      return await this.getCachedMetrics();
    }
  }

  async sync(): Promise<HealthMetrics> {
    // Push pending first
    await this.syncPending();
    // Pull remote and cache
    const remote = await this.fetchRemote();
    await this.setCached(remote);
    return remote;
  }

  async syncPending(): Promise<void> {
    const outbox = await this.getOutbox();
    if (outbox.length === 0) return;
    const remaining: PendingOperation[] = [];

    for (const op of outbox) {
      try {
        if (op.type === 'create') {
          const res = await ApiClient.post(`/health/${op.metric}`, op.entry);
          // Update cache with server-confirmed entry (assumes server returns the created entity)
          const updated = await this.applyLocalCreate(op.metric, res, false);
          await this.setCached(updated);
        } else if (op.type === 'update') {
          const res = await ApiClient.put(`/health/${op.metric}/${op.id}`, op.patch);
          const updated = await this.applyLocalUpdate(op.metric, op.id, res, false);
          await this.setCached(updated);
        } else if (op.type === 'delete') {
          await ApiClient.delete(`/health/${op.metric}/${op.id}`);
          const updated = await this.applyLocalDelete(op.metric, op.id, false);
          await this.setCached(updated);
        }
      } catch {
        remaining.push(op);
      }
    }

    await this.setOutbox(remaining);
  }

  // CRUD API exposed
  async list(): Promise<HealthMetrics> {
    const cached = await this.getCachedMetrics();
    // trigger a background sync (fire and forget)
    this.sync().catch(() => void 0);
    return cached;
  }

  async addWeight(entry: Omit<WeightEntry, 'id'> & { id?: UUID }): Promise<HealthMetrics> {
    const id = entry.id ?? this.uuid();
    const payload: WeightEntry = { ...entry, id, pending: true };
    const updated = await this.applyLocalCreate('weight', payload, true);
    await this.enqueue({ type: 'create', metric: 'weight', entry: payload });
    return updated;
  }

  async addBloodPressure(entry: Omit<BloodPressureEntry, 'id'> & { id?: UUID }): Promise<HealthMetrics> {
    const id = entry.id ?? this.uuid();
    const payload: BloodPressureEntry = { ...entry, id, pending: true };
    const updated = await this.applyLocalCreate('bloodPressure', payload, true);
    await this.enqueue({ type: 'create', metric: 'bloodPressure', entry: payload });
    return updated;
  }

  async addFetalMovement(entry: Omit<FetalMovementEntry, 'id'> & { id?: UUID }): Promise<HealthMetrics> {
    const id = entry.id ?? this.uuid();
    const payload: FetalMovementEntry = { ...entry, id, pending: true };
    const updated = await this.applyLocalCreate('fetalMovement', payload, true);
    await this.enqueue({ type: 'create', metric: 'fetalMovement', entry: payload });
    return updated;
  }

  async addNote(entry: Omit<NoteEntry, 'id'> & { id?: UUID }): Promise<HealthMetrics> {
    const id = entry.id ?? this.uuid();
    const payload: NoteEntry = { ...entry, id, pending: true };
    const updated = await this.applyLocalCreate('notes', payload, true);
    await this.enqueue({ type: 'create', metric: 'notes', entry: payload });
    return updated;
  }

  async update<T extends MetricType>(metric: T, id: UUID, patch: any): Promise<HealthMetrics> {
    const updated = await this.applyLocalUpdate(metric, id, patch, true);
    await this.enqueue({ type: 'update', metric, id, patch });
    return updated;
  }

  async remove<T extends MetricType>(metric: T, id: UUID): Promise<HealthMetrics> {
    const updated = await this.applyLocalDelete(metric, id, true);
    await this.enqueue({ type: 'delete', metric, id });
    return updated;
  }

  // Local cache mutations
  private async applyLocalCreate(metric: MetricType, payload: any, cacheAfter: boolean): Promise<HealthMetrics> {
    const cached = await this.getCachedMetrics();
    const next: HealthMetrics = { ...cached } as HealthMetrics;
    (next as any)[metric] = sortByDateDesc([...(next as any)[metric], payload]);
    if (cacheAfter) await this.setCached(next);
    return next;
  }

  private async applyLocalUpdate(metric: MetricType, id: UUID, patch: any, cacheAfter: boolean): Promise<HealthMetrics> {
    const cached = await this.getCachedMetrics();
    const list = (cached as any)[metric] as any[];
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return cached;
    list[idx] = { ...list[idx], ...patch };
    (cached as any)[metric] = sortByDateDesc(list);
    if (cacheAfter) await this.setCached(cached);
    return cached;
  }

  private async applyLocalDelete(metric: MetricType, id: UUID, cacheAfter: boolean): Promise<HealthMetrics> {
    const cached = await this.getCachedMetrics();
    const list = (cached as any)[metric] as any[];
    (cached as any)[metric] = list.filter(e => e.id !== id);
    if (cacheAfter) await this.setCached(cached);
    return cached;
  }

  private uuid(): UUID {
    // RFC4122 v4-ish simple uuid generator for local ids
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export default new HealthMetricsService();
