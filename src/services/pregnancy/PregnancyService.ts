import {CalculatedPregnancy, calculateGestationalAge, PregnancyData} from './ga';

export type PregnancyRecord = PregnancyData & {
  id: string;
  eddSource: 'lmp' | 'manual' | 'unknown';
  edd?: string | null;
  lastUpdatedAt?: string | null;
  auditTrail?: Array<{
    at: string;
    previousSource: 'lmp' | 'manual' | 'unknown';
    newSource: 'lmp' | 'manual' | 'unknown';
  }>;
};

class PregnancyServiceClass {
  private record: PregnancyRecord | null = null;
  private shouldFail = false;

  setFailureMode(shouldFail: boolean) {
    this.shouldFail = shouldFail;
  }

  async getPregnancy(): Promise<PregnancyRecord | null> {
    return this.record;
  }

  async upsertPregnancy(input: PregnancyData & { id?: string }): Promise<PregnancyRecord> {
    if (this.shouldFail) {
      throw new Error('Network error');
    }

    const now = new Date().toISOString();

    // Determine source transition for audit trail
    const prevSource = this.record?.eddSource ?? 'unknown';
    const calc = calculateGestationalAge(new Date(), input);
    const newSource = calc.source;

    const eddISO = calc.edd ? calc.edd.toISOString() : null;

    const next: PregnancyRecord = {
      id: this.record?.id ?? input.id ?? 'preg-1',
      lmpDate: input.lmpDate ?? null,
      manualEDD: input.manualEDD ?? null,
      eddSource: newSource,
      edd: eddISO,
      lastUpdatedAt: now,
      auditTrail: this.record?.auditTrail ? [...this.record.auditTrail] : [],
    };

    if (prevSource !== newSource) {
      next.auditTrail?.push({ at: now, previousSource: prevSource, newSource });
    }

    this.record = next;
    return next;
  }

  calculate(today: Date, data: PregnancyData): CalculatedPregnancy {
    return calculateGestationalAge(today, data);
  }
}

export const PregnancyService = new PregnancyServiceClass();
export type PregnancyServiceType = typeof PregnancyService;
