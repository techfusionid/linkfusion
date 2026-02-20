'use client';

import { useState } from 'react';
import { Share, QrCode, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function QRDialog({ isOpen, onClose }: QRDialogProps) {
  if (!isOpen) return null;

  // Mock QR code for now - will replace with qrcode.react
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-card border rounded-2xl p-6 shadow-elevated max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">QR Code</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          {/* Mock QR code */}
          <div className="w-48 h-48 bg-white border-2 border-border rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-5 gap-1 w-40 h-40">
              {/* Simple QR pattern mock */}
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    Math.random() > 0.5 ? 'bg-foreground' : 'bg-background'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan to visit this page
          </p>
          <div className="w-full h-px bg-border" />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // TODO: Download QR functionality
            }}
          >
            Download QR Code
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ShareDialog({ isOpen, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    // Mock URL - will use actual page URL later
    navigator.clipboard.writeText('https://linkfusion.dev/username');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-card border rounded-2xl p-6 shadow-elevated max-w-sm w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-positive" />
                Link copied!
              </>
            ) : (
              <>
                <Share className="w-4 h-4 mr-2" />
                Copy link
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Share to X/Twitter
              window.open('https://twitter.com/intent/tweet?text=Check+out+my+LinkFusion+page!', '_blank');
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share to X
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MobileActionButtonsProps {
  username?: string;
}

export default function MobileActionButtons({ username = 'username' }: MobileActionButtonsProps) {
  const [qrOpen, setQrOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Share Button */}
        <button
          onClick={() => setShareOpen(true)}
          className="w-12 h-12 rounded-full bg-card border border-border shadow-elevated flex items-center justify-center hover:bg-secondary transition-colors"
          title="Share"
        >
          <Share className="w-5 h-5" />
        </button>

        {/* QR Button */}
        <button
          onClick={() => setQrOpen(true)}
          className="w-12 h-12 rounded-full bg-card border border-border shadow-elevated flex items-center justify-center hover:bg-secondary transition-colors"
          title="QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      <ShareDialog isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <QRDialog isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
