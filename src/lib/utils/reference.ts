import type { IndexItem } from "sveltecms/core/Indexer"

export function isReferenceString(str:string) {
  if (str.match(/^([^\s\/]+)\/([^\s\/]+)$/)) return true
}

export function referencesEqual(a,b) {
  return a?._type && a?._slug && a?._type === b?._type && a?._slug === b?._slug
}

export function findReferenceIndex(item:IndexItem, arr?:any[]) {
  return Array.isArray(arr) ? arr.findIndex(i => referencesEqual(i, item)) : -1
}
