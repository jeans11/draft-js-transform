export default {
  inlineStyle: {
    italic: (text) => `\\textit{${ text }}`,
    bold: (text) => `\\textbf{${ text }}`,
    underline: (text) => `\\underline{${ text }}`
  },
  block: {
    "unstyled": (text) => `${ text }`
  }
}
