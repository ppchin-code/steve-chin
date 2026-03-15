import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { RadarMetric } from '../types';

interface Props {
  data: RadarMetric[];
}

export default function RadarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis 
          dataKey="labelEn" 
          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
        />
        <Radar
          name="Capability"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.5}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
