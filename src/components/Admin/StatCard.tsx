import React from 'react';
import './StatCard.css';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: 'primary' | 'success' | 'warning' | 'danger';
    trend?: {
        value: number;
        isUp: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
    return (
        <div className={`stat-card ${color}`}>
            <div className="stat-icon">
                <i className={`fas ${icon}`}></i>
            </div>
            <div className="stat-info">
                <h3>{title}</h3>
                <p className="stat-value">{value}</p>
                {trend && (
                    <div className={`trend ${trend.isUp ? 'trend-up' : 'trend-down'}`}>
                        <i className={`fas ${trend.isUp ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;