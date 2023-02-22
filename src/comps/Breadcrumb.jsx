import { useState } from "preact/hooks"
import { cls } from "reactutils"

export default function Breadcrumb({ segments }) {
  const [visible, setVisible] = useState(
    !!logseq.settings?.showBreadcrumbByDefault,
  )

  function goto(e, name, uuid) {
    e.preventDefault()
    e.stopPropagation()

    if (e.shiftKey) {
      logseq.Editor.openInRightSidebar(uuid)
    } else {
      logseq.Editor.scrollToBlockInPage(name ?? uuid)
    }
  }

  function toggleVisibility() {
    setVisible((v) => !v)
  }

  return (
    <>
      <a class="kef-ae-b-toggle" onClick={toggleVisibility} />
      <span class={cls("kef-ae-b-segs", visible && "kef-ae-b-show")}>
        {segments.map(({ label, name, uuid }, i) => (
          <>
            <a
              key={uuid}
              className="kef-ae-b-label"
              onClick={(e) => goto(e, name, uuid)}
            >
              {label}
            </a>
            {i + 1 < segments.length && (
              <span class="kef-ae-b-spacer mx-2 opacity-50">➤</span>
            )}
          </>
        ))}
      </span>
    </>
  )
}
