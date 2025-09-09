import { defineConfigObject } from 'reactive-vscode'
import * as Meta from './generated/meta'

// Define the interface for our configuration
interface NvimUiPlusConfig {
  enabled: { value: boolean }
  uiElements: {
    titleBar: { value: boolean }
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
    titleBar: Boolean,
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
