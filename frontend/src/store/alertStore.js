import { create } from 'zustand';

const useAlertStore = create((set) => ({
  isOpen: false,
  message: '',
  title: 'Alert',
  
  showAlert: (message, title = 'Alert') => set({ isOpen: true, message, title }),
  closeAlert: () => set({ isOpen: false, message: '' })
}));

export default useAlertStore;
