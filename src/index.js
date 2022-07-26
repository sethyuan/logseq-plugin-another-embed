import "@logseq/libs"

async function main() {
  logseq.provideStyle(`
    span[data-ref=".embed-nodot"],
    span[data-ref=".embed-nodot"] + .embed-block > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > .block-children-container > .block-children-left-border {
      display: none !important;
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
    const input = parent.document.activeElement
    const pos = input.selectionStart - 2
    input.setSelectionRange(pos, pos)
  })

  logseq.Editor.registerSlashCommand("Embed children", async () => {
    await logseq.Editor.insertAtEditingCursor(`[[.embed-children]]{{embed }}`)
    const input = parent.document.activeElement
    const pos = input.selectionStart - 2
    input.setSelectionRange(pos, pos)
  })

  console.log("#another-embed loaded")
}

logseq.ready(main).catch(console.error)
