import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      role: "guest", // 'admin', 'student', 'guest'

      // Acción de Login
      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
          role: userData.role,
        }),

      // Acción de Logout
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          role: "guest",
        }),
    }),
    {
      name: "scholarship-auth-storage", // Nombre para guardar en LocalStorage
    },
  ),
);
