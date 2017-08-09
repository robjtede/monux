export type Primitive = string | number | boolean | null

export interface JSONArray extends Array<JSONEntry> {}
export interface JSONMap {
  [key: string]: JSONEntry
}

export type JSONEntry = Primitive | JSONArray | JSONMap
export type JSONData = JSONArray | JSONMap
