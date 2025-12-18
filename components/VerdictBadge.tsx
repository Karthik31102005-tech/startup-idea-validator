
import React from 'react';

interface VerdictBadgeProps {
  verdict: 'PROCEED' | 'PIVOT' | 'DROP';
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict }) => {
  const styles = {
    PROCEED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    PIVOT: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    DROP: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className={`px-4 py-1.5 rounded-full border text-sm font-bold tracking-widest uppercase ${styles[verdict]}`}>
      {verdict}
    </div>
  );
};

export default VerdictBadge;
