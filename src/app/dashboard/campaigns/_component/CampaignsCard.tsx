
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Eye,
  Mail,
  TrendingUp,
  Users,
  MoreVertical,
  Edit3,
  Archive,
  Trash2,
  Play,
} from "lucide-react";
import { Campaign, CampaignStatus, Email } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { updateCampaign, updateCampaignStatus } from "@/actions/campaign/campaign";
import { deleteCampaign } from "@/actions/campaign/delete.campaign";
import { useRouter } from "next/navigation";

interface CampaignsCardProps {
  campaign: Campaign & { emails?: Email[] };
  getStatusColor: (status: CampaignStatus) => string;
  getTypeColor: (type: string) => string;
  onCampaignUpdated?: () => void;
}

export default function CampaignsCard({
  campaign,
  getStatusColor,
  getTypeColor,
  onCampaignUpdated,
}: CampaignsCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: campaign.name,
    description: campaign.description ?? "",
    type: campaign.type ?? "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    setForm({
      name: campaign.name,
      description: campaign.description ?? "",
      type: campaign.type ?? "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await updateCampaign(campaign.id, form);
      toast.success("Campaign updated");
      router.refresh()
      setEditOpen(false);
      onCampaignUpdated?.();
    } catch {
      toast.error("Failed to update campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = campaign.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateCampaignStatus(campaign.id, newStatus);
      toast.success(`Campaign ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`);
      router.refresh()
      onCampaignUpdated?.();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      setLoading(true);
      await deleteCampaign(campaign.id);
      toast.success("Campaign deleted");
      router.refresh()
      onCampaignUpdated?.();
    } catch {
      toast.error("Failed to delete campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-black text-white border border-gray-200 rounded-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
            <div className=" flex items-center justify-between w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white capitalize">
                  {campaign.name}
                </h3>
                <Badge className={`${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </Badge>
                <Badge className={`${getTypeColor(campaign.type ?? "default capitalize")}`}>
                  {campaign.type}
                </Badge>
              </div>
               {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Campaign
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {campaign.status === "ACTIVE" ? (
                    <>
                      <Archive className="h-4 w-4 mr-2" /> Deactivate
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
              <p className="text-gray-400 text-sm sm:text-base mb-3 capitalize">
                {campaign.description}
              </p>
              {/* Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                {[
                  {
                    icon: <Users className="h-4 w-4 text-yellow-400" />,
                    label: "Recipients",
                    value: (campaign.recipients ?? 0).toLocaleString(),
                  },
                  {
                    icon: <Mail className="h-4 w-4 text-yellow-400" />,
                    label: "Emails",
                    value: campaign.emails?.length?.toLocaleString() ?? "0",
                  },
                  {
                    icon: <TrendingUp className="h-4 w-4 text-yellow-400" />,
                    label: "Total Sent",
                    value: campaign.emailsSent.toLocaleString(),
                  },
                  {
                    icon: <Eye className="h-4 w-4 text-yellow-400" />,
                    label: "Open Rate",
                    value: `${campaign.openRate || 0}%`,
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg text-black p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {item.icon}
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              {/* Timeline */}
              <div className="flex gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created: {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
                {campaign.lastSentAt && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Last email: {new Date(campaign.lastSentAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

           
          </div>
        </CardContent>
      </Card>

      {/* Edit Campaign Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Campaign Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div> 
        </DialogContent>
      </Dialog>
    </>
  );
}
