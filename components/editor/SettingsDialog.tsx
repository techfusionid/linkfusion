'use client';

import { useEditor } from '@/app/editor/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { X, ChevronDown, Check } from 'lucide-react';

export default function SettingsDialog() {
  const { showSettingsSidebar, setShowSettingsSidebar, profile, updateProfile, theme, updateTheme } = useEditor();

  if (!showSettingsSidebar) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b bg-card">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettingsSidebar(false)}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 max-w-3xl mx-auto space-y-6 overflow-y-auto h-[calc(100vh-56px)]">
        {/* Profile Section */}
        <div className="space-y-3">
          <h3 className="text-xs text-muted-foreground font-medium">profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Username</Label>
              <Input
                value={profile.username}
                onChange={(e) => updateProfile({ username: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Bio</Label>
            <Input
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Avatar URL</Label>
            <Input
              value={profile.avatarUrl || ''}
              onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
              placeholder="https://..."
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-3">
          <h3 className="text-xs text-muted-foreground font-medium">appearance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.bgColor}
                  onChange={(e) => updateTheme({ bgColor: e.target.value })}
                  className="w-10 h-8 p-1 cursor-pointer"
                />
                <Input
                  value={theme.bgColor}
                  onChange={(e) => updateTheme({ bgColor: e.target.value })}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => updateTheme({ accentColor: e.target.value })}
                  className="w-10 h-8 p-1 cursor-pointer"
                />
                <Input
                  value={theme.accentColor}
                  onChange={(e) => updateTheme({ accentColor: e.target.value })}
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Pattern</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-8 text-sm justify-between">
                    <span className="capitalize">{theme.pattern}</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {['none', 'dots', 'grid', 'lines'].map((p) => (
                    <DropdownMenuItem
                      key={p}
                      onClick={() => updateTheme({ pattern: p as typeof theme.pattern })}
                      className="text-sm justify-between capitalize"
                    >
                      {p}
                      {theme.pattern === p && <Check className="w-3 h-3" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Card Radius</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-8 text-sm justify-between">
                    <span className="capitalize">{theme.cardRadius === 'sm' ? 'Small' : theme.cardRadius === 'md' ? 'Medium' : theme.cardRadius === 'lg' ? 'Large' : 'Extra Large'}</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {[
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' },
                  ].map((r) => (
                    <DropdownMenuItem
                      key={r.value}
                      onClick={() => updateTheme({ cardRadius: r.value as typeof theme.cardRadius })}
                      className="text-sm justify-between"
                    >
                      {r.label}
                      {theme.cardRadius === r.value && <Check className="w-3 h-3" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Toggles Section */}
        <div className="space-y-3">
          <h3 className="text-xs text-muted-foreground font-medium">options</h3>
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm">Show Banner</Label>
            <Switch
              checked={theme.showBanner}
              onCheckedChange={(checked) => updateTheme({ showBanner: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm">Dark Mode</Label>
            <Switch
              checked={theme.darkMode}
              onCheckedChange={(checked) => updateTheme({ darkMode: checked })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => setShowSettingsSidebar(false)}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
