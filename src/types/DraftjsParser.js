/* @flow */

import type {RawDraftContentState} from "draft-js"

export type DraftjsParser = (raw: RawDraftContentState) => string
