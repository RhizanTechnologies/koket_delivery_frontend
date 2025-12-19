"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, Edit, Trash2, KeyRound } from "lucide-react";
import { UserStats } from "./UserStats";

interface UserStatsData {
  totalOrders: number;
  totalSpending: number;
  recentRatings: any[];
}

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    phone_number: string;
    joinedDate: string;
    initials: string;
    profileImage?: string;
  };
  stats?: UserStatsData;
  onEdit: () => void;
  onDelete: () => void;
  onChangePassword?: () => void;
}

export function UserProfileCard({
  user,
  stats,
  onEdit,
  onDelete,
  onChangePassword,
}: UserProfileCardProps) {
  return (
    <Card className="p-6 border rounded-2xl shadow-sm">
      <div className="flex flex-col gap-6">
        {/* Top Section: User Info & Actions */}
        <div className="flex flex-col lg:flex-row items-start  justify-between gap-4">
          <div className="flex  gap-4">
            <Avatar className="h-16 w-16 bg-primary/10 hidden md:block">
              {user.profileImage && (
                <AvatarImage src={user.profileImage} alt={user.name} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold ">
                {user.initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <Badge className="bg-primary text-primary-foreground text-sm md:text-base">
                  User
                </Badge>
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-xs md:text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-xs md:text-sm">
                    Joined {user.joinedDate}
                  </span>
                </div>
                {user.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-xs md:text-sm">
                      {user.phone_number}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 self-end lg:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2 border-border hover:bg-background-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            {onChangePassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={onChangePassword}
                className="flex items-center gap-2 border-border hover:bg-background-2"
              >
                <KeyRound className="h-4 w-4" />
                Password
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* User Stats Section */}
        <UserStats
          totalOrders={stats?.totalOrders || 0}
          totalSpent={stats?.totalSpending || 0}
        />
      </div>
    </Card>
  );
}
