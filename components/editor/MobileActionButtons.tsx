'use client';

import { useState } from 'react';
import { Copy, QrCode, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function QRDialog({ isOpen, onClose }: QRDialogProps) {
  if (!isOpen) return null;

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

interface MobileActionButtonsProps {
  username?: string;
}

export default function MobileActionButtons({ username = 'username' }: MobileActionButtonsProps) {
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://linkfusion.app/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-48">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">Share your link</h3>
          <p className="text-sm text-muted-foreground mt-1">linkfusion.app/{username}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground shadow-elevated flex items-center justify-center gap-2 hover:bg-primary/90 transition-all font-medium relative overflow-hidden"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={() => setQrOpen(true)}
            className="flex-1 h-14 rounded-xl bg-card border border-border shadow-elevated flex items-center justify-center gap-2 hover:bg-secondary transition-all font-medium"
          >
            <QrCode className="w-5 h-5" />
            <span>QR</span>
          </button>
        </div>
      </div>

      <QRDialog isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
