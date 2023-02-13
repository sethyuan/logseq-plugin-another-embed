import "@logseq/libs"
import { setup, t } from "logseq-l10n"
import zhCN from "./translations/zh-CN.json"

const HEADING_REGEX = /^#+ /

async function main() {
  await setup({ builtinTranslations: { "zh-CN": zhCN } })

  const rootStyles = parent.getComputedStyle(parent.document.documentElement)
  logseq.provideStyle(`
    ::after {
      --kef-another-embed-handle-color: ${rootStyles.getPropertyValue(
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
      padding-left: 29px !important;
    }
    span[data-ref=".embed"] + .embed-block,
    span[data-ref=".embed-children"] + .embed-block {
      position: relative;
    }
    span[data-ref=".embed"] + .embed-block:hover::after,
    span[data-ref=".embed-children"] + .embed-block:hover::after,
    span[data-ref=".embed"] + .embed-page:hover::after,
    span[data-ref=".embed-children"] + .embed-page:hover::after {
      content: "";
      position: absolute;
      top: 10px;
      left: -7px;
      width: 14px;
      height: calc(100% - 10px - 10px);
      background: var(--kef-another-embed-handle-color);
      cursor: pointer;
      z-index: 2;
    }

    :root {
      --kef-ae-h1-fs: 2em;
      --kef-ae-h2-fs: 1.5em;
      --kef-ae-h3-fs: 1.2em;
      --kef-ae-h4-fs: 1em;
      --kef-ae-h5-fs: 0.83em;
      --kef-ae-h6-fs: 0.75em;
    }
    .embed-block[data-heading="1"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
    .embed-page[data-heading="1"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
      font-size: var(--kef-ae-h2-fs);
    }
    .embed-block[data-heading="1"] :is(.ls-block h2, .editor-inner .h2.uniline-block),
    .embed-block[data-heading="2"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
    .embed-page[data-heading="1"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
    .embed-page[data-heading="2"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
      font-size: var(--kef-ae-h3-fs);
    }
    .embed-block[data-heading="1"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
    .embed-block[data-heading="2"] :is(.ls-block h2, .editor-inner .h2.uniline-block),
    .embed-block[data-heading="3"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
    .embed-page[data-heading="1"] :is(.ls-block h4, .editor-inner .h4.uniline-block),
    .embed-page[data-heading="2"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
    .embed-page[data-heading="3"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
      font-size: var(--kef-ae-h4-fs);
    }
    .embed-block[data-heading="1"] :is(.ls-block h4, .editor-inner .h4.uniline-block),
    .embed-block[data-heading="2"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
    .embed-block[data-heading="3"] :is(.ls-block h2, .editor-inner .h2.uniline-block),
    .embed-block[data-heading="4"] :is(.ls-block h1, .editor-inner .h1.uniline-block),
    .embed-page[data-heading="1"] :is(.ls-block h5, .editor-inner .h5.uniline-block),
    .embed-page[data-heading="2"] :is(.ls-block h4, .editor-inner .h4.uniline-block),
    .embed-page[data-heading="3"] :is(.ls-block h3, .editor-inner .h3.uniline-block),
    .embed-page[data-heading="4"] :is(.ls-block h2, .editor-inner .h2.uniline-block) {
      font-size: var(--kef-ae-h5-fs);
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
      font-size: var(--kef-ae-h6-fs);
    }
  `)

  const appContainer = parent.document.getElementById("app-container")
  appContainer.addEventListener("click", onClick)

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
          : `span[data-ref=".embed"],span[data-ref=".embed-children"]`,
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
      `span[data-ref=".embed"],span[data-ref=".embed-children"]`,
    ),
  )

  const dbOff = logseq.DB.onChanged(async ({ blocks, txData, txMeta }) => {
    if (txMeta?.outlinerOp === "deleteBlocks") {
      let deletedBlock = null
      let currentBlock = null
      for (const [e, a, v, , isAdded] of txData) {
        if (deletedBlock == null && a === "content" && !isAdded) {
          deletedBlock = blocks.find((b) => b.id === e)
          continue
        }
        if (deletedBlock == null) continue
        if (a === "refs" && v === deletedBlock.id && !isAdded) {
          if (currentBlock == null) {
            currentBlock = await logseq.Editor.getCurrentBlock()
            console.log(currentBlock)
          }
          const refBlock = blocks.find((b) => b.id === e)
          if (refBlock == null) continue
          if (
            !currentBlock.content &&
            parent.document.activeElement.value ===
              deletedBlock.content.replace(`\nid:: ${deletedBlock.uuid}`, "")
          ) {
            // TODO: deal with persisting the id.
            setTimeout(() => {
              logseq.Editor.upsertBlockProperty(
                currentBlock.uuid,
                "id",
                currentBlock.uuid,
              )
            }, 100)
            await logseq.Editor.updateBlock(
              refBlock.uuid,
              refBlock.content.replace(
                `((${deletedBlock.uuid}))`,
                `((${currentBlock.uuid}))`,
              ),
            )
          } else {
            await logseq.Editor.updateBlock(
              refBlock.uuid,
              refBlock.content.replace(
                `((${deletedBlock.uuid}))`,
                `((missing))`,
              ),
            )
          }
        }
      }
    } else if (txMeta?.outlinerOp === "insertBlocks") {
      for (const [e, a, v, , isAdded] of txData) {
        if (a === "refs" && isAdded) {
          const refBlock = blocks.find((b) => b.id === e)
          const newBlock = blocks.find((b) => b.id === v)
          // TODO: deal with persisting the id on newBlock.
          if (refBlock.content.includes("((missing))")) {
            await logseq.Editor.updateBlock(
              refBlock.uuid,
              refBlock.content.replace("((missing))", `((${newBlock.uuid}))`),
            )
          }
        }
      }
    }
  })

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
      key: "deletionHelper",
      type: "boolean",
      default: true,
      description: t("Enable deletion helper."),
    },
  ])

  const settingsOff = logseq.onSettingsChanged(injectGlobalStyles)

  logseq.beforeunload(() => {
    dbOff()
    settingsOff()
    observer.disconnect()
    appContainer.removeEventListener("click", onClick)
  })

  console.log("#another-embed loaded")
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
        .embed-block:hover::after,
        .embed-page:hover::after {
          content: "";
          position: absolute;
          top: 10px;
          left: -7px;
          width: 14px;
          height: calc(100% - 10px - 10px);
          background: var(--kef-another-embed-handle-color);
          cursor: pointer;
          z-index: 2;
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
  }
}

function reverseEmbedsProcessing(embeds) {
  for (const embed of embeds) {
    delete embed.dataset.heading
    const blockContentWrapper = embed.closest(".block-content-wrapper")
    if (blockContentWrapper?.previousElementSibling) {
      blockContentWrapper.previousElementSibling.style.display = ""
    }
  }
}

function cursorBack(spaces) {
  const input = parent.document.activeElement
  const pos = input.selectionStart - spaces
  input.setSelectionRange(pos, pos)
}

function onClick(e) {
  if (
    (e.target.classList.contains("embed-page") ||
      e.target.classList.contains("embed-block")) &&
    e.offsetX >= -7 &&
    e.offsetX <= 7 &&
    e.offsetY >= 10 &&
    e.offsetY <= e.target.clientHeight - 10
  ) {
    e.preventDefault()
    const blockContentWrapper = e.target.closest(".block-content-wrapper")
    if (blockContentWrapper.previousElementSibling.style.display) {
      blockContentWrapper.previousElementSibling.style.display = ""
    } else {
      blockContentWrapper.previousElementSibling.style.display = "none"
    }
  }
}

logseq.ready(main).catch(console.error)
