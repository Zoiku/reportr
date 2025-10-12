import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "@/configs/firebase";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  error: null,
  isAuthenticating: true,

  getIsAuthenticated: () => !!get().user,

  signIn: async () => {
    set({ isAuthenticating: true });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      set({ error });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signOut: async () => {
    set({ isAuthenticating: true });
    try {
      await signOut(auth);
      set({ user: null, error: null });
    } catch (error) {
      set({ error });
    } finally {
      set({ isAuthenticating: false });
    }
  },
}));

onAuthStateChanged(auth, async (user) => {
  useAuthStore.setState({ isAuthenticating: true });
  if (!user) {
    useAuthStore.setState({ user: null, error: null });
  } else {
    useAuthStore.setState({ user, error: null });
  }
  useAuthStore.setState({ isAuthenticating: false });
});
