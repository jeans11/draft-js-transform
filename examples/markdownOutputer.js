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
    "header-six": (text) => `######${ text }`,
    "unordered-list-start": (text) => `\n${ text }`,
    "unordered-list-item": (text) => `* ${ text }\n`,
    "unordered-list-end": (text) => text,
  }
}
