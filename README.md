# Nvim UI+

<a href="https://marketplace.visualstudio.com/items?itemName=wrath-codes.nvim_ui_plus" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/wrath-codes.nvim_ui_plus.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23007ACC?style=flat&labelColor=%23229863"  alt="Made with reactive-vscode" /></a>

## Overview

Nvim UI+ enhances your VSCode Neovim experience by providing rich visual feedback of your current Vim mode. It transforms VSCode's interface elements to match your Vim mode, creating a more immersive and intuitive editing experience.

![Screenshot of Nvim UI+ in action](https://example.com/screenshot.png)

## Features

- 🌈 **Mode-aware UI**: VSCode's UI elements change color based on your current Neovim mode
- 📊 **Colorful status bar indicator**: Prominent status bar item shows your current mode with intuitive colors and icons
- ⚙️ **Highly customizable**: Configure which UI elements respond to mode changes and define your own color scheme
- 🔄 **Real-time updates**: Interface updates instantly when switching between Normal, Insert, Visual, Replace, and Command modes

## Requirements

- [VSCode Neovim extension](https://marketplace.visualstudio.com/items?itemName=asvetliakov.vscode-neovim) must be installed

## Installation

1. Install the VSCode Neovim extension
2. Install Nvim UI+
3. Add the required Neovim configuration (see below)
4. Restart VSCode

### Neovim Configuration

Add the following to your Neovim configuration file (init.lua or init.vim):

```lua
-- For init.lua
if vim.g.vscode then
  -- Add autocommands to notify VSCode about mode changes
  local function notify_current_mode()
    local mode = vim.api.nvim_get_mode().mode
    local mode_name = ""
    
    if mode == "n" then
      mode_name = "normal"
    elseif mode == "i" or mode == "ic" or mode == "ix" then
      mode_name = "insert"
    elseif mode == "v" or mode == "V" or mode == "\22" then -- \22 is <C-v>
      mode_name = "visual"
    elseif mode == "c" then
      mode_name = "cmdline"
    elseif mode == "R" then
      mode_name = "replace"
    else
      mode_name = "normal" -- default to normal for other modes
    end
    
    vim.fn.VSCodeNotify("nvim_ui_plus.setMode", { mode = mode_name })
  end
  
  -- Create autocommand group
  vim.api.nvim_create_augroup("NvimUiPlus", { clear = true })
  
  -- Add autocommands for different events that might change the mode
  vim.api.nvim_create_autocmd({"ModeChanged"}, {
    group = "NvimUiPlus",
    callback = notify_current_mode,
  })
  
  -- Initial mode notification
  vim.api.nvim_create_autocmd({"VimEnter"}, {
    group = "NvimUiPlus",
    callback = notify_current_mode,
  })
end
```

```vim
" For init.vim
if exists('g:vscode')
  function! NotifyVSCodeOfMode()
    let mode = mode()
    let mode_name = "normal"
    
    if mode ==# "n"
      let mode_name = "normal"
    elseif mode ==# "i" || mode ==# "ic" || mode ==# "ix"
      let mode_name = "insert"
    elseif mode ==# "v" || mode ==# "V" || mode ==# "\<C-v>"
      let mode_name = "visual"
    elseif mode ==# "c"
      let mode_name = "cmdline"
    elseif mode ==# "R"
      let mode_name = "replace"
    endif
    
    call VSCodeNotify("nvim_ui_plus.setMode", {"mode": mode_name})
  endfunction
  
  augroup NvimUiPlus
    autocmd!
    autocmd ModeChanged * call NotifyVSCodeOfMode()
    autocmd VimEnter * call NotifyVSCodeOfMode()
  augroup END
endif
```

## Configuration

Nvim UI+ can be configured through VSCode settings:

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
  "normal": "#89B4FA",  // Catppuccin blue
  "insert": "#A6E3A1",  // Catppuccin green
  "visual": "#CBA6F7",  // Catppuccin mauve
  "replace": "#F38BA8", // Catppuccin red
  "cmdline": "#F9E2AF"  // Catppuccin yellow
}
```

### UI Elements

Choose which VSCode UI elements should change color based on the current mode:

- `editorCursor`: Changes the cursor color
- `inputValidation`: Changes validation borders in input boxes
- `panelTitle`: Changes the active panel title 
- `peekView`: Changes peek view borders and titles
- `tabs`: Changes active tab indicators
- `activityBar`: Changes activity bar highlights
- `titleBar`: Changes title bar text and borders
- `statusBar`: Changes status bar elements
- `editor`: Changes editor selection highlights
- `suggestWidget`: Changes suggestion widget borders and backgrounds
- `lineNumbers`: Changes active line number color

### Mode Colors

Define custom colors for each Neovim mode:

- `normal`: Color for Normal mode (default: Catppuccin blue)
- `insert`: Color for Insert mode (default: Catppuccin green)
- `visual`: Color for Visual mode (default: Catppuccin mauve)
- `replace`: Color for Replace mode (default: Catppuccin red)
- `cmdline`: Color for Command-line mode (default: Catppuccin yellow)

## Commands

- `nvim-ui-plus.showCurrentMode`: Shows a notification with the current Neovim mode

## Implementation

This extension uses VSCode's context values set by the Neovim extension to detect the current mode. When the mode changes, it updates the interface elements and status bar to match the configured colors for that mode.

## License

[MIT](./LICENSE.md) License
