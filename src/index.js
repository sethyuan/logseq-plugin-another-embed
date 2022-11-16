import "@logseq/libs"

async function main() {
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
    span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container {
      margin-left: -12px !important;
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
          `span[data-ref=".embed"],span[data-ref=".embed-children"]`,
        ) &&
        target.previousElementSibling
      ) {
        target.previousElementSibling.style.display = ""
      }

      const addedNode = mutation.addedNodes[0]
      if (!addedNode || !addedNode.querySelectorAll) continue

      const embeds = addedNode.querySelectorAll(
        `span[data-ref=".embed"],span[data-ref=".embed-children"]`,
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

  logseq.beforeunload(() => {
    observer.disconnect()
    appContainer.removeEventListener("click", onClick)
  })

  processEmbeds(
    parent.document.querySelectorAll(
      `span[data-ref=".embed"],span[data-ref=".embed-children"]`,
    ),
  )

  console.log("#another-embed loaded")
}

function processEmbeds(embeds) {
  for (const embed of embeds) {
    const blockContentWrapper = embed.closest(".block-content-wrapper")
    if (blockContentWrapper) {
      blockContentWrapper.style.width = "100%"
      if (blockContentWrapper.previousElementSibling) {
        blockContentWrapper.previousElementSibling.style.display = "none"
      }
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
