import { create } from 'zustand';

interface DialogState {
    isDialogOpen: boolean;
    setIsDialogOpen: (isOpen: boolean) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
    isDialogOpen: false,
    setIsDialogOpen: (isOpen: boolean) => set({ isDialogOpen: isOpen }),
}));
