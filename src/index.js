import "@logseq/libs"

async function main() {
  logseq.provideStyle(`
    span[data-ref=".embed-nodot"],
    span[data-ref=".embed-nodot"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container > .block-children-left-border {
      display: none !important;
    }

    span[data-ref=".embed-nodot"] + .embed-block > .px-3 {
      padding-left: 0;
      padding-right: 0;
    }

    span[data-ref=".embed-children"],
    span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child,
    span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container > .block-children-left-border {
      display: none !important;
    }

    span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container {
      margin-left: 0 !important;
    }

    span[data-ref=".embed-children"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container > .block-children {
      border-left: 0 !important;
      margin-left: -12px !important;
    }
  `)

  logseq.Editor.registerSlashCommand("Embed with no dot", async () => {
    await logseq.Editor.insertAtEditingCursor(`[[.embed-nodot]]{{embed }}`)
    cursorBack(2)
  })

  logseq.Editor.registerSlashCommand("Embed children", async () => {
    await logseq.Editor.insertAtEditingCursor(`[[.embed-children]]{{embed }}`)
    cursorBack(2)
  })

  const observer = new MutationObserver(async (mutationList) => {
    for (const mutation of mutationList) {
      const addedNode = mutation.addedNodes[0]
      if (addedNode && !addedNode.querySelector) continue

      const target = mutation.target
      const embeds = addedNode?.querySelectorAll(
        `span[data-ref=".embed-nodot"]`,
      )

      if (embeds?.length > 0) {
        processEmbedNoDot(embeds)
        break
      } else if (target.classList.contains("editor-wrapper")) {
        if (
          mutation.removedNodes[0]?.querySelector(
            `span[data-ref=".embed-nodot"]`,
          )
        ) {
          if (target.previousElementSibling) {
            target.previousElementSibling.style.display = ""
          }
          break
        }
      }
    }
  })

  observer.observe(parent.document.body, {
    subtree: true,
    childList: true,
  })

  logseq.beforeunload(() => {
    observer.disconnect()
  })

  processEmbedNoDot(
    parent.document.querySelectorAll(`span[data-ref=".embed-nodot"]`),
  )

  console.log("#another-embed loaded")
}

function processEmbedNoDot(embeds) {
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

logseq.ready(main).catch(console.error)
