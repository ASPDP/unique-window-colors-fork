import { watchEffect } from 'reactive-vscode'
import { ConfigurationTarget, workspace } from 'vscode'
import { nvimUiConfig } from './config'
import { currentMode } from './neovimModeManager'
import { logger } from './utils'

// Interface for theme color customizations
interface ColorCustomizations {
  [key: string]: string
}

// Define our UI element keys more strictly
type UiElementKey =  'titleBar'

// Define the correct interface for our configuration
interface NvimUiPlusConfig {
  enabled: boolean
  uiElements: {
    titleBar: boolean
  }
  colors: {
    normal: string
    insert: string
    visual: string
    replace: string
    cmdline: string
  }
}

export function setupThemeManager() {
  // Track only the original global value for the single key we manage
  let recordedOriginal = false
  let originalTitleBarActiveBackground: string | undefined
  let originalHadTitleBarKey = false

  // Map VSCode color customization keys to our UI element config keys
  const colorKeyMap: Record<string, UiElementKey> = {
    'titleBar.activeBackground': 'titleBar',
  }

  // Reactively update theme colors when mode changes
  const watcher = watchEffect(() => {
    try {
      // Use type assertion for TypeScript
      const config = nvimUiConfig as unknown as NvimUiPlusConfig

      // Only apply UI theming if the extension is enabled
      if (!config.enabled) {
        logger.info('UI theming disabled, restoring original colors')
        restoreOriginalColors()
        return
      }

      const mode = currentMode.value || 'normal'

      // Get color for current mode from configuration
      let modeColor: string
      const colors = config.colors

      switch (mode) {
        case 'normal':
          modeColor = colors.normal || '#94E2D5' // Teal fallback
          break
        case 'insert':
          modeColor = colors.insert || '#74C7EC' // Sapphire fallback
          break
        case 'visual':
          modeColor = colors.visual || '#CBA6F7' // Mauve fallback
          break
        case 'replace':
          modeColor = colors.replace || '#EBA0AC' // Maroon fallback
          break
        case 'cmdline':
          modeColor = colors.cmdline || '#FAB387' // Peach fallback
          break
        default:
          modeColor = colors.normal || '#94E2D5' // Teal fallback
      }
      const workbenchConfig = workspace.getConfiguration('workbench')

      // Record the original Global value for the single key once
      if (!recordedOriginal) {
        const inspected = workbenchConfig.inspect<ColorCustomizations>('colorCustomizations')
        const globalValue = (inspected?.globalValue ?? {}) as ColorCustomizations
        if (Object.prototype.hasOwnProperty.call(globalValue, 'titleBar.activeBackground')) {
          originalHadTitleBarKey = true
          originalTitleBarActiveBackground = globalValue['titleBar.activeBackground']
        }
        recordedOriginal = true
        logger.info('Stored original global titleBar.activeBackground')
      }

      // Start from the current Global value only (avoid copying workspace values)
      const inspectedNow = workbenchConfig.inspect<ColorCustomizations>('colorCustomizations')
      const currentGlobal = (inspectedNow?.globalValue ?? {}) as ColorCustomizations
      const newGlobal: ColorCustomizations = { ...currentGlobal }

      // Apply color to the single key we manage only when enabled
      if (config.uiElements.titleBar) {
        newGlobal['titleBar.activeBackground'] = modeColor
      }
      else if (recordedOriginal) {
        // If not enabled, ensure we don't leave our override behind
        if (originalHadTitleBarKey) {
          newGlobal['titleBar.activeBackground'] = originalTitleBarActiveBackground as string
        }
        else {
          delete newGlobal['titleBar.activeBackground']
        }
      }

      // Write back only the global object with our single change
      workbenchConfig.update('colorCustomizations', newGlobal, ConfigurationTarget.Global)
        .then(() => {
          logger.info(`Applied ${mode} mode titleBar color`)
        }, (error: Error) => {
          logger.error('Failed to update colorCustomizations:', error)
        })
    }
    catch (error) {
      logger.error('Error in theme manager:', error)
    }
  })

  function restoreOriginalColors() {
    if (recordedOriginal) {
      try {
        const workbenchConfig = workspace.getConfiguration('workbench')
        const inspected = workbenchConfig.inspect<ColorCustomizations>('colorCustomizations')
        const currentGlobal = (inspected?.globalValue ?? {}) as ColorCustomizations
        const restored: ColorCustomizations = { ...currentGlobal }

        if (originalHadTitleBarKey) {
          restored['titleBar.activeBackground'] = originalTitleBarActiveBackground as string
        }
        else {
          delete restored['titleBar.activeBackground']
        }

        workbenchConfig.update('colorCustomizations', restored, ConfigurationTarget.Global)
          .then(() => {
            logger.info('Restored original global titleBar.activeBackground')
            // Reset tracking so a future activation will re-record
            recordedOriginal = false
            originalHadTitleBarKey = false
            originalTitleBarActiveBackground = undefined
          }, (error: Error) => {
            logger.error('Failed to restore original colorCustomizations key:', error)
          })
      }
      catch (error) {
        logger.error('Error restoring colors:', error)
      }
    }
  }

  // Return a cleanup function
  return () => {
    try {
      if (watcher)
        watcher()
      restoreOriginalColors()
    }
    catch (error) {
      logger.error('Error in theme manager cleanup:', error)
    }
  }
}
