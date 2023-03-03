export default function FavSubList({ items }) {
  console.log(items)
  return (
    <div class="kef-ae-fav-list">
      {items.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  )
}
