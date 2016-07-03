/* @flow */

export default function compose(...funcs: Array<Function>): Function {
  const last = funcs[funcs.length - 1]
  const rest = funcs.slice(0, -1)
  return (...args: Array<any>) => rest.reduceRight(
    (composed, func) => func(composed), last(...args)
  )
}
