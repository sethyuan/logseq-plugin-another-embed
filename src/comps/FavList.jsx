import produce from "immer"
import { createPortal } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import { cls } from "reactutils"
import { queryForSubItems } from "../libs/utils"
import FavArrow from "./FavArrow"

export default function FavList({ items, arrowContainer }) {
  const [expanded, setExpanded] = useState(false)

  function toggleList(e) {
    e.preventDefault()
    e.stopPropagation()
    setExpanded((v) => !v)
  }

  return (
    <>
      {createPortal(
        <FavArrow expanded={expanded} onToggle={toggleList} />,
        arrowContainer,
      )}
      <SubList items={items} shown={expanded} />
    </>
  )
}

function SubList({ items, shown }) {
  const [childrenData, setChildrenData] = useState(null)

  useEffect(() => {
    setChildrenData(null)
  }, [items])

  useEffect(() => {
    if (shown && childrenData == null) {
      ;(async () => {
        const data = {}
        for (const item of items) {
          if (item.subitems) {
            data[item.name] = { expanded: false, items: item.subitems }
          } else {
            const subitems = await queryForSubItems(item["original-name"])
            if (subitems?.length > 0) {
              data[item.name] = { expanded: false, items: subitems }
            }
          }
        }
        setChildrenData(data)
      })()
    }
  }, [shown, childrenData, items])

  async function openPage(e, item) {
    e.preventDefault()
    e.stopPropagation()
    if (item.filters) {
      const page = await logseq.Editor.getPage(item.name)
      await logseq.Editor.upsertBlockProperty(
        page.uuid,
        "filters",
        `{${item.filters.map((filter) => `"${filter}" true`).join(", ")}}`,
      )
    }
    if (e.shiftKey) {
      logseq.Editor.openInRightSidebar(item.uuid)
    } else {
      logseq.Editor.scrollToBlockInPage(item.name)
    }
  }

  function toggleChild(e, itemName) {
    e.preventDefault()
    e.stopPropagation()
    const newChildrenData = produce(childrenData, (draft) => {
      draft[itemName].expanded = !draft[itemName].expanded
    })
    setChildrenData(newChildrenData)
  }

  function preventSideEffect(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      class={cls("kef-ae-fav-list", shown && "kef-ae-fav-expanded")}
      onMouseDown={preventSideEffect}
    >
      {items.map((item) => {
        const displayName = item.displayName ?? item["original-name"]
        const data = childrenData?.[item.name]

        return (
          <div key={item.name}>
            <div class="kef-ae-fav-item" onClick={(e) => openPage(e, item)}>
              {item.filters ? (
                <div class="kef-ae-fav-item-icon">
                  {logseq.settings?.filterIcon ?? "🔎"}
                </div>
              ) : item.properties?.icon ? (
                <div class="kef-ae-fav-item-icon">{item.properties?.icon}</div>
              ) : (
                <span class="ui__icon tie tie-page kef-ae-fav-item-icon"></span>
              )}
              <div class="kef-ae-fav-item-name" title={displayName}>
                {displayName}
              </div>
              {data && (
                <FavArrow
                  expanded={data.expanded}
                  onToggle={(e) => toggleChild(e, item.name)}
                />
              )}
            </div>
            {data?.items?.length > 0 && (
              <SubList items={data.items} shown={data.expanded} />
            )}
          </div>
        )
      })}
    </div>
  )
}
