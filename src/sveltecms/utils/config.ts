/**
 * SvelteCMS config is merged with lodash _.merge, but with the following differences:
 * - Config that is an Array will overwrite and be overwritten by other config
 * - TODO: Displays should be overwritten completely, though at present this is not the case,
 *   i.e. a configuration of { displays: { field: { page: { link: true }}}} will probably
 *   ADD { link:true } to whatever configuration already exists for displays.field.page.
 *   Instead it should overwrite the entire display.
 * @param a a configuration
 * @param b a configuration
 * @returns
 */
export function mergeCmsConfig(a,b) {
  if (Array.isArray(a) || Array.isArray(b)) return b // overwrite arrays
}

