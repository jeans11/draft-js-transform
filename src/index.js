/* @flow */

import type {InlineStyleRange} from "draft-js"

import compose from "./utils/compose"
import type {Outputer} from "./types/Outputer"
import type {StylingText} from "./types/StylingText"
import type {FormatingText} from "./types/FormatingText"
import type {TransformState} from "./types/TransformState"
import type {DraftjsTransform} from "./types/DraftjsTransform"

/**
 * Retrieve the text who are inline style
 * @param {Array<InlineStyleRange>} Array of inline style
 * @return {Function} A function to map inline style
 */
function getStylingText(
  inlineStyleRanges: Array<InlineStyleRange> = []
): (textBlock: string) => Array<StylingText> {
  return (textBlock = "") => inlineStyleRanges.map(item => {
    const { length, offset, style } = item
    const text = textBlock.substring(offset, offset + length)

    return {
      styles: [ style ],
      offset,
      text,
      length
    }
  })
}

/**
 * Because a target text can have multiple style on a same offset. This function
 * allow to pack the style whish have the same offset and sort the item
 * @param {Array<StylingText>} Array of styling text
 * @return {Array<StylingText>} Sorting and dedupe array
 */
function dedupe(
  stylingText = []
): Array<StylingText> {
  return stylingText.reduce((acc: Array<StylingText>, item: StylingText) => {
    const duplicates = acc.filter(duplicate => (
      duplicate.offset === item.offset && duplicate.length === item.length
    ))
    const withoutDuplicates = acc.filter(style => (
      style.offset !== item.offset || (
        style.offset === item.offset && style.length !== item.length
      )
    ))
    if (duplicates.length !== 0) {
      const styleDuplicates = duplicates.map(duplicate => duplicate.styles)
      const mergeStyle = [].concat.apply(item.styles, styleDuplicates)
      item = {
        ...item,
        styles: mergeStyle
      }
    }
    acc = [
      ...withoutDuplicates,
      item
    ]
    return acc
  }, [])

  // Sort asc array
  .concat().sort((a, b) => {
    if (b.offset > a.offset) {
      return -1
    } else if (
        (b.offset === a .offset && b.length > a.length)
        ||
        b.offset < a.offset
    ) {
      return 1
    }
  })
}

/**
 * Apply the inline style to the part of text block
 * @param {Outputer} Structure to output
 * @return {Function} A function to create formatingText
 */
function applyStyle(
  outputer: Outputer
): (stylingText: Array<StylingText>) => Array<FormatingText> {
  return (stylingText = []) => stylingText.map(item => {
    const { text, styles, offset } = item
    const textFormat = styles.reduce((acc, format) => {
      const formatOutputer = format.toLowerCase()
      const inlineStyleOutputer = outputer.inlineStyle[formatOutputer]

      if (!inlineStyleOutputer) {
        throw new Error(`
          ${ formatOutputer } inline style doesn't exists. Please verify your
          mapping object
        `)
      }

      return inlineStyleOutputer(acc)
    }, text)
    return {
      offset,
      plainText: text,
      textFormat
    }
  })
}

/**
 * Create a new text block with the inline style applied on part of text
 * @param {String} Text of block
 * @return {Function} A function for inline style formating
 */
