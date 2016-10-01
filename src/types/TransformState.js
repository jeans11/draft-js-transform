/* @flow */

import type {FormatingText} from "./FormatingText"

export type TransformState = {
  text: string,
  refItem: FormatingText | null,
  shiftOffsetTotal: number,
  shiftOffsetNeested: {
    start: ?number,
    total: ?number
  }
}
