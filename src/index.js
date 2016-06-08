/**
 * Draftjs parser
 * @param {Object} structure mapping
 * @return {Function}
 */
export function parser(mapping) {

  if (typeof mapping !== "object") {
    throw new Error("Expected the mapping to be an object")
  }

  return function(raw) {
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
        const stylingText  = getStylingText(inlineStyleRanges, text)
        const dedupeStylingText = dedupe(stylingText)
        const styleWithFormat = applyStyle(dedupeStylingText, mapping)
        textWithInlineStyle = createInlineStyleBlock(text, styleWithFormat)
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
          contentBlock = handleListBlock(mapping, afterBlock, nbListElement)(
            mappingTypeBlock(textWithInlineStyle)
          )
          nbListElement += 1
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

/**
 * Retrieve the text who are inline style
 * @param {Array} inline styles
 * @param {String} text of block
 * @return {Array}
 */
function getStylingText(inlineStyleRanges, textBlock) {
  return inlineStyleRanges.map(item => {
    const { length, offset, style } = item
    const text = textBlock.substring(offset, offset + length)

    return {
      offset,
      style: [ style ],
      text,
      length
    }
  })
}

/**
 * Because a target text can have multiple style on a same offset. This function
 * allow to pack the style whish have the same offset and sort the item
 * @param {Array} Inline style of block
 * @return {Array} Inline style
 */
function dedupe(stylingText) {
  return stylingText.reduce((acc, item) => {
    const duplicates = acc.filter(duplicate => (
      duplicate.offset === item.offset && duplicate.length === item.length
    ))
    const withoutDuplicates = acc.filter(style => (
      style.offset !== item.offset || (
        style.offset === item.offset && style.length !== item.length
      )
    ))
    if (duplicates.length !== 0) {
      const styleDuplicates = duplicates.map(duplicate => duplicate.style)
      const mergeStyle = [].concat.apply(item.style, styleDuplicates)
      item = {
        ...item,
        style: mergeStyle
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
 * @param {Array} Inline style
 * @param {Object} Structure mapping for apply inline style
 */
function applyStyle(array, mapping) {
  return array.map(item => {
    const { text, style, offset } = item
    const textFormat = style.reduce((acc, format) => {
      const formatMapping = format.toLowerCase()
      const inlineStyleMapping = mapping.inlineStyle[formatMapping]

      if (!inlineStyleMapping) {
        throw new Error(`
          ${ formatMapping } inline style doesn't exists. Please verify your
          mapping object
        `)
      }

      return inlineStyleMapping(acc)
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
 * @param {Array} Inline style formated
 */
function createInlineStyleBlock(text, styleWithFormat) {

  function replace(text, replaceText, offsetStart, offsetEnd) {
    const start = text.substring(0, offsetStart)
    const end = text.substring(offsetEnd)
    return start + replaceText + end
  }

  function defaultState(text) {
    return {
      text,
      refItem: null,
      shiftOffsetTotal: 0,
      shiftOffsetNeested: {
        start: 0,
        end: 0
      }
    }
  }

  const applyStyleWithFormat = styleWithFormat.reduce((state, item, index, array) => {

    const { offset, textFormat, plainText } = item
    const { refItem, shiftOffsetNeested, shiftOffsetTotal } = state

    const reg = new RegExp(`(.*)${ plainText }(.*)`)
    const matcher = textFormat.match(reg)
    const shiftStart = matcher[1].length

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
  }, defaultState(text))

  return applyStyleWithFormat.text
}

/**
 * Allow handle list bock
 * @param {Object} The mapping structure
 * @param {Object} The after block
 * @param {Number} the number of list item
 * @return {Function}
 */
function handleListBlock(mapping, afterBlock, nb) {
  const start = mapping.block["unordered-list-start"]
  const end = mapping.block["unordered-list-end"]
  let res

  if (nb === 0) {
    if (afterBlock && afterBlock.type === "unordered-list-item") {
      res = start
    } else {
      res = (text) => end(start(text))
    }
  } else {
    if (!afterBlock || afterBlock.type !== "unordered-list-item") {
      res = end
    } else {
      res = (text) => text
    }
  }

  return res
}
