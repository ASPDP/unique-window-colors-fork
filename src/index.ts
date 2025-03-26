import { defineExtension, useDisposable } from 'reactive-vscode'
import { extensions, window } from 'vscode'
import { registerCommands } from './commands'
import { setupNeovimModeManager } from './neovimModeManager'
import { setupThemeManager } from './themeManager'
import { logger } from './utils'

const { activate, deactivate } = defineExtension(async () => {
  logger.info('nvim-ui-plus extension activated')

  // Check if neovim extension is installed
  const vscode_nvim_ext = extensions.getExtension('asvetliakov.vscode-neovim')
  if (!vscode_nvim_ext) {
    logger.error('vscode-neovim is not installed')
    window.showErrorMessage('vscode-neovim is not installed. Please install it to use this extension.')
    return
  }

  // Try to activate the vscode-neovim extension if it's not already active
  if (!vscode_nvim_ext.isActive) {
    logger.info('Activating vscode-neovim extension...')
    try {
      await vscode_nvim_ext.activate()
      logger.info('vscode-neovim extension activated successfully')
    }
    catch (err) {
      logger.error('Failed to activate vscode-neovim extension:', err)
      window.showErrorMessage('Failed to activate vscode-neovim extension')
      return
    }
  }
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
