'use client';

import { useState, useRef } from 'react';
import { useEditor, BlockType, LayoutPreset } from '@/app/editor/context';
import {
  Smartphone, Monitor, Palette, Plus, Link2, Type, ImagePlus, Heading1, X, User, UserX, Sun, Moon, Pencil,
} from 'lucide-react';

const BG_PRESETS_LIGHT = [
  { label: 'Snow', value: '#f8fafc' },
  { label: 'Cream', value: '#fffbeb' },
  { label: 'Mint', value: '#ecfdf5' },
  { label: 'Lavender', value: '#f5f3ff' },
  { label: 'Rose', value: '#fff1f2' },
  { label: 'Sky', value: '#f0f9ff' },
  { label: 'Peach', value: '#ffedd5' },
  { label: 'Coral', value: '#fee2e2' },
  { label: 'Indigo', value: '#e0e7ff' },
  { label: 'Teal', value: '#ccfbf1' },
  { label: 'Yellow', value: '#fef9c3' },
  { label: 'Amber', value: '#fef3c7' },
  { label: 'Pink', value: '#fce7f3' },
  { label: 'Purple', value: '#f3e8ff' },
  { label: 'Lime', value: '#ecfccb' },
  { label: 'Gray', value: '#f1f5f9' },
];

const BG_PRESETS_DARK = [
  { label: 'Charcoal', value: '#1a1a2e' },
  { label: 'Navy', value: '#0f172a' },
  { label: 'Slate', value: '#1e293b' },
  { label: 'Ink', value: '#0a0a0a' },
  { label: 'Deep Purple', value: '#1e1b2e' },
  { label: 'Forest', value: '#0f1f1a' },
  { label: 'Maroon', value: '#1c1917' },
  { label: 'Midnight', value: '#020617' },
  { label: 'Zinc', value: '#18181b' },
  { label: 'Stone', value: '#292524' },
  { label: 'Neutral', value: '#171717' },
  { label: 'Crimson', value: '#271c19' },
  { label: 'Violet', value: '#1e1b4e' },
  { label: 'Fuchsia', value: '#2a1a2e' },
  { label: 'Emerald', value: '#022c22' },
  { label: 'Cyan', value: '#083344' },
];

const PATTERNS: Array<{ value: 'none' | 'dots' | 'grid' | 'lines'; label: string }> = [
  { value: 'none', label: '✕' },
  { value: 'dots', label: '⠿' },
  { value: 'grid', label: '▦' },
  { value: 'lines', label: '≡' },
];

const ADD_BLOCK_OPTIONS: { type: BlockType; icon: typeof Plus; label: string }[] = [
  { type: 'link', icon: Link2, label: 'URL' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'image', icon: ImagePlus, label: 'Image' },
  { type: 'heading', icon: Heading1, label: 'Heading' },
];

