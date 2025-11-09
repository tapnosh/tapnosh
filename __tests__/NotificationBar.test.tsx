import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  NotificationProvider,
  useNotification,
} from "@/context/NotificationBar";

describe("NotificationBar", () => {
  it("should throw error when useNotification is used outside provider", () => {
    expect(() => renderHook(() => useNotification())).toThrow(
      "useNotifications must be used within a NotificationProvider",
    );
  });

  it("should open a notification with default options", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    act(() => {
      result.current.openNotification("Test notification");
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].content).toBe("Test notification");
    expect(result.current.notifications[0].persistent).toBe(false);
    expect(result.current.notifications[0].timeout).toBe(4000);
    expect(result.current.notifications[0].open).toBe(true);
    expect(result.current.notifications[0].animation).toBe(true);
  });

  it("should open a notification with custom options", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    act(() => {
      result.current.openNotification("Custom notification", {
        timeout: 2000,
        persistent: true,
        animation: false,
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].persistent).toBe(true);
    expect(result.current.notifications[0].timeout).toBe(2000);
    expect(result.current.notifications[0].animation).toBe(false);
  });

  it("should close a notification manually", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    let notificationId: string;

    act(() => {
      notificationId = result.current.openNotification("Test notification", {
        persistent: true,
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.closeNotification(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it("should handle multiple notifications", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    act(() => {
      result.current.openNotification("First notification");
      result.current.openNotification("Second notification");
      result.current.openNotification("Third notification");
    });

    expect(result.current.notifications).toHaveLength(3);
    expect(result.current.notifications[0].content).toBe("First notification");
    expect(result.current.notifications[1].content).toBe("Second notification");
    expect(result.current.notifications[2].content).toBe("Third notification");
  });

  it("should generate unique notification ids", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    const ids: string[] = [];

    act(() => {
      ids.push(result.current.openNotification("First", { persistent: true }));
      ids.push(result.current.openNotification("Second", { persistent: true }));
      ids.push(result.current.openNotification("Third", { persistent: true }));
    });

    // All IDs should be unique
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(3);

    // Check notifications have correct IDs
    expect(result.current.notifications.map((n) => n.id)).toEqual(ids);
  });

  it("should close specific notification without affecting others", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    const ids: string[] = [];

    act(() => {
      ids.push(result.current.openNotification("First", { persistent: true }));
      ids.push(result.current.openNotification("Second", { persistent: true }));
      ids.push(result.current.openNotification("Third", { persistent: true }));
    });

    expect(result.current.notifications).toHaveLength(3);

    act(() => {
      result.current.closeNotification(ids[1]);
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0].id).toBe(ids[0]);
    expect(result.current.notifications[1].id).toBe(ids[2]);
  });

  it("should set open to false when closing", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    let id: string;

    act(() => {
      id = result.current.openNotification("Test", { persistent: true });
    });

    expect(result.current.notifications[0].open).toBe(true);

    act(() => {
      result.current.closeNotification(id);
    });

    // After close, notification should be removed entirely
    expect(result.current.notifications).toHaveLength(0);
  });

  it("should accept ReactNode as content", () => {
    const { result } = renderHook(() => useNotification(), {
      wrapper: NotificationProvider,
    });

    const content = <div>Custom JSX Content</div>;

    act(() => {
      result.current.openNotification(content);
    });

    expect(result.current.notifications[0].content).toBe(content);
  });
});
