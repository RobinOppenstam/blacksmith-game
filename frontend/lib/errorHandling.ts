// src/lib/errorHandling.ts

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  WALLET_ERROR = 'WALLET_ERROR',
  IPFS_ERROR = 'IPFS_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface GameError {
  type: ErrorType;
  message: string;
  originalError?: any;
  timestamp: number;
  context?: Record<string, any>;
}

/**
 * Parse and categorize errors from various sources
 */
export function parseError(error: any, context?: Record<string, any>): GameError {
  const timestamp = Date.now();
  
  // Check for wallet/user rejection errors
  if (error?.message?.includes('User rejected') || 
      error?.message?.includes('rejected') ||
      error?.code === 4001) {
    return {
      type: ErrorType.WALLET_ERROR,
      message: 'Transaction was rejected by user',
      originalError: error,
      timestamp,
      context
    };
  }
  
  // Check for insufficient funds
  if (error?.message?.includes('insufficient funds') ||
      error?.message?.includes('INSUFFICIENT_FEE')) {
    return {
      type: ErrorType.WALLET_ERROR,
      message: 'Insufficient AVAX balance for transaction',
      originalError: error,
      timestamp,
      context
    };
  }
  
  // Check for contract-specific errors
  const contractErrors = {
    'ALREADY_REGISTERED': 'You are already registered as a blacksmith',
    'NOT_REGISTERED': 'You must register as a blacksmith first',
    'LEVEL_TOO_LOW': 'Your level is too low for this weapon tier',
    'INVALID_TIER': 'Invalid weapon tier selected',
    'INVALID_WEAPON_TYPE': 'Invalid weapon type selected'
  };
  
  for (const [code, message] of Object.entries(contractErrors)) {
    if (error?.message?.includes(code)) {
      return {
        type: ErrorType.CONTRACT_ERROR,
        message,
        originalError: error,
        timestamp,
        context
      };
    }
  }
  
  // Check for network errors
  if (error?.message?.includes('network') ||
      error?.message?.includes('timeout') ||
      error?.message?.includes('fetch')) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'Network connection error. Please check your internet connection.',
      originalError: error,
      timestamp,
      context
    };
  }
  
  // Check for IPFS errors
  if (error?.message?.includes('IPFS') ||
      error?.message?.includes('Pinata')) {
    return {
      type: ErrorType.IPFS_ERROR,
      message: 'Failed to upload to IPFS. Your NFT will be created with temporary metadata.',
      originalError: error,
      timestamp,
      context
    };
  }
  
  // Default to unknown error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error?.message || error?.shortMessage || 'An unexpected error occurred',
    originalError: error,
    timestamp,
    context
  };
}

/**
 * Get user-friendly error message with action suggestions
 */
export function getErrorMessage(error: GameError): {
  title: string;
  message: string;
  action?: string;
} {
  switch (error.type) {
    case ErrorType.WALLET_ERROR:
      if (error.message.includes('rejected')) {
        return {
          title: 'Transaction Cancelled',
          message: 'You cancelled the transaction in your wallet.',
          action: 'Try again when ready'
        };
      }
      return {
        title: 'Wallet Error',
        message: error.message,
        action: 'Check your wallet balance and try again'
      };
      
    case ErrorType.CONTRACT_ERROR:
      return {
        title: 'Smart Contract Error',
        message: error.message,
        action: 'Please check the requirements and try again'
      };
      
    case ErrorType.NETWORK_ERROR:
      return {
        title: 'Network Error',
        message: error.message,
        action: 'Check your connection and refresh the page'
      };
      
    case ErrorType.IPFS_ERROR:
      return {
        title: 'Storage Warning',
        message: error.message,
        action: 'Your NFT will still be created successfully'
      };
      
    case ErrorType.VALIDATION_ERROR:
      return {
        title: 'Validation Error',
        message: error.message,
        action: 'Please correct the input and try again'
      };
      
    default:
      return {
        title: 'Unexpected Error',
        message: error.message,
        action: 'Please try again or contact support if the issue persists'
      };
  }
}

/**
 * Log error for debugging (could be sent to analytics service)
 */
export function logError(error: GameError): void {
  console.error('Game Error:', {
    type: error.type,
    message: error.message,
    timestamp: new Date(error.timestamp).toISOString(),
    context: error.context,
    originalError: error.originalError
  });
  
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to Sentry, LogRocket, etc.
    // analytics.track('game_error', { ...error });
  }
}

