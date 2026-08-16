import React, { useState, useEffect } from 'react';
import { runAllUnitTests, UNIT_TEST_SUITES } from '../../tests/unitTests';
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  RotateCw,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

export function UnitTestRunner() {
  const [testResults, setTestResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [activeSuiteFilter, setActiveSuiteFilter] = useState('ALL');

  const executeTests = async () => {
    setRunning(true);
    try {
      const results = await runAllUnitTests();
      setTestResults(results);
    } catch (err) {
      console.error('Test execution failed:', err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    // Automatically run test suite on first mount
    executeTests();
  }, []);

  const totalTestsCount = UNIT_TEST_SUITES.reduce((acc, s) => acc + s.tests.length, 0);
  const passRate = testResults ? Math.round((testResults.passed / testResults.total) * 100) : 0;

  return (
    <div className="tests-container anim-fade-in">
      {/* Header & Controls */}
      <div className="tests-summary-bar">
        <div className="tests-kpi-row">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} color="var(--accent-teal)" />
              Automated Business Service Unit Test Runner
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Verifies domain logic across 6 isolated suites (Positive, Negative & Edge cases via AAA pattern)
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={executeTests}
            disabled={running}
          >
            {running ? (
              <>
                <RotateCw size={16} className="anim-spin" /> Running Suites...
              </>
            ) : (
              <>
                <Play size={16} /> Run All Tests
              </>
            )}
          </button>
        </div>

        {/* Progress Bar & Status */}
        {testResults && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ color: testResults.failed === 0 ? '#10b981' : '#ef4444' }}>
                {testResults.failed === 0
                  ? `All ${testResults.passed} Tests Passed Successfully (${passRate}%)`
                  : `${testResults.failed} Failed / ${testResults.total} Total`}
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                Executed in {testResults.durationMs}ms
              </span>
            </div>

            <div className="tests-progress-bar-bg">
              <div
                className="tests-progress-bar-fill"
                style={{
                  width: `${passRate}%`,
                  background: testResults.failed === 0 ? 'linear-gradient(90deg, #10b981, #34d399)' : '#ef4444'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Test Suites List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {testResults && testResults.suites.map(suite => (
          <div key={suite.id} className="suite-card">
            <div className="suite-card-header">
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{suite.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{suite.description}</div>
              </div>

              <span className="badge badge-cert" style={{ fontSize: '11px' }}>
                {suite.tests.filter(t => t.status === 'PASSED').length} / {suite.tests.length} Passed
              </span>
            </div>

            <div>
              {suite.tests.map(test => {
                const isPassed = test.status === 'PASSED';

                return (
                  <div key={test.id} className="test-row">
                    <div className="test-title-col">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isPassed ? (
                          <CheckCircle2 size={16} color="#10b981" />
                        ) : (
                          <XCircle size={16} color="#ef4444" />
                        )}
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: isPassed ? 'var(--text-primary)' : '#f87171' }}>
                          {test.title}
                        </span>
                      </div>

                      {test.error && (
                        <div className="test-error-box">
                          Assertion Failure: {test.error}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        className="badge"
                        style={{
                          fontSize: '10px',
                          background:
                            test.type === 'POSITIVE'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : test.type === 'NEGATIVE'
                              ? 'rgba(239, 68, 68, 0.12)'
                              : 'rgba(229, 169, 60, 0.12)',
                          color:
                            test.type === 'POSITIVE'
                              ? '#34d399'
                              : test.type === 'NEGATIVE'
                              ? '#f87171'
                              : '#f6c050'
                        }}
                      >
                        {test.type}
                      </span>

                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {test.durationMs}ms
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
