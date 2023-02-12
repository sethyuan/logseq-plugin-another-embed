import "@logseq/libs"
import { setup, t } from "logseq-l10n"
import zhCN from "./translations/zh-CN.json"

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
    .embed-block[data-heading="1"] .ls-block h1,
    .embed-page[data-heading="1"] .ls-block h2 {
      font-size: var(--kef-ae-h2-fs);
    }
    .embed-block[data-heading="1"] .ls-block h2,
    .embed-block[data-heading="2"] .ls-block h1,
    .embed-page[data-heading="1"] .ls-block h3,
    .embed-page[data-heading="2"] .ls-block h2 {
      font-size: var(--kef-ae-h3-fs);
    }
    .embed-block[data-heading="1"] .ls-block h3,
    .embed-block[data-heading="2"] .ls-block h2,
    .embed-block[data-heading="3"] .ls-block h1,
    .embed-page[data-heading="1"] .ls-block h4,
    .embed-page[data-heading="2"] .ls-block h3,
    .embed-page[data-heading="3"] .ls-block h2 {
      font-size: var(--kef-ae-h4-fs);
    }
    .embed-block[data-heading="1"] .ls-block h4,
    .embed-block[data-heading="2"] .ls-block h3,
    .embed-block[data-heading="3"] .ls-block h2,
    .embed-block[data-heading="4"] .ls-block h1,
    .embed-page[data-heading="1"] .ls-block h5,
    .embed-page[data-heading="2"] .ls-block h4,
    .embed-page[data-heading="3"] .ls-block h3,
    .embed-page[data-heading="4"] .ls-block h2 {
      font-size: var(--kef-ae-h5-fs);
    }
    .embed-block[data-heading="1"] .ls-block :is(h5, h6),
    .embed-block[data-heading="2"] .ls-block :is(h4, h5, h6),
    .embed-block[data-heading="3"] .ls-block :is(h3, h4, h5, h6),
    .embed-block[data-heading="4"] .ls-block :is(h2, h3, h4, h5, h6),
    .embed-block[data-heading="5"] .ls-block :is(h1, h2, h3, h4, h5, h6),
    .embed-page[data-heading="1"] .ls-block h6,
    .embed-page[data-heading="2"] .ls-block :is(h5, h6),
    .embed-page[data-heading="3"] .ls-block :is(h4, h5, h6),
    .embed-page[data-heading="4"] .ls-block :is(h3, h4, h5, h6),
    .embed-page[data-heading="5"] .ls-block :is(h2, h3, h4, h5, h6) {
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
  ])

  const settingsOff = logseq.onSettingsChanged(injectGlobalStyles)

  logseq.beforeunload(() => {
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
        const heading =
          containingBlock.closest(".embed-block, .embed-page")?.dataset
            .heading ??
          containingBlock.firstElementChild
            .querySelector(":is(h1, h2, h3, h4, h5, h6)")
            ?.tagName.toLowerCase()
        if (heading) {
          embed.dataset.heading = heading.startsWith("h")
            ? heading.substring(1)
            : +heading + 1
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
