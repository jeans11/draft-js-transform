# Draftjs parser

Parser for convert Draftjs ContentState.

# How to use

## Create your own mapping

```javascript
// mappings.js

// Simple HTML mapping
export const htmlMapping: Mapping = {
  inlineStyle: {
    italic: (text) => `<em>${ text }</em>`,
    bold: (text) => `<strong>${ text }</strong>`,
    underline: (text) => `<u>${ text }</u>`
  },
  block: {
    "unstyled": (text) => `<p>${ text }</p>`,
  }
}

// Simple TeX mapping
export const texMapping: Mapping = {
  inlineStyle: {
    italic: (text) => `\textit{${ text }}`,
    bold: (text) => `\textbf{${ text }}`,
    underline: (text) => `\underline{${ text }}`
  },
  block: {
    "unstyled": (text) => `${ text }`
  }
}

// Or dummy mapping
export const dummyMapping: Mapping = {
  inlineStyle: {
    italic: (text) => `__i${ text }|i__`,
    bold: (text) => `__b${ text }|b__`,
    underline: (text) => `__u${ text }|u__`
  },
  block: {
    "unstyled": (text) => `__p${ text }|p__`
  }
}
```
## And get the right parser

```javascript
import { parser } from "draft-js-parser"
import { htmlMapping, texMapping, dummyMapping } from "./mappings"

// Ok, let's create a HTML parser
const htmlParser: DraftjsParser = parser(htmlMapping)

// Ok, let's create a TeX parser
const texParser: DraftjsParser = parser(texMapping)

// Ok, let's create a dummy parser
const dummyParser: DraftjsParser = parser(dummyMapping)

// Draftjs have 'convertToRaw' function whish allow to export Draftjs ContentState
// to a simple Javascript object
const raw = convertToRaw(...)

// And parse...
const htmlString: string = htmlParser(raw)
const texString: string = texParser(raw)
const dummyString: string = dummyParser(raw)
```

# Road map

- Update the list parsing for matching with Markdown
- Add other feature
- Add more test ^^

# Contributing

Pull requests are always welcome :)

