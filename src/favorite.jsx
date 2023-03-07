import { render } from "preact"
import FavList from "./comps/FavList"
import { hash, queryForSubItems } from "./libs/utils"

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
        opacity: 0;
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

  // cleaning
  return () => {
    sidebarObserver.disconnect()
    favoritesObserver.disconnect()
    recentsObserver.disconnect()
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
