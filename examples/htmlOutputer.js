export default {
  inlineStyle: {
    italic: (text) => `<em>${ text }</em>`,
    bold: (text) => `<strong>${ text }</strong>`,
    underline: (text) => `<u>${ text }</u>`
  },
  block: {
    "unstyled": (text) => `<p>${ text }</p>`,
    "unordered-list-start": (text) => `<ul>${ text}`,
    "unordered-list-item": (text) => `<li>${ text }</li>`,
    "unordered-list-end": (text) => `${ text }</ul>`,
    "atomic": () => ({
      "image": (data) => `<figure><div style="max-width:330px;margin:0 auto;"><img style="display:block;max-width:100%;" src="${ data.src }" /></div></figure>`
    }),
    "header-one": (text) => `<h1>${ text }</h1>`,
    "header-two": (text) => `<h2>${ text }</h2>`,
    "header-three": (text) => `<h3>${ text }</h3>`,
    "header-four": (text) => `<h4>${ text }</h4>`,
    "header-five": (text) => `<h5>${ text }</h5>`,
    "header-six": (text) => `<h6>${ text }</h6>`
  }
}
