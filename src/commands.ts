
// import { useCommand } from 'reactive-vscode'
// import { window } from 'vscode'
// import { logger } from './utils'
// import { currentMode } from './neovimModeManager'

// export function registerCommands() {
//   // Register a command to receive mode updates from Neovim
//   const setModeCommand = useCommand('nvim_ui_plus.setMode', (args: { mode: string }) => {
//     if (!args || typeof args.mode !== 'string') {
//       logger.warn(`Received invalid args:`, args)
//       return false
//     }
    
//     logger.info(`Mode changed to: ${args.mode} (via Neovim autocommand)`)
//     currentMode.value = args.mode
//     return true
//   })
  
//   // Add a command to check the current mode
//   const showModeCommand = useCommand('nvim_ui_plus.showCurrentMode', () => {
//     window.showInformationMessage(`Current Neovim mode: ${currentMode.value}`)
//   })
  
//   // Return a cleanup function (though this may be handled by the framework)
//   return () => {
//     // The framework likely handles command disposal automatically
//   }
// }
// 

import { useCommand } from 'reactive-vscode'
import { window } from 'vscode'
import { logger } from './utils'
import { currentMode } from './neovimModeManager'

export function registerCommands() {
  // Register a command to receive mode updates from Neovim
  const setModeCommand = useCommand('nvim_ui_plus.setMode', (args: { mode: string }) => {
    if (!args || typeof args.mode !== 'string') {
      logger.warn(`Received invalid args:`, args)
      return false
    }
    
    logger.info(`Mode changed to: ${args.mode} (via Neovim autocommand)`)
    currentMode.value = args.mode
    return true
  })
  
  // Add a command to check the current mode
  const showModeCommand = useCommand('nvim_ui_plus.showCurrentMode', () => {
    window.showInformationMessage(`Current Neovim mode: ${currentMode.value}`)
  })
}