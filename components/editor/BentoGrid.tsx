'use client';

import { useCallback, useState, useRef } from 'react';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useEditor, BlockType } from '@/app/editor/context';
import {
  ExternalLink,
  Image as ImageIcon,
  X,
  Pencil,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  Upload,
  Plus,
  Type,
  Heading1,
  ImagePlus,
} from 'lucide-react';

const GridLayout = WidthProvider(ReactGridLayout);

/** Returns true if a hex color is "dark" (text should be light) */
function isDarkColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Perceived luminance
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function textColorFor(bgColor?: string): string {
  if (!bgColor) return 'inherit';
  return isDarkColor(bgColor) ? '#f1f5f9' : '#1e293b';
}

const SIZE_PRESETS = [
  { label: '1×1', w: 1, h: 1 },
  { label: '2×1', w: 2, h: 1 },
  { label: '1×2', w: 1, h: 2 },
  { label: '2×2', w: 2, h: 2 },
  { label: '4×1', w: 4, h: 1 },
];

// Simple richtext toolbar
function RichTextToolbar({ blockId }: { blockId: string }) {
  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  return (
    <div
      className="flex items-center gap-0.5 bg-card border rounded-lg p-1 shadow-elevated"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        onClick={() => execCmd('bold')}
        className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => execCmd('italic')}
        className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => execCmd('underline')}
        className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Underline"
      >
        <Underline className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-border mx-0.5" />
      <button
        onClick={() => {
          const url = prompt('Enter URL:');
          if (url) execCmd('createLink', url);
        }}
        className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Add Link"
      >
        <Link2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => execCmd('insertUnorderedList')}
        className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Bullet List"
      >
        <List className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Delete confirmation popover
function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="absolute top-8 right-0 bg-card border rounded-lg p-3 shadow-elevated z-[70] min-w-[160px]"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-xs text-foreground font-medium mb-2">Delete this block?</p>
      <div className="flex gap-1.5">
        <button
          onClick={onCancel}
          className="flex-1 px-2 py-1.5 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-2 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const BLOCK_COLORS = [
  '#e0f2fe', '#f1f5f9', '#ecfdf5', '#fef3c7', '#fce7f3', '#f3e8ff',
  '#fee2e2', '#e0e7ff', '#d1fae5', '#fef9c3',
  '#1e293b', '#0f172a', '#1a1a2e', '#171717', '#1e1b2e', '#0f1f1a',
];

interface BlockEditPopoverProps {
  block: {
    id: string;
    type: BlockType;
    content: string;
    url?: string;
    imageUrl?: string;
    bgColor?: string;
  };
  onUpdate: (updates: Partial<{ type: BlockType; content: string; url: string; imageUrl: string; bgColor: string }>) => void;
  onClose: () => void;
}

