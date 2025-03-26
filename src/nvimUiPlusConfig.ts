import { defineConfigs } from 'reactive-vscode'

// Define configuration for the extension - without destructuring nested properties
export const config = defineConfigs('nvim-ui-plus', {
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
})
