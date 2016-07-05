jest.autoMockOff()

describe("Draft js transform | General tests", () => {
  const transform = require("../index").transform
  const htmlMapping = require("../../examples/htmlMapping").default

  it("transform should be have a mapping object", () => {
    expect(transform).toThrow()
  })

  it("transform(mapping) should be have a raw object", () => {
    expect(transform(htmlMapping)).toThrow()
  })

  it("transform should have raw with block and entityMap", () => {
    const htmlTransform = transform(htmlMapping)
    const data = {}
    expect(() => htmlTransform(data)).toThrow()
  })

  it("Type block should be found in mapping object", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "fakeType"
      }]
    }
    const htmlTransform = transform(htmlMapping)
    expect(() => htmlTransform(data)).toThrow()
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
    const htmlTransform = transform(htmlMapping)
    expect(() => htmlTransform(data)).toThrow()
  })
})


