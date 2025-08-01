// app/actions/notifications.ts
'use server';

import { db } from '@/shared/libs/database';
import {  NewsletterOwnerNotification, NewsletterOwnerNotificationCategory, NotificationPriority, NotificationStatus, NotificationType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface FetchNotificationsParams {
  userId: string;
  page?: number;
  pageSize?: number;
  status?: NotificationStatus;
  type?: NotificationType;
  unreadOnly?: boolean;
}

export async function fetchNotifications({
  userId,
  page = 1,
  pageSize = 10,
  status,
  type,
  unreadOnly = false,
}: FetchNotificationsParams): Promise<{
  data: NewsletterOwnerNotification[];
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    const skip = (page - 1) * pageSize;
    
    const [notifications, totalCount] = await Promise.all([
      db.newsletterOwnerNotification.findMany({
        where: {
          userId,
          ...(status && { status }),
          ...(type && { type }),
          ...(unreadOnly && { read: false }),
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),
      db.newsletterOwnerNotification.count({
        where: {
          userId,
          ...(status && { status }),
          ...(type && { type }),
          ...(unreadOnly && { read: false }),
        },
      }),
    ]);

    return {
      data: notifications,
      total: totalCount,
      page,
      pageSize,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
}

interface MarkAsReadResult {
  success: boolean;
  error?: string;
}

export async function markNotificationAsRead(
  notificationId: string,
  pathToRevalidate?: string
): Promise<MarkAsReadResult> {
  try {
    await db.newsletterOwnerNotification.update({
      where: { id: notificationId },
      data: { 
        read: true, 
        lastOpened: new Date() 
      },
    });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mark notification as read' 
    };
  }
}

export async function markAllAsRead(
  userId: string,
  pathToRevalidate?: string
): Promise<MarkAsReadResult> {
  try {
    await db.newsletterOwnerNotification.updateMany({
      where: { 
        userId,
        read: false 
      },
      data: { 
        read: true,
        lastOpened: new Date() 
      },
    });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mark all notifications as read' 
    };
  }
}

export async function deleteNotification(
  notificationId: string,
  pathToRevalidate?: string
): Promise<MarkAsReadResult> {
  try {
    await db.newsletterOwnerNotification.delete({
      where: { id: notificationId },
    });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete notification' 
    };
  }
}




interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  category: NewsletterOwnerNotificationCategory;
  title: string;
  content: any;
  textContent?: string;
  priority: NotificationPriority;
  metadata?: any;
  htmlContent: string; // <-- Add this
}

export async function createNotification(data: CreateNotificationInput) {
  try {
    const notification = await db.newsletterOwnerNotification.create({
      data: {
        userId: data.userId,
        type: data.type,
        category: data.category,
        title: data.title,
        content: data.content,
        textContent: data.textContent || null,
        priority: data.priority,
        metadata: data.metadata || {},
        htmlContent: data.htmlContent, // <-- Save HTML
      },
    });

    return { success: true, notification };
  } catch (error: any) {
    console.error("Create notification error:", error);
    return { success: false, error: error.message };
  }
}