function createInlineStyleBlock(
  text: string = ""
): (styleWithFormat: Array<FormatingText>) => string {

  return (styleWithFormat = []) => {

    function replace(
      text: string,
      replaceText: string,
      offsetStart: number,
      offsetEnd: number
    ): string {
      const start = text.substring(0, offsetStart)
      const end = text.substring(offsetEnd)
      return start + replaceText + end
    }

    function defaultState(
      text: string
    ): TransformState {
      return {
        text,
        refItem: null,
        shiftOffsetTotal: 0,
        shiftOffsetNeested: {
          start: 0,
          total: 0
        }
      }
    }

    const applyStyleWithFormat = styleWithFormat.reduce(
      (state: TransformState, item: FormatingText, index, array) => {

        const { offset, textFormat, plainText } = item
        const { refItem, shiftOffsetNeested, shiftOffsetTotal } = state

        const reg = new RegExp(`(.*)${ plainText }(.*)`)
        const matcher = textFormat.match(reg)
        const shiftStart = matcher && matcher[1].length

        // First formating
        if (!refItem) {

          return {
            refItem: item,
            text: replace(state.text, textFormat, offset, offset + plainText.length),
            shiftOffsetTotal: textFormat.length - plainText.length,
            shiftOffsetNeested: {
              start: shiftStart,
              total: shiftStart
            }
          }

        } else {

          const {
            offset: refOffset,
            textFormat: refTextFormat,
            plainText: refPlainText
          } = refItem

          const {
            offset: beforeOffset,
            textFormat: beforeTextFormat,
            plainText: beforePlainText
          } = array[index - 1]

          let newOffset

          // The current item is neested to the ref item
          if (offset >= refOffset && offset < refOffset + refPlainText.length) {

            // The current item is before the before item
            if (offset > beforeOffset && offset >= beforeOffset + beforePlainText.length) {
              newOffset = offset + shiftOffsetNeested.total

            // The current item is neested into the before item
            } else {
              newOffset = offset + shiftOffsetNeested.start
            }

            return {
              ...state,
              text: replace(state.text, textFormat, newOffset, newOffset + plainText.length),
              shiftOffsetTotal: shiftOffsetTotal + (textFormat.length - plainText.length),
              shiftOffsetNeested: {
                start: shiftOffsetNeested.start + shiftStart,
                total: shiftOffsetNeested.total + textFormat.length - plainText.length
              }
            }

          // The current item is after the ref item
          } else {
            newOffset = shiftOffsetTotal + offset
            const newShifOffsetTotal = shiftOffsetTotal + shiftStart

            return {
              refItem: item,
              text: replace(state.text, textFormat, newOffset, newOffset + plainText.length),
              shiftOffsetTotal: shiftOffsetTotal + (textFormat.length - plainText.length),
              shiftOffsetNeested: {
                start: newShifOffsetTotal,
                total: newShifOffsetTotal
              }
            }
          }
        }
      }, defaultState(text)
    )

    return applyStyleWithFormat.text
  }
}

/**
 * Allow handle list bock
 * @param {Outputer} The mapping structure
 * @param {Object} The after block
 * @param {Number} the number of list item
 * @return {Object}
 */
function handleListBlock(mapping: Outputer, afterBlock: Object, nb: number) {
  const start = mapping.block["unordered-list-start"]
  const end = mapping.block["unordered-list-end"]
  let listBlock
  let nbElement = 0

  if (nb === 0) {
    if (afterBlock && afterBlock.type === "unordered-list-item") {
      listBlock = start
      nbElement = nb + 1
    } else {
      listBlock = (text) => end(start(text))
    }
  } else {
    if (!afterBlock || afterBlock.type !== "unordered-list-item") {
      listBlock = end
    } else {
      listBlock = (text) => text
      nbElement = nb + 1
    }
  }

  return {
    listBlock,
    nbElement,
  }
}

/**
 * Draftjs transform
 * @param {Outputer} Structure mapping
 * @return {Function} A function to transform Draftjs content state
 */
export function transform(
  mapping: Outputer
): DraftjsTransform {

  if (typeof mapping !== "object") {
    throw new Error("Expected the mapping to be an object")
  }

  return (raw) => {
    if (typeof raw !== "object") {
      throw new Error(`
        Expected the raw to be an object. Use 'convertToRaw' function
        to draft-js package for obtain it.
      `)
    }

    const { blocks, entityMap } = raw
    let nbListElement = 0

    return blocks.map((block, index, array) => {
      const { type, text, key, inlineStyleRanges, entityRanges } = block

      if (text.trim().length === 0 && entityRanges.length === 0) {
        return ""
      }

      let textWithInlineStyle = text
      let contentBlock

      // Ok, there are inline style
      if (inlineStyleRanges && inlineStyleRanges.length > 0) {
        const inlineStyleComposer = compose(
          createInlineStyleBlock(text),
          applyStyle(mapping),
          dedupe,
          getStylingText(inlineStyleRanges)
        )

        textWithInlineStyle = inlineStyleComposer(text)
      }

      const mappingTypeBlock = mapping.block[type]

      if (!mappingTypeBlock) {
        throw new Error(`
          ${ type } type block doesn't exists. Please verify your mapping object
        `)
      }

      switch (type) {
        case "unordered-list-item":
          const afterBlock = array[index + 1]

          const { listBlock, nbElement } = handleListBlock(mapping, afterBlock, nbListElement)

          contentBlock = listBlock(mappingTypeBlock(textWithInlineStyle))
          nbListElement = nbElement
          break
        case "atomic":
          contentBlock = entityRanges.reduce((acc, item) => {
            const entity = entityMap[item.key]
            const mappingTypeBlockEntity = mappingTypeBlock()[entity.type]
            return acc += mappingTypeBlockEntity(entity.data)
          }, "")
          break
        default:
          contentBlock = mappingTypeBlock(textWithInlineStyle)
          break
      }

      return contentBlock
    }).join("")
  }
}
