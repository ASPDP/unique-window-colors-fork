import { ref, watchEffect } from 'reactive-vscode'
import { window, StatusBarAlignment, ThemeColor } from 'vscode'
import { logger } from './utils'

// Export the current mode so other modules can access it
export const currentMode = ref('normal')

export function setupNeovimModeManager() {
  // Create a status bar item
  const modeStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 100)
  modeStatusBarItem.show()
  
  // For debugging - log when the mode changes
  watchEffect(() => {
    logger.info(`Neovim mode changed to: ${currentMode.value}`)
  })
  
  // Reactively update the UI when the mode changes
  watchEffect(() => {
    const mode = currentMode.value
    
    // Update the status bar text based on the mode
    switch (mode) {
      case 'insert':
        modeStatusBarItem.text = "$(wrench) INSERT"
        break
      case 'visual':
        modeStatusBarItem.text = "$(eye) VISUAL"
        break
      case 'replace':
        modeStatusBarItem.text = "$(replace-all) REPLACE"
        break
      case 'cmdline':
        modeStatusBarItem.text = "$(terminal) COMMAND"
        break
      case 'normal':
      default:
        modeStatusBarItem.text = "$(zap) NORMAL"
    }
    
    modeStatusBarItem.color = new ThemeColor('statusBarItem.remoteBackground') 
  })
  
  // Return a cleanup function
  return () => {
    modeStatusBarItem.dispose()
  }
}
