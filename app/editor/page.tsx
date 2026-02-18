'use client';

import { EditorProvider, useEditor } from './context';
import BentoGrid from '@/components/editor/BentoGrid';
import ProfileSection from '@/components/editor/ProfileSection';
import BottomToolbar from '@/components/editor/BottomToolbar';
import Navbar from '@/components/editor/Navbar';

function getPatternStyle(pattern: string, bgColor: string): React.CSSProperties {
  const bg = bgColor || '#f8fafc';
  switch (pattern) {
    case 'dots':
      return { backgroundColor: bg, backgroundImage: 'radial-gradient(circle, #00000008 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' };
    case 'grid':
      return { backgroundColor: bg, backgroundImage: 'linear-gradient(#00000006 1px, transparent 1px), linear-gradient(90deg, #00000006 1px, transparent 1px)', backgroundSize: '24px 24px' };
    case 'lines':
      return { backgroundColor: bg, backgroundImage: 'linear-gradient(#00000006 1px, transparent 1px)', backgroundSize: '100% 24px' };
    default:
      return { backgroundColor: bg };
  }
}

function EditorNavbar() {
  const { isEditing, setIsEditing } = useEditor();
  return <Navbar isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)} />;
}

function EditorCanvas() {
  const { previewMode, theme, selectBlock, layoutPreset } = useEditor();
  const patternStyle = getPatternStyle(theme.pattern, theme.bgColor);
  const isClassic = layoutPreset === 'classic';

  return (
    <div className="flex flex-col min-h-screen w-full">
      <EditorNavbar />

      <div
        className="flex-1 overflow-auto flex justify-center px-4 pb-24 pt-4 md:px-8 transition-colors"
        style={patternStyle}
        onClick={(e) => { if (e.target === e.currentTarget) selectBlock(null); }}
      >
        {isClassic ? (
          <div className={`w-full transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-[680px]'}`}>
            <ProfileSection />
            <BentoGrid />
          </div>
        ) : (
          <div className={`w-full transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-[960px]'}`}>
            {previewMode === 'mobile' ? (
              <>
                <ProfileSection />
                <BentoGrid />
              </>
            ) : (
              <div className="flex gap-8 items-start">
                <div className="w-[260px] shrink-0 sticky top-4">
                  <ProfileSection />
                </div>
                <div className="flex-1 min-w-0">
                  <BentoGrid />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomToolbar />
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorCanvas />
    </EditorProvider>
  );
}
