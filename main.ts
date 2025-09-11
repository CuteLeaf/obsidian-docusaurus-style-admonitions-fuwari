import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	MarkdownPostProcessorContext,
	MarkdownRenderer,
} from 'obsidian';

import { Decoration, DecorationSet, ViewUpdate } from '@codemirror/view';
import { Range } from '@codemirror/state';
import { ViewPlugin, EditorView } from '@codemirror/view';

/** Plugin Settings */
interface DocusaurusAdmonitionSettings {
	enabledAdmonitions: {
		note: boolean;
		tip: boolean;
		important: boolean;
		warning: boolean;
		caution: boolean;
	};
}

/**
 * Default settings for the Docusaurus Admonition plugin.
 * @property {Object} enabledAdmonitions - Object controlling which admonition types are enabled.
 * @property {boolean} enabledAdmonitions.note - Whether 'note' admonitions are enabled.
 * @property {boolean} enabledAdmonitions.tip - Whether 'tip' admonitions are enabled.
 * @property {boolean} enabledAdmonitions.important - Whether 'important' admonitions are enabled.
 * @property {boolean} enabledAdmonitions.warning - Whether 'warning' admonitions are enabled.
 * @property {boolean} enabledAdmonitions.caution - Whether 'caution' admonitions are enabled.
 */
const DEFAULT_SETTINGS: DocusaurusAdmonitionSettings = {
	enabledAdmonitions: {
		note: true,
		tip: true,
		important: true,
		warning: true,
		caution: true
	},
};

/**
 * Obsidian plugin that implements Docusaurus-style admonitions.
 * 
 * This plugin enables the use of :::type syntax to create formatted admonition 
 * blocks in both reading and live preview modes. Supported admonition types include:
 * note, tip, important, warning, and caution.
 * 
 * Admonitions can be used in two formats:
 * 1. Single-line: :::type Content here :::
 * 2. Multi-line:
 *    :::type
 *    Content here
 *    :::
 * 
 * The plugin handles both rendering modes:
 * - Reading mode: Processed via Markdown post processor
 * - Live Preview: Implemented through editor extensions
 * 
 * @extends Plugin Obsidian's base plugin class
 */
export default class DocusaurusAdmonitionsPlugin extends Plugin {
	settings: DocusaurusAdmonitionSettings;
	private editorExtensions: ViewPlugin<{
		decorations: DecorationSet;
		update(update: ViewUpdate): void;
	}>[] = [];

	/** Called when the plugin is loaded. */
	async onload() {
		// 1. Load plugin settings
		await this.loadSettings();

		// 2. Register Markdown post processor (nur einmal)
		this.registerMarkdownPostProcessor((el, ctx) => {
			this.processCustomAdmonitionSyntax(el, ctx);
		});

		// 3. Initialisiere Live Preview-Unterstützung
		this.updateEditorExtensions();

		// 4. Add settings tab
		this.addSettingTab(new DocusaurusAdmonitionsSettingTab(this.app, this));
	}

