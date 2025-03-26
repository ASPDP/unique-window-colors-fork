import { defineExtension, useDisposable } from 'reactive-vscode'
import { extensions, window } from 'vscode'
import { registerCommands } from './commands'
import { setupNeovimModeManager } from './neovimModeManager'
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

  // Register command to update mode from Neovim
  registerCommands()
})

export { activate, deactivate }
