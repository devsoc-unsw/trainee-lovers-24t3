import { create } from 'zustand';

const useQuestionStore = create((set, get) => ({
  questionStore: [],
  setQuestionStore: (questions) => set({ questionStore: questions}),
}))

export default useQuestionStore;