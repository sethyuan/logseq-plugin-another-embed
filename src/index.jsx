import "@logseq/libs"
import { setup, t } from "logseq-l10n"
import { render } from "preact"
import Breadcrumb from "./comps/Breadcrumb"
import { parseContent } from "./libs/utils"
import zhCN from "./translations/zh-CN.json"

const HEADING_REGEX = /^#+ /

let pageRefObserver = null
let tableObserver = null

let guideline = null
let col = null
let guideStart = 0
let colStart = 0

async function main() {
  await setup({ builtinTranslations: { "zh-CN": zhCN } })

  const rootStyles = parent.getComputedStyle(parent.document.documentElement)
  logseq.provideStyle({
    key: "kef-ae",
    style: `
      :root {
        --kef-ae-handle-color: ${rootStyles.getPropertyValue(
          "--ls-active-secondary-color",
        )};
      }
      span[data-ref=".embed"] {
        display: none !important;
      }
      span[data-ref=".embed"] + .embed-block > .px-3 {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      span[data-ref=".embed-children"],
      span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child,
      span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container > .block-children-left-border,
      span[data-ref=".embed-children"] + .embed-page > .embed-header {
        display: none !important;
      }
      span[data-ref=".embed-children"] + .embed-page > .blocks-container > div > div > .pre-block {
        display: none !important;
      }
      span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container {
        margin-left: 0 !important;
      }
      span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container > .block-children {
        border-left: 0 !important;
      }
      span[data-ref=".embed"] + .embed-page,
      span[data-ref=".embed-children"] + .embed-page {
        position: relative;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      span[data-ref=".embed"] + .embed-page {
        padding-left: 26px !important;
      }
      span[data-ref=".embed"] + .embed-block,
      span[data-ref=".embed-children"] + .embed-block {
        position: relative;
      }
      .kef-ae-control-bar {
        position: absolute;
        top: 10px;
        left: -7px;
        width: 14px;
        height: calc(100% - 10px - 10px);
        background: var(--kef-ae-handle-color);
        cursor: pointer;
        z-index: 2;
        opacity: 0;
      }

      :root {
        --kef-ae-h1-fs: 1.75em;
        --kef-ae-h2-fs: 1.5em;
        --kef-ae-h3-fs: 1.2em;
        --kef-ae-h4-fs: 1em;
        --kef-ae-h5-fs: 0.83em;
        --kef-ae-h6-fs: 0.75em;
      }
      .embed-block[data-heading="1"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
      .embed-page[data-heading="1"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
        font-size: var(--kef-ae-h2-fs) !important;
      }
      .embed-block[data-heading="1"] :is(.ls-block h2, .editor-inner .h2.uniline-block),
      .embed-block[data-heading="2"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
      .embed-page[data-heading="1"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
      .embed-page[data-heading="2"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
        font-size: var(--kef-ae-h3-fs) !important;
      }
      .embed-block[data-heading="1"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
      .embed-block[data-heading="2"] :is(.ls-block h2, .editor-inner .h2.uniline-block),
      .embed-block[data-heading="3"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
      .embed-page[data-heading="1"] :is(.ls-block h4, .editor-inner .h4.uniline-block),
      .embed-page[data-heading="2"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
      .embed-page[data-heading="3"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
        font-size: var(--kef-ae-h4-fs) !important;
      }
      .embed-block[data-heading="1"] :is(.ls-block h4, .editor-inner .h4.uniline-block),
      .embed-block[data-heading="2"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
      .embed-block[data-heading="3"] :is(.ls-block h2, .editor-inner .h2.uniline-block),
      .embed-block[data-heading="4"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
      .embed-page[data-heading="1"] :is(.ls-block h5, .editor-inner .h5.uniline-block),
      .embed-page[data-heading="2"] :is(.ls-block h4, .editor-inner .h4.uniline-block),
      .embed-page[data-heading="3"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
      .embed-page[data-heading="4"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
        font-size: var(--kef-ae-h5-fs) !important;
      }
      .embed-block[data-heading="1"] :is(.ls-block :is(h5, h6), .editor-inner :is(.h5, .h6).uniline-block),
      .embed-block[data-heading="2"] :is(.ls-block :is(h4, h5, h6), .editor-inner :is(.h4, .h5, .h6).uniline-block),
      .embed-block[data-heading="3"] :is(.ls-block :is(h3, h4, h5, h6), .editor-inner :is(.h3, .h4, .h5, .h6).uniline-block),
      .embed-block[data-heading="4"] :is(.ls-block :is(h2, h3, h4, h5, h6), .editor-inner :is(.h2, .h3, .h4, .h5, .h6).uniline-block),
      .embed-block[data-heading="5"] :is(.ls-block :is(h1, h2, h3, h4, h5, h6), .editor-inner :is(.h1, .h2, .h3, .h4, .h5, .h6).uniline-block),
      .embed-page[data-heading="1"] :is(.ls-block h6, .editor-inner .h6.uniline-block),
      .embed-page[data-heading="2"] :is(.ls-block :is(h5, h6), .editor-inner :is(.h5, .h6).uniline-block),
      .embed-page[data-heading="3"] :is(.ls-block :is(h4, h5, h6), .editor-inner :is(.h4, .h5, .h6).uniline-block),
      .embed-page[data-heading="4"] :is(.ls-block :is(h3, h4, h5, h6), .editor-inner :is(.h3, .h4, .h5, .h6).uniline-block),
      .embed-page[data-heading="5"] :is(.ls-block :is(h2, h3, h4, h5, h6), .editor-inner :is(.h2, .h3, .h4, .h5, .h6).uniline-block) {
        font-size: var(--kef-ae-h6-fs) !important;
      }

      .kef-ae-breadcrumb {
        margin-left: 26px;
        cursor: default;
        margin-bottom: -0.25em;
        padding-top: 5px;
      }
      .kef-ae-b-segs {
        display: none;
      }
      .kef-ae-show-breadcrumbs .kef-ae-b-segs {
        display: inline;
      }

      .kef-ae-hide-properties .block-properties:not(.page-properties) {
        display: none;
      }

      .kef-ae-table-guide {
        position: absolute;
        top: 0;
        left: -999px;
        width: 0;
        border-right: 1px dashed var(--ls-active-primary-color);
        pointer-events: none;
        z-index: var(--ls-z-index-level-1);
      }

      .kef-ae-arrow {
        position: absolute;
        top: 0;
        left: -18px;
        padding-right: 10px;
        height: 32px;
        display: flex;
        align-items: center;
        cursor: pointer;
        opacity: 0;
      }
      .kef-ae-arrow::before {
        display: block;
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 6px 0 6px;
        border-color: var(--ls-secondary-text-color) transparent transparent transparent;
        border-radius: 4px;
        transition: transform 0.1s ease-in-out;
      }
      .embed-header:hover .kef-ae-arrow {
        opacity: 0.4;
      }
      .kef-ae-arrow-collapsed::before {
        transform: rotate(-90deg);
      }
    `,
  })

  logseq.Editor.registerSlashCommand("Alternative embed", async () => {
    await logseq.Editor.insertAtEditingCursor(`[[.embed]]{{embed }}`)
    cursorBack(2)
  })

  logseq.Editor.registerSlashCommand("Alternative embed children", async () => {
    await logseq.Editor.insertAtEditingCursor(`[[.embed-children]]{{embed }}`)
    cursorBack(2)
  })

  logseq.App.registerCommandPalette(
    {
      key: "toggle-breadcrumb",
      ...(logseq.settings?.toggleBreadcrumbShortcut
        ? { keybinding: { binding: logseq.settings.toggleBreadcrumbShortcut } }
        : {}),
      label: t("Another Embed: Toggle Breadcrumb"),
    },
    toggleBreadcrumbDisplay,
  )

  logseq.App.registerCommandPalette(
    {
      key: "toggle-properties",
      ...(logseq.settings?.togglePropertiesShortcut
        ? { keybinding: { binding: logseq.settings.togglePropertiesShortcut } }
        : {}),
      label: t("Another Embed: Toggle Properties"),
    },
    togglePropertiesDisplay,
  )

  const observer = new MutationObserver(async (mutationList) => {
    for (const mutation of mutationList) {
      const target = mutation.target

      if (
        target.classList.contains("editor-wrapper") &&
        mutation.removedNodes?.[0]?.querySelector(
          logseq.settings?.globalEmbed
            ? `.embed-page,.embed-block`
            : `span[data-ref=".embed"],span[data-ref=".embed-children"]`,
        ) &&
        target.previousElementSibling
      ) {
        target.previousElementSibling.style.display = ""
      }

      const addedNode = mutation.addedNodes[0]
      if (!addedNode || !addedNode.querySelectorAll) continue

      const embeds = addedNode.querySelectorAll(
        logseq.settings?.globalEmbed
          ? `.embed-page,.embed-block`
          : `:is(span[data-ref=".embed"],span[data-ref=".embed-children"]) + :is(.embed-page,.embed-block)`,
      )

      if (embeds?.length > 0) {
        processEmbeds(embeds)
      }
    }
  })

  observer.observe(parent.document.body, {
    subtree: true,
    childList: true,
  })

  processEmbeds(
    parent.document.querySelectorAll(
      logseq.settings?.globalEmbed
        ? `.embed-page,.embed-block`
        : `:is(span[data-ref=".embed"],span[data-ref=".embed-children"]) + :is(.embed-page,.embed-block)`,
    ),
  )

  logseq.useSettingsSchema([
    {
      key: "globalEmbed",
      type: "boolean",
      default: false,
      description: t("Enable global alternative embed."),
    },
    {
      key: "autoHeading",
      type: "boolean",
      default: true,
      description: t("Enable auto heading processing in embeds."),
    },
    {
      key: "breadcrumb",
      type: "boolean",
      default: false,
      description: t("Enable breadcrumb for embeds."),
    },
    {
      key: "showBreadcrumbByDefault",
      type: "boolean",
      default: false,
      description: t("Display the breadcrumb by default or not."),
    },
    {
      key: "toggleBreadcrumbShortcut",
      type: "string",
      default: "s b",
      description: t("Assign a shortcut for toggling breadcrumb display."),
    },
    {
      key: "showPageRefIcon",
      type: "boolean",
      default: true,
      description: t(
        "Whether or not to show the page's icon (if any) in a page ref.",
      ),
    },
    {
      key: "showPropertiesByDefault",
      type: "boolean",
      default: true,
      description: t("Display the block properties by default or not."),
    },
    {
      key: "togglePropertiesShortcut",
      type: "string",
      default: "s p",
      description: t(
        "Assign a shortcut for toggling block properties display.",
      ),
    },
    {
      key: "tableColumnDrag",
      type: "boolean",
      default: true,
      description: t("You can adjust table columns' width if this is enabled."),
    },
  ])

  const settingsOff = logseq.onSettingsChanged(onSettingsChanged)

  logseq.beforeunload(() => {
    settingsOff()
    pageRefObserver?.disconnect()
    observer.disconnect()
  })

  console.log("#another-embed loaded")
}

