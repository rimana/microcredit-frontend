import React, { useState, useEffect } from 'react';
import { SystemSettings } from '../../ types/admin';
import { adminAPI } from '../../services/api/admin';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import {SystemConfig} from '../../components/Admin/SystemConfig';
import './Admin.css';


const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings && originalSettings) {
      const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasChanges(changed);
    }
  }, [settings, originalSettings]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getSystemSettings();
      setSettings(data);
      setOriginalSettings(JSON.parse(JSON.stringify(data))); // Deep copy
    } catch (error) {
      setError('Erreur lors du chargement des paramètres');
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      
      await adminAPI.updateSystemSettings(settings);
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      setSuccess('Paramètres sauvegardés avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Erreur lors de la sauvegarde des paramètres');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(JSON.parse(JSON.stringify(originalSettings)));
      setError(null);
      setSuccess(null);
    }
  };

  const validateSettings = (settings: SystemSettings): string[] => {
    const errors: string[] = [];
    
    if (settings.minLoanAmount >= settings.maxLoanAmount) {
      errors.push('Le montant minimum doit être inférieur au montant maximum');
    }
    
    if (settings.minLoanDuration >= settings.maxLoanDuration) {
      errors.push('La durée minimum doit être inférieure à la durée maximum');
    }
    
    if (settings.defaultInterestRate < 0 || settings.defaultInterestRate > 100) {
      errors.push('Le taux d\'intérêt doit être entre 0 et 100%');
    }
    
    return errors;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar />
        <div className="admin-container">
          <div className="admin-loading">
            Chargement des paramètres système...
          </div>
        </div>
      </div>
    );
  }

  const validationErrors = settings ? validateSettings(settings) : [];

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-container">
        <h1 className="admin-page-title">
          ⚙️ Paramètres Système
        </h1>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-success">
            {success}
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="admin-error">
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Indicateur de modifications */}
        {hasChanges && (
          <div className="admin-filters">
            <div className="filter-row">
              <div className="admin-success" style={{ padding: '10px', borderRadius: '5px' }}>
                ⚠️ Vous avez des modifications non sauvegardées
              </div>
            </div>
          </div>
        )}

        {/* Aperçu des paramètres actuels */}
        {settings && (
          <div className="admin-stats-grid stats-four-cols">
            <div className="admin-card primary">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>Taux d'Intérêt</h3>
                <p className="stat-number">{settings.defaultInterestRate}%</p>
              </div>
            </div>
            <div className="admin-card success">
              <div className="card-icon">💵</div>
              <div className="card-content">
                <h3>Montant Max</h3>
                <p className="stat-number">{settings.maxLoanAmount.toLocaleString()} DH</p>
              </div>
            </div>
            <div className="admin-card warning">
              <div className="card-icon">📅</div>
              <div className="card-content">
                <h3>Durée Max</h3>
                <p className="stat-number">{settings.maxLoanDuration} mois</p>
              </div>
            </div>
            <div className="admin-card danger">
              <div className="card-icon">🛠️</div>
              <div className="card-content">
                <h3>Maintenance</h3>
                <p className="stat-number">{settings.systemMaintenance ? 'Activée' : 'Désactivée'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de configuration */}
        {settings && (
          <SystemConfig
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSave={handleSave}
            onReset={handleReset}
            loading={saving}
          />
        )}

        {/* Actions rapides */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h3>Actions Rapides</h3>
          </div>
          <div className="settings-actions" style={{ padding: '20px' }}>
            <button 
              onClick={() => adminAPI.updateInterestRate(5.0)}
              className="btn-primary"
              disabled={saving}
            >
              Définir taux à 5%
            </button>
            <button 
              onClick={() => adminAPI.updateMaxAmount(100000)}
              className="btn-primary"
              disabled={saving}
            >
              Montant max à 100k DH
            </button>
            <button 
              onClick={loadSettings}
              className="btn-warning"
            >
              🔄 Recharger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;