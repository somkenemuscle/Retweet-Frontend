import { create } from 'zustand';

// Define the CommentStore interface
interface CommentStore {
  tweet: Tweet | null;
  setTweet: (newTweet: Tweet) => void;
}

// Create the Zustand store with proper types
const useCommentStore = create<CommentStore>((set) => ({
  tweet: null,  // Initially, there is no tweet object
  setTweet: (newTweet: Tweet) => set({ tweet: newTweet }),
}));

export default useCommentStore;
