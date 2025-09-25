import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface SessionData {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  sessionId?: string;
  user?: any;
}

export function useSession() {
  const { address, isConnected } = useAccount();
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionId: null,
    isLoading: false,
    error: null
  });

  // Generate unique session ID for this browser tab
  const generateTabId = useCallback(() => {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Get session ID from sessionStorage (tab-specific)
  const getStoredSessionId = useCallback(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sentinelai_session_id');
    }
    return null;
  }, []);

  // Store session ID in sessionStorage (tab-specific)
  const storeSessionId = useCallback((sessionId: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sentinelai_session_id', sessionId);
      // Also store tab ID for debugging
      sessionStorage.setItem('sentinelai_tab_id', generateTabId());
    }
  }, [generateTabId]);

  // Create new session
  const createSession = useCallback(async (walletAddress: string) => {
    setSessionData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.sessionId) {
        storeSessionId(result.sessionId);
        setSessionData({
          sessionId: result.sessionId,
          isLoading: false,
          error: null
        });
        return result.sessionId;
      } else {
        throw new Error(result.error || 'Failed to create session');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
      setSessionData(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return null;
    }
  }, [storeSessionId]);

  // Validate existing session
  const validateSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/session?sessionId=${sessionId}`);
      const result: ApiResponse = await response.json();
      
      return result.success;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }, []);

  // Initialize session
  const initializeSession = useCallback(async () => {
    if (!isConnected || !address) {
      setSessionData({ sessionId: null, isLoading: false, error: null });
      return;
    }

    setSessionData(prev => ({ ...prev, isLoading: true }));

    // Check for existing session in this tab
    const existingSessionId = getStoredSessionId();
    
    if (existingSessionId) {
      // Validate existing session
      const isValid = await validateSession(existingSessionId);
      if (isValid) {
        setSessionData({
          sessionId: existingSessionId,
          isLoading: false,
          error: null
        });
        return;
      } else {
        // Clear invalid session
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('sentinelai_session_id');
          sessionStorage.removeItem('sentinelai_tab_id');
        }
      }
    }

    // Create new session
    await createSession(address);
  }, [isConnected, address, getStoredSessionId, validateSession, createSession]);

  // Disconnect session
  const disconnectSession = useCallback(async () => {
    const currentSessionId = sessionData.sessionId;
    
    if (currentSessionId) {
      try {
        await fetch(`/api/session?sessionId=${currentSessionId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to disconnect session:', error);
      }
    }

    // Clear session data
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sentinelai_session_id');
      sessionStorage.removeItem('sentinelai_tab_id');
    }
    
    setSessionData({ sessionId: null, isLoading: false, error: null });
  }, [sessionData.sessionId]);

  // Initialize session when wallet connects
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect on unmount as user might refresh the page
      // Session will be cleaned up by the database cleanup job
    };
  }, []);

  return {
    sessionId: sessionData.sessionId,
    isLoading: sessionData.isLoading,
    error: sessionData.error,
    createSession,
    disconnectSession,
    initializeSession
  };
}

// Hook for API calls with session
export function useSessionApi() {
  const { sessionId } = useSession();

  const apiCall = useCallback(async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    if (!sessionId) {
      throw new Error('No active session');
    }

    const url = new URL(endpoint, window.location.origin);
    url.searchParams.set('sessionId', sessionId);

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return response.json();
  }, [sessionId]);

  const postData = useCallback(async <T = any>(
    endpoint: string,
    data: any
  ): Promise<ApiResponse<T>> => {
    if (!sessionId) {
      throw new Error('No active session');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        ...data,
      }),
    });

    return response.json();
  }, [sessionId]);

  return {
    sessionId,
    apiCall,
    postData,
  };
}
