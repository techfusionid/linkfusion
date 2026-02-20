'use client';

import { EditorProvider, useEditor } from './context';
import BentoGrid from '@/components/editor/BentoGrid';
import ProfileSection from '@/components/editor/ProfileSection';
import BottomToolbar from '@/components/editor/BottomToolbar';
import Navbar from '@/components/editor/Navbar';
import PhoneMock from '@/components/editor/PhoneMock';
import MobileActionButtons from '@/components/editor/MobileActionButtons';

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
  const { previewMode, theme, selectBlock, showBanner, profile } = useEditor();
  const patternStyle = getPatternStyle(theme.pattern, theme.bgColor);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <EditorNavbar />

      <div
        className="flex-1 overflow-auto flex justify-center px-4 pb-24 pt-4 md:px-8 transition-colors"
        style={patternStyle}
        onClick={(e) => { if (e.target === e.currentTarget) selectBlock(null); }}
      >
        {previewMode === 'mobile' ? (
          // Mobile preview: Phone mock with action buttons
          <div className="flex items-center justify-center gap-8">
            <PhoneMock>
              {showBanner && (
                <div className="px-4 pt-8 pb-2">
                  <ProfileSection />
                </div>
              )}
              <div className={showBanner ? 'px-4 pb-4' : 'px-4 pt-6 pb-4'}>
                <BentoGrid />
              </div>
            </PhoneMock>
            <MobileActionButtons username={profile.username} />
          </div>
        ) : (
          // Desktop preview: Centered content
          <div className="w-full max-w-[680px]">
            {showBanner && (
              <div className="mb-4">
                <ProfileSection />
              </div>
            )}
            <BentoGrid />
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
