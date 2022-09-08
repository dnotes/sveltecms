export async function load(event) {
  let data = await event.parent()
  return data
}
