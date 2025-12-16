// storage/tokenService.ts
export const tokenService = {
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    setToken: (token: string): void => {
        localStorage.setItem('token', token);
    },

    removeToken: (): void => {
        localStorage.removeItem('token');
    },

    getUser: (): any => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setUser: (user: any): void => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    clear: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Exportez aussi les fonctions individuellement
export const getToken = tokenService.getToken;
export const setToken = tokenService.setToken;
export const removeToken = tokenService.removeToken;
export const getUser = tokenService.getUser;
export const setUser = tokenService.setUser;
export const clear = tokenService.clear;