import type { PageServerLoad } from "./$types";
const readme = import.meta.glob('/README.md', { as:'raw', eager:true });
import md from '$lib/md';

export const load:PageServerLoad = async () => {
  let [intro] = readme['/README.md'].split(/\n---\s*\n/)
  return {
    intro: md.render(intro)
  }
}