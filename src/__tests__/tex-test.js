jest.autoMockOff()

describe("Draft js parser | Test TeX mapping", () => {
  const parser = require("../index").parser
  const texMapping = require("../../examples/texMapping").default
  const texParser = parser(texMapping)

  it("Parse simple structure", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "unstyled"
      }]
    }
    const htmlString = texParser(data)
    expect(htmlString).toBe("simple text structure")
  })

  it("Parse structure with simple inline style", () => {
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
    const htmlString = texParser(data)
    expect(htmlString).toBe("simple \\textbf{text} structure")
  })

  it("Parse structure with multiple inline style on one word", () => {
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
    const htmlString = texParser(data)
    expect(htmlString)
      .toBe("simple \\textbf{\\textit{\\underline{text}}} structure")
  })


})





