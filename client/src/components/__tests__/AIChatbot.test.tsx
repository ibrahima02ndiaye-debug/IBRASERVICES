import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContextProvider } from '../contexts/AppContext';
import AIChatbot from '../components/AIChatbot';

describe('AIChatbot', () => {
    const renderChatbot = () => {
        return render(
            <AppContextProvider>
                <AIChatbot />
            </AppContextProvider>
        );
    };

    it('should render chat button when closed', () => {
        renderChatbot();
        const button = screen.getByLabelText(/open chat/i);
        expect(button).toBeInTheDocument();
    });

    it('should open chat window when clicked', async () => {
        const user = userEvent.setup();
        renderChatbot();

        const button = screen.getByLabelText(/open chat/i);
        await user.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Assistant AI/i)).toBeInTheDocument();
        });
    });

    it('should display initial greeting message', async () => {
        const user = userEvent.setup();
        renderChatbot();

        const button = screen.getByLabelText(/open chat/i);
        await user.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Comment puis-je vous aider/i)).toBeInTheDocument();
        });
    });

    it('should send message when form submitted', async () => {
        const user = userEvent.setup();
        renderChatbot();

        // Open chat
        const button = screen.getByLabelText(/open chat/i);
        await user.click(button);

        // Type and send message
        const input = screen.getByPlaceholderText(/Tapez votre message/i);
        await user.type(input, 'Bonjour');

        const sendButton = screen.getByRole('button', { name: '' }); // Send icon button
        await user.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText('Bonjour')).toBeInTheDocument();
        });
    });

    it('should show quick actions on first message', async () => {
        const user = userEvent.setup();
        renderChatbot();

        const button = screen.getByLabelText(/open chat/i);
        await user.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Prendre RDV/i)).toBeInTheDocument();
            expect(screen.getByText(/Tarifs/i)).toBeInTheDocument();
        });
    });
});
