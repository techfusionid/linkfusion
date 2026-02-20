'use client';

import { useState, useRef } from 'react';
import { useEditor, BlockType, LayoutPreset } from '@/app/editor/context';
import {
  Smartphone, Monitor, Palette, Plus, Link2, Type, ImagePlus, Heading1, X, User,
} from 'lucide-react';

const BG_PRESETS_LIGHT = [
  { label: 'Snow', value: '#f8fafc' },
  { label: 'Cream', value: '#fffbeb' },
  { label: 'Mint', value: '#ecfdf5' },
  { label: 'Lavender', value: '#f5f3ff' },
  { label: 'Rose', value: '#fff1f2' },
  { label: 'Sky', value: '#f0f9ff' },
];

const BG_PRESETS_DARK = [
  { label: 'Charcoal', value: '#1a1a2e' },
  { label: 'Navy', value: '#0f172a' },
  { label: 'Slate', value: '#1e293b' },
  { label: 'Ink', value: '#171717' },
  { label: 'Deep Purple', value: '#1e1b2e' },
  { label: 'Forest', value: '#0f1f1a' },
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
    theme, updateTheme, addBlock, profile, layoutPreset, setLayoutPreset, showBanner, setShowBanner,
  } = useEditor();

  const [showTheme, setShowTheme] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const bgPresets = colorMode === 'light' ? BG_PRESETS_LIGHT : BG_PRESETS_DARK;

  return (
    <>
      {/* Theme Popover */}
      {showTheme && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[340px] bg-card border rounded-2xl p-5 shadow-elevated animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-foreground">Customize</span>
            <button onClick={() => setShowTheme(false)} className="p-1 rounded-md hover:bg-secondary">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Layout Preset */}
          <div className="mb-4">
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

          {/* Colors */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Colors</label>
              <div className="flex bg-secondary rounded-lg p-0.5">
                <button
                  onClick={() => setColorMode('light')}
                  className={`px-2 py-0.5 text-[10px] rounded-md font-medium transition-colors ${colorMode === 'light' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setColorMode('dark')}
                  className={`px-2 py-0.5 text-[10px] rounded-md font-medium transition-colors ${colorMode === 'dark' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  Dark
                </button>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {bgPresets.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => updateTheme({ bgColor: preset.value })}
                  className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                    theme.bgColor === preset.value ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.label}
                />
              ))}
              {/* Custom color picker */}
              <button
                onClick={() => colorInputRef.current?.click()}
                className="w-9 h-9 rounded-full border-2 border-border hover:border-foreground/40 transition-all hover:scale-110 overflow-hidden relative"
                style={{
                  background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                }}
                title="Custom color"
              >
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
          <div className="mb-4">
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Patterns</label>
            <div className="flex gap-2">
              {PATTERNS.map(p => (
                <button
                  key={p.value}
                  onClick={() => updateTheme({ pattern: p.value })}
                  className={`w-10 h-10 rounded-full border-2 text-base flex items-center justify-center transition-all ${
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

          {/* Card Corners - buttons themselves are rounded to match */}
          <div className="mb-4">
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

          {/* Banner Toggle - Two button style */}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-xs font-medium text-foreground">Banner</div>
              <div className="text-[10px] text-muted-foreground">Profile + Bio</div>
            </div>
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setShowBanner(false)}
                className={`relative w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200 ${
                  !showBanner
                    ? 'bg-card shadow-sm scale-100'
                    : 'hover:bg-card/50 scale-95 opacity-60'
                }`}
              >
                <X className={`w-4 h-4 transition-colors ${!showBanner ? 'text-foreground' : 'text-muted-foreground'}`} />
                {!showBanner && (
                  <span className="absolute inset-0 rounded-md bg-primary/10 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setShowBanner(true)}
                className={`relative w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200 ${
                  showBanner
                    ? 'bg-card shadow-sm scale-100'
                    : 'hover:bg-card/50 scale-95 opacity-60'
                }`}
              >
                <User className={`w-4 h-4 transition-colors ${showBanner ? 'text-foreground' : 'text-muted-foreground'}`} />
                {showBanner && (
                  <span className="absolute inset-0 rounded-md bg-primary/10 animate-pulse" />
                )}
              </button>
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

      {/* Toolbar - now only device toggle, url, add, theme */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-card border rounded-full p-1.5 shadow-elevated">
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-2.5 rounded-full transition-colors ${previewMode === 'mobile' ? 'bg-foreground text-background' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-2.5 rounded-full transition-colors ${previewMode === 'desktop' ? 'bg-foreground text-background' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-border mx-1" />
          <span className="text-xs text-muted-foreground pr-3 select-none">linkfusion.app/{profile.username}</span>
        </div>

        <div className="flex items-center gap-1 bg-card border rounded-full p-1.5 shadow-elevated">
          <button
            onClick={() => { setShowAddBlock(!showAddBlock); setShowTheme(false); }}
            className={`p-2.5 rounded-full transition-colors ${showAddBlock ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
            title="Add block"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setShowTheme(!showTheme); setShowAddBlock(false); }}
            className={`p-2.5 rounded-full transition-colors ${showTheme ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
            title="Customize"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
