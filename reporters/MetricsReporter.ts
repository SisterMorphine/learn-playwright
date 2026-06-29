import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { writeFileSync, mkdirSync } from 'fs';

type TestMetric = {
  name: string;
  status: string;
  flaky: boolean;
  duration_ms: number;
  retries: number;
};

class MetricsReporter implements Reporter {
  private results = new Map<string, TestMetric>();

  onTestEnd(test: TestCase, result: TestResult) {
    const existing = this.results.get(test.id);
    const flaky = (result.status === 'passed' && result.retry > 0)
                  || (existing?.status === 'failed' && result.status === 'passed');

    this.results.set(test.id, {
      name: test.titlePath().join(' > '),
      status: result.status,
      flaky,
      duration_ms: result.duration,
      retries: result.retry,
    });
  }

  onEnd(_result: FullResult) {
    mkdirSync('test-results', { recursive: true });
    writeFileSync(
      'test-results/metrics.json',
      JSON.stringify(Array.from(this.results.values()), null, 2)
    );
  }
}

export default MetricsReporter;
