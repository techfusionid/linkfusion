"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	ReactNode,
} from "react";

export type BlockType = "link" | "text" | "image" | "heading";

export interface BentoBlockData {
	id: string;
	type: BlockType;
	content: string;
	url?: string;
	imageUrl?: string;
	bgColor?: string;
}

export interface ProfileData {
	name: string;
	username: string;
	bio: string;
	avatarUrl?: string;
}

export type LayoutPreset = "classic" | "bento";

export interface ThemeConfig {
	bgColor: string;
	pattern: "none" | "dots" | "grid" | "lines";
	accentColor: string;
	cardRadius: "sm" | "md" | "lg" | "xl";
	showBanner: boolean;
	darkMode: boolean;
}

export interface CustomizeSettings {
	font: string;
	background: string;
	buttonBackground: string;
	buttonText: string;
	pageWidth: number;
	baseFontSize: number;
	logoWidth: number;
	logoHeight: number;
	logoCornerRadius: number;
	inputWidth: number;
	inputHeight: number;
	inputBackground: string;
	inputPlaceholder: string;
	inputBorderRadius: number;
	inputMarginBottom: number;
	buttonWidth: number;
	buttonHorizontalPadding: number;
	buttonHeight: number;
}

export interface LayoutItem {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	minW?: number;
	minH?: number;
}

interface EditorContextType {
	blocks: BentoBlockData[];
	layout: LayoutItem[];
	selectedBlockId: string | null;
	profile: ProfileData;
	theme: ThemeConfig;
	customizeSettings: CustomizeSettings;
	showCustomizeSidebar: boolean;
	showSettingsSidebar: boolean;
	previewMode: "desktop" | "mobile";
	isEditing: boolean;
	layoutPreset: LayoutPreset;
	showBanner: boolean;
	darkMode: boolean;
	isDraftMode: boolean;
	hasUnpublishedChanges: boolean;
	addBlock: (type: BlockType) => void;
	updateBlock: (id: string, updates: Partial<BentoBlockData>) => void;
	deleteBlock: (id: string) => void;
	resizeBlock: (id: string, w: number, h: number) => void;
	setLayout: (layout: LayoutItem[]) => void;
	setBlocks: (blocks: BentoBlockData[]) => void;
	selectBlock: (id: string | null) => void;
	updateProfile: (updates: Partial<ProfileData>) => void;
	updateTheme: (updates: Partial<ThemeConfig>) => void;
	updateCustomizeSettings: (updates: Partial<CustomizeSettings>) => void;
	setShowCustomizeSidebar: (show: boolean) => void;
	setShowSettingsSidebar: (show: boolean) => void;
	setPreviewMode: (mode: "desktop" | "mobile") => void;
	setIsEditing: (editing: boolean) => void;
	setLayoutPreset: (preset: LayoutPreset) => void;
	setShowBanner: (show: boolean) => void;
	setDarkMode: (dark: boolean) => void;
	enableDraftMode: () => void;
	publishDraft: () => void;
	discardDraft: () => void;
}

const initialBlocks: BentoBlockData[] = [
	{
		id: "b1",
		type: "link",
		content: "Twitter / X",
		url: "https://x.com",
		bgColor: "#e0f2fe",
	},
	{
		id: "b2",
		type: "link",
		content: "GitHub",
		url: "https://github.com",
		bgColor: "#f1f5f9",
	},
	{
		id: "b3",
		type: "text",
		content:
			"Hey there! 👋 I build products at the intersection of design and code. Currently exploring AI, open source, and creative tools.",
		bgColor: "#ecfdf5",
	},
	{ id: "b4", type: "image", content: "Featured", bgColor: "#fef3c7" },
	{
		id: "b5",
		type: "link",
		content: "Read My Blog",
		url: "https://blog.example.com",
		bgColor: "#fce7f3",
	},
	{
		id: "b6",
		type: "heading",
		content: "🚀 Latest Projects",
		bgColor: "#f3e8ff",
	},
];

