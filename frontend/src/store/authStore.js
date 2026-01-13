import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create (Store)
export const useAuthStore = create(
  persist(
    (set) => ({
      // Initial
      user: null,
      isAuthenticated: false,
      role: "GUEST", // 'ADMIN' o 'STUDENT'

      // Action: Login
      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
          role: userData.role || "STUDENT", // Por defecto estudiante si no viene rol
        }),

      // Action: Logout
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          role: "GUEST",
        }),

      // Action: Change Rol
      toggleRole: () =>
        set((state) => ({
          role: state.role === "ADMIN" ? "STUDENT" : "ADMIN",
        })),
    }),
    {
      name: "auth-storage", // Name Search Automatic
    }
  )
);
