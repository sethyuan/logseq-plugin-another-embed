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
          if (item.filters) {
            if (item.subitems) {
              data[item.displayName] = {
                expanded: false,
                items: Object.values(item.subitems),
              }
            }
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
      let content = (await logseq.Editor.getBlock(item.uuid)).content.replace(
        /\n*^filters:: .*\n*/m,
        "",
      )
      content += `\nfilters:: ${`{${item.filters
        .map((filter) => `"${filter.toLowerCase()}" true`)
        .join(", ")}}`}`
      await logseq.Editor.updateBlock(item.uuid, content)
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
        const data = item.filters
          ? childrenData?.[item.displayName]
          : childrenData?.[item.name]

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
                {item.filters &&
                displayName.toLowerCase().startsWith(`${item.name}/`)
                  ? displayName.substring(item.name.length + 1)
                  : displayName}
              </div>
              {data && (
                <FavArrow
                  expanded={data.expanded}
                  onToggle={(e) =>
                    item.filters
                      ? toggleChild(e, item.displayName)
                      : toggleChild(e, item.name)
                  }
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
