import { create } from 'zustand';

const useAuthStore = create(
	(set, get) => ({
		isHost: false,
    hasPickedRole: false,
    userName: '',
    gameId: '',
		setIsHost: ( host ) => set({ isHost: host }),
    setHasPickedRole: ( hasPicked ) => set({ hasPickedRole : hasPicked}),
    setUserName: ( name ) => set({ userName: name }),
    setGameId: (gameId) => set({ gameId: gameId }),
	})
)

export default useAuthStore;