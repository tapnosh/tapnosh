"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of a notification
interface Notification {
  id: string;
  content: ReactNode;
  persistent: boolean;
  timeout?: number;
}

// Define the context type
interface NotificationsContextType {
  notifications: Notification[];
  openNotification: (
    content: ReactNode,
    options?: { timeout?: number; persistent?: boolean },
  ) => string;
  closeNotification: (id: string) => void;
}

// Create the context
const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

// Custom hook for consuming the notifications context
export const useNotification = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

// NotificationProvider component that provides the notifications context
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to open a new notification
  const openNotification = (
    content: ReactNode,
    options?: { timeout?: number; persistent?: boolean },
  ) => {
    const id = Date.now().toString(); // simple id generation using current time
    const persistent = options?.persistent ?? false;
    const timeout = options?.timeout ?? 2000;

    const newNotification: Notification = { id, content, persistent, timeout };
    setNotifications((prev) => [...prev, newNotification]);

    // If notification is not persistent and timeout is provided, auto close it
    if (!persistent && timeout) {
      setTimeout(() => {
        closeNotification(id);
      }, timeout);
    }

    return id;
  };

  // Function to close a notification manually
  const closeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, openNotification, closeNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationProvider;
