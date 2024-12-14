import { create } from 'zustand';

const useAuthStore = create(
	(set, get) => ({
		isHost: false,
    username: '',
    roomCode: '',
    userId: '',
    showEnterNameModal: false,
    showGameIdModal: false,
    showStartGameModal : false,
    showSelectQuestionsModal: false,
		setIsHost: ( host ) => set({ isHost: host }),
    setUsername: ( name ) => set({ username: name }),
    setRoomCode: ( roomCode ) => set({ roomCode: roomCode }),
    setShowEnterNameModal: ( showModal ) => set({ showEnterNameModal : showModal }),
    setShowGameIdModal : ( showModal ) => set({ showGameIdModal : showModal }),
    setShowStartGameModal : ( showModal ) => set({ showStartGameModal: showModal }),
    setShowSelectQuestionsModal: ( showModal ) => set({ showSelectQuestionsModal : showModal }),
    setUserId: (id) => ({ userId: id })
	})
)

export default useAuthStore;