function onSettingsChanged() {
  injectGlobalStyles()

  if (logseq.settings?.showBreadcrumbByDefault) {
    const appContainer = parent.document.getElementById("app-container")
    appContainer.classList.add("kef-ae-show-breadcrumbs")
  }

  if (
    logseq.settings?.showPropertiesByDefault != null &&
    !logseq.settings.showPropertiesByDefault
  ) {
    const appContainer = parent.document.getElementById("app-container")
    appContainer.classList.add("kef-ae-hide-properties")
  }

  pageRefObserver?.disconnect()
  if (logseq.settings?.showPageRefIcon) {
    pageRefObserver = new MutationObserver(async (mutationList) => {
      for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
          if (node.querySelectorAll) {
            await processPageRefs(node)
          }
        }
      }
    })
    pageRefObserver.observe(parent.document.body, {
      subtree: true,
      childList: true,
    })
    processPageRefs(parent.document.getElementById("app-container"))
  }

  tableObserver?.disconnect()
  if (logseq.settings?.tableColumnDrag) {
    logseq.provideStyle({
      key: "kef-ae-table",
      style: `
      td.whitespace-nowrap {
        white-space: initial;
      }
      `,
    })
    tableObserver = new MutationObserver(async (mutationList) => {
      for (const mutation of mutationList) {
        for (const node of mutation.addedNodes) {
          if (node.querySelectorAll) {
            await processTables(node)
          }
        }
      }
    })
    tableObserver.observe(parent.document.body, {
      subtree: true,
      childList: true,
    })
    guideline = parent.document.querySelector(".kef-ae-table-guide")
    if (guideline == null) {
      const guide = parent.document.createElement("div")
      guide.classList.add("kef-ae-table-guide")
      guide.style.display = "none"
      parent.document.body.append(guide)
      guideline = guide
    }
    processTables(parent.document.getElementById("app-container"))
  }
}

