import { partition } from "rambdax"
import { parse } from "./marked-renderer.js"

let language

export function setLanguage(val) {
  language = val
}

export async function parseContent(content) {
  if (!content) return content

  // Use only the first line.
  content = content.match(/.*/)[0]

  // Remove macro renderers.
  content = content.replace(/ \{\{renderer (?:\}[^\}]|[^\}])+\}\}/g, "")

  // Remove properties.
  content = content.replace(/^.+:: .+$/gm, "").trim()

  // Handle markdown.
  content = parse(content)

  // Handle LaTex
  content = content.replaceAll(/(\${1,2})([^\$]+)\1/g, (str, _, expr) => {
    if (parent.window.katex == null) return expr
    return parent.window.katex.renderToString(expr, { throwOnError: false })
  })

  // Replace block refs with their content.
  let match
  while ((match = /(?:\(\()(?!\()([^\)]+)\)\)/g.exec(content)) != null) {
    const start = match.index
    const end = start + match[0].length
    const refUUID = match[1]
    try {
      const refBlock = await logseq.Editor.getBlock(refUUID)
      const refFirstLine = refBlock.content.match(/.*/)[0]
      const refContent = await parseContent(refFirstLine)
      content = `${content.substring(0, start)}${refContent}${content.substring(
        end,
      )}`
    } catch (err) {
      // ignore err
      break
    }
  }

  // Remove page refs
  content = content.replace(/\[\[([^\]]+)\]\]/g, "$1")

  return content.trim()
}

export async function hash(text) {
  if (!text) return ""

  const bytes = new TextEncoder().encode(text)
  const hashedArray = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-1", bytes)),
  )
  const hashed = hashedArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return hashed
}

export async function queryForSubItems(name) {
  name = name.toLowerCase()

  const namespaceChildren = (
    await logseq.DB.datascriptQuery(
      `[:find (pull ?p [:block/name :block/original-name :block/uuid :block/properties])
       :in $ ?name
       :where
       [?t :block/name ?name]
       [?p :block/namespace ?t]]`,
      `"${name}"`,
    )
  ).flat()
  namespaceChildren.forEach((p) => {
    const originalName = p["original-name"]
    const trimStart = originalName.lastIndexOf("/")
    p.displayName =
      trimStart > -1 ? originalName.substring(trimStart + 1) : originalName
  })

  const hierarchyProperty = logseq.settings?.hierarchyProperty ?? "tags"
  const taggedPages = (
    await logseq.DB.datascriptQuery(
      hierarchyProperty === "tags"
        ? `[:find (pull ?p [:block/name :block/original-name :block/uuid :block/properties])
            :in $ ?name
            :where
            [?t :block/name ?name]
            [?p :block/tags ?t]]`
        : `[:find (pull ?p [:block/name :block/original-name :block/uuid :block/properties])
            :in $ ?name
            :where
            [?p :block/original-name]
            [?p :block/properties ?props]
            [(get ?props :${hierarchyProperty}) ?v]
            (or [(= ?v ?name)] [(contains? ?v ?name)])]`,
      `"${name}"`,
    )
  ).flat()

  const quickFilters = await getQuickFilters(name)

  if (
    namespaceChildren.length === 0 &&
    taggedPages.length === 0 &&
    quickFilters.length === 0
  )
    return namespaceChildren

  const list = namespaceChildren.concat(taggedPages).concat(quickFilters)
  const [fixed, dynamic] = partition((p) => p.properties?.fixed != null, list)
  fixed.sort((a, b) => a.properties.fixed - b.properties.fixed)
  dynamic.sort((a, b) =>
    (a.displayName ?? a["original-name"]).localeCompare(
      b.displayName ?? b["original-name"],
      language,
    ),
  )
  const result = fixed
    .concat(dynamic)
    .slice(0, logseq.settings?.taggedPageLimit ?? 30)

  return result
}

async function getQuickFilters(name) {
  const [{ uuid: blockUUID }, { uuid: pageUUID }] = (
    await logseq.DB.datascriptQuery(
      `[:find (pull ?b [:block/uuid]) (pull ?p [:block/uuid])
      :in $ ?name
      :where
      [?p :block/name ?name]
      [?b :block/page ?p]
      [?b :block/pre-block? true]]`,
      `"${name}"`,
    )
  )[0] ?? [{}, {}]
  if (blockUUID == null || pageUUID == null) return []

  let quickFiltersStr
  try {
    quickFiltersStr = JSON.parse(
      (await logseq.Editor.getBlockProperty(blockUUID, "quick-filters")) ??
        '""',
    )
  } catch (err) {
    console.error(err)
    return []
  }
  if (!quickFiltersStr) return []

  const groups = quickFiltersStr.match(/(?:\d+\s+)?(?:\[\[[^\]]+\]\]\s*)+/g)
  if (groups == null) return []

  const quickFilters = groups
    .map((filterStr) => {
      const matches = Array.from(
        filterStr.matchAll(/\[\[([^\]]+)\]\]\s*|(\d+)/g),
      )
      const fixed = matches[0][2] ? +matches[0][2] : null
      const tags = (fixed == null ? matches : matches.slice(1)).map((m) => m[1])
      return [tags, fixed]
    })
    .filter(([tags, fixed]) => tags.length > 0)
    .reduce((filter, [tags, fixed]) => {
      if (filter[tags[0]] == null) {
        filter[tags[0]] = {}
        if (fixed != null) {
          filter[tags[0]].properties = { fixed }
        }
      }
      constructFilter(filter[tags[0]], name, blockUUID, pageUUID, tags, [])
      return filter
    }, {})

  return Object.values(quickFilters)
}

function constructFilter(obj, name, blockUUID, pageUUID, tags, path) {
  if (obj.displayName == null) {
    obj.name = name
    obj.blockUUID = blockUUID
    obj.pageUUID = pageUUID
    obj.displayName = tags[0]
    obj.filters = [...path, tags[0]]
  }

  tags = tags.slice(1)
  if (tags.length === 0) return

  if (obj.subitems == null) {
    obj.subitems = {}
  }
  if (obj.subitems[tags[0]] == null) {
    obj.subitems[tags[0]] = {}
  }
  constructFilter(
    obj.subitems[tags[0]],
    name,
    blockUUID,
    pageUUID,
    tags,
    obj.filters,
  )
}
