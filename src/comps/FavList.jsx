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
          const subitems = await queryForSubItems(item["original-name"])
          if (subitems?.length > 0) {
            data[item.name] = { expanded: false, items: subitems }
          }
        }
        setChildrenData(data)
      })()
    }
  }, [shown, childrenData, items])

  function openPage(e, item) {
    e.preventDefault()
    e.stopPropagation()
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

  return (
    <div class={cls("kef-ae-fav-list", shown && "kef-ae-fav-expanded")}>
      {items.map((item) => {
        const itemName = item["original-name"]
        const trimStart = itemName.lastIndexOf("/")
        const displayName =
          trimStart > -1 ? itemName.substring(trimStart + 1) : itemName
        const data = childrenData?.[item.name]

        return (
          <div key={itemName}>
            <div class="kef-ae-fav-item" onClick={(e) => openPage(e, item)}>
              {item.properties?.icon ? (
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
