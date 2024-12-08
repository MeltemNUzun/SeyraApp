import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Şifre doğrulama kontrolü
        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            return;
        }

        setIsLoading(true); // Yüklenme durumunu başlat
        try {
            const token = localStorage.getItem('auth_token'); // Kullanıcının token'ı

            if (!token) {
                setError('Kimlik doğrulama başarısız. Lütfen tekrar giriş yapınız.');
                navigate('/login'); // Token eksikse giriş ekranına yönlendir
                return;
            }

            await axios.post(
                `http://localhost:8080/api/v1/change-password`,
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization başlığı eklendi
                    },
                }
            );

            setSuccessMessage('Şifreniz başarıyla değiştirildi!');
            setTimeout(() => navigate('/login'), 2000); // Başarılı mesajdan sonra yönlendirme
        } catch (error) {
            setError(error.response?.data?.message || 'Şifre güncellenemedi.');
        } finally {
            setIsLoading(false); // Yüklenme durumunu kapat
        }
    };

    return (
        <Layout>
            <div>
                <h2>Şifre Değiştir</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Yeni Şifre:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Yeni Şifreyi Doğrula:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ChangePassword;