	/** Processes the :::type syntax in Reading Mode. */
	/**
	 * Processes custom admonition syntax in markdown content.
	 * 
	 * This method parses and transforms paragraphs starting with ":::" into styled admonition elements.
	 * It supports both single-line and multi-line admonition formats:
	 * - Single-line: :::type content :::
	 * - Single-line with custom title: :::type [Custom Title] content :::
	 * - Multi-line: :::type (content paragraphs) :::
	 * - Multi-line with custom title: :::type [Custom Title] (content paragraphs) :::
	 * 
	 * Supported admonition types: note, tip, important, warning, and caution.
	 * Admonitions will only be rendered if they are enabled in the plugin settings.
	 * 
	 * @param el - The HTML element containing paragraphs to process
	 * @param ctx - The markdown post processor context
	 * @returns A Promise that resolves when all admonitions have been processed
	 */
	async processCustomAdmonitionSyntax(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const paragraphs = el.querySelectorAll('p');

		for (let i = 0; i < paragraphs.length; i++) {
			const p = paragraphs[i];
			const text = p.textContent?.trim();
			if (!text) continue;

			// Skip if this paragraph is inside a code block
			if (this.isInsideCodeBlock(p)) {
				continue;
			}

			// Check for GitHub syntax first: > [!TYPE]
			const githubMatch = text.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
			if (githubMatch) {
				const githubType = githubMatch[1].toLowerCase();
				
				if (!this.settings.enabledAdmonitions[githubType as keyof DocusaurusAdmonitionSettings['enabledAdmonitions']]) {
					continue;
				}

				// Process GitHub-style admonition
				let content = text.replace(/^>\s*\[![^\]]+\]\s*/, '').trim();
				const admonitionDiv = document.createElement('div');
				admonitionDiv.className = `docusaurus-admonition docusaurus-admonition-${githubType}`;
				
				const titleDiv = document.createElement('div');
				titleDiv.className = 'docusaurus-admonition-title';
				titleDiv.textContent = githubType.toUpperCase();
				admonitionDiv.appendChild(titleDiv);
				
				const contentDiv = document.createElement('div');
				contentDiv.className = 'docusaurus-admonition-content';
				if (content) {
					contentDiv.textContent = content;
				}
				admonitionDiv.appendChild(contentDiv);
				
				p.replaceWith(admonitionDiv);
				continue;
			}

			// Check for standard :::type syntax
			if (!text.startsWith(':::')) continue;

		// Determine type
		const match = text.match(/^:::(note|tip|important|warning|caution)(?:\s|$)/);
		if (!match) continue;			// Single line admonition - unterstützt nun auch benutzerdefinierte Titel
			// Syntax: :::type [Custom Title] Content :::
			const singleLineMatch = text.match(/^:::(note|tip|important|warning|caution)(?:\s*\[(.*?)\])?\s+([\s\S]+?)\s+:::$/);
			if (singleLineMatch) {
				const singleType = singleLineMatch[1];
				const customTitle = singleLineMatch[2];
				const content = singleLineMatch[3];

				if (!this.settings.enabledAdmonitions[singleType as keyof DocusaurusAdmonitionSettings['enabledAdmonitions']]) {
					continue;
				}

				const admonitionDiv = document.createElement('div');
				admonitionDiv.className = `docusaurus-admonition docusaurus-admonition-${singleType}`;
				
				const titleDiv = document.createElement('div');
				titleDiv.className = 'docusaurus-admonition-title';
				titleDiv.textContent = customTitle || singleType.toUpperCase();
				admonitionDiv.appendChild(titleDiv);
				
				const contentDiv = document.createElement('div');
				contentDiv.className = 'docusaurus-admonition-content';
				contentDiv.textContent = content;
				admonitionDiv.appendChild(contentDiv);
				p.replaceWith(admonitionDiv);
				continue;
			}

		// Multi-line admonition - unterstützt nun auch benutzerdefinierte Titel
		// Syntax: :::type [Custom Title]
		//         Content
		//         :::
		const multiLineMatch = text.match(/^:::(note|tip|important|warning|caution)(?:\s*\[(.*?)\])?$/);
		if (!multiLineMatch) continue;			const multiType = multiLineMatch[1];
			const customTitle = multiLineMatch[2];

			let endIndex = -1;
			const content: HTMLElement[] = [];
			for (let j = i + 1; j < paragraphs.length; j++) {
				const endText = paragraphs[j].textContent?.trim();
				if (endText === ':::') {
					endIndex = j;
					break;
				} else {
					content.push(paragraphs[j]);
				}
			}
			if (endIndex === -1) continue;

			if (!this.settings.enabledAdmonitions[multiType as keyof DocusaurusAdmonitionSettings['enabledAdmonitions']]) {
				continue;
			}

			// Build container
			const admonitionDiv = document.createElement('div');
			admonitionDiv.className = `docusaurus-admonition docusaurus-admonition-${multiType}`;
			
			const titleDiv = document.createElement('div');
			titleDiv.className = 'docusaurus-admonition-title';
			titleDiv.textContent = customTitle || multiType.toUpperCase();
			admonitionDiv.appendChild(titleDiv);
			
			const contentDiv = document.createElement('div');
			contentDiv.className = 'docusaurus-admonition-content';

			for (let k = 0; k < content.length; k++) {
				contentDiv.appendChild(content[k].cloneNode(true));
			}
			admonitionDiv.appendChild(contentDiv);

			p.replaceWith(admonitionDiv);
			content.forEach(el => el.remove());
			paragraphs[endIndex].remove();
			i = endIndex;
		}
	}

	/** Check if an element is inside a code block */
	private isInsideCodeBlock(element: HTMLElement): boolean {
		// Check if the element or any of its parents is a code block
		let current: HTMLElement | null = element;
		while (current) {
			// Check for common code block classes and tags
			if (current.tagName === 'CODE' || 
				current.tagName === 'PRE' ||
				current.classList.contains('language-') ||
				current.classList.contains('hljs') ||
				current.classList.contains('cm-line') ||
				current.closest('pre') ||
				current.closest('code')) {
				return true;
			}
			current = current.parentElement;
		}
		return false;
	}

	/** Registers Post-Processor & CodeMirror decorations for Live Preview. */
	updateEditorExtensions() {
		try {
			// Erstelle neue ViewPlugin-Instanz mit aktuellen Einstellungen
			const pluginExtension = createAdmonitionViewPlugin(this.settings);

			// Alte Erweiterungen entfernen (falls vorhanden)
			this.editorExtensions = [];

			// Neue Erweiterung hinzufügen
			this.editorExtensions.push(pluginExtension);

			// Registriere die aktualisierte Extensions-Liste
			this.registerEditorExtension(this.editorExtensions);
		} catch (e) {
			// Silent fallback - styles already defined in CSS
		}
	}

	/** Called when the plugin is disabled */
	onunload() {
		// No actions required - Obsidian handles resource cleanup
	}

	/** Load settings */
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	/** Save settings */
	async saveSettings() {
		await this.saveData(this.settings);
	}
}

