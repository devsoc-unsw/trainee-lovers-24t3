import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
	(set, get) => ({
		isHost: false,
		setIsHost: ( host ) => set({ isHost: host })
	})
)

export default useAuthStore;