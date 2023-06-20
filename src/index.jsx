import "@logseq/libs"
import { setup, t } from "logseq-l10n"
import { render } from "preact"
import Breadcrumb from "./comps/Breadcrumb"
import { load as favoriteHelper } from "./favorite"
import { parseContent, setLanguage } from "./libs/utils"
import zhCN from "./translations/zh-CN.json"

const HEADING_REGEX = /^#+ /

let pageRefObserver = null

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
      .kef-ae-b-toggle {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 6px;
        height: 6px;
        background: var(--ls-primary-text-color);
      }
      .kef-ae-b-segs {
        display: none;
      }
      .kef-ae-b-show {
        display: inline;
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

  if (logseq.settings?.autoHeadingShortcut) {
    logseq.App.registerCommandShortcut(
      { binding: logseq.settings.autoHeadingShortcut },
      async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (block != null) {
          if (block.properties?.heading) {
            if (HEADING_REGEX.test(block.content)) {
              const content = `${block.content.replace(
                HEADING_REGEX,
                "",
              )}\nheading:: true`
              await logseq.Editor.updateBlock(block.uuid, content)
              await logseq.Editor.exitEditingMode(true)
            } else {
              await logseq.Editor.removeBlockProperty(block.uuid, "heading")
            }
          } else {
            await logseq.Editor.upsertBlockProperty(block.uuid, "heading", true)
          }
        }
      },
    )
  }

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
      description: t("Enable auto heading processing."),
    },
    {
      key: "autoHeadingShortcut",
      type: "string",
      default: "mod+9",
      description: t("Assign a shortcut to toggle auto heading."),
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
      key: "hierarchyProperty",
      type: "string",
      default: "tags",
      description: t(
        "It controls which property is used to decide a tag's hierarchy.",
      ),
    },
    {
      key: "filterIcon",
      type: "string",
      default: "🔍",
      description: t("Define an icon for quick filters."),
    },
    {
      key: "hoverArrow",
      type: "boolean",
      default: false,
      description: t("Show arrows only when hovered."),
    },
    {
      key: "taggedPageLimit",
      type: "number",
      default: 30,
      description: t(
        "Maximum number of tagged pages to display on each level for favorites.",
      ),
    },
    {
      key: "showPageRefIcon",
      type: "boolean",
      default: true,
      description: t(
        "Whether or not to show the page's icon (if any) in a page ref.",
      ),
    },
  ])

  const settingsOff = logseq.onSettingsChanged(onSettingsChanged)

  const { preferredLanguage: lang } = await logseq.App.getUserConfigs()
  setLanguage(lang)
  const favoriteOff = await favoriteHelper()

  logseq.beforeunload(() => {
    favoriteOff?.()
    settingsOff()
    pageRefObserver?.disconnect()
    observer.disconnect()
  })

  console.log("#another-embed loaded")
}

function onSettingsChanged() {
  injectGlobalStyles()

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
    processPageRefs(parent.document.getElementById("main-content-container"))
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
          padding-left: 0 !important;
          padding-right: 0 !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        .embed-page {
          padding-left: 29px !important;
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

logseq.ready(main).catch(console.error)
