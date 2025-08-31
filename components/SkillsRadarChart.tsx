import React from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { Skill } from '../types';

interface SkillsRadarChartProps {
    skills: Skill[];
}

const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ skills }) => {
    const data = skills.map(skill => ({
        subject: skill.name,
        current: skill.currentLevel,
        required: skill.requiredLevel,
        fullMark: 5,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontFamily: 'Cairo, sans-serif' }}/>
                <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontFamily: 'Cairo, sans-serif'
                    }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Cairo, sans-serif' }} />
                <Radar name="المستوى الحالي" dataKey="current" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                <Radar name="المستوى المطلوب" dataKey="required" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default SkillsRadarChart;
