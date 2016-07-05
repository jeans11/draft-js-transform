/* @flow */

import type {RawDraftContentState} from "draft-js"

export type DraftjsTransform = (raw: RawDraftContentState) => string
