# Nvim UI+

<a href="https://marketplace.visualstudio.com/items?itemName=wrath-codes.nvim_ui_plus" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/wrath-codes.nvim_ui_plus.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

## What's this?

Hey there! Nvim UI+ takes your VSCode Neovim experience to the next level by making the UI adapt to your current Vim mode. Think of it as mood lighting for your editor - different colors for different modes so you always know where you are.

## Cool Stuff It Does

- 🌈 **UI that knows your mode**: VSCode's interface changes color based on your Neovim mode
- 📊 **Mode indicator that pops**: The status bar shows your current mode with neat icons and colors
- ⚙️ **Make it yours**: Pick which UI bits change and choose your own colors
- 🔄 **Instant feedback**: See changes immediately when switching between modes

## Before You Install

- You need the [VSCode Neovim extension](https://marketplace.visualstudio.com/items?itemName=asvetliakov.vscode-neovim) installed

## Getting Started

1. Grab the VSCode Neovim extension
2. Install this extension (Nvim UI+)
3. Add a bit of Lua to your Neovim config (see below)
4. Restart VSCode and enjoy!

### Neovim Config Setup

Add this to your Neovim config:

```lua
-- For init.lua
local vscode = require("vscode")

local function notify_vscode_mode()
    local mode = vim.api.nvim_get_mode().mode
    local mode_name = ""
    -- Convert Neovim mode to readable name
    if mode == "n" then
        mode_name = "normal"
    elseif mode == "i" then
        mode_name = "insert"
    elseif mode == "v" then
        mode_name = "visual"
    elseif mode == "V" then
        mode_name = "visual"  
    elseif mode == "\22" then 
        mode_name = "visual"  
    elseif mode == "c" then
        mode_name = "cmdline"
    elseif mode == "R" then
        mode_name = "replace"
    else
        mode_name = mode
    end
    --  Call VSCode extension to update UI asynchronously
    vscode.action("nvim_ui_plus.setMode", {
        args = { mode = mode_name }
    })
end

-- Mode change notification autocmd
vim.api.nvim_create_autocmd("ModeChanged", {
    pattern = "*",
    callback = notify_vscode_mode,
})

-- Notify on initial load
vim.api.nvim_create_autocmd({ "VimEnter" }, {
    callback = notify_vscode_mode,
})
```

## Tweaking to Your Taste

You can customize everything through VSCode settings:

```json
"nvim_ui_plus.enabled": true,
"nvim_ui_plus.uiElements": {
  "editorCursor": true,
  "inputValidation": true,
  "panelTitle": true,
  "peekView": true,
  "tabs": true,
  "activityBar": true,
  "titleBar": true,
  "statusBar": true,
  "editor": true,
  "suggestWidget": true,
  "lineNumbers": true
},
"nvim_ui_plus.colors": {
  "normal": "#94E2D5",  // Catppuccin teal
  "insert": "#74C7EC",  // Catppuccin sapphire
  "visual": "#CBA6F7",  // Catppuccin mauve
  "replace": "#EBA0AC", // Catppuccin maroon
  "cmdline": "#FAB387"  // Catppuccin peach
}
```

### UI Elements You Can Theme

Pick and choose which parts of VSCode should change with your mode:

- `editorCursor`: Your text cursor
- `inputValidation`: Those borders you see in input boxes
- `panelTitle`: Titles in panels like terminal and output
- `peekView`: The peek definition windows
- `tabs`: Your document tabs
- `activityBar`: The sidebar icon bar
- `titleBar`: The window title at the top
- `statusBar`: The info bar at the bottom
- `editor`: Selection highlights in your code
- `suggestWidget`: Intellisense suggestion popups
- `lineNumbers`: The active line number

### Mode Colors

Set your own colors for each mode (defaults to Catppuccin colors):

<details>
<summary>🎨 Catppuccin Mocha Colors</summary>
<table>
	<tr>
		<th>Mode</th>
		<th>Color</th>
		<th>Hex</th>
		<th>Preview</th>
	</tr>
	<tr>
		<td>Normal</td>
		<td>Teal</td>
		<td><code>#94E2D5</code></td>
		<td><img src="assets/mocha_teal.png" width="23"/></td>
	</tr>
	<tr>
		<td>Insert</td>
		<td>Sapphire</td>
		<td><code>#74C7EC</code></td>
		<td><img src="assets/mocha_sapphire.png" width="23"/></td>
	</tr>
	<tr>
		<td>Visual</td>
		<td>Mauve</td>
		<td><code>#CBA6F7</code></td>
		<td><img src="assets/mocha_mauve.png" width="23"/></td>
	</tr>
	<tr>
		<td>Replace</td>
		<td>Maroon</td>
		<td><code>#EBA0AC</code></td>
		<td><img src="assets/mocha_maroon.png" width="23"/></td>
	</tr>
	<tr>
		<td>Command</td>
		<td>Peach</td>
		<td><code>#FAB387</code></td>
		<td><img src="assets/mocha_peach.png" width="23"/></td>
	</tr>
</table>
</details>

## How It Works

The extension listens for mode changes from Neovim, then updates VSCode's interface accordingly. Your Neovim config sends mode information to VSCode, and we handle the rest!

## License

[MIT](./LICENSE.md) License
