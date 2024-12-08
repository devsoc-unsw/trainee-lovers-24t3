import { create } from 'zustand';

const useAuthStore = create(
	(set, get) => ({
		isHost: false,
    hasPickedRole: false,
    userName: '',
		setIsHost: ( host ) => set({ isHost: host }),
    setHasPickedRole: ( hasPicked ) => set({ hasPickedRole : hasPicked}),
    setUserName: ( name ) => set({ userName: name }),
	})
)

export default useAuthStore;