function injectGlobalStyles() {
  if (logseq.settings?.globalEmbed) {
    logseq.provideStyle({
      key: "kef-ae-global",
      style: `
        .embed-block > .px-3 {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .embed-page {
          position: relative;
          padding-left: 29px !important;
          padding-right: 0 !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        .embed-page > .embed-header {
          padding-left: 0;
          padding-right: 0;
        }
        .embed-block {
          position: relative;
        }
      `,
    })

    processEmbeds(parent.document.querySelectorAll(`.embed-page,.embed-block`))
  } else {
    reverseEmbedsProcessing(
      parent.document.querySelectorAll(`.embed-page,.embed-block`),
    )
    logseq.provideStyle({ key: "kef-ae-global", style: "/**/" })
  }
}

function processEmbeds(embeds) {
  for (const embed of embeds) {
    if (logseq.settings?.autoHeading) {
      const containingBlock = embed
        .closest("[blockid]")
        .parentElement.closest("[blockid]")
        .parentElement.closest("[blockid]")
      if (containingBlock == null) {
        // Containing block is page itself.
        embed.dataset.heading = 1
      } else {
        if (containingBlock.dataset.embed) {
          const outerEmbed = containingBlock.closest(
            ".embed-block, .embed-page",
          )
          if (outerEmbed) {
            embed.dataset.heading =
              embed.classList.contains("embed-block") &&
              embed.previousElementSibling?.dataset.ref === ".embed-children"
                ? +outerEmbed.dataset.heading
                : +outerEmbed.dataset.heading + 1
          }
        } else {
          const headingEl = containingBlock.firstElementChild.querySelector(
            ":is(h1,h2,h3,h4,h5,h6), .uniline-block:is(.h1,.h2,.h3,.h4,.h5,.h6)",
          )
          if (headingEl) {
            let heading
            if (headingEl.tagName.startsWith("H")) {
              heading = +headingEl.tagName.substring(1)
            } else if (headingEl.classList.contains("h1")) {
              heading = 1
            } else if (headingEl.classList.contains("h2")) {
              heading = 2
            } else if (headingEl.classList.contains("h3")) {
              heading = 3
            } else if (headingEl.classList.contains("h4")) {
              heading = 4
            } else if (headingEl.classList.contains("h5")) {
              heading = 5
            } else if (headingEl.classList.contains("h6")) {
              heading = 6
            }
            embed.dataset.heading =
              embed.classList.contains("embed-block") &&
              embed.previousElementSibling?.dataset.ref === ".embed-children"
                ? heading - 1
                : heading
          }
        }
      }
    }

    const container = embed.parentElement?.parentElement
    // Container is a block and not a property nor query table.
    if (
      container?.tagName === "DIV" &&
      container?.classList.contains("flex-1")
    ) {
      const blockContentWrapper = embed.closest(".block-content-wrapper")
      if (blockContentWrapper) {
        blockContentWrapper.style.width = "100%"
        if (blockContentWrapper.previousElementSibling) {
          blockContentWrapper.previousElementSibling.style.display = "none"
        }
      }

      const controlBar = parent.document.createElement("div")
      controlBar.classList.add("kef-ae-control-bar")
      controlBar.addEventListener("click", onClick)
      controlBar.addEventListener("mouseenter", onMouseEnter)
      controlBar.addEventListener("mouseleave", onMouseLeave)
      embed.appendChild(controlBar)

      // inject collapsing arrow
      if (
        embed.classList.contains("embed-page") &&
        embed.querySelector(".kef-ae-arrow") == null
      ) {
        const header = embed.querySelector(".embed-header")
        header.style.position = "relative"
        const arrow = parent.document.createElement("div")
        arrow.classList.add("kef-ae-arrow")
        arrow.addEventListener("click", onArrowClick)
        header.append(arrow)
      }
    }

    if (logseq.settings?.breadcrumb) {
      const embedded = embed.querySelector("[data-embed]")
      // whiteboard doesn't have data-embed.
      if (embedded) {
        embed.style.display = "flex"
        embed.style.flexDirection = "column"
        const containing = embed.closest("[id]")
        const selector = `#${containing.id} [class="${embed.className}"]`
        const blockId = embedded.getAttribute("blockid")
        const key = `kef-ae-${containing.id}`
        logseq.provideUI({
          key,
          path: selector,
          template: `<div id="${key}" class="kef-ae-breadcrumb breadcrumb block-parents"></div>`,
          style: {
            order: -1,
            paddingBottom:
              embed.classList.contains("embed-page") &&
              embed.previousElementSibling?.dataset?.ref === ".embed-children"
                ? "0.25rem"
                : 0,
          },
        })
        setTimeout(() => {
          renderBreadcrumb(embed, blockId, key)
        }, 0)
      }
    }
  }
}

