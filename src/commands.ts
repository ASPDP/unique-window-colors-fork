import { useCommand } from 'reactive-vscode'
import { window } from 'vscode'
import { currentMode } from './neovimModeManager'
import { logger } from './utils'

export function registerCommands() {
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
}
