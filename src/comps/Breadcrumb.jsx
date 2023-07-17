export default function Breadcrumb({ segments }) {
  function goto(e, name, uuid) {
    e.preventDefault()
    e.stopPropagation()

    if (e.shiftKey) {
      logseq.Editor.openInRightSidebar(uuid)
    } else {
      logseq.Editor.scrollToBlockInPage(name ?? uuid)
    }
  }

  return (
    <>
      <span class="kef-ae-b-segs">
        {segments.map(({ label, name, uuid }, i) => (
          <>
            <a
              key={uuid}
              className="kef-ae-b-label"
              onClick={(e) => goto(e, name, uuid)}
              dangerouslySetInnerHTML={{ __html: label }}
            ></a>
            {i + 1 < segments.length && (
              <span class="kef-ae-b-spacer mx-2 opacity-50">➤</span>
            )}
          </>
        ))}
      </span>
    </>
  )
}
