import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import { ChatIcon, SendIcon, BotIcon, UserIcon, CloseIcon } from './icons/Icons';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const AIChatbot: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Bonjour! 👋 Je suis votre assistant AI IBRA Services. Comment puis-je vous aider aujourd\'hui?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Call AI API
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.slice(-5), // Send last 5 messages for context
                }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || 'Désolé, je n\'ai pas pu comprendre. Pouvez-vous reformuler?',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);

            // Fallback responses
            const fallbackResponse = getFallbackResponse(input);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: fallbackResponse,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const getFallbackResponse = (userInput: string): string => {
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes('prix') || lowerInput.includes('coût')) {
            return 'Nos tarifs varient selon le service. Vidange d\'huile: ~85$, Freins: 150-300$, Inspection: 50$. Contactez-nous au (819) 979-1017 pour un devis précis!';
        }

        if (lowerInput.includes('rendez-vous') || lowerInput.includes('rdv') || lowerInput.includes('appointment')) {
            return 'Pour prendre rendez-vous, utilisez notre système de réservation en ligne ou appelez-nous au (819) 979-1017. Nous sommes ouverts du lundi au vendredi, 8h-17h.';
        }

        if (lowerInput.includes('adresse') || lowerInput.includes('location')) {
            return 'Nous sommes situés au 2374 Rue Royale, Trois-Rivières, QC. Facile d\'accès avec stationnement gratuit!';
        }

        if (lowerInput.includes('taxi') || lowerInput.includes('livraison')) {
            return 'Oui! Nous offrons des services pour taxis et véhicules de livraison. Maintenance préventive, réparations urgentes, et inspections SAAQ. Appelez pour service prioritaire!';
        }

        if (lowerInput.includes('clim') || lowerInput.includes('climatisation') || lowerInput.includes('ac')) {
            return 'Service de climatisation disponible! Recharge de gaz, réparation de compresseur, diagnostic de fuites. Parfait pour l\'été québécois! 🌡️';
        }

        if (lowerInput.includes('urgent') || lowerInput.includes('emergency')) {
            return '🚨 Pour service d\'urgence, appelez immédiatement au (819) 979-1017. Nous priorisons les cas urgents!';
        }

        if (lowerInput.includes('heures') || lowerInput.includes('horaire') || lowerInput.includes('ouvert')) {
            return 'Nos heures d\'ouverture: Lundi-Vendredi 8h-17h, Samedi 9h-13h (sur rendez-vous), Fermé le dimanche.';
        }

        return 'Je peux vous aider avec: 📅 Rendez-vous, 💰 Tarifs, 🚗 Services (mécanique, taxi, climatisation), 📍 Localisation, et plus! Que souhaitez-vous savoir?';
    };

    const quickActions = [
        { label: 'Prendre RDV', action: () => setInput('Je voudrais prendre un rendez-vous') },
        { label: 'Tarifs', action: () => setInput('Quels sont vos tarifs?') },
        { label: 'Horaires', action: () => setInput('Quels sont vos heures d\'ouverture?') },
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-pulse"
                aria-label="Open chat"
            >
                <ChatIcon className="w-8 h-8 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 dark:border-gray-700 animate-scaleIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <BotIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Assistant AI</h3>
                        <p className="text-xs text-blue-100">En ligne 24/7</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                    <CloseIcon className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                    ? 'bg-blue-600'
                                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                }`}
                        >
                            {msg.role === 'user' ? (
                                <UserIcon className="w-5 h-5 text-white" />
                            ) : (
                                <BotIcon className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none shadow-md'
                                }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {msg.timestamp.toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <BotIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <p className="text-xs text-gray-500 mb-2">Actions rapides:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={action.action}
                                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                    >
                        <SendIcon className="w-5 h-5 text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChatbot;
