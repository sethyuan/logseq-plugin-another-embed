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
        padding-left: 10px;
      }
      .kef-ae-fav-arrow svg {
        transform: rotate(90deg);
        transition: transform 0.04s linear;
      }
      .kef-ae-fav-arrow-expanded svg {
        transform: rotate(0deg);
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
        margin-right: 5px;
        width: 16px;
        text-align: center;
      }
      .kef-ae-fav-item-name {
        flex: 1 1 auto;
      }
    `,
  })

  const leftSidebar = parent.document.getElementById("left-sidebar")
  const favoritesEl = parent.document.querySelector(
    "#left-sidebar ul.favorites",
  )

  const observer = new MutationObserver(async (mutationList) => {
    if (leftSidebar.classList.contains("is-open")) {
      await processFavorites()
    }
  })
  observer.observe(favoritesEl, { childList: true })
  observer.observe(leftSidebar, { attributeFilter: ["class"] })

  await processFavorites()

  // cleaning
  return () => {
    observer.disconnect()
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

async function injectList(fav, items) {
  const key = `kef-ae-f-${await hash(fav.dataset.ref)}`

  logseq.provideUI({
    key,
    path: `.favorite-item[data-ref="${fav.dataset.ref}"]`,
    template: `<div id="${key}"></div>`,
  })

  setTimeout(() => {
    renderList(key, items, fav)
  }, 0)
}

function renderList(key, items, fav) {
  const el = parent.document.getElementById(key)
  const arrowContainer = fav.querySelector("a")
  const arrow = arrowContainer.querySelector(".kef-ae-fav-arrow")
  if (arrow != null) {
    arrow.remove()
  }
  render(<FavList items={items} arrowContainer={arrowContainer} />, el)
}
