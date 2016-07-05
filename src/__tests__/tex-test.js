jest.autoMockOff()

describe("Draft js transform | Test TeX mapping", () => {
  const transform = require("../index").transform
  const texMapping = require("../../examples/texMapping").default
  const texTransform = transform(texMapping)

  it("Transform simple structure", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "unstyled"
      }]
    }
    const texString = texTransform(data)
    expect(texString).toBe("simple text structure")
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
    const texString = texTransform(data)
    expect(texString).toBe("simple \\textbf{text} structure")
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
    const texString = texTransform(data)
    expect(texString)
      .toBe("simple \\textbf{\\textit{\\underline{text}}} structure")
  })


})





