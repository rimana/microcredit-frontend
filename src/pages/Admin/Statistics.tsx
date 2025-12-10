import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import StatCard from '../../components/Admin/StatCard';
import { AdminStats } from '../../ types/admin';
import { adminAPI } from '../../services/api/admin';
import './Admin.css';

interface TrendData {
    userTrend: number;
    creditTrend: number;
    amountTrend: number;
}

const Statistics: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [trends, setTrends] = useState<TrendData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            // Charger les statistiques principales
            const statsData = await adminAPI.getOverviewStats();
            setStats(statsData);

            // Charger les tendances (ou utiliser des données mockées pour le test)
            const trendsData: TrendData = {
                userTrend: 5.2,
                creditTrend: 3.8,
                amountTrend: -2.1
            };
            setTrends(trendsData);

        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <AdminNavbar />
                <div className="admin-content">
                    <div className="loading">Chargement des statistiques...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminNavbar />
            <div className="admin-content">
                <div className="dashboard">
                    <h1>📊 Statistiques Détaillées</h1>
                    
                    {stats && trends && (
                        <div className="stats-grid">
                            <StatCard
                                title="Total Utilisateurs"
                                value={stats.totalUsers}
                                icon="fa-users"
                                color="primary"
                                trend={{
                                    value: trends.userTrend,
                                    isUp: trends.userTrend > 0
                                }}
                            />
                            
                            <StatCard
                                title="Clients Actifs"
                                value={stats.activeClients}
                                icon="fa-user-check"
                                color="success"
                                trend={{
                                    value: trends.creditTrend,
                                    isUp: trends.creditTrend > 0
                                }}
                            />
                            
                            <StatCard
                                title="Total Crédits"
                                value={stats.pendingCredits}
                                icon="fa-credit-card"
                                color="primary"
                                trend={{
                                    value: trends.creditTrend,
                                    isUp: trends.creditTrend > 0
                                }}
                            />
                            
                            <StatCard
                                title="Montant Total"
                                value={`${stats.totalAmount.toLocaleString()} DH`}
                                icon="fa-money-bill"
                                color="success"
                                trend={{
                                    value: trends.amountTrend,
                                    isUp: trends.amountTrend > 0
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Statistics;