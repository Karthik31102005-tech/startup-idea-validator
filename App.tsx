
import React, { useState } from 'react';
import { evaluateStartup } from './services/geminiService';
import { StartupInput, EvaluationResult } from './types';
import ScoreChart from './components/ScoreChart';
import VerdictBadge from './components/VerdictBadge';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [formData, setFormData] = useState<StartupInput>({
    idea: '',
    targetUsers: '',
    alternatives: '',
    reasoning: '',
    background: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const evaluation = await evaluateStartup(formData);
      setResult(evaluation);
    } catch (err: any) {
      console.error(err);
      setError('Failed to analyze the idea. Ensure your API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StartupInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-neutral-800 pb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tighter text-white uppercase italic">
              Founders<span className="text-rose-600">Truth</span>
            </h1>
            <span className="text-xs mono text-neutral-500 tracking-widest uppercase">Elite Analysis Engine v3.0</span>
          </div>
          <p className="mt-4 text-neutral-400 max-w-2xl leading-relaxed">
            Submit your concept for a brutal, high-fidelity venture analysis. We optimize for truth, not validation.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
          {/* Input Section */}
          {!result || loading ? (
            <section className="space-y-8 bg-neutral-900/30 p-8 rounded-2xl border border-neutral-800 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Startup Idea</label>
                  <textarea
                    required
                    value={formData.idea}
                    onChange={(e) => handleInputChange('idea', e.target.value)}
                    placeholder="3-6 sentences explaining the core mechanics and value prop."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Target Users</label>
                    <input
                      required
                      type="text"
                      value={formData.targetUsers}
                      onChange={(e) => handleInputChange('targetUsers', e.target.value)}
                      placeholder="Specific user segment"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Current Alternatives</label>
                    <input
                      required
                      type="text"
                      value={formData.alternatives}
                      onChange={(e) => handleInputChange('alternatives', e.target.value)}
                      placeholder="What users do today instead"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Why This Works</label>
                  <textarea
                    required
                    value={formData.reasoning}
                    onChange={(e) => handleInputChange('reasoning', e.target.value)}
                    placeholder="Your core assumptions or secret insight"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Your Background</label>
                  <textarea
                    required
                    value={formData.background}
                    onChange={(e) => handleInputChange('background', e.target.value)}
                    placeholder="Skills, domain expertise, unfair advantages"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-4 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none min-h-[80px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Analyzing Dynamics...
                    </>
                  ) : (
                    'Run Evaluation'
                  )}
                </button>
                {error && <p className="text-rose-500 text-sm font-medium mt-2">{error}</p>}
              </form>
            </section>
          ) : (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Score Chart */}
                <div className="w-full md:w-1/2">
                   <div className="bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Analysis Matrix</h3>
                      <VerdictBadge verdict={result.overallVerdict} />
                    </div>
                    <ScoreChart data={result.scores} />
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {result.scores.map((s) => (
                        <div key={s.dimension} className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500">{s.dimension}</span>
                          <span className={`font-mono font-bold ${s.score >= 7 ? 'text-emerald-500' : s.score <= 3 ? 'text-rose-500' : 'text-amber-500'}`}>{s.score}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Smart Pivots</h3>
                    <ul className="space-y-3">
                      {result.smartPivots.map((pivot, i) => (
                        <li key={i} className="text-sm flex gap-3 text-neutral-300 leading-relaxed">
                          <span className="text-rose-600 font-bold shrink-0">{i + 1}.</span>
                          {pivot}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 space-y-8">
                  <div className="bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Brutal Truth</h3>
                    <p className="text-neutral-200 leading-relaxed italic text-lg">
                      &quot;{result.brutalTruth}&quot;
                    </p>
                  </div>

                  <div className="bg-rose-950/20 p-6 rounded-2xl border border-rose-900/30">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4">Single Biggest Flaw</h3>
                    <p className="text-rose-200 font-medium leading-relaxed">
                      {result.singleBiggestFlaw}
                    </p>
                  </div>

                  <div className="bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">30-Day Validation Plan</h3>
                    <div className="space-y-6">
                      {result.validationPlan.map((plan) => (
                        <div key={plan.week} className="relative pl-6 border-l border-neutral-800">
                          <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 bg-neutral-700 rounded-full border border-neutral-900" />
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Week {plan.week}</h4>
                            <span className="text-[10px] mono text-neutral-600 uppercase font-medium">{plan.focus}</span>
                          </div>
                          <p className="text-sm text-neutral-400 leading-relaxed">{plan.actions}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setResult(null)}
                    className="w-full bg-neutral-800 text-neutral-400 font-bold py-3 rounded-lg uppercase tracking-widest hover:bg-neutral-700 hover:text-white transition-all text-sm"
                  >
                    Analyze New Concept
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        <footer className="mt-20 pt-8 border-t border-neutral-900 flex flex-col items-center gap-2">
          <p className="text-[10px] mono text-neutral-600 uppercase tracking-widest">Powered by FoundersTruth Reasoning Engine</p>
          <p className="text-[10px] mono text-neutral-800">Truth &gt; Comfort</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
