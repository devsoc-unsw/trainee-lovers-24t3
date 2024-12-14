import { create } from 'zustand';

const usePlayersStore = create((set, get) => ({
  players: [],
  setPlayers: (players) => set({ players: players})
}))

export default usePlayersStore;