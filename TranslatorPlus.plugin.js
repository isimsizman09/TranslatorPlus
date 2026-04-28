/**
 * @name TranslatorPlus
 * @author isimsizman09
 * @version 1.5.2
 * @description The ultimate translation plugin for BetterDiscord. Smart Protection, AI Tone, Live Preview, Context Memory, Interactive Mode.
 * @website https://github.com/isimsizman09
 * @source https://github.com/isimsizman09/TranslatorPlus
 */

module.exports = (() => {
    const config = {
        info: {
            name: "TranslatorPlus",
            authors: [{ name: "isimsizman09" }],
            version: "1.5.2",
            description: "Advanced translation plugin with AI support, context memory, smart protection, and live preview."
        },
        defaultSettings: {
            receivedInput: "auto",
            receivedOutput: "tr",
            sentInput: "auto",
            sentOutput: "en",
            contextMap: {},
            autoTranslate: false,
            autoTranslateIncoming: false,
            showAutoTranslateTooltip: true,
            displayMode: "accessory",
            livePreview: true,
            translationService: "google",
            groqApiKey: "",
            groqModel: "openai/gpt-oss-120b",
            groqTone: "standard",
            groqPrompt: "You are a professional translator. Translate the input to ${targetLanguage}. Do not add any emojis, explanations, notes, or opening/closing remarks. Return ONLY the translation.",
            openrouterApiKey: "",
            openrouterModel: "google/gemma-3-27b-it:free",
            openrouterTone: "standard",
            openrouterPrompt: "You are a professional translator. Translate the input to ${targetLanguage}. Do not add any emojis, explanations, notes, or opening/closing remarks. Return ONLY the translation.",
            uiLanguage: "en",
            bulkTranslateCount: 10,
            livePreviewMode: "timed",
            livePreviewInterval: 5000,
            skipCommands: true,
            skipCodeOnly: true,
            skipLinksOnly: true,
            quickTargetLanguages: ["tr", "en", "es", "de", "fr", "ru", "ar", "pt", "zh-CN", "ja"]
        }
    };

    const GoogleLanguages = {
        "auto": "Detect language",
        "af": "Afrikaans", "sq": "Albanian", "am": "Amharic", "ar": "Arabic", "hy": "Armenian", "az": "Azerbaijani",
        "eu": "Basque", "be": "Belarusian", "bn": "Bengali", "bs": "Bosnian", "bg": "Bulgarian",
        "ca": "Catalan", "ceb": "Cebuano", "ny": "Chichewa", "zh-CN": "Chinese (Simplified)", "zh-TW": "Chinese (Traditional)",
        "co": "Corsican", "hr": "Croatian", "cs": "Czech", "da": "Danish", "nl": "Dutch", "en": "English",
        "eo": "Esperanto", "et": "Estonian", "tl": "Filipino", "fi": "Finnish", "fr": "French", "fy": "Frisian",
        "gl": "Galician", "ka": "Georgian", "de": "German", "el": "Greek", "gu": "Gujarati", "ht": "Haitian Creole",
        "ha": "Hausa", "haw": "Hawaiian", "iw": "Hebrew", "hi": "Hindi", "hmn": "Hmong", "hu": "Hungarian",
        "is": "Icelandic", "ig": "Igbo", "id": "Indonesian", "ga": "Irish", "it": "Italian", "ja": "Japanese",
        "jw": "Javanese", "kn": "Kannada", "kk": "Kazakh", "km": "Khmer", "rw": "Kinyarwanda", "ko": "Korean",
        "ku": "Kurdish (Kurmanji)", "ky": "Kyrgyz", "lo": "Lao", "la": "Latin", "lv": "Latvian", "lt": "Lithuanian",
        "lb": "Luxembourgish", "mk": "Macedonian", "mg": "Malagasy", "ms": "Malay", "ml": "Malayalam",
        "mt": "Maltese", "mi": "Maori", "mr": "Marathi", "mn": "Mongolian", "my": "Myanmar (Burmese)",
        "ne": "Nepali", "no": "Norwegian", "or": "Odia (Oriya)", "ps": "Pashto", "fa": "Persian", "pl": "Polish",
        "pt": "Portuguese", "pa": "Punjabi", "ro": "Romanian", "ru": "Russian", "sm": "Samoan", "gd": "Scots Gaelic",
        "sr": "Serbian", "st": "Sesotho", "sn": "Shona", "sd": "Sindhi", "si": "Sinhala", "sk": "Slovak",
        "sl": "Slovenian", "so": "Somali", "es": "Spanish", "su": "Sundanese", "sw": "Swahili", "sv": "Swedish",
        "tg": "Tajik", "ta": "Tamil", "tt": "Tatar", "te": "Telugu", "th": "Thai", "tr": "Turkish", "tk": "Turkmen",
        "uk": "Ukrainian", "ur": "Urdu", "ug": "Uyghur", "uz": "Uzbek", "vi": "Vietnamese", "cy": "Welsh",
        "xh": "Xhosa", "yi": "Yiddish", "yo": "Yoruba", "zu": "Zulu"
    };

    const AI_TONES = {
        "standard": "Translate naturally and accurately. Do not add emojis or extra text.",
        "formal": "Use formal, polite, and professional language. No emojis.",
        "gamer": "Use casual gamer slang. Keep terms like GG, nerf, buff, diff, inting untranslated.",
        "toxic": "Translate with an aggressive, roast-like, toxic tone. Be savage."
    };

    const CSS = `
.translatorplus-accessory {
    color: var(--text-muted, #72767d);
    margin-top: 2px;
    font-style: italic;
    font-weight: 400;
    line-height: 1.375rem;
    white-space: pre-wrap;
    font-size: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0;
}
.translatorplus-accessory-text {
    color: var(--text-normal, #dcddde);
    font-style: italic;
}
.translatorplus-accessory-meta {
    font-size: 0.7rem;
    color: var(--text-muted, #72767d);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 1px;
    opacity: 0.7;
    transition: opacity 0.2s;
}
.translatorplus-accessory:hover .translatorplus-accessory-meta {
    opacity: 1;
}
.translatorplus-accessory-meta svg {
    width: 12px;
    height: 12px;
}
.translatorplus-dismiss {
    all: unset;
    cursor: pointer;
    color: var(--text-link, #00aff4);
    font-size: 0.7rem;
    font-weight: 500;
    margin-left: 4px;
}
.translatorplus-dismiss:hover {
    text-decoration: underline;
}
.translatorplus-quick-target {
    height: 22px;
    max-width: 140px;
    border: 1px solid var(--background-modifier-accent, rgba(255,255,255,0.08));
    border-radius: 4px;
    background: var(--background-secondary, rgba(0,0,0,0.2));
    color: var(--text-normal, #dcddde);
    font-size: 0.7rem;
    color-scheme: dark;
}
.translatorplus-quick-target option,
.translatorplus-select option {
    background: var(--bg-floating, var(--background-floating, #1e1f22));
    color: var(--text-normal, #dbdee1);
}
.translatorplus-quick-target optgroup,
.translatorplus-select optgroup {
    background: var(--bg-floating, var(--background-floating, #1e1f22));
    color: var(--header-primary, #f2f3f5);
}
.translatorplus-interactive {
    cursor: help;
    border-bottom: 1px dotted var(--text-muted, #72767d);
    position: relative;
    transition: color 0.15s;
    display: inline;
}
.translatorplus-interactive:hover {
    color: var(--header-primary, #fff);
}
.translatorplus-interactive-tooltip {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--background-floating, #18191c);
    padding: 8px 12px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    z-index: 9999;
    width: max-content;
    max-width: 300px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    font-size: 0.875rem;
    color: var(--text-normal, #dcddde);
    border: 1px solid var(--background-modifier-accent);
    text-align: center;
    font-style: normal;
}
.translatorplus-interactive:hover .translatorplus-interactive-tooltip {
    opacity: 1;
}
.translatorplus-ghost-container {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    padding: 0 16px 8px 16px;
    pointer-events: none;
    z-index: 10;
    display: flex;
    justify-content: flex-start;
}
.translatorplus-ghost-box {
    background: var(--bg-floating, var(--background-floating, rgba(18, 19, 22, 0.94)));
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-light, var(--background-modifier-accent, rgba(255, 255, 255, 0.1)));
    border-radius: 8px;
    padding: 8px 14px;
    color: var(--text-normal, #dcddde);
    font-size: 0.9em;
    box-shadow: 0 -6px 18px rgba(0,0,0,0.3);
    max-width: 100%;
    animation: translatorplus-slide-up 0.2s ease;
    pointer-events: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}
.translatorplus-ghost-box:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: var(--text-link);
}
.translatorplus-ghost-label {
    font-size: 0.65em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.05em;
}
.translatorplus-ghost-text {
    max-width: min(760px, 75vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/* ── Chat Bar Button: matches Discord native expression-picker buttons ── */
.translatorplus-chatbar-wrapper {
    display: flex;
    align-items: center;
}
.translatorplus-chatbar-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 4px;
    color: var(--interactive-normal, #b9bbbe);
    transition: color 0.17s ease, background-color 0.17s ease;
    border: none;
    background: transparent;
    height: 100%;
    position: relative;
}
.translatorplus-chatbar-btn:hover {
    color: var(--interactive-hover, #dcddde);
}
.translatorplus-chatbar-btn.active {
    color: var(--text-positive, #23a55a);
}
.translatorplus-chatbar-btn.active:hover {
    color: var(--text-positive, #23a55a);
    filter: brightness(1.2);
}
.translatorplus-chatbar-btn svg {
    display: block;
}
/* ── Message Toolbar Button: matches Discord hover-bar buttons ── */
.translatorplus-toolbar-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    color: var(--interactive-normal, #b9bbbe);
    transition: color 0.17s ease, background-color 0.17s ease;
    background: transparent;
    border: none;
}
.translatorplus-toolbar-btn:hover {
    color: var(--interactive-hover, #dcddde);
    background-color: var(--background-modifier-hover, rgba(79,84,92,0.16));
}
.translatorplus-toolbar-btn svg {
    display: block;
}
/* ── Modal: fully theme-compatible with transparency, blur, and custom CSS variables ── */
.translatorplus-modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    animation: translatorplus-fade-in 0.15s ease;
}
.translatorplus-modal {
    background: var(--bg-floating, var(--background-floating, var(--modal-background, #2b2d31)));
    backdrop-filter: blur(var(--blur-amount, 16px));
    -webkit-backdrop-filter: blur(var(--blur-amount, 16px));
    border: 1px solid var(--border, var(--background-modifier-accent, rgba(255, 255, 255, 0.08)));
    border-radius: 12px;
    width: 620px;
    max-width: 90vw;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04);
    animation: translatorplus-slide-up 0.2s ease;
    overflow: hidden;
}
.translatorplus-modal-header {
    padding: 16px 24px;
    background: var(--bg-3, var(--background-secondary-alt, var(--background-secondary, rgba(0, 0, 0, 0.15))));
    border-bottom: 1px solid var(--border-light, var(--background-modifier-accent, rgba(255, 255, 255, 0.06)));
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}
.translatorplus-modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-1, var(--header-primary, #f2f3f5));
    display: flex;
    gap: 8px;
    align-items: center;
}
.translatorplus-modal-close {
    cursor: pointer;
    color: var(--text-4, var(--interactive-normal, #b5bac1));
    transition: color 0.15s;
    display: flex;
}
.translatorplus-modal-close:hover {
    color: var(--text-1, var(--interactive-hover, #f2f3f5));
}
.translatorplus-modal-body {
    padding: 0;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
}
.translatorplus-modal-content {
    padding: 24px;
}
.translatorplus-settings-card {
    border: 1px solid var(--border-light, var(--background-modifier-accent, rgba(255,255,255,0.06)));
    background: var(--bg-2, var(--background-secondary, rgba(0,0,0,0.12)));
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 16px;
}
.translatorplus-action-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}
.translatorplus-action-btn {
    cursor: pointer;
    border: 1px solid var(--border-light, var(--background-modifier-accent, rgba(255,255,255,0.08)));
    border-radius: 6px;
    padding: 9px 12px;
    background: var(--bg-1, var(--button-secondary-background, rgba(255,255,255,0.05)));
    color: var(--text-1, var(--header-primary, #f2f3f5));
    font-weight: 600;
}
.translatorplus-action-btn:hover {
    background: var(--background-modifier-hover, rgba(255,255,255,0.08));
}
.translatorplus-section-title {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-4, var(--header-secondary, #b5bac1));
    margin-bottom: 12px;
    margin-top: 4px;
    letter-spacing: 0.05em;
}
.translatorplus-divider {
    height: 1px;
    background: var(--border-light, var(--background-modifier-accent, rgba(255, 255, 255, 0.06)));
    margin: 20px 0;
}
.translatorplus-select-wrapper {
    margin-bottom: 16px;
    width: 100%;
    box-sizing: border-box;
}
.translatorplus-select-label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: var(--text-4, var(--header-secondary, #b5bac1));
    font-size: 0.85rem;
}
.translatorplus-select {
    width: 100%;
    padding: 10px;
    background: var(--bg-1, var(--input-background, rgba(0, 0, 0, 0.25)));
    border: 1px solid var(--border-light, var(--background-modifier-accent, rgba(255, 255, 255, 0.06)));
    border-radius: 6px;
    color: var(--text-2, var(--text-normal, #dbdee1));
    font-size: 0.95rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
    appearance: none;
    color-scheme: dark;
}
.translatorplus-select:focus {
    border-color: var(--accent-2, var(--text-link, #5865f2));
    outline: none;
}
.translatorplus-tabs {
    display: flex;
    background: var(--bg-3, var(--background-tertiary, var(--background-secondary, rgba(0, 0, 0, 0.15))));
    padding: 0 16px;
    border-bottom: 1px solid var(--border-light, var(--background-modifier-accent, rgba(255, 255, 255, 0.06)));
    flex-shrink: 0;
}
.translatorplus-tab {
    padding: 12px 16px;
    cursor: pointer;
    color: var(--text-4, var(--interactive-normal, #b5bac1));
    border-bottom: 2px solid transparent;
    font-weight: 600;
    transition: all 0.2s;
}
.translatorplus-tab:hover {
    color: var(--text-1, var(--interactive-hover, #f2f3f5));
}
.translatorplus-tab.active {
    color: var(--text-1, var(--header-primary, #f2f3f5));
    border-bottom-color: var(--accent-2, var(--text-link, #5865f2));
}
.translatorplus-loading {
    font-size: 0.8em;
    color: var(--text-5, var(--text-muted, #949ba4));
    font-style: italic;
    margin-top: 2px;
}
.translatorplus-ctx-btn {
    cursor: pointer;
    display: block;
    width: 100%;
    padding: 10px 16px;
    margin-bottom: 16px;
    border: none;
    border-radius: 6px;
    color: var(--text-0, #fff);
    font-weight: 600;
    font-size: 0.9rem;
    transition: opacity 0.2s, filter 0.2s;
}
.translatorplus-ctx-btn:hover { filter: brightness(1.1); }
@keyframes translatorplus-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes translatorplus-slide-up { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

    const ICONS = {
        TRANSLATE: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>',
        TRANSLATE_SMALL: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>',
        CLOSE: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
    };

    const translationCache = new Map();
    const MAX_CACHE_ENTRIES = 500;
    const UI_LANGUAGES = {
        en: "English",
        tr: "Turkish",
        es: "Spanish",
        pt: "Portuguese",
        ru: "Russian",
        ar: "Arabic",
        hi: "Hindi",
        "zh-CN": "Chinese",
        fr: "French",
        de: "German",
        ja: "Japanese",
        ko: "Korean",
        id: "Indonesian"
    };

    const I18N = {
        en: {
            basicSettings: "Basic Settings",
            advancedSettings: "Advanced Settings",
            languageSettings: "Language Settings",
            channelOverrideActive: "Channel Override Active",
            saveChannelOverride: "Save Language Override for This Channel",
            resetChannelOverride: "Reset Channel Override (Use Global)",
            incomingSource: "Incoming Source",
            incomingTarget: "Incoming Target",
            outgoingSource: "Outgoing Source",
            outgoingTarget: "Outgoing Target",
            options: "Options",
            displayMode: "Display Mode",
            displayModeDesc: "How translations are shown",
            autoTranslate: "Auto Translate",
            autoTranslateDesc: "Automatically translate outgoing messages",
            autoTranslateIncoming: "Auto Translate Incoming",
            autoTranslateIncomingDesc: "Automatically translate new messages from other users",
            autoTranslateIncomingChannel: "Channel Incoming Auto Translate",
            autoTranslateIncomingChannelDesc: "Override incoming automatic translation in this channel",
            channelAutoTranslate: "Channel Auto Translate",
            channelAutoTranslateDesc: "Override outgoing auto-translation in this channel",
            inheritGlobal: "Inherit Global",
            enabled: "Enabled",
            disabled: "Disabled",
            showTooltip: "Show Tooltip",
            showTooltipDesc: "Show tooltip when auto-translating",
            livePreview: "Live Preview",
            livePreviewDesc: "Show translation preview while typing",
            livePreviewMode: "Live Preview Mode",
            livePreviewModeDesc: "Timed preview every 5 seconds or manual Ctrl+Space",
            debounced: "Fast",
            timed: "Every 5 seconds",
            manual: "Manual (Ctrl+Space)",
            preview: "Preview",
            protectedContent: "Protected Content",
            skipCommands: "Skip Commands",
            skipCommandsDesc: "Do not translate slash or prefix commands",
            skipCodeOnly: "Skip Code-Only Messages",
            skipCodeOnlyDesc: "Do not translate messages that are only code",
            skipLinksOnly: "Skip Link-Only Messages",
            skipLinksOnlyDesc: "Do not translate messages that are only links",
            quickTargets: "Quick Target Languages",
            quickTargetsDesc: "Comma-separated language codes used in message quick-select",
            actions: "Actions",
            bulkCount: "Recent Message Count",
            bulkCountDesc: "How many visible recent messages to translate from the current channel",
            translateRecent: "Translate Recent Visible Messages",
            translationService: "Translation Service",
            activeService: "Active Service",
            activeServiceDesc: "Choose translation engine",
            interfaceLanguage: "Interface Language",
            interfaceLanguageDesc: "Language used by TranslatorPlus settings",
            copy: "Copy",
            copied: "Translation copied",
            dismiss: "Dismiss",
            target: "Target",
            translateSelection: "Translate Selection",
            translateMessage: "Translate Message",
            revertTranslation: "Revert Translation",
            skippedProtected: "Skipped protected content"
        },
        tr: {
            basicSettings: "Temel Ayarlar",
            advancedSettings: "Gelismis Ayarlar",
            languageSettings: "Dil Ayarlari",
            channelOverrideActive: "Kanal Ozel Ayari Aktif",
            saveChannelOverride: "Bu Kanal Icin Dil Ayarini Kaydet",
            resetChannelOverride: "Kanal Ayarini Sifirla (Global Kullan)",
            incomingSource: "Gelen Kaynak",
            incomingTarget: "Gelen Hedef",
            outgoingSource: "Giden Kaynak",
            outgoingTarget: "Giden Hedef",
            options: "Secenekler",
            displayMode: "Gosterim Modu",
            displayModeDesc: "Cevirilerin nasil gosterilecegi",
            autoTranslate: "Otomatik Ceviri",
            autoTranslateDesc: "Giden mesajlari otomatik cevir",
            autoTranslateIncoming: "Gelenleri Otomatik Cevir",
            autoTranslateIncomingDesc: "Diger kullanicilardan gelen yeni mesajlari otomatik cevir",
            autoTranslateIncomingChannel: "Kanal Gelen Otomatik Ceviri",
            autoTranslateIncomingChannelDesc: "Bu kanalda gelen otomatik ceviriyi ozellestir",
            channelAutoTranslate: "Kanal Otomatik Ceviri",
            channelAutoTranslateDesc: "Bu kanalda giden otomatik ceviriyi ozellestir",
            inheritGlobal: "Global Ayari Kullan",
            enabled: "Acik",
            disabled: "Kapali",
            showTooltip: "Bildirim Goster",
            showTooltipDesc: "Otomatik ceviride bildirim goster",
            livePreview: "Canli Onizleme",
            livePreviewDesc: "Yazarken ceviri onizlemesi goster",
            livePreviewMode: "Canli Onizleme Modu",
            livePreviewModeDesc: "5 saniyede bir onizleme veya manuel Ctrl+Space",
            debounced: "Hizli",
            timed: "5 saniyede bir",
            manual: "Manuel (Ctrl+Space)",
            preview: "Onizleme",
            protectedContent: "Korunan Icerik",
            skipCommands: "Komutlari Atlama",
            skipCommandsDesc: "Slash veya prefix komutlarini cevirme",
            skipCodeOnly: "Sadece Kod Mesajlarini Atlama",
            skipCodeOnlyDesc: "Tamami kod olan mesajlari cevirme",
            skipLinksOnly: "Sadece Link Mesajlarini Atlama",
            skipLinksOnlyDesc: "Tamami link olan mesajlari cevirme",
            quickTargets: "Hizli Hedef Dilleri",
            quickTargetsDesc: "Mesajdaki hizli secim icin virgulle ayrilmis dil kodlari",
            actions: "Islemler",
            bulkCount: "Son Mesaj Sayisi",
            bulkCountDesc: "Bu kanalda cevrilecek gorunur son mesaj sayisi",
            translateRecent: "Gorunur Son Mesajlari Cevir",
            translationService: "Ceviri Servisi",
            activeService: "Aktif Servis",
            activeServiceDesc: "Ceviri motorunu sec",
            interfaceLanguage: "Arayuz Dili",
            interfaceLanguageDesc: "TranslatorPlus ayarlarinda kullanilan dil",
            copy: "Kopyala",
            copied: "Ceviri kopyalandi",
            dismiss: "Kapat",
            target: "Hedef",
            translateSelection: "Secimi Cevir",
            translateMessage: "Mesaji Cevir",
            revertTranslation: "Ceviriyi Geri Al",
            skippedProtected: "Korunan icerik atlandi"
        }
    };
    Object.keys(UI_LANGUAGES).forEach(lang => {
        if (!I18N[lang]) I18N[lang] = I18N.en;
    });

    function getCachedTranslation(cacheKey) {
        if (!translationCache.has(cacheKey)) return null;
        const value = translationCache.get(cacheKey);
        translationCache.delete(cacheKey);
        translationCache.set(cacheKey, value);
        return value;
    }

    function setCachedTranslation(cacheKey, value) {
        if (translationCache.has(cacheKey)) translationCache.delete(cacheKey);
        translationCache.set(cacheKey, value);
        while (translationCache.size > MAX_CACHE_ENTRIES) {
            translationCache.delete(translationCache.keys().next().value);
        }
    }

    // React component to bridge DOM-based settings UI into Discord's native Modal
    function SettingsContainer({ plugin, channelId }) {
        const containerRef = BdApi.React.useRef(null);
        BdApi.React.useEffect(() => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
                const ui = plugin.buildSettingsUI(channelId);
                ui.style.display = "flex";
                ui.style.flexDirection = "column";
                ui.style.flex = "1";
                ui.style.overflow = "hidden";
                containerRef.current.appendChild(ui);
            }
        }, [channelId]);
        return BdApi.React.createElement("div", {
            ref: containerRef,
            className: "translatorplus-native-modal-content",
            style: { display: "flex", flexDirection: "column", flex: "1", minHeight: "400px" }
        });
    }

    function protectVariables(text) {
        const protectedParts = [];
        let pText = text;
        pText = pText.replace(/```[\s\S]*?```/g, (match) => {
            protectedParts.push(match);
            return `[[PROTECTED_CODE_${protectedParts.length - 1}]]`;
        });
        pText = pText.replace(/`[^`]+`/g, (match) => {
            protectedParts.push(match);
            return `[[PROTECTED_INLINE_${protectedParts.length - 1}]]`;
        });
        pText = pText.replace(/<(@|#|@&)!?\d+>/g, (match) => {
            protectedParts.push(match);
            return `[[PROTECTED_MENTION_${protectedParts.length - 1}]]`;
        });
        pText = pText.replace(/<a?:\w+:\d+>/g, (match) => {
            protectedParts.push(match);
            return `[[PROTECTED_EMOJI_${protectedParts.length - 1}]]`;
        });
        pText = pText.replace(/https?:\/\/\S+/gi, (match) => {
            protectedParts.push(match);
            return `[[PROTECTED_LINK_${protectedParts.length - 1}]]`;
        });
        return { protectedText: pText, parts: protectedParts };
    }

    function restoreVariables(text, parts) {
        let rText = text;
        for (let i = 0; i < parts.length; i++) {
            rText = rText.replace(new RegExp(`\\[\\[PROTECTED_\\w+_${i}\\]\\]`, 'g'), parts[i]);
        }
        return rText;
    }

    async function googleTranslate(text, sourceLang, targetLang) {
        const cacheKey = `g:${sourceLang}:${targetLang}:${text}`;
        const cached = getCachedTranslation(cacheKey);
        if (cached) return cached;
        const url = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
            client: "gtx",
            sl: sourceLang,
            tl: targetLang,
            dt: "t",
            q: text
        });
        const res = await fetch(url);
        if (!res.ok) throw new Error("Google API Error: " + res.status);
        const data = await res.json();
        const translatedText = Array.isArray(data?.[0]) ? data[0].map(part => part?.[0] || "").join("") : "";
        const detectedSource = data?.[2] || sourceLang;
        const result = { sourceLanguage: GoogleLanguages[detectedSource] || detectedSource, text: translatedText };
        if (!result.text) throw new Error("Google API Error: Empty translation response");
        setCachedTranslation(cacheKey, result);
        return result;
    }

    async function groqTranslate(text, sourceLang, targetLang, settings) {
        if (!settings.groqApiKey) throw new Error("Groq API Key Missing");
        if (settings.translationService !== "groq") throw new Error("Service mismatch: Settings say " + settings.translationService + " but Groq called");
        const cacheKey = `groq:${settings.groqModel}:${settings.groqTone}:${targetLang}:${text}`;
        const cached = getCachedTranslation(cacheKey);
        if (cached) return cached;
        let systemPrompt = settings.groqPrompt;
        systemPrompt = systemPrompt.replace("${targetLanguage}", GoogleLanguages[targetLang] || targetLang);
        const toneInstruction = AI_TONES[settings.groqTone || "standard"];
        if (toneInstruction) systemPrompt += "\n\n" + toneInstruction;
        const body = {
            model: settings.groqModel || "openai/gpt-oss-120b",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }]
        };
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": "Bearer " + settings.groqApiKey, "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error("Groq API Error: " + (err.error?.message || res.statusText));
        }
        const data = await res.json();
        const result = { sourceLanguage: "Groq AI", text: data.choices[0]?.message?.content?.trim() };
        setCachedTranslation(cacheKey, result);
        return result;
    }

    async function openrouterTranslate(text, sourceLang, targetLang, settings) {
        if (!settings.openrouterApiKey) throw new Error("OpenRouter API Key Missing");
        if (settings.translationService !== "openrouter") throw new Error("Service mismatch: Settings say " + settings.translationService + " but OpenRouter called");
        const cacheKey = `or:${settings.openrouterModel}:${settings.openrouterTone}:${targetLang}:${text}`;
        const cached = getCachedTranslation(cacheKey);
        if (cached) return cached;
        let systemPrompt = settings.openrouterPrompt || "You are a professional translator. Translate the input to ${targetLanguage}. Do not add any emojis, explanations, notes, or opening/closing remarks. Return ONLY the translation.";
        systemPrompt = systemPrompt.replace("${targetLanguage}", GoogleLanguages[targetLang] || targetLang);
        const toneInstruction = AI_TONES[settings.openrouterTone || "standard"];
        if (toneInstruction) systemPrompt += "\n\n" + toneInstruction;
        const body = {
            model: settings.openrouterModel || "google/gemma-3-27b-it:free",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }]
        };
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": "Bearer " + settings.openrouterApiKey, "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error("OpenRouter API Error: " + (err.error?.message || res.statusText));
        }
        const data = await res.json();
        const result = { sourceLanguage: "OpenRouter AI", text: data.choices[0]?.message?.content?.trim() };
        setCachedTranslation(cacheKey, result);
        return result;
    }

    function shouldSkipTranslation(text, kind, settings) {
        const trimmed = String(text || "").trim();
        if (!trimmed) return true;
        if (kind === "sent" && settings.skipCommands && /^(\/|!|\?|\.|;|\$)\S+/.test(trimmed)) return true;
        if (settings.skipCodeOnly && (/^```[\s\S]*```$/.test(trimmed) || /^`[^`]+`$/.test(trimmed))) return true;
        if (settings.skipLinksOnly) {
            const withoutLinks = trimmed.replace(/https?:\/\/\S+/gi, "").replace(/<https?:\/\/\S+>/gi, "").trim();
            if (!withoutLinks && /https?:\/\//i.test(trimmed)) return true;
        }
        return false;
    }

    async function translate(kind, text, globalSettings, channelId, overrides = {}) {
        let settings = Object.assign({}, globalSettings);
        if (channelId && globalSettings.contextMap && globalSettings.contextMap[channelId]) {
            settings = Object.assign(settings, globalSettings.contextMap[channelId]);
        }
        settings = Object.assign(settings, overrides);
        const sourceLang = settings[kind + "Input"];
        const targetLang = settings[kind + "Output"];

        // Force global service to prevent context overrides causing confusion
        let service = String(globalSettings.translationService || "google").toLowerCase().trim();
        if (!["google", "groq", "openrouter"].includes(service)) service = "google";

        const prot = protectVariables(text);
        let result;

        try {
            if (service === "groq") {
                result = await groqTranslate(prot.protectedText, sourceLang, targetLang, settings);
            } else if (service === "openrouter") {
                result = await openrouterTranslate(prot.protectedText, sourceLang, targetLang, settings);
            } else {
                result = await googleTranslate(prot.protectedText, sourceLang, targetLang);
            }
        } catch (err) {
            console.error("[TranslatorPlus] Translation failed with " + service + ", falling back to Google:", err);
            // If the primary service failed, fall back to Google (unless Google itself failed)
            if (service !== "google") {
                BdApi.UI.showToast(`${service} Error: ${err.message}. Falling back to Google...`, { type: "warning", timeout: 3000 });
                try {
                    result = await googleTranslate(prot.protectedText, sourceLang, targetLang);
                } catch (fallbackErr) {
                    throw new Error("Translation failed on both " + service + " and Google: " + fallbackErr.message);
                }
            } else {
                // If Google failed, re-throw the error
                throw err;
            }
        }

        result.text = restoreVariables(result.text, prot.parts);
        return result;
    }

    // ======================== PLUGIN CLASS ========================
    return class TranslatorPlus {
        constructor() {
            this.settings = {};
            this.translations = new Map();
            this.pendingTranslations = new Map();
            this.observer = null;
            this.contextMenuPatch = null;
            this.chatBarObserver = null;
            this.previewDebounce = null;
            this.ghostElement = null;
            this._keyHandler = null;
            this.restoreDebounce = null;
            this.channelChangeListener = null;
            this.currentChannelId = null;
            this.previewRequestId = 0;
            this.lastPreviewAt = 0;
            this.autoIncomingQueue = [];
            this.autoIncomingQueuedIds = new Set();
            this.autoIncomingTimer = null;
        }

        start() {
            this.settings = this.loadSettings();
            BdApi.DOM.addStyle(config.info.name, CSS);
            this.patchContextMenu();
            this.patchDOMObserver();
            this.injectChatBarButton();
            this.patchMessageSend();
            this.enableLivePreview();
            
            // Memory Management: Clear translations when switching channels
            const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
            if (SelectedChannelStore) {
                this.currentChannelId = SelectedChannelStore.getChannelId?.() ?? null;
                this.channelChangeListener = () => {
                    const nextChannelId = SelectedChannelStore.getChannelId?.() ?? null;
                    if (nextChannelId === this.currentChannelId) return;
                    this.currentChannelId = nextChannelId;
                    this.translations.clear();
                    this.autoIncomingQueue = [];
                    this.autoIncomingQueuedIds.clear();
                    this.updateChatBarButtonState();
                };
                SelectedChannelStore.addChangeListener(this.channelChangeListener);
            }
            
            BdApi.UI.showToast("TranslatorPlus V1.5.1 Enabled", { type: "success" });
        }

        stop() {
            BdApi.DOM.removeStyle(config.info.name);
            this.unpatchAll();
            this.removeAllAccessories();
            this.removeChatBarButton();
            this.disableLivePreview();
            this.translations.clear();
            this.pendingTranslations.clear();
            this.autoIncomingQueue = [];
            this.autoIncomingQueuedIds.clear();
            if (this.autoIncomingTimer) clearTimeout(this.autoIncomingTimer);
            this.autoIncomingTimer = null;
            
            const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
            if (SelectedChannelStore && this.channelChangeListener) {
                SelectedChannelStore.removeChangeListener(this.channelChangeListener);
            }
            this.currentChannelId = null;
        }

        loadSettings() {
            const loaded = BdApi.Data.load(config.info.name, "settings");
            const finalSettings = Object.assign({}, config.defaultSettings, loaded);
            if (!Array.isArray(finalSettings.quickTargetLanguages)) {
                finalSettings.quickTargetLanguages = String(finalSettings.quickTargetLanguages || "tr,en,es,de,fr,ru,ar,pt,zh-CN,ja")
                    .split(",")
                    .map(lang => lang.trim())
                    .filter(Boolean);
            }
            finalSettings.bulkTranslateCount = Math.max(1, Math.min(30, Number(finalSettings.bulkTranslateCount) || 10));
            if (!I18N[finalSettings.uiLanguage]) finalSettings.uiLanguage = "en";
            if (!["debounced", "timed", "manual"].includes(finalSettings.livePreviewMode)) finalSettings.livePreviewMode = "timed";
            finalSettings.livePreviewInterval = Math.max(2000, Math.min(15000, Number(finalSettings.livePreviewInterval) || 5000));
            // Sanitize translationService to prevent stuck invalid states
            if (finalSettings.translationService && !["google", "groq", "openrouter"].includes(finalSettings.translationService)) {
                finalSettings.translationService = "google";
            }
            return finalSettings;
        }

        saveSettings() {
            BdApi.Data.save(config.info.name, "settings", this.settings);
        }

        t(key) {
            const lang = I18N[this.settings.uiLanguage] ? this.settings.uiLanguage : "en";
            return I18N[lang]?.[key] || I18N.en[key] || key;
        }

        getEffectiveSettings(channelId) {
            const effective = Object.assign({}, this.settings);
            if (channelId && this.settings.contextMap?.[channelId]) {
                Object.assign(effective, this.settings.contextMap[channelId]);
            }
            return effective;
        }

        /* ==================== LIVE PREVIEW ==================== */

        enableLivePreview() {
            this._keyHandler = this.handleKeyPress.bind(this);
            document.addEventListener("keyup", this._keyHandler);
        }

        disableLivePreview() {
            if (this._keyHandler) document.removeEventListener("keyup", this._keyHandler);
            this.removeGhostText();
        }

        handleKeyPress(e) {
            if (!this.settings.livePreview) return;
            const target = e.target;
            if (!target || target.tagName !== "TEXTAREA") return;
            if (!target.closest('[class*="channelTextArea_"]')) return;
            if (this.previewDebounce) clearTimeout(this.previewDebounce);
            if (e.key === "Enter") { this.removeGhostText(); return; }
            if (this.settings.livePreviewMode === "manual" && !(e.ctrlKey && e.code === "Space")) return;
            const text = target.value;
            if (!text || text.length < 2) { this.removeGhostText(); return; }
            if (shouldSkipTranslation(text, "sent", this.getEffectiveSettings(BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId()))) {
                this.removeGhostText();
                return;
            }
            let delay = 800;
            if (this.settings.livePreviewMode === "manual") delay = 0;
            if (this.settings.livePreviewMode === "timed") {
                const elapsed = Date.now() - this.lastPreviewAt;
                delay = Math.max(0, this.settings.livePreviewInterval - elapsed);
            }
            this.previewDebounce = setTimeout(() => this.showGhostPreview(target, text), delay);
        }

        async showGhostPreview(textarea, text) {
            const requestId = ++this.previewRequestId;
            try {
                const channelId = BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
                const res = await translate("sent", text, this.settings, channelId);
                if (requestId !== this.previewRequestId || textarea.value !== text) return;
                this.lastPreviewAt = Date.now();
                this.removeGhostText();
                if (!res.text || res.text === text) return;
                const container = textarea.closest('[class*="channelTextArea_"]');
                if (!container) return;
                const ghost = document.createElement("div");
                ghost.className = "translatorplus-ghost-container";
                const box = document.createElement("div");
                box.className = "translatorplus-ghost-box";
                box.title = "Click to replace your text";
                const label = document.createElement("span");
                label.className = "translatorplus-ghost-label";
                label.textContent = this.t("preview") + ":";
                const span = document.createElement("span");
                span.className = "translatorplus-ghost-text";
                span.textContent = res.text;
                box.appendChild(label);
                box.appendChild(span);
                box.addEventListener("click", () => {
                    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                    nativeSetter.call(textarea, res.text);
                    textarea.dispatchEvent(new Event("input", { bubbles: true }));
                    this.removeGhostText();
                });
                ghost.appendChild(box);
                container.style.position = "relative";
                container.prepend(ghost);
                this.ghostElement = ghost;
            } catch (err) {
                console.error("[TranslatorPlus] Preview Error:", err);
            }
        }

        removeGhostText() {
            if (this.ghostElement) {
                this.ghostElement.remove();
                this.ghostElement = null;
            }
            document.querySelectorAll(".translatorplus-ghost-container").forEach(el => el.remove());
        }

        getTargetLanguage(kind, channelId) {
            return this.getEffectiveSettings(channelId)?.[kind + "Output"];
        }

        getQuickTargetLanguages(currentTarget) {
            const langs = Array.isArray(this.settings.quickTargetLanguages) ? this.settings.quickTargetLanguages : [];
            return Array.from(new Set([currentTarget, ...langs].filter(lang => lang && GoogleLanguages[lang])));
        }

        /* ==================== TRANSLATE MESSAGE ==================== */

        async translateMessage(message) {
            await this.translateMessageById(message.id, message.content);
        }

        async translateMessageById(msgId, content, overrides = {}, options = {}) {
            if (this.translations.has(msgId) && !options.force) {
                this.removeTranslation(msgId);
                return;
            }
            if (this.translations.has(msgId) && options.force) this.removeTranslation(msgId);
            if (this.pendingTranslations.has(msgId)) return this.pendingTranslations.get(msgId);
            const contentEl = document.getElementById("message-content-" + msgId);
            if (!contentEl && !content) return;
            const text = content || contentEl?.innerText;
            if (!text || text.trim().length === 0) return;

            const task = (async () => {
                const channelId = BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
                const effectiveSettings = Object.assign(this.getEffectiveSettings(channelId), overrides);
                if (shouldSkipTranslation(text, "received", effectiveSettings)) {
                    BdApi.UI.showToast(this.t("skippedProtected"), { type: "info" });
                    return;
                }
                this.showLoading(msgId);
                const startTime = performance.now();
                try {
                    const res = await translate("received", text, this.settings, channelId, overrides);
                    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
                    res.timing = elapsed + "s";
                    res.targetLanguage = overrides.receivedOutput || this.getTargetLanguage("received", channelId);
                    this.translations.set(msgId, {
                        text: res.text,
                        sourceLanguage: res.sourceLanguage,
                        targetLanguage: res.targetLanguage,
                        original: text,
                        originalHtml: contentEl?.innerHTML || null,
                        displayMode: options.displayMode || null
                    });
                    this.removeLoading(msgId);

                    this.renderTranslation(msgId, this.translations.get(msgId));
                } catch (err) {
                    console.error("[TranslatorPlus] Translation Error:", err);
                    this.removeLoading(msgId);
                    BdApi.UI.showToast("Translation Error: " + err.message, { type: "error" });
                } finally {
                    this.pendingTranslations.delete(msgId);
                }
            })();
            this.pendingTranslations.set(msgId, task);
            return task;
        }

        async retranslateMessage(msgId, targetLang) {
            const current = this.translations.get(msgId);
            const original = current?.original || document.getElementById("message-content-" + msgId)?.innerText;
            if (!original || !targetLang) return;
            this.removeTranslation(msgId);
            await this.translateMessageById(msgId, original, { receivedOutput: targetLang }, { force: true });
        }

        renderTranslation(msgId, res) {
            const mode = res.displayMode || this.settings.displayMode;
            if (mode === "interactive") {
                this.showInteractive(msgId, res);
            } else if (mode === "replace") {
                this.showReplace(msgId, res);
            } else if (mode === "both") {
                this.showReplace(msgId, res);
                this.showAccessory(msgId, res);
            } else {
                this.showAccessory(msgId, res);
            }
        }

        async translateSelectedText(message, selectedText) {
            if (!message?.id || !selectedText?.trim()) return;
            await this.translateMessageById(message.id, selectedText.trim(), {}, { force: true, displayMode: "accessory" });
        }

        async translateRecentMessages() {
            const limit = Math.max(1, Math.min(30, Number(this.settings.bulkTranslateCount) || 10));
            const items = Array.from(document.querySelectorAll('li[id^="chat-messages-"] [id^="message-content-"]'))
                .slice(-limit)
                .map(el => ({ id: el.id.replace("message-content-", ""), text: el.innerText }))
                .filter(item => item.id && item.text && !this.translations.has(item.id) && !this.pendingTranslations.has(item.id));

            for (const item of items) {
                await this.translateMessageById(item.id, item.text);
                await new Promise(resolve => setTimeout(resolve, 120));
            }
        }

        /* ==================== DISPLAY MODES ==================== */

        showAccessory(msgId, res) {
            const container = this.getMessageContainer(msgId);
            if (!container) return;
            const existing = document.getElementById("translatorplus-" + msgId);
            if (existing) existing.remove();

            const acc = document.createElement("div");
            acc.className = "translatorplus-accessory";
            acc.id = "translatorplus-" + msgId;

            const textDiv = document.createElement("div");
            textDiv.className = "translatorplus-accessory-text";
            textDiv.textContent = res.text;
            acc.appendChild(textDiv);

            const meta = document.createElement("div");
            meta.className = "translatorplus-accessory-meta";
            const iconWrap = document.createElement("span");
            iconWrap.innerHTML = ICONS.TRANSLATE_SMALL;
            meta.appendChild(iconWrap);
            const info = document.createElement("span");
            const source = res.sourceLanguage || "Auto";
            const target = GoogleLanguages[res.targetLanguage] || res.targetLanguage || "";
            info.textContent = source + (target ? " -> " + target : "") + (res.timing ? " • " + res.timing : "");
            meta.appendChild(info);

            const quickTargets = this.getQuickTargetLanguages(res.targetLanguage);
            if (quickTargets.length > 1) {
                const quick = document.createElement("select");
                quick.className = "translatorplus-quick-target";
                quick.title = this.t("target");
                quickTargets.forEach(lang => {
                    const opt = document.createElement("option");
                    opt.value = lang;
                    opt.textContent = GoogleLanguages[lang] || lang;
                    if (lang === res.targetLanguage) opt.selected = true;
                    quick.appendChild(opt);
                });
                quick.addEventListener("change", () => this.retranslateMessage(msgId, quick.value));
                meta.appendChild(quick);
            }

            const copy = document.createElement("button");
            copy.className = "translatorplus-dismiss";
            copy.textContent = this.t("copy");
            copy.addEventListener("click", () => {
                globalThis.DiscordNative?.clipboard?.copy?.(res.text) || navigator.clipboard?.writeText?.(res.text);
                BdApi.UI.showToast(this.t("copied"), { type: "success" });
            });
            meta.appendChild(copy);

            const dismiss = document.createElement("span");
            dismiss.className = "translatorplus-dismiss";
            dismiss.textContent = this.t("dismiss");
            dismiss.addEventListener("click", () => this.removeTranslation(msgId));
            meta.appendChild(dismiss);
            acc.appendChild(meta);

            container.appendChild(acc);
        }

        showReplace(msgId, res) {
            const el = document.getElementById("message-content-" + msgId);
            if (!el) return;
            if (!el.dataset.originalText) {
                el.dataset.originalText = el.innerText;
                el.dataset.originalHtml = res.originalHtml || el.innerHTML;
            }
            el.innerText = res.text;
        }

        showInteractive(msgId, res) {
            const el = document.getElementById("message-content-" + msgId);
            if (!el) return;
            if (!el.dataset.originalText) {
                el.dataset.originalText = el.innerText;
                el.dataset.originalHtml = res.originalHtml || el.innerHTML;
            }
            const wrapper = document.createElement("span");
            wrapper.className = "translatorplus-interactive";
            wrapper.textContent = res.text;

            const tooltip = document.createElement("div");
            tooltip.className = "translatorplus-interactive-tooltip";
            tooltip.textContent = el.dataset.originalText;
            wrapper.appendChild(tooltip);

            el.innerHTML = "";
            el.appendChild(wrapper);
        }

        showLoading(msgId) {
            const container = this.getMessageContainer(msgId);
            if (!container) return;
            const loader = document.createElement("div");
            loader.className = "translatorplus-loading";
            loader.id = "translatorplus-loader-" + msgId;
            loader.textContent = "Translating...";
            container.appendChild(loader);
        }

        removeLoading(msgId) {
            const loader = document.getElementById("translatorplus-loader-" + msgId);
            if (loader) loader.remove();
        }

        getMessageContainer(msgId) {
            const contentEl = document.getElementById("message-content-" + msgId);
            if (contentEl) return contentEl.parentElement;
            return null;
        }

        removeTranslation(msgId, options = {}) {
            const stored = this.translations.get(msgId);
            if (!options.keepCache) this.translations.delete(msgId);
            const acc = document.getElementById("translatorplus-" + msgId);
            if (acc) acc.remove();
            const el = document.getElementById("message-content-" + msgId);
            if (el && el.dataset.originalText) {
                if (el.dataset.originalHtml || stored?.originalHtml) {
                    el.innerHTML = el.dataset.originalHtml || stored.originalHtml;
                } else {
                    el.innerText = el.dataset.originalText;
                }
                delete el.dataset.originalText;
                delete el.dataset.originalHtml;
            }
        }

        removeAllAccessories() {
            document.querySelectorAll(".translatorplus-accessory").forEach(el => el.remove());
            document.querySelectorAll("[data-original-text]").forEach(el => {
                if (el.dataset.originalHtml) el.innerHTML = el.dataset.originalHtml;
                else el.innerText = el.dataset.originalText;
                delete el.dataset.originalText;
                delete el.dataset.originalHtml;
            });
        }

        /* ==================== SHARED SETTINGS UI ==================== */

        buildSettingsUI(channelId, activeTab) {
            activeTab = activeTab || "basic";
            const hasContext = channelId && this.settings.contextMap && this.settings.contextMap[channelId];
            const wrapper = document.createElement("div");

            const tabs = document.createElement("div");
            tabs.className = "translatorplus-tabs";
            const tabBasic = document.createElement("div");
            tabBasic.className = "translatorplus-tab" + (activeTab === "basic" ? " active" : "");
            tabBasic.textContent = this.t("basicSettings");
            const tabAdv = document.createElement("div");
            tabAdv.className = "translatorplus-tab" + (activeTab === "advanced" ? " active" : "");
            tabAdv.textContent = this.t("advancedSettings");
            tabs.appendChild(tabBasic);
            tabs.appendChild(tabAdv);

            const body = document.createElement("div");
            body.className = "translatorplus-modal-body";
            const basicContent = document.createElement("div");
            basicContent.className = "translatorplus-modal-content";
            basicContent.style.display = activeTab === "basic" ? "block" : "none";
            const advContent = document.createElement("div");
            advContent.className = "translatorplus-modal-content";
            advContent.style.display = activeTab === "advanced" ? "block" : "none";
            body.appendChild(basicContent);
            body.appendChild(advContent);

            tabBasic.onclick = () => {
                tabBasic.classList.add("active");
                tabAdv.classList.remove("active");
                basicContent.style.display = "block";
                advContent.style.display = "none";
            };
            tabAdv.onclick = () => {
                tabAdv.classList.add("active");
                tabBasic.classList.remove("active");
                basicContent.style.display = "none";
                advContent.style.display = "block";
            };

            wrapper.appendChild(tabs);
            wrapper.appendChild(body);

            // BASIC TAB
            basicContent.appendChild(this.createSectionTitle(hasContext ? this.t("channelOverrideActive") : this.t("languageSettings")));

            if (channelId) {
                const ctxBtn = document.createElement("button");
                ctxBtn.className = "translatorplus-ctx-btn";
                ctxBtn.style.background = hasContext ? "#faa61a" : "#43b581";
                ctxBtn.textContent = hasContext ? this.t("resetChannelOverride") : this.t("saveChannelOverride");
                ctxBtn.onclick = () => {
                    if (hasContext) {
                        delete this.settings.contextMap[channelId];
                    } else {
                        if (!this.settings.contextMap) this.settings.contextMap = {};
                        this.settings.contextMap[channelId] = {
                            receivedInput: this.settings.receivedInput,
                            receivedOutput: this.settings.receivedOutput,
                            sentInput: this.settings.sentInput,
                            sentOutput: this.settings.sentOutput,
                            autoTranslate: this.settings.autoTranslate,
                            autoTranslateIncoming: this.settings.autoTranslateIncoming
                        };
                    }
                    this.saveSettings();
                    const newUI = this.buildSettingsUI(channelId, "basic");
                    wrapper.replaceWith(newUI);
                };
                basicContent.appendChild(ctxBtn);
            }

            const getSetting = (key) => {
                if (hasContext && this.settings.contextMap[channelId][key] !== undefined) {
                    return this.settings.contextMap[channelId][key];
                }
                return this.settings[key];
            };
            const setSetting = (key, val) => {
                if (hasContext) {
                    this.settings.contextMap[channelId][key] = val;
                } else {
                    this.settings[key] = val;
                }
                this.saveSettings();
            };

            basicContent.appendChild(this.createLangSelect(this.t("incomingSource"), getSetting("receivedInput"), (v) => setSetting("receivedInput", v), true));
            basicContent.appendChild(this.createLangSelect(this.t("incomingTarget"), getSetting("receivedOutput"), (v) => setSetting("receivedOutput", v), false));

            const divider1 = document.createElement("div");
            divider1.className = "translatorplus-divider";
            basicContent.appendChild(divider1);

            basicContent.appendChild(this.createLangSelect(this.t("outgoingSource"), getSetting("sentInput"), (v) => setSetting("sentInput", v), true));
            basicContent.appendChild(this.createLangSelect(this.t("outgoingTarget"), getSetting("sentOutput"), (v) => setSetting("sentOutput", v), false));

            const divider2 = document.createElement("div");
            divider2.className = "translatorplus-divider";
            basicContent.appendChild(divider2);

            basicContent.appendChild(this.createSectionTitle(this.t("options")));

            basicContent.appendChild(this.createSimpleSelect(this.t("displayMode"), this.t("displayModeDesc"), this.settings.displayMode,
                [{ v: "accessory", l: "Accessory (Below Message)" }, { v: "replace", l: "Replace Original Text" }, { v: "interactive", l: "Interactive (Hover to See Original)" }, { v: "both", l: "Both (Replace + Accessory)" }],
                (v) => { this.settings.displayMode = v; this.saveSettings(); }
            ));

            basicContent.appendChild(this.createToggle(this.t("autoTranslate"), this.t("autoTranslateDesc"), this.settings.autoTranslate, (v) => {
                this.settings.autoTranslate = v;
                this.saveSettings();
                this.updateChatBarButtonState();
            }));
            basicContent.appendChild(this.createToggle(this.t("autoTranslateIncoming"), this.t("autoTranslateIncomingDesc"), this.settings.autoTranslateIncoming, (v) => {
                this.settings.autoTranslateIncoming = v;
                this.saveSettings();
            }));
            if (channelId) {
                const channelAuto = hasContext && this.settings.contextMap[channelId].autoTranslate !== undefined ? String(this.settings.contextMap[channelId].autoTranslate) : "inherit";
                basicContent.appendChild(this.createSimpleSelect(this.t("channelAutoTranslate"), this.t("channelAutoTranslateDesc"), channelAuto,
                    [{ v: "inherit", l: this.t("inheritGlobal") }, { v: "true", l: this.t("enabled") }, { v: "false", l: this.t("disabled") }],
                    (v) => {
                        if (!this.settings.contextMap) this.settings.contextMap = {};
                        if (!this.settings.contextMap[channelId]) this.settings.contextMap[channelId] = {};
                        if (v === "inherit") delete this.settings.contextMap[channelId].autoTranslate;
                        else this.settings.contextMap[channelId].autoTranslate = v === "true";
                        this.saveSettings();
                    }
                ));
                const channelIncomingAuto = hasContext && this.settings.contextMap[channelId].autoTranslateIncoming !== undefined ? String(this.settings.contextMap[channelId].autoTranslateIncoming) : "inherit";
                basicContent.appendChild(this.createSimpleSelect(this.t("autoTranslateIncomingChannel"), this.t("autoTranslateIncomingChannelDesc"), channelIncomingAuto,
                    [{ v: "inherit", l: this.t("inheritGlobal") }, { v: "true", l: this.t("enabled") }, { v: "false", l: this.t("disabled") }],
                    (v) => {
                        if (!this.settings.contextMap) this.settings.contextMap = {};
                        if (!this.settings.contextMap[channelId]) this.settings.contextMap[channelId] = {};
                        if (v === "inherit") delete this.settings.contextMap[channelId].autoTranslateIncoming;
                        else this.settings.contextMap[channelId].autoTranslateIncoming = v === "true";
                        this.saveSettings();
                    }
                ));
            }
            basicContent.appendChild(this.createToggle(this.t("showTooltip"), this.t("showTooltipDesc"), this.settings.showAutoTranslateTooltip, (v) => {
                this.settings.showAutoTranslateTooltip = v;
                this.saveSettings();
            }));
            basicContent.appendChild(this.createToggle(this.t("livePreview"), this.t("livePreviewDesc"), this.settings.livePreview, (v) => {
                this.settings.livePreview = v;
                this.saveSettings();
            }));
            basicContent.appendChild(this.createSimpleSelect(this.t("livePreviewMode"), this.t("livePreviewModeDesc"), this.settings.livePreviewMode,
                [{ v: "timed", l: this.t("timed") }, { v: "debounced", l: this.t("debounced") }, { v: "manual", l: this.t("manual") }],
                (v) => { this.settings.livePreviewMode = v; this.saveSettings(); }
            ));

            basicContent.appendChild(this.createSectionTitle(this.t("actions")));
            const actions = document.createElement("div");
            actions.className = "translatorplus-action-row";
            const recentBtn = document.createElement("button");
            recentBtn.className = "translatorplus-action-btn";
            recentBtn.textContent = this.t("translateRecent");
            recentBtn.onclick = () => this.translateRecentMessages();
            actions.appendChild(recentBtn);
            basicContent.appendChild(actions);
            basicContent.appendChild(this.createInput(this.t("bulkCount"), this.settings.bulkTranslateCount, this.t("bulkCountDesc"), false, (v) => {
                this.settings.bulkTranslateCount = Math.max(1, Math.min(30, Number(v) || 10));
                this.saveSettings();
            }));

            // ADVANCED TAB
            advContent.appendChild(this.createSectionTitle(this.t("interfaceLanguage")));
            advContent.appendChild(this.createSimpleSelect(this.t("interfaceLanguage"), this.t("interfaceLanguageDesc"), this.settings.uiLanguage,
                Object.entries(UI_LANGUAGES).map(([v, l]) => ({ v, l })),
                (v) => { this.settings.uiLanguage = v; this.saveSettings(); const newUI = this.buildSettingsUI(channelId, "advanced"); wrapper.replaceWith(newUI); }
            ));

            advContent.appendChild(this.createSectionTitle(this.t("protectedContent")));
            advContent.appendChild(this.createToggle(this.t("skipCommands"), this.t("skipCommandsDesc"), this.settings.skipCommands, (v) => { this.settings.skipCommands = v; this.saveSettings(); }));
            advContent.appendChild(this.createToggle(this.t("skipCodeOnly"), this.t("skipCodeOnlyDesc"), this.settings.skipCodeOnly, (v) => { this.settings.skipCodeOnly = v; this.saveSettings(); }));
            advContent.appendChild(this.createToggle(this.t("skipLinksOnly"), this.t("skipLinksOnlyDesc"), this.settings.skipLinksOnly, (v) => { this.settings.skipLinksOnly = v; this.saveSettings(); }));
            advContent.appendChild(this.createInput(this.t("quickTargets"), this.settings.quickTargetLanguages.join(","), this.t("quickTargetsDesc"), false, (v) => {
                this.settings.quickTargetLanguages = v.split(",").map(lang => lang.trim()).filter(lang => GoogleLanguages[lang]);
                this.saveSettings();
            }));

            advContent.appendChild(this.createSectionTitle(this.t("translationService")));

            // replaceWith keeps closure references intact — the new wrapper IS the new closure scope
            const refreshAdvanced = () => {
                const newUI = this.buildSettingsUI(channelId, "advanced");
                wrapper.replaceWith(newUI);
            };

            advContent.appendChild(this.createSimpleSelect(this.t("activeService"), this.t("activeServiceDesc"), this.settings.translationService,
                [{ v: "google", l: "Google Translate (Free)" }, { v: "groq", l: "Groq AI (Fast & Smart)" }, { v: "openrouter", l: "OpenRouter AI (Multi-Model)" }],
                (v) => { this.settings.translationService = v; this.saveSettings(); refreshAdvanced(); }
            ));

            // Groq AI Settings
            if (this.settings.translationService === "groq") {
                advContent.appendChild(this.createSectionTitle("GROQ AI SETTINGS"));
                advContent.appendChild(this.createInput("API Key", this.settings.groqApiKey, "gsk_...", true, (v) => { this.settings.groqApiKey = v; this.saveSettings(); }));

                advContent.appendChild(this.createSimpleSelect("AI Tone", "Changes the translation style and updates the system prompt", this.settings.groqTone || "standard",
                    [{ v: "standard", l: "Standard (Natural)" }, { v: "formal", l: "Formal (Professional)" }, { v: "gamer", l: "Gamer (Slang/Gaming)" }, { v: "toxic", l: "Toxic (Aggressive Fun)" }],
                    (v) => {
                        this.settings.groqTone = v;
                        const basePrompt = "You are a professional translator. Translate the input to ${targetLanguage}. Do not add any emojis, explanations, notes, or opening/closing remarks. Return ONLY the translation.";
                        const toneText = AI_TONES[v] || "";
                        this.settings.groqPrompt = toneText ? basePrompt + "\n\n" + toneText : basePrompt;
                        this.saveSettings();
                        refreshAdvanced();
                    }
                ));

                const groqModels = [
                    { id: "openai/gpt-oss-120b", label: "OpenAI: GPT-OSS 120B (free)", isDefault: true },
                    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile (free)" },
                    { id: "qwen/qwen3-32b", label: "Qwen3-32B (free)" }
                ];
                advContent.appendChild(this.createModelSelector("Model", this.settings.groqModel, groqModels, (v) => {
                    this.settings.groqModel = v;
                    this.saveSettings();
                }));

                advContent.appendChild(this.createTextArea("System Prompt", this.settings.groqPrompt, (v) => { this.settings.groqPrompt = v; this.saveSettings(); }));
            }

            // OpenRouter AI Settings
            if (this.settings.translationService === "openrouter") {
                advContent.appendChild(this.createSectionTitle("OPENROUTER AI SETTINGS"));
                advContent.appendChild(this.createInput("API Key", this.settings.openrouterApiKey, "sk-or-v1-...", true, (v) => { this.settings.openrouterApiKey = v; this.saveSettings(); }));

                advContent.appendChild(this.createSimpleSelect("AI Tone", "Changes the translation style and updates the system prompt", this.settings.openrouterTone || "standard",
                    [{ v: "standard", l: "Standard (Natural)" }, { v: "formal", l: "Formal (Professional)" }, { v: "gamer", l: "Gamer (Slang/Gaming)" }, { v: "toxic", l: "Toxic (Aggressive Fun)" }],
                    (v) => {
                        this.settings.openrouterTone = v;
                        const basePrompt = "You are a professional translator. Translate the input to ${targetLanguage}. Do not add any emojis, explanations, notes, or opening/closing remarks. Return ONLY the translation.";
                        const toneText = AI_TONES[v] || "";
                        this.settings.openrouterPrompt = toneText ? basePrompt + "\n\n" + toneText : basePrompt;
                        this.saveSettings();
                        refreshAdvanced();
                    }
                ));

                const openrouterModels = [
                    { id: "google/gemma-3-27b-it:free", label: "Google: Gemma 3 27B (free)", isDefault: true },
                    { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Meta: Llama 3.3 70B (free)" },
                    { id: "qwen/qwen3-next-80b-a3b-instruct:free", label: "Qwen3-Next 80B (free)" }
                ];
                advContent.appendChild(this.createModelSelector("Model", this.settings.openrouterModel, openrouterModels, (v) => {
                    this.settings.openrouterModel = v;
                    this.saveSettings();
                }));

                advContent.appendChild(this.createTextArea("System Prompt", this.settings.openrouterPrompt, (v) => { this.settings.openrouterPrompt = v; this.saveSettings(); }));
            }

            return wrapper;
        }

        /* ==================== MODAL ==================== */

        showTranslateModal() {
            // Use Discord's native modal system for full theme compatibility
            const DiscordModal = BdApi.Webpack.getByKeys("Modal")?.Modal;
            const discordOpenModal = BdApi.Webpack.getByKeys("openModal")?.openModal;

            if (!DiscordModal || !discordOpenModal) {
                // Fallback: use custom overlay if Discord API not available
                this.showFallbackModal();
                return;
            }

            const channelId = BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
            const self = this;

            discordOpenModal((props) => {
                return BdApi.React.createElement(DiscordModal, {
                    title: "TranslatorPlus",
                    ...props
                }, BdApi.React.createElement(SettingsContainer, { plugin: self, channelId }));
            });
        }

        showFallbackModal() {
            const existing = document.querySelector(".translatorplus-modal-overlay");
            if (existing) existing.remove();

            const channelId = BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
            const overlay = document.createElement("div");
            overlay.className = "translatorplus-modal-overlay";

            const modal = document.createElement("div");
            modal.className = "translatorplus-modal";

            const header = document.createElement("div");
            header.className = "translatorplus-modal-header";

            const title = document.createElement("div");
            title.className = "translatorplus-modal-title";
            title.innerHTML = ICONS.TRANSLATE + " TranslatorPlus";

            const closeBtn = document.createElement("div");
            closeBtn.className = "translatorplus-modal-close";
            closeBtn.innerHTML = ICONS.CLOSE;
            closeBtn.onclick = () => overlay.remove();

            header.appendChild(title);
            header.appendChild(closeBtn);
            modal.appendChild(header);

            const ui = this.buildSettingsUI(channelId);
            ui.style.display = "flex";
            ui.style.flexDirection = "column";
            ui.style.flex = "1";
            ui.style.overflow = "hidden";
            modal.appendChild(ui);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) overlay.remove();
            });
        }

        getSettingsPanel() {
            return this.buildSettingsUI(null);
        }

        /* ==================== UI HELPERS ==================== */

        createSectionTitle(text) {
            const div = document.createElement("div");
            div.className = "translatorplus-section-title";
            div.textContent = text;
            return div;
        }

        createLangSelect(label, value, onChange, includeAuto) {
            const wrap = document.createElement("div");
            wrap.className = "translatorplus-select-wrapper";
            const lbl = document.createElement("label");
            lbl.className = "translatorplus-select-label";
            lbl.textContent = label;
            wrap.appendChild(lbl);
            const sel = document.createElement("select");
            sel.className = "translatorplus-select";
            Object.entries(GoogleLanguages).forEach(([key, name]) => {
                if (!includeAuto && key === "auto") return;
                const opt = document.createElement("option");
                opt.value = key;
                opt.textContent = name;
                if (key === value) opt.selected = true;
                sel.appendChild(opt);
            });
            sel.onchange = () => onChange(sel.value);
            wrap.appendChild(sel);
            return wrap;
        }

        createSimpleSelect(label, desc, value, options, onChange) {
            const wrap = document.createElement("div");
            wrap.className = "translatorplus-select-wrapper";
            const lbl = document.createElement("label");
            lbl.className = "translatorplus-select-label";
            lbl.textContent = label;
            wrap.appendChild(lbl);
            if (desc) {
                const descEl = document.createElement("div");
                descEl.style.fontSize = "0.8em";
                descEl.style.color = "var(--text-5, var(--text-muted, #949ba4))";
                descEl.style.marginBottom = "6px";
                descEl.textContent = desc;
                wrap.appendChild(descEl);
            }
            const sel = document.createElement("select");
            sel.className = "translatorplus-select";
            options.forEach(opt => {
                const o = document.createElement("option");
                o.value = opt.v;
                o.textContent = opt.l;
                if (opt.v === value) o.selected = true;
                sel.appendChild(o);
            });
            sel.onchange = () => onChange(sel.value);
            wrap.appendChild(sel);
            return wrap;
        }

        createInput(label, value, placeholder, isPassword, onChange) {
            const wrap = document.createElement("div");
            wrap.className = "translatorplus-select-wrapper";
            const lbl = document.createElement("label");
            lbl.className = "translatorplus-select-label";
            lbl.textContent = label;
            wrap.appendChild(lbl);
            const inp = document.createElement("input");
            inp.className = "translatorplus-select";
            inp.type = isPassword ? "password" : "text";
            inp.value = value || "";
            inp.placeholder = placeholder || "";
            inp.oninput = () => onChange(inp.value);
            wrap.appendChild(inp);
            return wrap;
        }

        createTextArea(label, value, onChange) {
            const wrap = document.createElement("div");
            wrap.className = "translatorplus-select-wrapper";
            const lbl = document.createElement("label");
            lbl.className = "translatorplus-select-label";
            lbl.textContent = label;
            wrap.appendChild(lbl);
            const area = document.createElement("textarea");
            area.className = "translatorplus-select";
            area.style.height = "100px";
            area.style.resize = "vertical";
            area.style.fontFamily = "monospace";
            area.value = value || "";
            area.oninput = () => onChange(area.value);
            wrap.appendChild(area);
            return wrap;
        }

        createModelSelector(label, currentValue, presetModels, onChange) {
            const wrap = document.createElement("div");
            wrap.className = "translatorplus-select-wrapper";
            const lbl = document.createElement("label");
            lbl.className = "translatorplus-select-label";
            lbl.textContent = label;
            wrap.appendChild(lbl);

            const isCustom = !presetModels.some(m => m.id === currentValue);
            const btnsContainer = document.createElement("div");
            btnsContainer.style.display = "flex";
            btnsContainer.style.flexWrap = "wrap";
            btnsContainer.style.gap = "6px";
            btnsContainer.style.marginBottom = "8px";

            const customInputWrap = document.createElement("div");
            customInputWrap.style.display = isCustom ? "block" : "none";
            customInputWrap.style.marginTop = "6px";

            const customInput = document.createElement("input");
            customInput.className = "translatorplus-select";
            customInput.type = "text";
            customInput.placeholder = "Enter custom model ID...";
            customInput.value = isCustom ? currentValue : "";
            customInput.oninput = () => onChange(customInput.value);
            customInputWrap.appendChild(customInput);

            const makeBtn = (labelText, modelId, isActive, isDefault) => {
                const btn = document.createElement("button");
                btn.style.cssText = `
                    padding: 6px 12px; border-radius: 6px; border: 1px solid;
                    cursor: pointer; font-size: 0.8rem; font-weight: 500;
                    transition: all 0.15s ease; display: flex; align-items: center; gap: 6px;
                    position: relative;
                `;
                if (isActive) {
                    btn.style.background = "var(--accent-2, var(--text-link, #5865f2))";
                    btn.style.color = "#fff";
                    btn.style.borderColor = "var(--accent-2, var(--text-link, #5865f2))";
                } else if (isDefault) {
                    btn.style.background = "var(--bg-1, var(--input-background, rgba(0,0,0,0.25)))";
                    btn.style.color = "var(--text-1, var(--header-primary, #f2f3f5))";
                    btn.style.borderColor = "#f0b232";
                    btn.style.boxShadow = "0 0 8px rgba(240, 178, 50, 0.3)";
                } else {
                    btn.style.background = "var(--bg-1, var(--input-background, rgba(0,0,0,0.25)))";
                    btn.style.color = "var(--text-1, var(--header-primary, #f2f3f5))";
                    btn.style.borderColor = "var(--border-light, var(--background-modifier-accent, rgba(255,255,255,0.06)))";
                }

                // Button text
                const textSpan = document.createElement("span");
                textSpan.textContent = labelText;
                btn.appendChild(textSpan);

                // Default badge
                if (isDefault) {
                    const badge = document.createElement("span");
                    badge.textContent = "⭐ varsayılan";
                    badge.style.cssText = `
                        font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
                        color: #f0b232; letter-spacing: 0.5px;
                        padding: 1px 5px; border-radius: 3px;
                        background: rgba(240, 178, 50, 0.15);
                    `;
                    btn.appendChild(badge);
                }

                btn.onmouseenter = () => {
                    if (!isActive) btn.style.borderColor = "var(--accent-2, var(--text-link, #5865f2))";
                };
                btn.onmouseleave = () => {
                    if (!isActive) {
                        btn.style.borderColor = isDefault ? "#f0b232" : "var(--border-light, var(--background-modifier-accent, rgba(255,255,255,0.06)))";
                    }
                };
                btn.onclick = () => {
                    btnsContainer.querySelectorAll("button").forEach(b => {
                        b.style.background = "var(--bg-1, var(--input-background, rgba(0,0,0,0.25)))";
                        b.style.color = "var(--text-1, var(--header-primary, #f2f3f5))";
                        b.style.borderColor = "var(--border-light, var(--background-modifier-accent, rgba(255,255,255,0.06)))";
                        b.style.boxShadow = "none";
                    });
                    btn.style.background = "var(--accent-2, var(--text-link, #5865f2))";
                    btn.style.color = "#fff";
                    btn.style.borderColor = "var(--accent-2, var(--text-link, #5865f2))";
                    if (modelId === "__custom__") {
                        customInputWrap.style.display = "block";
                        customInput.focus();
                    } else {
                        onChange(modelId);
                        customInputWrap.style.display = "none";
                    }
                };
                return btn;
            };

            presetModels.forEach(m => {
                btnsContainer.appendChild(makeBtn(m.label, m.id, currentValue === m.id, m.isDefault));
            });
            btnsContainer.appendChild(makeBtn("✏️ Custom", "__custom__", isCustom, false));

            wrap.appendChild(btnsContainer);
            wrap.appendChild(customInputWrap);
            return wrap;
        }

        createToggle(label, desc, value, onChange) {
            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.justifyContent = "space-between";
            wrap.style.alignItems = "center";
            wrap.style.marginBottom = "12px";

            const textDiv = document.createElement("div");
            const titleEl = document.createElement("div");
            titleEl.style.fontWeight = "500";
            titleEl.style.color = "var(--text-1, var(--header-primary, #f2f3f5))";
            titleEl.textContent = label;
            textDiv.appendChild(titleEl);
            if (desc) {
                const descEl = document.createElement("div");
                descEl.style.fontSize = "0.8em";
                descEl.style.color = "var(--text-5, var(--text-muted, #949ba4))";
                descEl.textContent = desc;
                textDiv.appendChild(descEl);
            }
            wrap.appendChild(textDiv);

            const toggleLabel = document.createElement("label");
            toggleLabel.style.position = "relative";
            toggleLabel.style.width = "40px";
            toggleLabel.style.height = "24px";
            toggleLabel.style.cursor = "pointer";
            toggleLabel.style.flexShrink = "0";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = value;
            checkbox.style.opacity = "0";
            checkbox.style.width = "0";
            checkbox.style.height = "0";
            checkbox.style.position = "absolute";

            const slider = document.createElement("span");
            slider.style.position = "absolute";
            slider.style.top = "0";
            slider.style.left = "0";
            slider.style.right = "0";
            slider.style.bottom = "0";
            slider.style.borderRadius = "12px";
            slider.style.transition = "0.2s";
            slider.style.backgroundColor = value ? "#43b581" : "#72767d";

            const circle = document.createElement("span");
            circle.style.position = "absolute";
            circle.style.height = "18px";
            circle.style.width = "18px";
            circle.style.left = "3px";
            circle.style.bottom = "3px";
            circle.style.borderRadius = "50%";
            circle.style.backgroundColor = "#fff";
            circle.style.transition = "0.2s";
            circle.style.transform = value ? "translateX(16px)" : "translateX(0)";

            checkbox.onchange = () => {
                onChange(checkbox.checked);
                slider.style.backgroundColor = checkbox.checked ? "#43b581" : "#72767d";
                circle.style.transform = checkbox.checked ? "translateX(16px)" : "translateX(0)";
            };

            toggleLabel.appendChild(checkbox);
            toggleLabel.appendChild(slider);
            toggleLabel.appendChild(circle);
            wrap.appendChild(toggleLabel);
            return wrap;
        }

        /* ==================== PATCHES ==================== */

        patchContextMenu() {
            this.contextMenuPatch = BdApi.ContextMenu.patch("message", (retVal, props) => {
                const message = props.message;
                if (!message) return;
                const isTranslated = this.translations.has(message.id);
                const selection = String(window.getSelection?.()?.toString?.() || "").trim();
                retVal.props.children.push(BdApi.ContextMenu.buildItem({ type: "separator" }));
                if (selection) {
                    retVal.props.children.push(BdApi.ContextMenu.buildItem({
                        label: this.t("translateSelection"),
                        action: () => this.translateSelectedText(message, selection)
                    }));
                }
                retVal.props.children.push(BdApi.ContextMenu.buildItem({
                    label: isTranslated ? this.t("revertTranslation") : this.t("translateMessage"),
                    action: () => {
                        if (isTranslated) {
                            this.removeTranslation(message.id);
                        } else {
                            this.translateMessage(message);
                        }
                    }
                }));
            });
        }

        isTranslationRelevantMutationNode(node) {
            if (!node || node.nodeType !== 1) return false;
            const element = node;
            if (element.id?.startsWith?.("message-content-")) return true;
            if (element.id?.startsWith?.("translatorplus-")) return true;
            if (element.id?.startsWith?.("chat-messages-")) return true;
            if (element.classList?.contains?.("translatorplus-accessory")) return true;
            return !!element.querySelector?.('[id^="message-content-"], [id^="translatorplus-"], li[id^="chat-messages-"]');
        }

        isRecentMessageId(msgId) {
            try {
                const createdAt = Number((BigInt(msgId) >> 22n) + 1420070400000n);
                return Date.now() - createdAt < 120000;
            } catch {
                return true;
            }
        }

        getMessageIdsFromNode(node) {
            if (!node || node.nodeType !== 1) return [];
            const element = node;
            const nodes = [];
            if (element.id?.startsWith?.("message-content-")) nodes.push(element);
            element.querySelectorAll?.('[id^="message-content-"]').forEach(el => nodes.push(el));
            return nodes
                .map(el => el.id.replace("message-content-", ""))
                .filter(Boolean);
        }

        shouldAutoTranslateMessage(msgId) {
            if (!msgId || this.translations.has(msgId) || this.pendingTranslations.has(msgId) || this.autoIncomingQueuedIds.has(msgId)) return false;
            if (!this.isRecentMessageId(msgId)) return false;
            const contentEl = document.getElementById("message-content-" + msgId);
            if (!contentEl || !contentEl.innerText?.trim()) return false;

            const li = contentEl.closest('li[id^="chat-messages-"]');
            const parts = li?.id?.split("-") || [];
            const channelId = parts.length >= 4 ? parts[2] : BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
            const effectiveSettings = this.getEffectiveSettings(channelId);
            if (!effectiveSettings.autoTranslateIncoming) return false;
            if (shouldSkipTranslation(contentEl.innerText, "received", effectiveSettings)) return false;

            const MessageStore = BdApi.Webpack.getStore("MessageStore");
            const UserStore = BdApi.Webpack.getStore("UserStore");
            const message = MessageStore?.getMessage?.(channelId, msgId);
            const currentUserId = UserStore?.getCurrentUser?.()?.id;
            if (message?.author?.id && currentUserId && message.author.id === currentUserId) return false;

            return true;
        }

        queueAutoIncomingFromNode(node) {
            for (const msgId of this.getMessageIdsFromNode(node)) {
                if (!this.shouldAutoTranslateMessage(msgId)) continue;
                this.autoIncomingQueuedIds.add(msgId);
                this.autoIncomingQueue.push(msgId);
            }
            if (this.autoIncomingQueue.length > 0 && !this.autoIncomingTimer) {
                this.autoIncomingTimer = setTimeout(() => this.processAutoIncomingQueue(), 650);
            }
        }

        async processAutoIncomingQueue() {
            this.autoIncomingTimer = null;
            const msgId = this.autoIncomingQueue.shift();
            if (!msgId) return;
            this.autoIncomingQueuedIds.delete(msgId);
            if (this.shouldAutoTranslateMessage(msgId)) {
                const contentEl = document.getElementById("message-content-" + msgId);
                await this.translateMessageById(msgId, contentEl?.innerText, {}, { displayMode: "accessory" });
            }
            if (this.autoIncomingQueue.length > 0) {
                this.autoIncomingTimer = setTimeout(() => this.processAutoIncomingQueue(), 900);
            }
        }

        patchDOMObserver() {
            this.observer = new MutationObserver((mutations) => {
                let checkLostTranslations = false;
                
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType !== 1) return;
                        // Check if the added node itself is the toolbar
                        if (node.className && typeof node.className === "string" && node.className.includes("buttonsInner")) {
                            this.injectToolbarButton(node);
                            // We don't return here so we don't skip checkLostTranslations logic below
                        } else if (node.querySelectorAll) {
                            // Also search inside the added node for nested toolbar containers
                            node.querySelectorAll('div[class*="buttonsInner"]').forEach((toolbar) => {
                                this.injectToolbarButton(toolbar);
                            });
                        }
                        this.queueAutoIncomingFromNode(node);
                    });
                    
                    // Only check translated messages when message/translation DOM changed.
                    if (this.translations.size > 0 && mutation.type === "childList" && !checkLostTranslations) {
                        const addedRelevant = Array.from(mutation.addedNodes).some(node => this.isTranslationRelevantMutationNode(node));
                        const removedRelevant = Array.from(mutation.removedNodes).some(node => this.isTranslationRelevantMutationNode(node));
                        checkLostTranslations = addedRelevant || removedRelevant;
                    }
                });

                if (checkLostTranslations) {
                    if (this.restoreDebounce) clearTimeout(this.restoreDebounce);
                    this.restoreDebounce = setTimeout(() => this.restoreLostTranslations(), 200);
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        restoreLostTranslations() {
            if (this.translations.size === 0) return;
            
            for (const [msgId, res] of this.translations.entries()) {
                const el = document.getElementById("message-content-" + msgId);
                // If message is entirely gone (scrolled away), skip
                if (!el) continue;

                const mode = res.displayMode || this.settings.displayMode || "accessory";
                let needsRestore = false;

                if (mode === "accessory" || mode === "both") {
                    const acc = document.getElementById("translatorplus-" + msgId);
                    if (!acc) needsRestore = true;
                }
                
                if (mode === "replace" || mode === "interactive" || mode === "both") {
                    // React wiped our wrapper span or generic text replacement
                    if (!el.dataset.originalText || (mode === "replace" && el.innerText !== res.text)) {
                        needsRestore = true;
                    }
                }

                if (needsRestore) {
                    // Temporarily remove to avoid double-appending in some modes if partially broken
                    const existingAcc = document.getElementById("translatorplus-" + msgId);
                    if (existingAcc) existingAcc.remove();
                    
                    if (mode === "interactive") {
                        this.showInteractive(msgId, res);
                    } else if (mode === "replace") {
                        this.showReplace(msgId, res);
                    } else if (mode === "both") {
                        this.showReplace(msgId, res);
                        this.showAccessory(msgId, res);
                    } else {
                        this.showAccessory(msgId, res);
                    }
                }
            }
        }

        injectToolbarButton(toolbar) {
            if (toolbar.querySelector(".translatorplus-btn")) return;

            // Try to clone Discord's native button classes for seamless integration
            const existingBtn = toolbar.querySelector('div[class*="hoverBarButton"]');
            const existingIcon = existingBtn ? existingBtn.querySelector('svg') : null;

            const btn = document.createElement("div");
            // Use native Discord classes if available, otherwise use our fallback class
            if (existingBtn) {
                btn.className = existingBtn.className;
            } else {
                btn.className = "translatorplus-toolbar-btn";
            }
            btn.classList.add("translatorplus-btn");
            btn.setAttribute("aria-label", "Translate Message");
            btn.setAttribute("role", "button");
            btn.setAttribute("tabindex", "0");

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("role", "img");
            // Copy Discord's native icon class if available
            if (existingIcon && existingIcon.getAttribute("class")) {
                svg.setAttribute("class", existingIcon.getAttribute("class"));
            }
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", "currentColor");
            path.setAttribute("d", "M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z");
            svg.appendChild(path);
            btn.appendChild(svg);

            btn.addEventListener("click", () => {
                // Strategy 1: Extract message ID directly from the li element's id
                // Format: chat-messages-{channelId}-{messageId}
                const msgLi = toolbar.closest('li[id^="chat-messages-"]');
                if (msgLi) {
                    const liIdParts = msgLi.id.split("-");
                    if (liIdParts.length >= 4) {
                        const msgId = liIdParts[liIdParts.length - 1];
                        const contentEl = document.getElementById("message-content-" + msgId);
                        this.translateMessageById(msgId, contentEl ? contentEl.innerText : null);
                        return;
                    }
                }

                // Strategy 2: Walk up to any message container and find content
                let parent = toolbar.parentElement;
                for (let i = 0; i < 10 && parent; i++) {
                    const contentEl = parent.querySelector('[id^="message-content-"]');
                    if (contentEl) {
                        const msgId = contentEl.id.replace("message-content-", "");
                        this.translateMessageById(msgId, contentEl.innerText);
                        return;
                    }
                    parent = parent.parentElement;
                }

                // Strategy 3: React fiber fallback
                try {
                    const inst = BdApi.ReactUtils.getInternalInstance(toolbar);
                    let fiber = inst;
                    for (let i = 0; i < 50 && fiber; i++) {
                        if (fiber.memoizedProps?.message?.id) {
                            this.translateMessage(fiber.memoizedProps.message);
                            return;
                        }
                        if (fiber.pendingProps?.message?.id) {
                            this.translateMessage(fiber.pendingProps.message);
                            return;
                        }
                        fiber = fiber.return;
                    }
                } catch (e) {
                    console.error("[TranslatorPlus] React fiber search failed:", e);
                }

                BdApi.UI.showToast("Could not find message to translate", { type: "error" });
            });

            // Insert before the separator
            const separator = toolbar.querySelector('div[class*="separator_"]');
            if (separator) {
                toolbar.insertBefore(btn, separator);
            } else {
                toolbar.insertBefore(btn, toolbar.firstChild);
            }
        }

        injectChatBarButton() {
            this.chatBarObserver = new MutationObserver(() => {
                let buttonsContainer = document.querySelector('[class*="channelTextArea_"] [class*="buttons_"]');
                if (!buttonsContainer) {
                    const expressionBtn = document.querySelector('div[class*="expression-picker-chat-input-button"]');
                    if (expressionBtn && expressionBtn.parentElement) {
                        buttonsContainer = expressionBtn.parentElement;
                    }
                }
                if (!buttonsContainer) return;
                if (buttonsContainer.querySelector(".translatorplus-chatbar-wrapper")) return;

                // Create a simple wrapper matching Discord's button container pattern
                const wrapper = document.createElement("div");
                wrapper.className = "translatorplus-chatbar-wrapper";

                // Try to adopt the container class from a sibling for proper spacing
                const nativeContainer = buttonsContainer.querySelector('div[class*="buttonContainer"]');
                if (nativeContainer) {
                    const nativeClasses = nativeContainer.className
                        .split(/\s+/)
                        .filter(c => c.startsWith("buttonContainer") || c.startsWith("expression-picker"))
                        .join(" ");
                    if (nativeClasses) {
                        wrapper.className = nativeClasses + " translatorplus-chatbar-wrapper";
                    }
                }

                const btn = document.createElement("div");
                btn.className = "translatorplus-chatbar-btn";
                const channelId = BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
                if (this.getEffectiveSettings(channelId).autoTranslate) btn.classList.add("active");
                btn.setAttribute("aria-label", "TranslatorPlus");
                btn.setAttribute("role", "button");
                btn.setAttribute("tabindex", "0");
                btn.title = "TranslatorPlus Settings (Right-click: Toggle Auto-Translate)";

                // Build SVG manually for reliability
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("viewBox", "0 0 24 24");
                svg.setAttribute("width", "20");
                svg.setAttribute("height", "20");
                svg.setAttribute("aria-hidden", "true");
                const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                svgPath.setAttribute("fill", "currentColor");
                svgPath.setAttribute("d", "M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z");
                svg.appendChild(svgPath);
                btn.appendChild(svg);

                btn.addEventListener("click", () => {
                    this.showTranslateModal();
                });

                btn.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    this.settings.autoTranslate = !this.settings.autoTranslate;
                    this.saveSettings();
                    this.updateChatBarButtonState();
                    const statusText = this.settings.autoTranslate ? "Auto-Translate " + this.t("enabled") : "Auto-Translate " + this.t("disabled");
                    BdApi.UI.showToast(statusText, { type: this.settings.autoTranslate ? "success" : "info" });
                });

                wrapper.appendChild(btn);
                buttonsContainer.insertBefore(wrapper, buttonsContainer.firstChild);
            });
            this.chatBarObserver.observe(document.body, { childList: true, subtree: true });
        }

        updateChatBarButtonState() {
            const channelId = BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
            const enabled = !!this.getEffectiveSettings(channelId).autoTranslate;
            document.querySelectorAll(".translatorplus-chatbar-btn").forEach((btn) => {
                btn.classList.toggle("active", enabled);
            });
        }

        removeChatBarButton() {
            document.querySelectorAll(".translatorplus-chatbar-wrapper").forEach(el => el.remove());
            if (this.chatBarObserver) this.chatBarObserver.disconnect();
        }

        patchMessageSend() {
            const MessageActions = BdApi.Webpack.getModule(m => m?.sendMessage);
            if (!MessageActions) {
                console.error("[TranslatorPlus] Could not find MessageActions module for auto-translate");
                return;
            }
            BdApi.Patcher.instead(config.info.name, MessageActions, "sendMessage", async (thisObj, args, original) => {
                const channelId = args[0] || BdApi.Webpack.getStore("SelectedChannelStore")?.getChannelId();
                const effectiveSettings = this.getEffectiveSettings(channelId);
                if (!effectiveSettings.autoTranslate) {
                    return original.apply(thisObj, args);
                }
                const msg = args[1];
                if (!msg || !msg.content || msg.content.trim().length === 0) {
                    return original.apply(thisObj, args);
                }
                if (shouldSkipTranslation(msg.content, "sent", effectiveSettings)) {
                    return original.apply(thisObj, args);
                }
                try {
                    const res = await translate("sent", msg.content, this.settings, channelId);
                    if (res && res.text && res.text.trim().length > 0) {
                        const originalText = msg.content;
                        msg.content = res.text;
                        if (this.settings.showAutoTranslateTooltip) {
                            BdApi.UI.showToast(`Translated: ${originalText.substring(0, 50)}${originalText.length > 50 ? "..." : ""} → ${res.text.substring(0, 50)}${res.text.length > 50 ? "..." : ""}`, { type: "info" });
                        }
                    }
                } catch (err) {
                    console.error("[TranslatorPlus] Send translation error:", err);
                    BdApi.UI.showToast("Translation failed, sending original: " + err.message, { type: "error" });
                }
                return original.apply(thisObj, args);
            });
        }

        unpatchAll() {
            if (this.contextMenuPatch) this.contextMenuPatch();
            if (this.observer) this.observer.disconnect();
            if (this.chatBarObserver) this.chatBarObserver.disconnect();
            BdApi.Patcher.unpatchAll(config.info.name);
        }
    };
})();
