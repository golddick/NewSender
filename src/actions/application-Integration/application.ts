

"use server"

import { db } from "@/shared/libs/database"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export type IntegrationData = {
  name: string
  url: string
  logo?: string
  email?: string
  status?: "active" | "inactive"
  category: string
  description?: string
}

export type IntegrationWithMetrics = IntegrationData & {
  id: string
  apiKey?: string
  webhookUrl?: string
  campaigns?: number
  subscribers?: number
  emailsSent?: number
  openRate?: number
  clickRate?: number
  conversionRate?: number
  lastSync?: string
  dateAdded: string
}


import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage"


export async function addIntegration(data: IntegrationData) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  try {
    // Step 1: Check usage limit
    const usageCheck = await checkUsageLimit(user.id, "appIntegrated")
    if (!usageCheck.success) {
      throw new Error(usageCheck.message || "Usage limit reached")
    }

    // Step 2: Create integration
    const integration = await db.integration.create({
      data: {
        name: data.name,
        url: data.url,
        logo: data.logo,
        email: data.email || user.primaryEmailAddress?.emailAddress,
        status: data.status || "inactive",
        category: data.category,
        description: data.description,
        userId: user.id
      }
    })

    // Step 3: Increment usage count
    await incrementUsage(user.id, "appIntegrated")

    // Step 4: Revalidate cache path
    revalidatePath("/dashboard/integration")

    return integration
  } catch (error) {
    console.error("Integration creation failed:", error)
    throw new Error(
      error instanceof Error ? error.message : "Failed to create integration"
    )
  }
}


export async function getIntegrations() {
  const user = await currentUser()
  if (!user) return { error: "Unauthorized" }

  try {
    const integrations = await db.integration.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    })


    return {
      data: integrations.map(i => ({
        id: i.id,
        name: i.name,
        url: i.url,
        logo: i.logo,
        email: i.email,
        status: i.status,
        category: i.category,
        description: i.description,
        apiKey: i.apiKey,
        webhookUrl: i.webhookUrl,
        campaigns: i.campaigns,
        subscribers: i.subscribers,
        emailsSent: i.emailsSent,
        openRate: i.openRate,
        clickRate: i.clickRate,
        conversionRate: i.conversionRate,
        lastSync: i.lastSync?.toISOString(),
        dateAdded: i.createdAt
      }))
    }
  } catch (error) {
    console.error("Failed to fetch integrations:", error)
    return { error: "Failed to fetch integrations" }
  }
}

export async function getIntegrationByName(name: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const integration = await db.integration.findFirst({
      where: { name, userId: user.id },
      include: {
        _count: {
          select: {
            Email: true, // This will count all emails associated with the integration
          },
        },
      },
    });

    if (!integration) return { error: "Integration not found" };

    return {
      data: {
        id: integration.id,
        name: integration.name,
        url: integration.url,
        logo: integration.logo,
        email: integration.email,
        status: integration.status,
        category: integration.category,
        description: integration.description,
        apiKey: integration.apiKey,
        webhookUrl: integration.webhookUrl,
        campaigns: integration.campaigns,
        subscribers: integration.subscribers,
        emailsSent: integration.emailsSent,
        openRate: integration.openRate,
        clickRate: integration.clickRate,
        totalEmailCount: integration._count.Email, // Added total email count
        conversionRate: integration.conversionRate,
        lastSync: integration.lastSync?.toISOString(),
        dateAdded: integration.createdAt.toISOString().split('T')[0],
      },
    };
  } catch (error) {
    console.error("Failed to fetch integration:", error);
    return { error: "Failed to fetch integration" };
  }
}

export async function updateIntegration(id: string, data: Partial<IntegrationData>) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  try {
    const integration = await db.integration.update({
      where: { id, userId: user.id },
      data: {
        name: data.name,
        url: data.url,
        logo: data.logo,
        email: data.email,
        status: data.status,
        category: data.category,
        description: data.description
      }
    })
    revalidatePath("/dashboard/integration")
    return integration
  } catch (error) {
    console.error("Failed to update integration:", error)
    throw new Error("Failed to update integration")
  }
}

export async function updateIntegrationMetrics(
  id: string,
  metrics: {
    campaigns?: number
    subscribers?: number
    emailsSent?: number
    openRate?: number
    clickRate?: number
    conversionRate?: number
    lastSync?: string
  }
) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  try {
    const integration = await db.integration.update({
      where: { id, userId: user.id },
      data: {
        campaigns: metrics.campaigns,
        subscribers: metrics.subscribers,
        emailsSent: metrics.emailsSent,
        openRate: metrics.openRate,
        clickRate: metrics.clickRate,
        conversionRate: metrics.conversionRate,
        lastSync: metrics.lastSync ? new Date(metrics.lastSync) : null
      }
    })
    revalidatePath("/dashboard/integration")
    return integration
  } catch (error) {
    console.error("Failed to update integration metrics:", error)
    throw new Error("Failed to update metrics")
  }
}

export async function updateIntegrationStatus(id: string, status: "active" | "inactive") {
  const user = await currentUser()
  if (!user) return { error: "Unauthorized" }

  try {
    const updatedIntegration = await db.integration.update({
      where: { id, userId: user.id },
      data: { status }
    })
  revalidatePath("/dashboard/integration")
    return { data: updatedIntegration }
  } catch (error) {
    console.error("Failed to update integration status:", error)
    return { error: "Failed to update status" }
  }
}

export async function deleteIntegration(id: string) {
  const user = await currentUser()
  if (!user) return { error: "Unauthorized" }

  try {
    await db.integration.delete({
      where: { id, userId: user.id }
    })
    revalidatePath("/dashboard/integration")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete integration:", error)
    return { error: "Failed to delete integration" }
  }
}


export async function getIntegrationsWithCampaigns(userId: string) {

  if (!userId) {
    return
  }

  try {
    
    const integrations = await db.integration.findMany({
      where: { userId },
      include: {
        Campaign: {
          where: {
            userId,
            status: "active"
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      data: integrations.map(integration => ({
        id: integration.id,
        name: integration.name,
        url: integration.url,
        logo: integration.logo,
        email: integration.email,
        status: integration.status,
        category: integration.category,
        description: integration.description,
        apiKey: integration.apiKey,
        webhookUrl: integration.webhookUrl,
        subscribers: integration.subscribers,
        emailsSent: integration.emailsSent,
        openRate: integration.openRate,
        clickRate: integration.clickRate,
        conversionRate: integration.conversionRate,
        lastSync: integration.lastSync?.toISOString(),
        dateAdded: integration.createdAt,
        campaigns: integration.Campaign.map(campaign => ({
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          status: campaign.status,
          createdAt: campaign.createdAt
        }))
      }))
    };
  } catch (error) {
    console.error("Failed to fetch integrations with campaigns:", error);
    return { error: "Failed to fetch integrations with campaigns" };
  }
}