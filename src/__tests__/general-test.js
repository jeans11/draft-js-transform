jest.autoMockOff()

describe("Draft js parser | General tests", () => {
  const parser = require("../index").parser
  const htmlMapping = require("../../examples/htmlMapping").default

  it("parser should be have a mapping object", () => {
    expect(parser).toThrow()
  })

  it("parser(mapping) should be have a raw object", () => {
    expect(parser(htmlMapping)).toThrow()
  })

  it("parser should have raw with block and entityMap", () => {
    const htmlParser = parser(htmlMapping)
    const data = {}
    expect(() => htmlParser(data)).toThrow()
  })

  it("Type block should be found in mapping object", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "fakeType"
      }]
    }
    const htmlParser = parser(htmlMapping)
    expect(() => htmlParser(data)).toThrow()
  })

  it("Inline style should be found in mapping object", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 4,
          offset: 7,
          style: "FAKE"
        }]
      }]
    }
    const htmlParser = parser(htmlMapping)
    expect(() => htmlParser(data)).toThrow()
  })
})


