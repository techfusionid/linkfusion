'use client';

import { X, ChevronDown, Check } from 'lucide-react';
import { useEditor, CustomizeSettings } from '@/app/editor/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Nunito',
  'Source Sans Pro',
];

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="px-3 py-2 space-y-2">
      <span className="text-[11px] text-muted-foreground">{title}</span>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-[11px]">{label}</Label>
      <div className="flex items-center gap-1">
        <div
          className="w-5 h-5 rounded border cursor-pointer shrink-0"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-14 h-6 text-[10px] px-1.5 font-mono"
        />
      </div>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  className?: string;
}

  function NumberInput({ label, value, onChange, suffix = 'px', min = 0, max = 999, className = "" }: NumberInputProps) {
    return (
      <div className={`flex items-center justify-between gap-1 ${className}`}>
        <Label className="text-[10px] text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-0.5">
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 0;
              onChange(Math.min(max, Math.max(min, v)));
            }}
            min={min}
            max={max}
            className="w-10 h-6 text-[10px] px-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-[9px] text-muted-foreground w-3">{suffix}</span>
        </div>
      </div>
    );
  }

interface FontSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function FontSelect({ value, onChange }: FontSelectProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-[11px]">Font</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-6 w-24 justify-between text-[11px] px-2">
            <span className="truncate">{value}</span>
            <ChevronDown className="w-3 h-3 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[120px]">
          {fontOptions.map((font) => (
            <DropdownMenuItem
              key={font}
              onClick={() => onChange(font)}
              className="text-xs justify-between"
            >
              <span style={{ fontFamily: font }}>{font}</span>
              {value === font && <Check className="w-3 h-3" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function CustomizeSidebar() {
  const { showCustomizeSidebar, setShowCustomizeSidebar, customizeSettings, updateCustomizeSettings } = useEditor();

  const update = <K extends keyof CustomizeSettings>(key: K, value: CustomizeSettings[K]) => {
    updateCustomizeSettings({ [key]: value });
  };

  return (
    <aside
      className={`h-full bg-background border-l border-border flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        showCustomizeSidebar ? 'w-64' : 'w-0'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 border-b border-border shrink-0 ${
          showCustomizeSidebar ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      >
        <h2 className="font-semibold text-sm">Customize</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => setShowCustomizeSidebar(false)}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-y-auto ${
          showCustomizeSidebar ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      >
        {/* Theme Section */}
        <Section title="Theme">
          <FontSelect
            value={customizeSettings.font}
            onChange={(v) => update('font', v)}
          />
          <ColorInput
            label="Background"
            value={customizeSettings.background}
            onChange={(v) => update('background', v)}
          />
        </Section>

        {/* Buttons Section */}
          <Section title="Buttons">
            <ColorInput
              label="Background"
              value={customizeSettings.buttonBackground}
              onChange={(v) => update('buttonBackground', v)}
            />
            <ColorInput
              label="Text"
              value={customizeSettings.buttonText}
              onChange={(v) => update('buttonText', v)}
            />
            <div className="flex items-center gap-2 pt-1">
              <NumberInput
                label="W"
                value={customizeSettings.buttonWidth}
                onChange={(v) => update('buttonWidth', v)}
                max={500}
              />
              <NumberInput
                label="P"
                value={customizeSettings.buttonHorizontalPadding}
                onChange={(v) => update('buttonHorizontalPadding', v)}
                max={50}
              />
              <NumberInput
                label="H"
                value={customizeSettings.buttonHeight}
                onChange={(v) => update('buttonHeight', v)}
                max={80}
              />
            </div>
          </Section>

        {/* Layout Section */}
        <Section title="Layout">
          <div className="flex items-center gap-2">
            <NumberInput
              label="Width"
              value={customizeSettings.pageWidth}
              onChange={(v) => update('pageWidth', v)}
              max={800}
              className="flex-1"
            />
            <NumberInput
              label="Font"
              value={customizeSettings.baseFontSize}
              onChange={(v) => update('baseFontSize', v)}
              min={10}
              max={24}
              className="flex-1"
            />
          </div>
        </Section>

        {/* Logo Section */}
        <Section title="Logo">
          <div className="flex items-center gap-2">
            <NumberInput
              label="W"
              value={customizeSettings.logoWidth}
              onChange={(v) => update('logoWidth', v)}
              max={200}
            />
            <NumberInput
              label="H"
              value={customizeSettings.logoHeight}
              onChange={(v) => update('logoHeight', v)}
              max={200}
            />
            <NumberInput
              label="R"
              value={customizeSettings.logoCornerRadius}
              onChange={(v) => update('logoCornerRadius', v)}
              max={50}
              suffix="%"
            />
          </div>
        </Section>

        {/* Inputs Section */}
        <Section title="Inputs">
          <div className="flex items-center gap-2">
            <NumberInput
              label="W"
              value={customizeSettings.inputWidth}
              onChange={(v) => update('inputWidth', v)}
              max={500}
            />
            <NumberInput
              label="H"
              value={customizeSettings.inputHeight}
              onChange={(v) => update('inputHeight', v)}
              max={60}
            />
          </div>
          <ColorInput
            label="Background"
            value={customizeSettings.inputBackground}
            onChange={(v) => update('inputBackground', v)}
          />
          <ColorInput
            label="Placeholder"
            value={customizeSettings.inputPlaceholder}
            onChange={(v) => update('inputPlaceholder', v)}
          />
          <div className="flex items-center gap-2 pt-1">
            <NumberInput
              label="Radius"
              value={customizeSettings.inputBorderRadius}
              onChange={(v) => update('inputBorderRadius', v)}
              max={30}
            />
            <NumberInput
              label="Margin"
              value={customizeSettings.inputMarginBottom}
              onChange={(v) => update('inputMarginBottom', v)}
              max={30}
            />
          </div>
        </Section>
      </div>
    </aside>
  );
}