/** Settings Tab */
class DocusaurusAdmonitionsSettingTab extends PluginSettingTab {
	plugin: DocusaurusAdmonitionsPlugin;

	constructor(app: App, plugin: DocusaurusAdmonitionsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const desc = 'Enables :::SYNTAX admonition';
		const types = ['note', 'tip', 'important', 'warning', 'caution'] as const;

		types.forEach(type => {
			new Setting(containerEl)
				.setName(`${type.toUpperCase()} Admonition`)
				.setDesc(`${desc.replace('SYNTAX', type)}`)
				.addToggle(toggle => toggle
					.setValue(this.plugin.settings.enabledAdmonitions[type])
					.onChange(async (value) => {
						this.plugin.settings.enabledAdmonitions[type] = value;
						await this.plugin.saveSettings();

						// Statt registerLivePreviewRenderer() aufzurufen, nur die Extensions aktualisieren
						this.plugin.updateEditorExtensions();
					})
				);
		});
	}
}

/** ViewPlugin: Decorates the ::: lines in Edit Mode (Live Preview). */
function createAdmonitionViewPlugin(settings: DocusaurusAdmonitionSettings) {
	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = computeAdmonitionDecorations(view, settings);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged) {
					this.decorations = computeAdmonitionDecorations(update.view, settings);
				}
			}
		},
		{
			decorations: v => v.decorations
		}
	);
}

/** Creates a DecorationSet that highlights start/end lines and content in Edit Mode. */
function computeAdmonitionDecorations(view: EditorView, settings: DocusaurusAdmonitionSettings): DecorationSet {
	const types = ['note', 'tip', 'important', 'warning', 'caution'];
	const decorations: Range<Decoration>[] = [];
	const doc = view.state.doc;

	let pos = 0;
	while (pos < doc.length) {
		const line = doc.lineAt(pos);
		const text = line.text;

		// Skip if we're inside a code block
		if (isInsideCodeBlockInEditor(view, line.from)) {
			pos = line.to + 1;
			continue;
		}

		// Check for admonition start (e.g., :::note or :::note [Custom Title])
		for (const t of types) {
			// Check if this type is enabled in settings
			if (!settings.enabledAdmonitions[t as keyof DocusaurusAdmonitionSettings['enabledAdmonitions']]) {
				continue;
			}

			// Überprüfe auf Startzeilen mit oder ohne benutzerdefinierten Titel
			const startRegex = new RegExp(`^:::${t}(?:\\s*\\[.*?\\])?(?:\\s|$)`);
			if (startRegex.test(text)) {
				// Start line
				decorations.push(
					Decoration.line({
						attributes: { class: `admonition-${t}-start` }
					}).range(line.from)
				);

				// Now style all following lines (content) until we find ":::"
				let innerPos = line.to + 1;
				while (innerPos < doc.length) {
					const innerLine = doc.lineAt(innerPos);
					const innerText = innerLine.text.trim();

					// End line?
					if (innerText === ':::') {
						decorations.push(
							Decoration.line({
								attributes: { class: `admonition-${t}-end` }
							}).range(innerLine.from)
						);
						break;
					} else {
						// Content
						decorations.push(
							Decoration.line({
								attributes: { class: `admonition-${t}-content` }
							}).range(innerLine.from)
						);
					}
					innerPos = innerLine.to + 1;
				}
				break;
			}
		}
		pos = line.to + 1;
	}
	return Decoration.set(decorations, true);
}

/** Check if a position is inside a code block in the editor */
function isInsideCodeBlockInEditor(view: EditorView, pos: number): boolean {
	const state = view.state;
	const doc = state.doc;
	
	// Get the line containing this position
	const line = doc.lineAt(pos);
	const lineText = line.text;
	
	// Simple heuristic: check if line starts with indentation (4+ spaces or tab)
	// or if it's part of a fenced code block
	if (lineText.match(/^(\s{4,}|\t)/)) {
		return true;
	}
	
	// Check for fenced code blocks by looking backwards for opening ```
	let currentPos = line.from;
	let inCodeBlock = false;
	
	// Scan backwards to check for code block boundaries
	for (let lineNum = line.number - 1; lineNum >= 1; lineNum--) {
		const checkLine = doc.line(lineNum);
		const checkText = checkLine.text;
		
		// If we find a closing ```, we're not in a code block
		if (checkText.match(/^```\s*$/)) {
			break;
		}
		
		// If we find an opening ```, we're in a code block
		if (checkText.match(/^```\w*/)) {
			inCodeBlock = true;
			break;
		}
	}
	
	return inCodeBlock;
}