export default function BottomToolbar() {
  const {
    previewMode, setPreviewMode,
    theme, updateTheme, addBlock, profile, layoutPreset, setLayoutPreset, showBanner, setShowBanner, darkMode, setDarkMode,
  } = useEditor();

  const [showTheme, setShowTheme] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const bgPresets = darkMode ? BG_PRESETS_DARK : BG_PRESETS_LIGHT;
  const isCustomColor = !bgPresets.some(p => p.value === theme.bgColor);

  return (
    <>
      {/* Theme Popover */}
      {showTheme && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[360px] bg-card border rounded-2xl p-5 shadow-elevated animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-semibold text-foreground">Customize</span>
            <button onClick={() => setShowTheme(false)} className="p-1 rounded-md hover:bg-secondary">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Top Row: Banner Toggle | Divider | Theme Switcher */}
          <div className="flex items-center justify-between gap-3 mb-5">
            {/* Banner Toggle */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Banner</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowBanner(true)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    showBanner
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:scale-105'
                  }`}
                  title="Show banner"
                >
                  <User className="w-3.5 h-3.5" />
                  {showBanner && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
                  )}
                </button>
                <button
                  onClick={() => setShowBanner(false)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    !showBanner
                      ? 'bg-destructive text-destructive-foreground shadow-md shadow-destructive/30 scale-105'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:scale-105'
                  }`}
                  title="Hide banner"
                >
                  <UserX className="w-3.5 h-3.5" />
                  {!showBanner && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex-1 h-px bg-border/40" />

            {/* Theme Switcher */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Theme</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden shrink-0 ${
                  darkMode
                    ? 'bg-slate-900 text-yellow-400 shadow-md shadow-slate-900/50 scale-105'
                    : 'bg-amber-100 text-amber-600 shadow-md shadow-amber-200/50 scale-105'
                }`}
                title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/30" />
                </div>
                <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/50 via-orange-300/50 to-yellow-300/50" />
                </div>

                {/* Icon */}
                <div className="relative z-10">
                  {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
              </button>
            </div>
          </div>

          {/* Layout Preset */}
          <div className="mb-5">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Layout</label>
            <div className="flex gap-2">
              {([
                { value: 'classic' as LayoutPreset, label: 'Classic', desc: 'Profile top' },
                { value: 'bento' as LayoutPreset, label: 'Bento', desc: 'Profile left' },
              ]).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setLayoutPreset(opt.value)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${
                    layoutPreset === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:border-primary/30'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className={`text-[10px] mt-0.5 ${layoutPreset === opt.value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Colors - 8x2 grid */}
          <div className="mb-5">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Background</label>
            <div className="grid grid-cols-8 gap-2">
              {bgPresets.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => updateTheme({ bgColor: preset.value })}
                  className={`aspect-square rounded-full border-2 transition-all hover:scale-110 relative overflow-hidden ${
                    theme.bgColor === preset.value ? 'border-foreground scale-105' : 'border-border'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.label}
                >
                  {/* Subtle sheen overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                </button>
              ))}
              {/* Custom color picker */}
              <button
                onClick={() => colorInputRef.current?.click()}
                className="aspect-square rounded-full border-2 border-border hover:border-foreground/40 transition-all hover:scale-110 relative overflow-hidden"
                title="Custom color"
              >
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: theme.bgColor }} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Pencil className="w-3 h-3 text-foreground/60" />
                </div>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={theme.bgColor}
                  onChange={(e) => updateTheme({ bgColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </button>
            </div>
          </div>

          {/* Patterns */}
          <div className="mb-5">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Pattern</label>
            <div className="flex gap-2">
              {PATTERNS.map(p => (
                <button
                  key={p.value}
                  onClick={() => updateTheme({ pattern: p.value })}
                  className={`flex-1 h-10 rounded-full border-2 text-sm flex items-center justify-center transition-all ${
                    theme.pattern === p.value
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Corners */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Corners</label>
            <div className="flex gap-2">
              {([
                { value: 'sm' as const, radius: 'rounded-sm' },
                { value: 'md' as const, radius: 'rounded-md' },
                { value: 'lg' as const, radius: 'rounded-lg' },
                { value: 'xl' as const, radius: 'rounded-xl' },
              ]).map(r => (
                <button
                  key={r.value}
                  onClick={() => updateTheme({ cardRadius: r.value })}
                  className={`flex-1 py-2 text-xs uppercase font-medium transition-colors border ${r.radius} ${
                    theme.cardRadius === r.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                  }`}
                >
                  {r.value}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Block Popover */}
      {showAddBlock && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-card border rounded-2xl p-4 shadow-elevated animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center gap-3">
            {ADD_BLOCK_OPTIONS.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => { addBlock(type); setShowAddBlock(false); }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all w-[90px]"
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showTheme || showAddBlock) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowTheme(false); setShowAddBlock(false); }} />
      )}

      {/* Toolbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-card border rounded-full p-2 shadow-elevated">
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-3 rounded-full transition-all hover:scale-110 ${previewMode === 'mobile' ? 'bg-foreground text-background' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <Smartphone className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-3 rounded-full transition-all hover:scale-110 ${previewMode === 'desktop' ? 'bg-foreground text-background' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <Monitor className="w-4.5 h-4.5" />
          </button>
          <div className="h-5 w-px bg-border mx-1" />
          <span className="text-xs text-muted-foreground pr-3 select-none">linkfusion.app/{profile.username}</span>
        </div>

        <div className="flex items-center gap-1 bg-card border rounded-full p-2 shadow-elevated">
          <button
            onClick={() => { setShowAddBlock(!showAddBlock); setShowTheme(false); }}
            className={`p-3 rounded-full transition-all hover:scale-110 ${showAddBlock ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
            title="Add block"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => { setShowTheme(!showTheme); setShowAddBlock(false); }}
            className={`p-3 rounded-full transition-all hover:scale-110 ${showTheme ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
            title="Customize"
          >
            <Palette className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </>
  );
}
