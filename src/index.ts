import { defineExtension, useCommand, useDisposable } from 'reactive-vscode'
import { window } from 'vscode'
import { currentMode, setupNeovimModeManager } from './neovimModeManager'
import { setupThemeManager } from './themeManager'
import { logger } from './utils'

const { activate, deactivate } = defineExtension(async () => {
  logger.info('nvim-ui-plus extension activated')

  // Set up the mode manager
  const modeManager = setupNeovimModeManager()
  useDisposable({ dispose: modeManager })

  // Set up the theme manager to react to mode changes
  const themeManager = setupThemeManager()
  useDisposable({ dispose: themeManager })

  // Register a command to receive mode updates from Neovim
  useCommand('nvim-ui-plus.setMode', (args: { mode: string }) => {
    if (!args || typeof args.mode !== 'string') {
      logger.warn(`Received invalid args:`, args)
      return false
    }

    logger.info(`Mode changed to: ${args.mode} (via Neovim autocommand)`)
    currentMode.value = args.mode
    return true
  })

  // Add a command to check the current mode
  useCommand('nvim-ui-plus.showCurrentMode', () => {
    window.showInformationMessage(`Current Neovim mode: ${currentMode.value}`)
  })
})

export { activate, deactivate }
