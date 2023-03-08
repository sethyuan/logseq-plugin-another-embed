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
  )
    .flat()
    .sort((a, b) =>
      a["original-name"].localeCompare(b["original-name"], language),
    )
  if (namespaceChildren.length > 0) return namespaceChildren

  const taggedPages = (
    await logseq.DB.datascriptQuery(
      `[:find (pull ?p [:block/name :block/original-name :block/uuid :block/properties])
       :in $ ?name
       :where
       [?t :block/name ?name]
       [?p :block/tags ?t]]`,
      `"${name}"`,
    )
  )
    .flat()
    .slice(0, logseq.settings?.taggedPageLimit ?? 20)
    .sort((a, b) =>
      a["original-name"].localeCompare(b["original-name"], language),
    )
  return taggedPages
}
