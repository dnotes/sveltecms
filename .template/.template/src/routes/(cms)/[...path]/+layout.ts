import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load:LayoutLoad = async (event) => {

  const { parent } = event
  let data = await parent()

  if (!data?.content && !data?.teasers) throw error(404)

}
