// pages/Profile/Profile.tsx
import React, { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileRequest } from '../../ types/user';
import { profileApi } from '../../services/api/profile';
import './Profile.css';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        email: '',
        phone: '',
        cin: '',
        address: '',
        employed: false,
        monthlyIncome: 0,
        profession: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userProfile = await profileApi.getProfile();
            setProfile(userProfile);
            setFormData({
                email: userProfile.email,
                phone: userProfile.phone,
                cin: userProfile.cin,
                address: userProfile.address,
                employed: userProfile.employed,
                monthlyIncome: userProfile.monthlyIncome,
                profession: userProfile.profession,
            });
        } catch (error) {
            console.error('Erreur lors du chargement du profil:', error);
            setMessage('Erreur lors du chargement du profil');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updatedProfile = await profileApi.updateProfile(formData);
            setProfile(updatedProfile);
            setIsEditing(false);
            setMessage('Profil mis à jour avec succès');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            setMessage('Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) : value
        }));
    };

    if (loading && !profile) {
        return <div className="loading">Chargement du profil...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Mon Profil</h1>
                {!isEditing && (
                    <button
                        className="edit-btn"
                        onClick={() => setIsEditing(true)}
                    >
                        Modifier le Profil
                    </button>
                )}
            </div>

            {message && <div className="message">{message}</div>}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Nom d'utilisateur:</label>
                        <input type="text" value={profile?.username || ''} disabled />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Téléphone:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>CIN:</label>
                        <input
                            type="text"
                            name="cin"
                            value={formData.cin}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Adresse:</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                        />
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

                    <div className="form-group">
                        <label>Profession:</label>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Revenu Mensuel (MAD):</label>
                        <input
                            type="number"
                            name="monthlyIncome"
                            value={formData.monthlyIncome}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Mise à jour...' : 'Sauvegarder'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <div className="profile-view">
                    <div className="profile-info">
                        <div className="info-item">
                            <strong>Nom d'utilisateur:</strong>
                            <span>{profile?.username}</span>
                        </div>
                        <div className="info-item">
                            <strong>Email:</strong>
                            <span>{profile?.email}</span>
                        </div>
                        <div className="info-item">
                            <strong>Téléphone:</strong>
                            <span>{profile?.phone || 'Non renseigné'}</span>
                        </div>
                        <div className="info-item">
                            <strong>CIN:</strong>
                            <span>{profile?.cin || 'Non renseigné'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Adresse:</strong>
                            <span>{profile?.address || 'Non renseignée'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Statut emploi:</strong>
                            <span>{profile?.employed ? 'Employé' : 'Non employé'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Profession:</strong>
                            <span>{profile?.profession || 'Non renseignée'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Revenu mensuel:</strong>
                            <span>{profile?.monthlyIncome ? `${profile.monthlyIncome} MAD` : 'Non renseigné'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;