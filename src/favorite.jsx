import { render } from "preact"
import FavArrow from "./comps/FavArrow"
import FavSubList from "./comps/FavSubList"
import { hash } from "./libs/utils"

export async function load() {
  logseq.provideStyle({
    key: "kef-ae-fav",
    style: `
      .kef-ae-fav-list {
        padding: 0 24px;
        display: none;
      }
      .kef-ae-fav-expanded > div > div > .kef-ae-fav-list {
        display: block;
      }
      .kef-ae-fav-arrow svg {
        transform: rotate(90deg);
      }
      .kef-ae-fav-arrow-expanded svg {
        transform: rotate(0deg);
      }
    `,
  })

  const favoritesEl = parent.document.querySelector(
    "#left-sidebar ul.favorites",
  )

  const observer = new MutationObserver(async (mutationList) => {
    await processFavorites()
  })
  observer.observe(favoritesEl, { childList: true })

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
  for (const itemEl of favorites) {
    const subItems = await queryForSubItems(itemEl)
    if (subItems?.length > 0) {
      injectSubList(itemEl, subItems)
    }
  }
}

async function queryForSubItems(itemEl) {
  const name = itemEl.dataset.ref
  // TODO: also deal with tag ref hierarchies.
  const childrenNames = (
    await logseq.DB.datascriptQuery(
      `[:find (pull ?p [:block/original-name])
       :in $ ?name
       :where
       [?t :block/original-name ?name]
       [?p :block/namespace ?t]]`,
      `"${name}"`,
    )
  )
    .flat()
    .map((x) => x["original-name"])
  return childrenNames
}

async function injectSubList(itemEl, subItems) {
  const key = `kef-ae-f-${await hash(itemEl.dataset.ref)}`
  const arrowKey = `${key}-arrow`
  const listKey = `${key}-list`

  logseq.provideUI({
    key: arrowKey,
    path: `.favorite-item[data-ref="${itemEl.dataset.ref}"] > a`,
    template: `<span id="${arrowKey}"></span>`,
  })
  logseq.provideUI({
    key: listKey,
    path: `.favorite-item[data-ref="${itemEl.dataset.ref}"]`,
    template: `<div id="${listKey}"></div>`,
    style: { padding: "0 24px" },
  })

  setTimeout(() => {
    renderArrow(arrowKey, itemEl)
    renderList(listKey, subItems)
  }, 0)
}

function renderArrow(key, itemEl) {
  const el = parent.document.getElementById(key)
  render(<FavArrow itemEl={itemEl} />, el)
}

function renderList(key, items) {
  const el = parent.document.getElementById(key)
  render(<FavSubList items={items} />, el)
}
