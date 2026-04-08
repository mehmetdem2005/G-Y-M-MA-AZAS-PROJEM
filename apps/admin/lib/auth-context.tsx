'use client';

export function useAuth() {
  return {
    logout: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  };
}
