import { createJSONStorage, persist } from 'zustand/middleware';

import { create } from 'zustand';

export type Notification = {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

interface NotificationState {
  notifications: Array<Notification>;
  append: (title: string, description: string, variant?: 'default' | 'destructive') => void;
  remove: (index: string) => void;
  purge: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      append: (title: string, description: string, variant = 'default') => {
        set((state) => {
          return {
            notifications: [
              ...state.notifications,
              {
                id: new Date().getTime().toString(),
                title,
                description,
                variant,
              },
            ],
          };
        });
      },
      remove: (id: string) => {
        set((state) => {
          return {
            notifications: state.notifications.filter((notification) => notification.id !== id),
          };
        });
      },
      purge: () => {
        set(() => {
          return {
            notifications: [],
          };
        });
      },
    }),
    {
      name: 'notification',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
