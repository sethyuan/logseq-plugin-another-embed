import { render } from "preact"
import { throttle } from "rambdax"
import FavList from "./comps/FavList"
import { hash, queryForSubItems } from "./libs/utils"

let dragHandle = null

export async function load() {
  logseq.provideStyle({
    key: "kef-ae-fav",
    style: `
      .kef-ae-fav-list {
        padding-left: 24px;
        display: none;
      }
      .kef-ae-fav-expanded {
        display: block;
      }
      .kef-ae-fav-arrow {
        flex: 0 0 auto;
        padding: 4px 20px 4px 10px;
        margin-right: -20px;
        opacity: ${logseq.settings?.hoverArrow ? 0 : 1};
        transition: opacity 0.3s;
      }
      :is(.favorite-item, .recent-item):hover > a > .kef-ae-fav-arrow,
      .kef-ae-fav-item:hover > .kef-ae-fav-arrow {
        opacity: 1;
      }
      .kef-ae-fav-arrow svg {
        transform: rotate(90deg) scale(0.8);
        transition: transform 0.04s linear;
      }
      .kef-ae-fav-arrow-expanded svg {
        transform: rotate(0deg) scale(0.8);
      }
      .kef-ae-fav-item {
        display: flex;
        align-items: center;
        padding: 0 24px;
        line-height: 28px;
        color: var(--ls-header-button-background);
        cursor: pointer;
      }
      .kef-ae-fav-item:hover {
        background-color: var(--ls-quaternary-background-color);
      }
      .kef-ae-fav-item-icon {
        flex: 0 0 auto;
        margin-right: 5px;
        width: 16px;
        text-align: center;
      }
      .kef-ae-fav-item-name {
        flex: 1 1 auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .kef-ae-drag-handle {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 4px;
        z-index: 10;
      }
      .kef-ae-drag-handle:hover,
      .kef-ae-dragging .kef-ae-drag-handle {
        cursor: col-resize;
        background: var(--ls-active-primary-color);
      }
      .kef-ae-dragging {
        cursor: col-resize;
      }
      .kef-ae-dragging :is(#left-sidebar, #main-content-container) {
        pointer-events: none;
      }
    `,
  })

  const leftSidebar = parent.document.getElementById("left-sidebar")
  const favoritesEl = parent.document.querySelector(
    "#left-sidebar ul.favorites",
  )
  const recentsEl = parent.document.querySelector(
    "#left-sidebar .recent .bd > ul",
  )

  const sidebarObserver = new MutationObserver(async (mutationList) => {
    if (leftSidebar.classList.contains("is-open")) {
      await processFavorites()
      await processRecents()
    }
  })
  sidebarObserver.observe(leftSidebar, { attributeFilter: ["class"] })
  const favoritesObserver = new MutationObserver(async (mutationList) => {
    await processFavorites()
  })
  favoritesObserver.observe(favoritesEl, { childList: true })
  const recentsObserver = new MutationObserver(async (mutationList) => {
    await processRecents()
  })
  recentsObserver.observe(recentsEl, { childList: true })

  await processFavorites()
  await processRecents()

  const graph = await logseq.App.getCurrentGraph()
  const storedWidth = parent.localStorage.getItem(`kef-ae-lsw-${graph.name}`)
  if (storedWidth) {
    parent.document.documentElement.style.setProperty(
      "--ls-left-sidebar-width",
      `${+storedWidth}px`,
    )
  }

  logseq.provideUI({
    key: "kef-ae-drag-handle",
    path: "#left-sidebar",
    template: `<div class="kef-ae-drag-handle"></div>`,
  })
  setTimeout(() => {
    dragHandle = parent.document.querySelector(
      "#left-sidebar .kef-ae-drag-handle",
    )
    dragHandle.addEventListener("pointerdown", onPointerDown)
  }, 0)

  // cleaning
  return () => {
    sidebarObserver.disconnect()
    favoritesObserver.disconnect()
    recentsObserver.disconnect()

    dragHandle?.removeEventListener("pointerdown", onPointerDown)
  }
}

async function processFavorites() {
  const favorites = parent.document.querySelectorAll(
    `#left-sidebar .favorite-item`,
  )
  for (const fav of favorites) {
    const items = await queryForSubItems(fav.dataset.ref)
    if (items?.length > 0) {
      injectList(fav, items)
    }
  }
}

async function processRecents() {
  const recents = parent.document.querySelectorAll(`#left-sidebar .recent-item`)
  for (const recent of recents) {
    const items = await queryForSubItems(recent.dataset.ref)
    if (items?.length > 0) {
      injectList(recent, items)
    }
  }
}

async function injectList(el, items) {
  const isFav = el.classList.contains("favorite-item")
  const key = `kef-ae-${isFav ? "f" : "r"}-${await hash(el.dataset.ref)}`

  const arrowContainer = el.querySelector("a")
  const arrow = arrowContainer.querySelector(".kef-ae-fav-arrow")
  if (arrow != null) {
    arrow.remove()
  }

  logseq.provideUI({
    key,
    path: `.${isFav ? "favorite" : "recent"}-item[data-ref="${
      el.dataset.ref
    }"]`,
    template: `<div id="${key}"></div>`,
  })

  setTimeout(() => {
    renderList(key, items, arrowContainer, el)
  }, 0)
}

function renderList(key, items, arrowContainer, fav) {
  const el = parent.document.getElementById(key)
  render(<FavList items={items} arrowContainer={arrowContainer} />, el)
}

function onPointerDown(e) {
  e.preventDefault()
  parent.document.documentElement.classList.add("kef-ae-dragging")
  parent.document.addEventListener("pointermove", onPointerMove)
  parent.document.addEventListener("pointerup", onPointerUp)
  parent.document.addEventListener("pointercancel", onPointerUp)
}

function onPointerUp(e) {
  e.preventDefault()
  parent.document.removeEventListener("pointermove", onPointerMove)
  parent.document.removeEventListener("pointerup", onPointerUp)
  parent.document.removeEventListener("pointercancel", onPointerUp)
  parent.document.documentElement.classList.remove("kef-ae-dragging")

  const pos = e.clientX
  parent.document.documentElement.style.setProperty(
    "--ls-left-sidebar-width",
    `${pos}px`,
  )
  ;(async () => {
    const graph = await logseq.App.getCurrentGraph()
    parent.localStorage.setItem(`kef-ae-lsw-${graph.name}`, pos)
  })()
}

function onPointerMove(e) {
  e.preventDefault()
  move(e.clientX)
}

const move = throttle((pos) => {
  parent.document.documentElement.style.setProperty(
    "--ls-left-sidebar-width",
    `${pos}px`,
  )
}, 12)
