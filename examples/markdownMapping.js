export default {
  inlineStyle: {
    italic: (text) => `_${ text }_`,
    bold: (text) => `**${ text }**`
  },

  block: {
    "unstyled": (text) => `    ${ text }`,
    "header-one": (text) => `#${ text }`,
    "header-two": (text) => `##${ text }`,
    "header-three": (text) => `###${ text }`,
    "header-four": (text) => `####${ text }`,
    "header-five": (text) => `#####${ text }`,
    "header-six": (text) => `######${ text }`
  }
}
