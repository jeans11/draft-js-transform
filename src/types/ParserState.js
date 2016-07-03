/* @flow */

import type {FormatingText} from "./FormatingText"

export type ParserState = {
  text: string,
  refItem: ?FormatingText,
  shiftOffsetTotal: number,
  shiftOffsetNeested: {
    start: ?number,
    total: ?number
  }
}