function reverseEmbedsProcessing(embeds) {
  for (const embed of embeds) {
    delete embed.dataset.heading

    const blockContentWrapper = embed.closest(".block-content-wrapper")
    if (blockContentWrapper?.previousElementSibling) {
      blockContentWrapper.previousElementSibling.style.display = ""
    }

    const controlBar = embed.querySelector(".kef-ae-control-bar")
    if (controlBar) {
      controlBar.removeEventListener("mouseenter", onMouseEnter)
      controlBar.removeEventListener("mouseleave", onMouseLeave)
      controlBar.removeEventListener("click", onClick)
      controlBar.remove()
    }

    const arrow = embed.querySelector(".kef-ae-arrow")
    if (arrow) {
      arrow.removeEventListener("click", onArrowClick)
      arrow.remove()
    }
  }
}

function cursorBack(spaces) {
  const input = parent.document.activeElement
  const pos = input.selectionStart - spaces
  input.setSelectionRange(pos, pos)
}

function onClick(e) {
  e.preventDefault()
  const blockContentWrapper = e.target.closest(".block-content-wrapper")
  if (blockContentWrapper.previousElementSibling.style.display) {
    blockContentWrapper.previousElementSibling.style.display = ""
  } else {
    blockContentWrapper.previousElementSibling.style.display = "none"
  }
}

