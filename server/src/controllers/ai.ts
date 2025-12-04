import { Request, Response } from 'express';
import { GoogleGenAI, Chat } from '@google/genai';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

// FIX: Initialize GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// In a real application, you would manage chat instances per user session.
// For this demo, we use a single, shared chat instance.
let chat: Chat;

function initializeChat() {
    // FIX: Use the correct model 'gemini-2.5-flash'.
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are GaragePilot AI, a helpful assistant for auto garage management.',
        },
    });
}

export const handleChatStream = async (req: Request, res: Response) => {
    if (!chat) {
        initializeChat();
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        // FIX: Use sendMessageStream for streaming responses.
        const stream = await chat.sendMessageStream({ message });

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of stream) {
            // FIX: Access the generated text directly from the 'text' property of the chunk.
            res.write(chunk.text);
        }
        res.end();
    } catch (error) {
        console.error('AI chat stream error:', error);
        res.status(500).send('Error communicating with the AI service.');
    }
};
