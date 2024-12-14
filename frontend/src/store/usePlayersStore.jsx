import { create } from 'zustand';

const usePlayersStore = create((set, get) => ({
  players: [],
  setPlayers: (players) => set({ players: players}),
  handleUpdateRoom: (userDetails) => {  // function to handle update rooom
    const { setPlayers } = get();
    setPlayers(userDetails.map(u => u.username));
    console.log(userDetails.map(u => u.username))
  }
}))

export default usePlayersStore;