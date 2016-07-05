/* @flow */

import type {FormatingText} from "./FormatingText"

export type TransformState = {
  text: string,
  refItem: ?FormatingText,
  shiftOffsetTotal: number,
  shiftOffsetNeested: {
    start: ?number,
    total: ?number
  }
}
