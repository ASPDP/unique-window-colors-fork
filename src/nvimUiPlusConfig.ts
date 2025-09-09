import { defineConfigs } from 'reactive-vscode'

// Define configuration for the extension - without destructuring nested properties
export const config = defineConfigs('nvim-ui-plus', {
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
})
