import { defineConfigObject } from 'reactive-vscode'
import * as Meta from './generated/meta'

// Define the interface for our configuration
interface NvimUiPlusConfig {
  enabled: { value: boolean }
  uiElements: {
    editorCursor: { value: boolean }
    inputValidation: { value: boolean }
    panelTitle: { value: boolean }
    peekView: { value: boolean }
    tabs: { value: boolean }
    activityBar: { value: boolean }
    titleBar: { value: boolean }
    statusBar: { value: boolean }
    editor: { value: boolean }
    suggestWidget: { value: boolean }
    lineNumbers: { value: boolean }
  }
  colors: {
    normal: { value: string }
    insert: { value: string }
    visual: { value: string }
    replace: { value: string }
    cmdline: { value: string }
  }
}

// Define our UI configuration with the proper type
export const nvimUiConfig = defineConfigObject('nvim-ui-plus', {
  enabled: Boolean,

  uiElements: {
    editorCursor: Boolean,
    inputValidation: Boolean,
    panelTitle: Boolean,
    peekView: Boolean,
    tabs: Boolean,
    activityBar: Boolean,
    titleBar: Boolean,
    statusBar: Boolean,
    editor: Boolean,
    suggestWidget: Boolean,
    lineNumbers: Boolean,
  },

  colors: {
    normal: String,
    insert: String,
    visual: String,
    replace: String,
    cmdline: String,
  },
}) as unknown as NvimUiPlusConfig // Type assertion

// Keep the original config for the rest of the extension
export const config = defineConfigObject<Meta.ScopedConfigKeyTypeMap>(
  Meta.scopedConfigs.scope,
  Meta.scopedConfigs.defaults,
)
