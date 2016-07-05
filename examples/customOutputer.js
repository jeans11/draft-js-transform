export default {
  inlineStyle: {
    italic: (text) => `__i${ text }|i__`,
    bold: (text) => `__b${ text }|b__`,
    underline: (text) => `__u${ text }|u__`
  },
  block: {
    "unstyled": (text) => `__p${ text }|p__`
  }
}
