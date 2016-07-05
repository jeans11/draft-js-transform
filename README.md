# Draftjs transform

A librairie for transform Draftjs ContentState.

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
## And transform

```javascript
import { transform } from "draft-js-transform"
import { htmlMapping, texMapping, dummyMapping } from "./mappings"

// Ok, let's create a HTML transform
const htmlTransform: DraftjsTransform = transform(htmlMapping)

// Ok, let's create a TeX transform
const texTransform: DraftjsTransform = transform(texMapping)

// Ok, let's create a dummy transform
const dummyTransform: DraftjsTransform = transform(dummyMapping)

// Draftjs have 'convertToRaw' function whish allow to export Draftjs ContentState
// to a simple Javascript object
const raw = convertToRaw(...)

// And transform...
const htmlString: string = htmlTransform(raw)
const texString: string = texTransform(raw)
const dummyString: string = dummyTransform(raw)
```

# Road map

- Update the list parsing for matching with Markdown
- Add other feature
- Add more test ^^

# Contributing

Pull requests are always welcome :)