const initialLayout: LayoutItem[] = [
	{ i: "b1", x: 0, y: 0, w: 2, h: 1, minW: 1, minH: 1 },
	{ i: "b2", x: 2, y: 0, w: 2, h: 1, minW: 1, minH: 1 },
	{ i: "b3", x: 0, y: 1, w: 2, h: 2, minW: 1, minH: 1 },
	{ i: "b4", x: 2, y: 1, w: 2, h: 2, minW: 1, minH: 1 },
	{ i: "b5", x: 0, y: 3, w: 4, h: 1, minW: 1, minH: 1 },
	{ i: "b6", x: 0, y: 4, w: 4, h: 1, minW: 1, minH: 1 },
];

const initialProfile: ProfileData = {
	name: "Alex Rivera",
	username: "alexrivera",
	bio: "Designer, developer, and dreamer. Building the future one pixel at a time.",
};

const initialTheme: ThemeConfig = {
	bgColor: "#f8fafc",
	pattern: "dots",
	accentColor: "#14b8a6",
	cardRadius: "lg",
	showBanner: true,
	darkMode: false,
};

const initialCustomizeSettings: CustomizeSettings = {
	font: "Inter",
	background: "#ffffff",
	buttonBackground: "#14b8a6",
	buttonText: "#ffffff",
	pageWidth: 700,
	baseFontSize: 16,
	logoWidth: 100,
	logoHeight: 100,
	logoCornerRadius: 25,
	inputWidth: 200,
	inputHeight: 36,
	inputBackground: "#ffffff",
	inputPlaceholder: "#9ca3af",
	inputBorderRadius: 8,
	inputMarginBottom: 10,
	buttonWidth: 200,
	buttonHorizontalPadding: 16,
	buttonHeight: 44,
};

