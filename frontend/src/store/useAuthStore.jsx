import { create } from 'zustand';

const useAuthStore = create(
	(set, get) => ({
		isHost: false,
    username: '',
    gameId: '',
    users: [],
    showEnterNameModal: false,
    showGameIdModal: false,
    showStartGameModal : false,
    showSelectQuestionsModal: false,
		setIsHost: ( host ) => set({ isHost: host }),
    setUsername: ( name ) => set({ username: name }),
    setGameId: ( gameId ) => set({ gameId: gameId }),
    setUsers: (users) => set({ users: users }),
    setShowEnterNameModal: ( showModal ) => set({ showEnterNameModal : showModal }),
    setShowGameIdModal : ( showModal ) => set({ showGameIdModal : showModal }),
    setShowStartGameModal : ( showModal ) => set({ showStartGameModal: showModal }),
    setShowSelectQuestionsModal: ( showModal ) => set({ showSelectQuestionsModal : showModal })
	})
)

export default useAuthStore;