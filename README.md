# TranslatorPlus

![BetterDiscord Plugin](https://img.shields.io/badge/BetterDiscord-Plugin-5865F2?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.5.2-23A55A?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-F0B232?style=for-the-badge)

TranslatorPlus is an unofficial BetterDiscord plugin that brings fast, in-client translation to Discord conversations.

It is built for multilingual chats, gaming communities, international support servers, and direct messages where switching to an external translator breaks the flow.

[Download latest release](../../releases/latest/download/TranslatorPlus.plugin.js)

## Highlights

| Area | What it does |
| --- | --- |
| Incoming messages | Translate messages from other users into your preferred language. |
| Outgoing messages | Auto-translate your own messages before they are sent. |
| Incoming auto-translate | Automatically translate new messages as they arrive. |
| Live preview | Preview your outgoing translation above the chat box. |
| Channel overrides | Use different language settings per channel. |
| Providers | Use Google Translate, Groq, or OpenRouter. |
| Theme support | Uses Discord/BetterDiscord theme variables for a native look. |

## Features

- Translate individual messages from the hover toolbar.
- Translate or revert from the message context menu.
- Translate selected text only.
- Translate recent visible messages in the current channel.
- Automatically translate new incoming messages from other users.
- Automatically translate outgoing messages before sending.
- Preview outgoing translations above the chat input.
- Configure global language settings and channel-specific overrides.
- Override incoming and outgoing auto-translation per channel.
- Switch target language from the translated message itself.
- Copy translated text with one click.
- Choose between four display modes:
  - Accessory below the original message
  - Replace original text
  - Interactive hover-to-see-original mode
  - Replace plus accessory
- Protect Discord-specific content from being damaged by translation:
  - Mentions
  - Custom emojis
  - Code blocks
  - Inline code
  - Links
- Use English or Turkish in the settings interface.

## Translation Providers

| Provider | Notes |
| --- | --- |
| Google Translate endpoint | Default, no setup required and no bundled API key. |
| Groq | Requires your own Groq API key. |
| OpenRouter | Requires your own OpenRouter API key. |

## Installation

1. Install BetterDiscord.
2. Download `TranslatorPlus.plugin.js` from the latest release.
3. Move the file into your BetterDiscord plugins folder:
   - Windows: `%AppData%\BetterDiscord\plugins`
4. Open Discord.
5. Go to `User Settings > BetterDiscord > Plugins`.
6. Enable `TranslatorPlus`.

## Usage

- Click the TranslatorPlus button near the chat box to open settings.
- Right-click that button to toggle outgoing auto-translation.
- Hover a message and click the translate icon to translate that message.
- Right-click a message to translate or revert it.
- Select text in a message, right-click, and choose the selected-text translation action.
- Enable incoming auto-translate when you want new messages to be translated automatically.

## Privacy

TranslatorPlus does not intentionally collect, store, or upload analytics.

Text you choose to translate is sent to the selected translation provider. If you use Groq or OpenRouter, your configured API key is stored locally in BetterDiscord's plugin data storage.

Do not translate sensitive private information unless you trust the selected translation provider.

## Performance Notes

The plugin avoids continuous message scanning. Incoming auto-translation is event-driven and uses a small queue so active chats do not create unnecessary CPU or network load.

Translation responses are cached in memory with an LRU-style cache to avoid repeated requests for the same text.

## BetterDiscord Notice

This is an unofficial BetterDiscord plugin and is not affiliated with Discord Inc. or BetterDiscord.

Client modifications may break when Discord changes its internal UI. If that happens, update the plugin or disable the affected feature.

## Contributing

Issues and pull requests are welcome. Please keep changes focused, avoid unnecessary background work, and test the plugin in Discord before submitting UI or patch changes.

## License

MIT License. See [LICENSE](LICENSE).
