// hooks/useNotifications.ts
'use client';

import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllAsRead,
  deleteNotification,
} from '@/actions/notification/notifications';
import { NewsletterOwnerNotification, NotificationStatus, NotificationType } from '@prisma/client';
import { useEffect, useState } from 'react';

interface UseNotificationsReturn {
  notifications: NewsletterOwnerNotification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}

interface UseNotificationsOptions {
  initialPage?: number;
  initialPageSize?: number;
  status?: NotificationStatus;
  type?: NotificationType;
  unreadOnly?: boolean;
}

export function useNotifications(
  userId: string,
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NewsletterOwnerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(options.initialPage || 1);
  const [pageSize, setPageSize] = useState(options.initialPageSize || 10);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchNotifications({
        userId,
        page,
        pageSize,
        status: options.status,
        type: options.type,
        unreadOnly: options.unreadOnly,
      });
      setNotifications(result.data);
      setTotal(result.total);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    await fetchData();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true, lastOpened: new Date() } : n
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(userId);
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, lastOpened: new Date() }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotal(prev => prev - 1);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, page, pageSize, options.status, options.type, options.unreadOnly, fetchData]);

  return {
    notifications,
    loading,
    error,
    unreadCount: notifications.filter(n => !n.read).length,
    refreshNotifications,
    markAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    pagination: {
      page,
      pageSize,
      total,
      setPage,
      setPageSize,
    },
  };
}