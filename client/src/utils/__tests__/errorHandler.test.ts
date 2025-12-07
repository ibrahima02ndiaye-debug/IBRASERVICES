import { describe, it, expect } from 'vitest';
import { retryWithBackoff, createAppError, handleApiError } from '../errorHandler';

describe('Error Handler', () => {
    describe('retryWithBackoff', () => {
        it('should succeed on first try', async () => {
            const successFn = async () => 'success';
            const result = await retryWithBackoff(successFn);
            expect(result).toBe('success');
        });

        it('should retry on failure and eventually succeed', async () => {
            let attempts = 0;
            const retryFn = async () => {
                attempts++;
                if (attempts < 3) throw new Error('Temporary failure');
                return 'success';
            };

            const result = await retryWithBackoff(retryFn, 3);
            expect(result).toBe('success');
            expect(attempts).toBe(3);
        });

        it('should throw after max retries', async () => {
            const failFn = async () => {
                throw new Error('Permanent failure');
            };

            await expect(retryWithBackoff(failFn, 2)).rejects.toThrow('Permanent failure');
        });
    });

    describe('createAppError', () => {
        it('should create error with message and code', () => {
            const error = createAppError('Test error', 'TEST_ERROR');
            expect(error.message).toBe('Test error');
            expect(error.code).toBe('TEST_ERROR');
        });
    });

    describe('handleApiError', () => {
        it('should return user-friendly message for known errors', () => {
            const error = new Error('Network request failed');
            const result = handleApiError(error);
            expect(result.userMessage).toContain('connexion');
        });

        it('should handle generic errors', () => {
            const error = new Error('Unknown error');
            const result = handleApiError(error);
            expect(result.userMessage).toBeDefined();
        });
    });
});
