/**
 * Lottery API Call Manager
 * Handles backend communication with lottery-specific state tracking
 */

import { useState } from 'react';
import { parseApiError, getUserFriendlyMessage } from '../lib/api/errors';

interface ApiError {
  message: string;
  code?: string;
}

interface ApiResponse {
  success?: boolean;
  data?: unknown;
  error?: string;
  [key: string]: unknown;
}

export function useLotteryBackend<ResultType>(initialValue: ResultType | null = null) {
  const [backendState, setBackendState] = useState({
    result: initialValue,
    working: false,
    problem: null as ApiError | null,
  });

  async function callBackend(apiPromise: Promise<ApiResponse>): Promise<ResultType | null> {
    setBackendState({ result: null, working: true, problem: null });

    try {
      const response = await apiPromise;
      const finalResult = (response?.success !== false ? (response?.data ?? response) : null) as ResultType | null;
      
      if (response?.success === false) {
        throw new Error(response.error || 'Call failed');
      }

      setBackendState({ result: finalResult, working: false, problem: null });
      return finalResult;
    } catch (err) {
      const errorObj = parseApiError(err);
      console.error('[Backend Call Failed]', getUserFriendlyMessage(errorObj));
      setBackendState({ result: null, working: false, problem: errorObj });
      return null;
    }
  }

  return {
    result: backendState.result as ResultType | null,
    working: backendState.working,
    problem: backendState.problem,
    callBackend,
  };
}
