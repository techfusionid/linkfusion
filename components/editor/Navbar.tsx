'use client';

import { Pencil, Eye, BarChart3, Share2, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEditor } from '@/app/editor/context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export default function Navbar({ isEditing, onToggleEdit }: NavbarProps) {
  const { profile } = useEditor();

  return (
    <header className="h-12 flex items-center justify-between px-4 md:px-6 shrink-0 bg-card/80 backdrop-blur-sm border-b relative z-50">
      <h1 className="font-display text-lg font-bold tracking-tight">
        <span className="text-primary">Link</span>Fusion
      </h1>

      <div className="flex items-center gap-1.5">
        {/* Edit / Preview toggle */}
        {onToggleEdit && (
          <Button
            onClick={onToggleEdit}
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs"
          >
            {isEditing ? <Pencil className="w-3.5 h-3.5 mr-1.5" /> : <Eye className="w-3.5 h-3.5 mr-1.5" />}
            {isEditing ? 'Editing' : 'Preview'}
          </Button>
        )}

        <Link href="/analytics" className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Analytics">
          <BarChart3 className="w-4 h-4" />
        </Link>
        <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Share">
          <Share2 className="w-4 h-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center hover:bg-primary/20 transition-colors overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                profile?.name.charAt(0).toUpperCase() || 'U'
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{profile?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">@{profile?.username || 'user'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/analytics" className="cursor-pointer">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
