jest.autoMockOff()

describe("Draft js transform | Test HTML mapping", () => {
  const transform = require("../index").transform
  const htmlOutputer = require("../../examples/htmlOutputer").default
  const htmlTransform = transform(htmlOutputer)

  it("Transform simple structure", () => {
    const data = {
      blocks: [{
        text: "simple text structure",
        type: "unstyled"
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString).toBe("<p>simple text structure</p>")
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
    const htmlString = htmlTransform(data)
    expect(htmlString).toBe("<p>simple <strong>text</strong> structure</p>")
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
    const htmlString = htmlTransform(data)
    expect(htmlString)
      .toBe("<p>simple <strong><em><u>text</u></em></strong> structure</p>")
  })

  it("Transform structure with multiple inline style on several words", () => {
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
        }, {
          length: 9,
          offset: 12,
          style: "ITALIC"

        }]
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString)
      .toBe("<p>simple <strong><em><u>text</u></em></strong> <em>structure</em></p>")
  })

  it("Transform structure with inline nested", () => {
    const data = {
      blocks: [{
        text: "simple text structure with inline nested",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 33,
          offset: 7,
          style: "BOLD"
        }, {
          length: 4,
          offset: 22,
          style: "UNDERLINE"

        }]
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString)
      .toBe("<p>simple <strong>text structure <u>with</u> inline nested</strong></p>")
  })

  it("Transform structure with inline nested (begin on first word)", () => {
    const data = {
      blocks: [{
        text: "simple text structure with inline nested",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 40,
          offset: 0,
          style: "BOLD"
        }, {
          length: 33,
          offset: 7,
          style: "ITALIC"
        }, {
          length: 28,
          offset: 12,
          style: "UNDERLINE"
        }]
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString)
      .toBe("<p><strong>simple <em>text <u>structure with inline nested</u></em></strong></p>")
  })

  it("Transform structure with multiple inline nested on multiple blocks (begin on first word)", () => {
    const data = {
      blocks: [{
        text: "simple text structure with inline nested",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 22,
          offset: 0,
          style: "BOLD"
        }, {
          length: 14,
          offset: 26,
          style: "BOLD"
        }, {
          length: 15,
          offset: 7,
          style: "ITALIC"
        }, {
          length: 14,
          offset: 26,
          style: "ITALIC"
        }, {
          length: 10,
          offset: 12,
          style: "UNDERLINE"
        }, {
          length: 14,
          offset: 26,
          style: "UNDERLINE"
        }]
      }, {
        text: "simple text structure with inline nested",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 22,
          offset: 0,
          style: "BOLD"
        }, {
          length: 14,
          offset: 26,
          style: "BOLD"
        }, {
          length: 15,
          offset: 7,
          style: "ITALIC"
        }, {
          length: 14,
          offset: 26,
          style: "ITALIC"
        }, {
          length: 10,
          offset: 12,
          style: "UNDERLINE"
        }, {
          length: 14,
          offset: 26,
          style: "UNDERLINE"
        }]
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString)
      .toBe("<p><strong>simple <em>text <u>structure </u></em></strong>with<strong><em><u> inline nested</u></em></strong></p><p><strong>simple <em>text <u>structure </u></em></strong>with<strong><em><u> inline nested</u></em></strong></p>")
  })

  it("Transform complex text structure (begin on first word)", () => {
    const data = {
      blocks: [{
        text: "simple text structure with other text for create the new Game of trones !",
        type: "unstyled",
        inlineStyleRanges: [{
          length: 26,
          offset: 0,
          style: "BOLD"
        }, {
          length: 6,
          offset: 65,
          style: "BOLD"
        }, {
          length: 4,
          offset: 7,
          style: "ITALIC"
        }, {
          length: 33,
          offset: 38,
          style: "ITALIC"
        }, {
          length: 9,
          offset: 12,
          style: "UNDERLINE"
        }, {
          length: 3,
          offset: 49,
          style: "UNDERLINE"
        }]
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString)
      .toBe("<p><strong>simple <em>text</em> <u>structure</u> with</strong> other text <em>for create <u>the</u> new Game of <strong>trones</strong></em> !</p>")
  })

  it("Transform complex text structure with list block type", () => {
    const data = {
      blocks: [{
        text: "simple text structure with inline nested in element list block",
        type: "unordered-list-item",
        inlineStyleRanges: [{
          length: 18,
          offset: 44,
          style: "BOLD"
        }, {
          length: 14,
          offset: 7,
          style: "ITALIC"
        }, {
          length: 9,
          offset: 12,
          style: "UNDERLINE"
        }, {
          length: 10,
          offset: 52,
          style: "UNDERLINE"
        }]
      }, {
        text: "Second element",
        type: "unordered-list-item",
        inlineStyleRanges: [{
          length: 7,
          offset: 7,
          style: "UNDERLINE"
        }]
      }, {
        text: "Third element",
        type: "unordered-list-item",
        inlineStyleRanges: [{
          length: 7,
          offset: 6,
          style: "ITALIC"
        }]
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString)
      .toBe("<ul><li>simple <em>text <u>structure</u></em> with inline nested in <strong>element <u>list block</u></strong></li><li>Second <u>element</u></li><li>Third <em>element</em></li></ul>")
  })

  it("Transform structure with simple atomic entity", () => {
    const data = {
      blocks: [{
        text: " ",
        type: "atomic",
        entityRanges: [{
          key: 0,
          length: 1,
          offset: 0
        }]
      }],
      entityMap: {
        0: {
          data: {
            src: "http://fifoo.media.jpeg"
          },
          mutability: "IMMUTABLE",
          type: "image"
        }
      }
    }
    const htmlString = htmlTransform(data)
    expect(htmlString).toBe(`<figure><div style="max-width:330px;margin:0 auto;"><img style="display:block;max-width:100%;" src="http://fifoo.media.jpeg" /></div></figure>`)
  })

  it("Transform structure with header title", () => {
    const data = {
      blocks: [{
        text: "Simple title",
        type: "header-one"
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString).toBe(`<h1>Simple title</h1>`)
  })

  it("Transform structure with header title and inline style", () => {
    const data = {
      blocks: [{
        text: "Simple title",
        type: "header-one",
        inlineStyleRanges: [{
          length: 5,
          offset: 7,
          style: "BOLD"
        }]
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString).toBe(`<h1>Simple <strong>title</strong></h1>`)
  })

  it("Transform structure with multiple header", () => {
    const data = {
      blocks: [{
        text: "Header 1",
        type: "header-one"
      }, {
        text: "Header 2",
        type: "header-two"
      }, {
        text: "Header 3",
        type: "header-three"
      }, {
        text: "Header 4",
        type: "header-four"
      }, {
        text: "Header 5",
        type: "header-five"
      }, {
        text: "Header 6",
        type: "header-six"
      }]
    }
    const htmlString = htmlTransform(data)
    expect(htmlString).toBe(`<h1>Header 1</h1><h2>Header 2</h2><h3>Header 3</h3><h4>Header 4</h4><h5>Header 5</h5><h6>Header 6</h6>`)
  })

  it("Should render multiple list", () => {
    const data = {
      blocks: [{
        text: "1,1",
        type: "unordered-list-item",
      }, {
        text: "1,2",
        type: "unordered-list-item",
      }, {
        text: "Test",
        type: "unstyled",
      }, {
        text: "2,1",
        type: "unordered-list-item",
      }, {
        text: "2,2",
        type: "unordered-list-item",
      }]
    }

    const htmlString = htmlTransform(data)

    expect(htmlString).toBe("<ul><li>1,1</li><li>1,2</li></ul><p>Test</p><ul><li>2,1</li><li>2,2</li></ul>")
  })
})
