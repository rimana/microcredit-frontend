import React, { useState } from 'react';
import { creditService } from '../../services/api/credit'; // Changé: creditApi → creditService
import './MLTest.css';

// Interface pour le formulaire de test ML
interface MLTestForm {
    monthlyIncome: number;
    loanAmount: number;
    loanDuration: number;
    isFunctionnaire: boolean;
    employed: boolean;
    age: number;
    profession: string;
    hasGuarantor: boolean;
}

const MLTest = () => {
    const [formData, setFormData] = useState<MLTestForm>({
        monthlyIncome: 8000,
        loanAmount: 20000,
        loanDuration: 24,
        isFunctionnaire: true,
        employed: true,
        age: 35,
        profession: 'Ingénieur',
        hasGuarantor: true,
    });

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [testHistory, setTestHistory] = useState<any[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : type === 'number'
                    ? parseFloat(value) || 0
                    : value
        }));
    };

    const handleTestML = async () => {
        setLoading(true);
        try {
            // Convertir MLTestForm en CreditRequestDTO
            const creditRequestDTO = {
                amount: formData.loanAmount,
                duration: formData.loanDuration,
                purpose: "Test ML", // Valeur par défaut
                monthlyIncome: formData.monthlyIncome,
                isFunctionnaire: formData.isFunctionnaire,
                employed: formData.employed,
                age: formData.age,
                profession: formData.profession,
                hasGuarantor: formData.hasGuarantor,
                interestRate: 5.0 // Valeur par défaut
            };

            // Changé: creditApi.simulateScoring() → creditService.testMLModel()
            const response = await creditService.testMLModel(creditRequestDTO);
            setResult(response);

            // Ajouter à l'historique
            setTestHistory(prev => [{
                ...formData,
                result: response,
                timestamp: new Date().toLocaleTimeString(),
            }, ...prev.slice(0, 9)]);

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du test du modèle');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickTest = (type: string) => {
        const tests: any = {
            'good': {
                monthlyIncome: 15000,
                loanAmount: 30000,
                loanDuration: 12,
                isFunctionnaire: true,
                employed: true,
                age: 40,
                profession: 'Médecin',
                hasGuarantor: true,
            },
            'average': {
                monthlyIncome: 6000,
                loanAmount: 15000,
                loanDuration: 36,
                isFunctionnaire: false,
                employed: true,
                age: 28,
                profession: 'Enseignant',
                hasGuarantor: false,
            },
            'risky': {
                monthlyIncome: 3000,
                loanAmount: 50000,
                loanDuration: 60,
                isFunctionnaire: false,
                employed: false,
                age: 22,
                profession: 'Étudiant',
                hasGuarantor: false,
            }
        };

        setFormData(tests[type]);
    };

    return (
        <div className="ml-test">
            <h1>🧪 Test du Modèle ML - XGBoost</h1>

            <div className="test-container">
                <div className="test-form">
                    <h2>Paramètres de Test</h2>

                    <div className="quick-tests">
                        <button className="btn-good" onClick={() => handleQuickTest('good')}>
                            Bon Profil
                        </button>
                        <button className="btn-average" onClick={() => handleQuickTest('average')}>
                            Profil Moyen
                        </button>
                        <button className="btn-risky" onClick={() => handleQuickTest('risky')}>
                            Profil Risqué
                        </button>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Revenu Mensuel (DHS)</label>
                            <input
                                type="number"
                                name="monthlyIncome"
                                value={formData.monthlyIncome}
                                onChange={handleChange}
                                min="1000"
                                step="500"
                            />
                        </div>

                        <div className="form-group">
                            <label>Montant Prêt (DHS)</label>
                            <input
                                type="number"
                                name="loanAmount"
                                value={formData.loanAmount}
                                onChange={handleChange}
                                min="5000"
                                step="1000"
                            />
                        </div>

                        <div className="form-group">
                            <label>Durée (mois)</label>
                            <input
                                type="number"
                                name="loanDuration"
                                value={formData.loanDuration}
                                onChange={handleChange}
                                min="6"
                                max="84"
                            />
                        </div>

                        <div className="form-group">
                            <label>Âge</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="18"
                                max="70"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isFunctionnaire"
                                    checked={formData.isFunctionnaire}
                                    onChange={handleChange}
                                />
                                Fonctionnaire
                            </label>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="employed"
                                    checked={formData.employed}
                                    onChange={handleChange}
                                />
                                Employé
                            </label>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="hasGuarantor"
                                    checked={formData.hasGuarantor}
                                    onChange={handleChange}
                                />
                                A un Garant
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Profession</label>
                            <select
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                            >
                                <option value="Ingénieur">Ingénieur</option>
                                <option value="Médecin">Médecin</option>
                                <option value="Enseignant">Enseignant</option>
                                <option value="Commerçant">Commerçant</option>
                                <option value="Fonctionnaire">Fonctionnaire</option>
                                <option value="Étudiant">Étudiant</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                    </div>

                    <button
                        className="btn-test"
                        onClick={handleTestML}
                        disabled={loading}
                    >
                        {loading ? 'Test en cours...' : '🚀 Tester le Modèle ML'}
                    </button>
                </div>

                {result && (
                    <div className="test-results">
                        <h2>Résultats du Scoring</h2>

                        <div className={`score-card ${result.riskLevel?.toLowerCase()}`}>
                            <div className="score-header">
                                <h3>Score XGBoost</h3>
                                <div className="score-badge">{result.score}/850</div>
                            </div>

                            <div className="score-details">
                                <div className="detail-item">
                                    <span>Niveau de Risque:</span>
                                    <strong className={`risk-${result.riskLevel?.toLowerCase()}`}>
                                        {result.riskLevel}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Probabilité Défaut:</span>
                                    <strong>{(result.probabilityDefault * 100).toFixed(1)}%</strong>
                                </div>

                                <div className="detail-item">
                                    <span>Recommandation:</span>
                                    <strong>{result.recommendation}</strong>
                                </div>

                                <div className="detail-item">
                                    <span>Montant Max Recommandé:</span>
                                    <strong>{result.maxRecommendedAmount?.toLocaleString()} DHS</strong>
                                </div>

                                <div className="detail-item">
                                    <span>Durée Suggérée:</span>
                                    <strong>{result.suggestedDuration} mois</strong>
                                </div>
                            </div>
                        </div>

                        {result.redFlags?.length > 0 && (
                            <div className="red-flags-section">
                                <h4>🚨 Alertes Identifiées</h4>
                                <ul>
                                    {result.redFlags.map((flag: string, index: number) => (
                                        <li key={index}>{flag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.positiveFactors?.length > 0 && (
                            <div className="positive-factors-section">
                                <h4>✅ Points Forts</h4>
                                <ul>
                                    {result.positiveFactors.map((factor: string, index: number) => (
                                        <li key={index}>{factor}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {testHistory.length > 0 && (
                <div className="test-history">
                    <h3>Historique des Tests</h3>
                    <div className="history-grid">
                        {testHistory.map((test, index) => (
                            <div key={index} className="history-item">
                                <div className="history-header">
                                    <span className="time">{test.timestamp}</span>
                                    <span className={`score-badge-small ${test.result.riskLevel?.toLowerCase()}`}>
                                        {test.result.score}
                                    </span>
                                </div>
                                <div className="history-details">
                                    <div>Revenu: {test.monthlyIncome.toLocaleString()} DHS</div>
                                    <div>Prêt: {test.loanAmount.toLocaleString()} DHS</div>
                                    <div>Risque: {test.result.riskLevel}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MLTest;