import React from 'react';
import { SystemSettings } from '../../ types/admin';

interface SystemConfigProps {
    settings: SystemSettings;
    onSettingsChange: (newSettings: SystemSettings) => void;
    onSave: () => Promise<void>;
    onReset: () => void;
    loading: boolean;
}

export const SystemConfig: React.FC<SystemConfigProps> = ({
    settings,
    onSettingsChange,
    onSave,
    onReset,
    loading
}) => {
    const handleInputChange = (field: keyof SystemSettings, value: any) => {
        onSettingsChange({
            ...settings,
            [field]: value
        });
    };

    return (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <h3>Configuration Système</h3>
            </div>
            
            <div className="system-config-form">
                <div className="config-section">
                    <h4>Paramètres des Prêts</h4>
                    
                    <div className="form-group">
                        <label htmlFor="minLoanAmount">Montant minimum de crédit (DH)</label>
                        <input
                            type="number"
                            id="minLoanAmount"
                            value={settings.minLoanAmount}
                            onChange={(e) => handleInputChange('minLoanAmount', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxLoanAmount">Montant maximum de crédit (DH)</label>
                        <input
                            type="number"
                            id="maxLoanAmount"
                            value={settings.maxLoanAmount}
                            onChange={(e) => handleInputChange('maxLoanAmount', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="minLoanDuration">Durée minimum (mois)</label>
                        <input
                            type="number"
                            id="minLoanDuration"
                            value={settings.minLoanDuration}
                            onChange={(e) => handleInputChange('minLoanDuration', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxLoanDuration">Durée maximum (mois)</label>
                        <input
                            type="number"
                            id="maxLoanDuration"
                            value={settings.maxLoanDuration}
                            onChange={(e) => handleInputChange('maxLoanDuration', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="defaultInterestRate">Taux d'intérêt par défaut (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            id="defaultInterestRate"
                            value={settings.defaultInterestRate}
                            onChange={(e) => handleInputChange('defaultInterestRate', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.systemMaintenance}
                                onChange={(e) => handleInputChange('systemMaintenance', e.target.checked)}
                            />
                            Mode maintenance
                        </label>
                    </div>
                </div>

                <div className="config-actions">
                    <button 
                        onClick={onSave} 
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    
                    <button 
                        onClick={onReset}
                        disabled={loading}
                        className="btn-secondary"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>
        </div>
    );
};