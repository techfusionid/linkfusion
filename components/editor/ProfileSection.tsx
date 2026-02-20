'use client';

import { useRef } from 'react';
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

interface ProfileSectionProps {
  variant?: 'bento' | 'classic';
}

export default function ProfileSection({ variant }: ProfileSectionProps) {
  const { profile, updateProfile, isEditing, theme } = useEditor();
  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If variant is not provided, check layoutPreset from context
  const isBento = variant === 'bento';

  // Avatar & text sizes: larger in bento mode
  const avatarSize = isBento ? 'w-32 h-32' : 'w-20 h-20';
  const avatarTextSize = isBento ? 'text-4xl' : 'text-2xl';
  const nameTextSize = isBento ? 'text-3xl' : 'text-2xl';
  const bioTextSize = isBento ? 'text-base' : 'text-sm';
  const containerPadding = isBento ? 'py-8' : 'py-6';

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateProfile({ avatarUrl: url });
    }
    e.target.value = '';
  };

  return (
    <div className={`flex flex-col space-y-5 ${containerPadding} ${isBento ? 'items-start text-left' : 'items-center text-center'}`}>
      <div className="relative group">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className={`${avatarSize} rounded-full object-cover shadow-elevated`}
          />
        ) : (
          <div className={`${avatarSize} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground ${avatarTextSize} font-display font-bold shadow-elevated`}>
            {initials}
          </div>
        )}
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`absolute inset-0 ${avatarSize} rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
            title="Upload photo"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      <div className={isBento ? 'space-y-2' : 'space-y-1'}>
        <h2
          contentEditable={isEditing}
          suppressContentEditableWarning
          className={`${nameTextSize} font-display font-bold outline-none tracking-tight`}
          style={{ color: isDarkColor(theme.bgColor) ? '#f1f5f9' : undefined }}
          onBlur={(e) => updateProfile({ name: e.currentTarget.textContent || '' })}
        >
          {profile.name}
        </h2>

        <p className="text-sm font-medium" style={{ color: isDarkColor(theme.bgColor) ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          @{profile.username}
        </p>

        <p
          contentEditable={isEditing}
          suppressContentEditableWarning
          className={`${bioTextSize} max-w-md outline-none leading-relaxed`}
          style={{ color: isDarkColor(theme.bgColor) ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}
          onBlur={(e) => updateProfile({ bio: e.currentTarget.textContent || '' })}
        >
          {profile.bio}
        </p>
      </div>
    </div>
  );
}
