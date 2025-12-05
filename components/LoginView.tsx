
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import { GarageIcon } from './icons/Icons';
import { loginUser, registerUser } from '../client/src/services/api';
import { useAppContext } from '../contexts/AppContext';

const LoginView: React.FC = () => {
    const { t } = useTranslation();
    const { login } = useAppContext();
    
    const [isLoginMode, setIsLoginMode] = useState(true);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Garage');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!isLoginMode && password !== confirmPassword) {
            setError(t('login.error_mismatch'));
            setIsLoading(false);
            return;
        }

        try {
            let data;
            
            if (isLoginMode) {
                data = await loginUser({ email, password });
            } else {
                data = await registerUser({ name, email, password, role });
            }
            
            if (data.token) {
                login(data.token, data.user || { role: role });
            } else {
                throw new Error('No token received');
            }
        } catch (err: any) {
            console.error('Auth failed', err);
            
            if (isLoginMode) {
                 if (err.message === 'Invalid credentials.' || err.message === 'Unauthorized') {
                    setError(t('login.error_credentials') || 'Invalid email or password.');
                } else {
                    setError('Connection failed. Please check your network.');
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleMode = () => {
        setError(null);
        setIsLoginMode(!isLoginMode);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 font-sans">
            {/* Left Side - Modern Gradient & Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 to-gray-900 items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                
                {/* Decorative Circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s'}}></div>

                <div className="relative z-10 text-center px-10">
                    <div className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-2xl border border-white/20">
                         <GarageIcon className="w-14 h-14 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">IBRA Services</h1>
                    <p className="text-xl text-blue-200 max-w-md mx-auto leading-relaxed">
                        {isLoginMode 
                            ? "Mécanique générale, Taxi, Livraison et Climatisation." 
                            : "Rejoignez IBRA Services pour une gestion simplifiée."}
                    </p>
                    <div className="mt-6 flex flex-col gap-1 items-center">
                        <p className="text-sm text-blue-300">Trois-Rivières, QC</p>
                        <a href="https://servicesibra.ca/" target="_blank" rel="noopener noreferrer" className="text-sm text-white font-medium hover:underline hover:text-blue-100 transition-colors">
                            servicesibra.ca
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                                <GarageIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            {isLoginMode ? t('login.welcome') : t('login.welcome_register')}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {isLoginMode ? t('login.sign_in_prompt') : t('login.register_prompt')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        {!isLoginMode && (
                            <div className="space-y-4 animate-fadeIn">
                                <Input
                                    id="name"
                                    label={t('forms.label_full_name')}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLoginMode}
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">{t('forms.label_user_type')}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole('Garage')}
                                            className={`py-2.5 px-4 rounded-lg text-sm font-semibold border transition-all ${role === 'Garage' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                        >
                                            {t('roles.Garage')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('Client')}
                                            className={`py-2.5 px-4 rounded-lg text-sm font-semibold border transition-all ${role === 'Client' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                        >
                                            {t('roles.Client')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Input
                            id="email"
                            label={t('forms.label_email')}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="bg-gray-50 dark:bg-gray-800"
                        />
                        
                        <div className="space-y-4">
                            <Input
                                id="password"
                                label={t('forms.label_password')}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete={isLoginMode ? "current-password" : "new-password"}
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                            
                            {!isLoginMode && (
                                <Input
                                    id="confirmPassword"
                                    label={t('forms.label_confirm_password')}
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required={!isLoginMode}
                                    autoComplete="new-password"
                                    className="bg-gray-50 dark:bg-gray-800 animate-fadeIn"
                                />
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}
                        
                        <Button type="submit" className="w-full py-3 text-base shadow-lg shadow-blue-500/20" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    {isLoginMode ? t('login.signing_in') : t('login.registering')}
                                </span>
                            ) : (isLoginMode ? t('login.sign_in') : t('login.register'))}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-100 dark:bg-gray-950 text-gray-500">
                                {isLoginMode ? "Nouveau ici ?" : "Déjà membre ?"}
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {isLoginMode ? t('login.no_account') : t('login.have_account')}{' '}
                            <button 
                                onClick={toggleMode} 
                                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:underline"
                            >
                                {isLoginMode ? t('login.create_account') : t('login.login_link')}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LoginView;