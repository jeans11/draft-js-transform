jest.autoMockOff()

describe("Draft js transform | Test custom mapping", () => {
  const transform = require("../index").transform
  const texOutputer = require("../../examples/customOutputer").default
  const customTransform = transform(texOutputer)

  it("Transform simple structure", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "unstyled"
      }]
    }
    const htmlString = customTransform(data)
    expect(htmlString).toBe("__psimple text structure|p__")
  })

  it("Transform structure with simple inline style", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 4,
          offset: 7,
          style: "BOLD"
        }]
      }]
    }
    const htmlString = customTransform(data)
    expect(htmlString).toBe("__psimple __btext|b__ structure|p__")
  })

  it("Transform structure with multiple inline style on one word", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 4,
          offset: 7,
          style: "BOLD"
        }, {
          length: 4,
          offset: 7,
          style: "ITALIC"
        }, {
          length: 4,
          offset: 7,
          style: "UNDERLINE"
        }]
      }]
    }
    const htmlString = customTransform(data)
    expect(htmlString)
      .toBe("__psimple __b__i__utext|u__|i__|b__ structure|p__")
  })
})

