import { create } from 'zustand';

// Define the TweetStore interface
interface TweetStore {
    tweets: Tweet[];
    setTweets: (newTweets: Tweet[]) => void;
}

// Create the Zustand store with proper types
const useTweetStore = create<TweetStore>((set) => ({
    tweets: [],
    setTweets: (newTweets: Tweet[]) => set({ tweets: newTweets }),
}));

export default useTweetStore;
