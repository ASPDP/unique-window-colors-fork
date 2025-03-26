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
type UiElementKey = 'editorCursor' | 'inputValidation' | 'panelTitle' |
  'peekView' | 'tabs' | 'activityBar' | 'titleBar' |
  'statusBar' | 'editor' | 'suggestWidget' | 'lineNumbers'

// Define the correct interface for our configuration
interface NvimUiPlusConfig {
  enabled: boolean
  uiElements: {
    editorCursor: boolean
    inputValidation: boolean
    panelTitle: boolean
    peekView: boolean
    tabs: boolean
    activityBar: boolean
    titleBar: boolean
    statusBar: boolean
    editor: boolean
    suggestWidget: boolean
    lineNumbers: boolean
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
  // Store original color customizations to restore later
  let originalColorCustomizations: ColorCustomizations | undefined

  // Map VSCode color customization keys to our UI element config keys
  const colorKeyMap: Record<string, UiElementKey> = {
    'editorCursor.foreground': 'editorCursor',
    'inputValidation.errorBorder': 'inputValidation',
    'inputValidation.infoBorder': 'inputValidation',
    'inputValidation.warningBorder': 'inputValidation',
    'panelTitle.activeForeground': 'panelTitle',
    'panelTitle.activeBorder': 'panelTitle',
    'peekView.border': 'peekView',
    'peekViewTitleLabel.foreground': 'peekView',
    'tab.activeBorder': 'tabs',
    'tab.activeBorderTop': 'tabs',
    'tab.activeForeground': 'tabs',
    'activityBarBadge.background': 'activityBar',
    'activityBar.activeBorder': 'activityBar',
    'activityBar.foreground': 'activityBar',
    'statusBarItem.remoteBackground': 'statusBar',
    'titleBar.activeForeground': 'titleBar',
    'titleBar.border': 'titleBar',
    'statusBar.border': 'statusBar',
    'statusBar.foreground': 'statusBar',
    'editor.selectionHighlightBorder': 'editor',
    'editor.selectionForeground': 'editor',
    'editor.findMatchBorder': 'editor',
    'editorMultiCursor.primary.foreground': 'editor',
    'editorMultiCursor.secondary.foreground': 'editor',
    'editorSuggestWidget.border': 'suggestWidget',
    'editorLineNumber.activeForeground': 'lineNumbers',
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

      // Store original customizations if we haven't already
      if (originalColorCustomizations === undefined) {
        originalColorCustomizations = workbenchConfig.get('colorCustomizations') || {}
        logger.info('Stored original color customizations')
      }

      // Create new color customizations
      const newColorCustomizations = { ...originalColorCustomizations }

      // Apply color to each enabled UI element
      for (const [colorKey, configKey] of Object.entries(colorKeyMap)) {
        if (config.uiElements[configKey]) {
          newColorCustomizations[colorKey] = modeColor
        }
      }

      // Apply the customizations
      workbenchConfig.update('colorCustomizations', newColorCustomizations, ConfigurationTarget.Workspace)
        .then(() => {
          logger.info(`Applied ${mode} mode theme colors`)
        }, (error: Error) => {
          logger.error('Failed to update colorCustomizations:', error)
        })
    }
    catch (error) {
      logger.error('Error in theme manager:', error)
    }
  })

  function restoreOriginalColors() {
    if (originalColorCustomizations !== undefined) {
      try {
        workspace.getConfiguration('workbench').update(
          'colorCustomizations',
          originalColorCustomizations,
          ConfigurationTarget.Workspace,
        ).then(() => {
          logger.info('Restored original color customizations')
          originalColorCustomizations = undefined
        }, (error: Error) => {
          logger.error('Failed to restore original colorCustomizations:', error)
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
