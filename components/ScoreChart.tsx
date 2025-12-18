
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ScoreItem } from '../types';

interface ScoreChartProps {
  data: ScoreItem[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] mt-8 bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#404040" />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ fill: '#a3a3a3', fontSize: 10 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