// Block edit popover (appears when pencil is clicked)
function BlockEditPopover({ block, onUpdate, onClose }: BlockEditPopoverProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="absolute top-0 right-full mr-2 bg-card border rounded-xl p-4 shadow-elevated z-[80] w-[220px] animate-in fade-in slide-in-from-right-2 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Edit Block</span>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Content field for link/heading */}
      {(block.type === 'link' || block.type === 'heading') && (
        <div className="mb-3">
          <label className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 block">Label</label>
          <input
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full bg-secondary text-foreground rounded-lg p-2 text-sm border-0 outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}

      {/* URL field for links */}
      {block.type === 'link' && (
        <div className="mb-3">
          <label className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 block">URL</label>
          <input
            value={block.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full bg-secondary text-foreground rounded-lg p-2 text-sm border-0 outline-none focus:ring-1 focus:ring-ring"
            placeholder="https://..."
          />
        </div>
      )}

      {/* Background color */}
      <div>
        <label className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1.5 block">Background</label>
        <div className="flex flex-wrap gap-1.5 items-center">
          {BLOCK_COLORS.map(color => (
            <button
              key={color}
              onClick={() => onUpdate({ bgColor: color })}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                block.bgColor === color ? 'border-foreground scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <button
            onClick={() => colorInputRef.current?.click()}
            className="w-6 h-6 rounded-full border-2 border-border hover:border-foreground/40 transition-all hover:scale-110 overflow-hidden relative"
            style={{
              background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            }}
          >
            <input
              ref={colorInputRef}
              type="color"
              value={block.bgColor || '#f1f5f9'}
              onChange={(e) => onUpdate({ bgColor: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// Add block placeholder shown on canvas
function AddBlockPlaceholder({ onAddBlock }: { onAddBlock: (type: BlockType) => void }) {
  const [showOptions, setShowOptions] = useState(false);

  const ADD_BLOCK_OPTIONS: { type: BlockType; icon: typeof Plus; label: string; desc: string }[] = [
    { type: 'link', icon: Link2, label: 'Link', desc: 'Button with URL' },
    { type: 'text', icon: Type, label: 'Text', desc: 'Rich text block' },
    { type: 'image', icon: ImagePlus, label: 'Image', desc: 'Upload or URL' },
    { type: 'heading', icon: Heading1, label: 'Heading', desc: 'Section title' },
  ];

  return (
    <div className="mt-3">
      {showOptions ? (
        <div className="border border-dashed border-primary/30 rounded-2xl p-4 bg-card/80 backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 text-center font-medium">Choose block type</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ADD_BLOCK_OPTIONS.map(({ type, icon: Icon, label, desc }) => (
              <button
                key={type}
                onClick={() => { onAddBlock(type); setShowOptions(false); }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary hover:border-primary/30 transition-all duration-200 cursor-pointer active:scale-95 group"
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-[10px] text-muted-foreground">{desc}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowOptions(false)}
            className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer hover:bg-secondary/50 rounded-lg"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowOptions(true)}
          className="w-full py-5 border border-dashed border-border/40 rounded-2xl text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-primary/5 hover:shadow-sm transition-all duration-300 ease-out flex flex-col items-center gap-2 group cursor-pointer active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
            <Plus className="w-5 h-5 text-primary/60 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
          </div>
          <span className="text-sm font-medium">Add a new bento block</span>
        </button>
      )}
    </div>
  );
}

// Image upload interface
interface ImageUploadUIProps {
  block: { imageUrl?: string };
  onUpdate: (updates: { imageUrl: string }) => void;
}

function ImageUploadUI({ block, onUpdate }: ImageUploadUIProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate({ imageUrl: url });
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      <button
        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-black/5 transition-colors text-foreground/40 hover:text-foreground/60"
      >
        <Upload className="w-6 h-6" />
        <span className="text-xs font-medium">Upload Image</span>
      </button>
      <span className="text-[10px] text-foreground/30">or paste URL in sidebar</span>
    </div>
  );
}

export default function BentoGrid() {
  const { blocks, layout, setLayout, selectBlock, selectedBlockId, updateBlock, deleteBlock, resizeBlock, addBlock, isEditing, theme } = useEditor();
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editPopoverId, setEditPopoverId] = useState<string | null>(null);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const onLayoutChange = useCallback((newLayout: any[]) => {
    setLayout(newLayout.map((l: any) => ({ i: l.i, x: l.x, y: l.y, w: l.w, h: l.h, minW: 1, minH: 1 })));
  }, [setLayout]);

  const radiusMap: Record<string, string> = { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' };
  const radius = radiusMap[theme.cardRadius] || '0.75rem';

  const handleDelete = (blockId: string) => {
    deleteBlock(blockId);
    setConfirmDeleteId(null);
    setHoveredBlock(null);
  };

  const handleBlockClick = (blockId: string, blockType: BlockType, blockUrl?: string) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      // Double click - enable editing
      if (blockType === 'text' || blockType === 'heading') {
        setEditingTextId(blockId);
        setTimeout(() => {
          const el = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement;
          el?.focus();
        }, 0);
      }
    } else {
      // Single click - wait to see if it becomes a double click
      const timeout = setTimeout(() => {
        if (isEditing) {
          selectBlock(blockId);
        } else if (blockType === 'link') {
          window.open(blockUrl || 'https://youtube.com', '_blank', 'noopener');
        }
        setClickTimeout(null);
      }, 200);
      setClickTimeout(timeout);
    }
  };

  return (
    <div className="mt-4 pb-16">
      <GridLayout
        layout={layout}
        cols={4}
        rowHeight={80}
        onLayoutChange={onLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
        compactType="vertical"
        margin={[12, 12] as [number, number]}
        useCSSTransforms
      >
        {blocks.map(block => {
          const isHovered = hoveredBlock === block.id;
          const isSelected = selectedBlockId === block.id;
          const isTextEditing = editingTextId === block.id;
          const hasEditPopover = editPopoverId === block.id;
          const showControls = isEditing && (isHovered || isSelected || hasEditPopover);
          const txtColor = textColorFor(block.bgColor);
          const subtleColor = isDarkColor(block.bgColor || '') ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
          const iconBg = isDarkColor(block.bgColor || '') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

          return (
            <div
              key={block.id}
              data-block-id={block.id}
              className="relative group"
              onClick={() => handleBlockClick(block.id, block.type, block.url)}
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => {
                setHoveredBlock(null);
                setConfirmDeleteId(null);
                // Don't close edit popover on mouse leave
              }}
            >
              <div
                className={`h-full w-full p-4 transition-shadow overflow-hidden shadow-card ${
                  isEditing ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-elevated'
                    : isEditing ? 'hover:ring-1 hover:ring-primary/40 hover:shadow-elevated' : ''
                }`}
                style={{ backgroundColor: block.bgColor || '#f1f5f9', borderRadius: radius, color: txtColor }}
              >
                {block.type === 'link' && (
                  <div className="flex items-center gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
                      <ExternalLink className="w-5 h-5" style={{ color: subtleColor }} />
                    </div>
                    <span className="font-medium text-sm truncate">{block.content}</span>
                  </div>
                )}
                {block.type === 'text' && (
                  <div
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    className="h-full text-sm outline-none leading-relaxed overflow-auto prose prose-sm max-w-none"
                    style={{ color: txtColor }}
                    onFocus={() => setEditingTextId(block.id)}
                    onBlur={(e) => {
                      updateBlock(block.id, { content: e.currentTarget.innerHTML || '' });
                      setEditingTextId(null);
                    }}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )}
                {block.type === 'image' && (
                  <div className="h-full w-full flex items-center justify-center">
                    {block.imageUrl ? (
                      <img src={block.imageUrl} alt="" className="w-full h-full object-cover" style={{ borderRadius: radius }} />
                    ) : isEditing ? (
                      <ImageUploadUI block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />
                    ) : (
                      <div className="flex flex-col items-center gap-2" style={{ color: subtleColor }}>
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>
                )}
                {block.type === 'heading' && (
                  <div
                    contentEditable={isTextEditing}
                    suppressContentEditableWarning
                    className="h-full text-lg font-bold font-display outline-none flex items-center"
                    onBlur={(e) => updateBlock(block.id, { content: e.currentTarget.textContent || '' })}
                  >
                    {block.content}
                  </div>
                )}
              </div>

              {/* Hover controls - Edit (top-left edge) and Delete (top-right edge) */}
              {showControls && (
                <>
                  <div className="absolute -top-3 -left-3 z-[60]">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditPopoverId(editPopoverId === block.id ? null : block.id); }}
                      className="w-8 h-8 rounded-full bg-card border shadow-elevated hover:bg-secondary transition-colors flex items-center justify-center"
                      title="Edit block"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    {editPopoverId === block.id && (
                      <BlockEditPopover
                        block={block}
                        onUpdate={(updates) => updateBlock(block.id, updates)}
                        onClose={() => setEditPopoverId(null)}
                      />
                    )}
                  </div>
                  <div className="absolute -top-3 -right-3 z-[60]">
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(block.id); }}
                      className="w-8 h-8 rounded-full bg-card border shadow-elevated hover:bg-secondary hover:border-border transition-colors flex items-center justify-center"
                      title="Delete block"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    {confirmDeleteId === block.id && (
                      <DeleteConfirm
                        onConfirm={() => handleDelete(block.id)}
                        onCancel={() => setConfirmDeleteId(null)}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Richtext toolbar when editing text block */}
              {isTextEditing && block.type === 'text' && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-[70]">
                  <RichTextToolbar blockId={block.id} />
                </div>
              )}

              {/* Size presets on hover */}
              {isEditing && (isHovered || isSelected) && (
                <div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-0.5 bg-card border rounded-lg p-1 shadow-elevated z-[200]"
                  onMouseEnter={() => setHoveredBlock(block.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                >
                  {SIZE_PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      onClick={(e) => { e.stopPropagation(); resizeBlock(block.id, preset.w, preset.h); }}
                      className="px-2 py-1 text-[11px] font-mono rounded hover:bg-primary hover:text-primary-foreground transition-colors text-muted-foreground"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </GridLayout>

      {/* Add block placeholder on canvas */}
      {isEditing && <AddBlockPlaceholder onAddBlock={addBlock} />}
    </div>
  );
}
