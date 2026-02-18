'use client';

import { useRef, useState } from 'react';
import { useEditor } from '@/app/editor/context';
import { Camera } from 'lucide-react';

/** Returns true if a hex color is "dark" (text should be light) */
function isDarkColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

export default function ProfileSection() {
  const { profile, updateProfile, isEditing, layoutPreset, theme } = useEditor();
  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const isBento = layoutPreset === 'bento';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // For now, just set the avatar URL directly
      // TODO: Add cropping dialog
      updateProfile({ avatarUrl: url });
    }
    // Reset so re-uploading same file works
    e.target.value = '';
  };

  return (
    <div className={`flex flex-col space-y-3 py-6 ${isBento ? 'items-start text-left' : 'items-center text-center'}`}>
      <div className="relative group">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover shadow-elevated"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-display font-bold shadow-elevated">
            {initials}
          </div>
        )}
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 w-20 h-20 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Upload photo"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <h2
        contentEditable={isEditing}
        suppressContentEditableWarning
        className="text-2xl font-display font-bold outline-none"
        style={{ color: isDarkColor(theme.bgColor) ? '#f1f5f9' : undefined }}
        onBlur={(e) => updateProfile({ name: e.currentTarget.textContent || '' })}
      >
        {profile.name}
      </h2>

      <p className="text-sm" style={{ color: isDarkColor(theme.bgColor) ? 'rgba(255,255,255,0.55)' : undefined }}>
        @{profile.username}
      </p>

      <p
        contentEditable={isEditing}
        suppressContentEditableWarning
        className="text-sm max-w-md outline-none leading-relaxed"
        style={{ color: isDarkColor(theme.bgColor) ? 'rgba(255,255,255,0.55)' : undefined }}
        onBlur={(e) => updateProfile({ bio: e.currentTarget.textContent || '' })}
      >
        {profile.bio}
      </p>
    </div>
  );
}