function onMouseEnter(e) {
  e.target.style.opacity = 1
}

function onMouseLeave(e) {
  e.target.style.opacity = null
}

function onArrowClick(e) {
  const arrow = e.target
  const blocksContainer =
    arrow.parentElement.parentElement.querySelector(".blocks-container")
  if (blocksContainer == null) return
  const collapsed = arrow.classList.contains("kef-ae-arrow-collapsed")
  if (collapsed) {
    arrow.classList.remove("kef-ae-arrow-collapsed")
    blocksContainer.style.display = "block"
  } else {
    arrow.classList.add("kef-ae-arrow-collapsed")
    blocksContainer.style.display = "none"
  }
}

async function renderBreadcrumb(embed, blockId, elId) {
  // Page has no breadcrumb need.
  if (
    embed.classList.contains("embed-page") &&
    embed.previousElementSibling?.dataset?.ref !== ".embed-children"
  )
    return

  const root = parent.document.getElementById(elId)
  if (root == null) return

  const path = []
  let block = await logseq.Editor.getBlock(blockId)
  if (
    embed.previousElementSibling?.dataset?.ref === ".embed-children" &&
    embed.classList.contains("embed-block")
  ) {
    path.unshift({
      label: await parseContent(block.content),
      uuid: block.uuid,
    })
  }
  while (block.parent != null) {
    block =
      block.page.id === block.parent.id
        ? await logseq.Editor.getPage(block.parent.id)
        : await logseq.Editor.getBlock(block.parent.id)
    path.unshift({
      label: (await parseContent(block.content)) || block.originalName,
      name: block.name,
      uuid: block.uuid,
    })
  }

  render(<Breadcrumb segments={path} />, root)
}

function toggleBreadcrumbDisplay() {
  const appContainer = parent.document.getElementById("app-container")
  if (appContainer.classList.contains("kef-ae-show-breadcrumbs")) {
    appContainer.classList.remove("kef-ae-show-breadcrumbs")
  } else {
    appContainer.classList.add("kef-ae-show-breadcrumbs")
  }
}

