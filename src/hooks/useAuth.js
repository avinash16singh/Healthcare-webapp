export function useAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      isAuthenticated: !!user,
      role: user?.role || 'guest',
    };
  }