export const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
	const [blocks, setBlocks] = useState(initialBlocks);
	const [layout, setLayoutState] = useState(initialLayout);
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
	const [profile, setProfile] = useState(initialProfile);
	const [theme, setTheme] = useState(initialTheme);
	const [customizeSettings, setCustomizeSettings] = useState(initialCustomizeSettings);
	const [showCustomizeSidebar, setShowCustomizeSidebar] = useState(false);
	const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
	const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
		"desktop",
	);
	const [isEditing, setIsEditing] = useState(true);
	const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>("classic");

	// Draft mode: snapshot of last published state
	const [isDraftMode, setIsDraftMode] = useState(false);
	const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
	const [draftSnapshot, setDraftSnapshot] = useState<{
		blocks: BentoBlockData[];
		layout: LayoutItem[];
		profile: ProfileData;
		theme: ThemeConfig;
		layoutPreset: LayoutPreset;
	} | null>(null);

	const resizeBlock = useCallback((id: string, w: number, h: number) => {
		setLayoutState((prev) =>
			prev.map((l) => (l.i === id ? { ...l, w, h } : l)),
		);
	}, []);

	const selectBlock = useCallback((id: string | null) => {
		setSelectedBlockId(id);
	}, []);

	const updateTheme = useCallback(
		(updates: Partial<ThemeConfig>) => {
			setTheme((prev) => ({ ...prev, ...updates }));
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const updateCustomizeSettings = useCallback(
		(updates: Partial<CustomizeSettings>) => {
			setCustomizeSettings((prev) => ({ ...prev, ...updates }));
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const setShowBanner = useCallback(
		(show: boolean) => {
			setTheme((prev) => ({ ...prev, showBanner: show }));
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const setDarkMode = useCallback(
		(dark: boolean) => {
			setTheme((prev) => ({ ...prev, darkMode: dark }));
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	// Apply dark mode class to document element
	useEffect(() => {
		const root = document.documentElement;
		if (theme.darkMode) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, [theme.darkMode]);

	const draftAwareAddBlock = useCallback(
		(type: BlockType) => {
			const id = `b${Date.now()}`;
			const colors: Record<BlockType, string> = {
				link: "#e0f2fe",
				text: "#ecfdf5",
				image: "#fef3c7",
				heading: "#f3e8ff",
			};
			const defaults: Record<BlockType, string> = {
				link: "New Link",
				text: "Enter your text here...",
				image: "",
				heading: "New Heading",
			};
			setBlocks((prev) => [
				...prev,
				{ id, type, content: defaults[type], bgColor: colors[type] },
			]);
			setLayoutState((prev) => [
				...prev,
				{ i: id, x: 0, y: Infinity, w: 1, h: 1, minW: 1, minH: 1 },
			]);
			setSelectedBlockId(id);
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const draftAwareUpdateBlock = useCallback(
		(id: string, updates: Partial<BentoBlockData>) => {
			setBlocks((prev) =>
				prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
			);
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const draftAwareDeleteBlock = useCallback(
		(id: string) => {
			setBlocks((prev) => prev.filter((b) => b.id !== id));
			setLayoutState((prev) => prev.filter((l) => l.i !== id));
			setSelectedBlockId(null);
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const draftAwareUpdateProfile = useCallback(
		(updates: Partial<ProfileData>) => {
			setProfile((prev) => ({ ...prev, ...updates }));
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const draftAwareSetLayout = useCallback(
		(newLayout: LayoutItem[]) => {
			setLayoutState(newLayout);
			if (isDraftMode) setHasUnpublishedChanges(true);
		},
		[isDraftMode],
	);

	const enableDraftMode = useCallback(() => {
		// Snapshot current "published" state before entering draft
		setDraftSnapshot({ blocks, layout, profile, theme, layoutPreset });
		setIsDraftMode(true);
		setHasUnpublishedChanges(false);
	}, [blocks, layout, profile, theme, layoutPreset]);

	const publishDraft = useCallback(() => {
		// Changes become the new published state — clear draft
		setDraftSnapshot(null);
		setIsDraftMode(false);
		setHasUnpublishedChanges(false);
	}, []);

	const discardDraft = useCallback(() => {
		// Revert to snapshot taken when draft mode started
		if (draftSnapshot) {
			setBlocks(draftSnapshot.blocks);
			setLayoutState(draftSnapshot.layout);
			setProfile(draftSnapshot.profile);
			setTheme(draftSnapshot.theme);
			setLayoutPreset(draftSnapshot.layoutPreset);
		}
		setDraftSnapshot(null);
		setIsDraftMode(false);
		setHasUnpublishedChanges(false);
	}, [draftSnapshot]);

	return (
		<EditorContext.Provider
			value={{
				blocks,
				layout,
				selectedBlockId,
				profile,
				theme,
				customizeSettings,
				showCustomizeSidebar,
				showSettingsSidebar,
				previewMode,
				isEditing,
				layoutPreset,
				showBanner: theme.showBanner,
				darkMode: theme.darkMode,
				isDraftMode,
				hasUnpublishedChanges,
				addBlock: draftAwareAddBlock,
				updateBlock: draftAwareUpdateBlock,
				deleteBlock: draftAwareDeleteBlock,
				resizeBlock,
				setLayout: draftAwareSetLayout,
				setBlocks,
				selectBlock,
				updateProfile: draftAwareUpdateProfile,
				updateTheme,
				updateCustomizeSettings,
				setShowCustomizeSidebar,
				setShowSettingsSidebar,
				setPreviewMode,
				setIsEditing,
				setLayoutPreset,
				setShowBanner,
				setDarkMode,
				enableDraftMode,
				publishDraft,
				discardDraft,
			}}
		>
			{children}
		</EditorContext.Provider>
	);
}

export function useEditor() {
	const ctx = useContext(EditorContext);
	if (!ctx) throw new Error("useEditor must be within EditorProvider");
	return ctx;
}