async function processPageRefs(node) {
  const pageRefs = Array.from(node.querySelectorAll(".page-ref"))
  if (pageRefs.length === 0) return
  await Promise.allSettled(
    pageRefs.map(async (pageRef) => {
      if (
        pageRef.previousElementSibling?.classList.contains(
          "kef-ae-pageref-icon",
        )
      )
        return
      const pageName = pageRef.dataset.ref
      const page = await logseq.Editor.getPage(pageName)
      const icon = page.properties?.icon
      if (
        icon &&
        !pageRef.previousElementSibling?.classList.contains(
          "kef-ae-pageref-icon",
        )
      ) {
        const iconEl = parent.document.createElement("span")
        iconEl.classList.add("kef-ae-pageref-icon")
        iconEl.style.marginRight = "0.3ch"
        iconEl.innerHTML = icon
        pageRef.parentElement.insertBefore(iconEl, pageRef)
      }
    }),
  )
}

function togglePropertiesDisplay() {
  const appContainer = parent.document.getElementById("app-container")
  if (appContainer.classList.contains("kef-ae-hide-properties")) {
    appContainer.classList.remove("kef-ae-hide-properties")
  } else {
    appContainer.classList.add("kef-ae-hide-properties")
  }
}

async function processTables(node) {
  const tables = node.querySelectorAll("table.table-auto:not(.table-condensed)")
  for (const table of tables) {
    table.style.tableLayout = "fixed"
    table.addEventListener("pointerdown", onTablePointerDown)
    table.addEventListener("pointerup", onTablePointerUp)
    table.addEventListener("pointermove", onTablePointerMove)

    const blockUUID = table.closest("[blockid]")?.getAttribute("blockid")
    if (!blockUUID) return
    const block = await logseq.Editor.getBlock(blockUUID)
    if (block == null) return
    if (block.properties == null) return
    const keys = Object.keys(block.properties).filter((k) =>
      k.startsWith("colW"),
    )
    if (keys.length === 0) return
    const colWidths = keys.reduce((obj, k) => {
      obj[+k.substring(4) - 1] = block.properties[k]
      return obj
    }, {})
    const cols = table.querySelectorAll("thead th")
    cols.forEach((col, i) => {
      if (colWidths[i]) {
        col.style.width = colWidths[i]
      }
    })
  }
}

function onTablePointerDown(e) {
  if (!e.target.style?.cursor) return
  if (guideline == null) return

  e.preventDefault()
  e.stopPropagation()

  col = e.target
  const table = col.closest("table")
  const tableRect = table.getBoundingClientRect()
  const colRect = col.getBoundingClientRect()
  guideline.style.top = `${tableRect.top}px`
  guideline.style.height = `${tableRect.height}px`
  guideline.style.left = `${e.x}px`
  guideline.style.display = ""
  guideStart = e.x
  colStart = colRect.x
  col.setPointerCapture(e.pointerId)
}

async function onTablePointerUp(e) {
  if (col == null) return

  e.preventDefault()
  e.stopPropagation()
  col.releasePointerCapture(e.pointerId)

  try {
    if (e.x <= colStart) return
    const blockUUID = col.closest("[blockid]")?.getAttribute("blockid")
    if (!blockUUID) return
    const index =
      Array.prototype.indexOf.call(col.parentElement.children, col) + 1
    const width = `${~~(col.offsetWidth + (e.x - guideStart))}px`
    col.style.width = width
    await logseq.Editor.upsertBlockProperty(blockUUID, `col-w-${index}`, width)
  } finally {
    guideline.style.display = "none"
    guideline.style.left = "-999px"
    col = null
  }
}

function onTablePointerMove(e) {
  if (col == null) {
    // not being dragged
    if (
      !(
        e.target.nodeName === "TH" &&
        e.target.parentElement?.parentElement?.nodeName === "THEAD"
      )
    )
      return
    if (
      e.offsetX >= e.target.offsetWidth - 8 &&
      e.offsetX <= e.target.offsetWidth
    ) {
      e.target.style.cursor = "col-resize"
    } else if (e.target.style?.cursor) {
      e.target.style.cursor = ""
    }
  } else {
    // being dragged
    if (e.x <= colStart) return
    guideline.style.left = `${e.x}px`
  }
}

logseq.ready(main).catch(console.error)
