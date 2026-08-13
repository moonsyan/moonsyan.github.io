/**
 * 页面 SEO 元信息助手（SEO-001）：DOM 版（纯客户端 SPA）。
 * 统一设置 title、description、canonical 与 Open Graph；
 * 可选 robots noindex 与 JSON-LD 结构化数据。
 */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const sel = `${attr}="${key}"`
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${sel}]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(data: object) {
  document.querySelectorAll('script[data-page-jsonld]').forEach((s) => s.remove())
  const s = document.createElement('script')
  s.type = 'application/ld+json'
  s.dataset.pageJsonld = ''
  s.textContent = JSON.stringify(data)
  document.head.appendChild(s)
}

export function usePageSeo(options: {
  title: string
  description: string
  path: string
  noindex?: boolean
  jsonLd?: object
}) {
  document.title = options.title
  upsertMeta('name', 'description', options.description)
  upsertMeta('property', 'og:title', options.title)
  upsertMeta('property', 'og:description', options.description)
  upsertMeta('property', 'og:type', 'website')
  const url = `${location.origin}${options.path}`
  upsertMeta('property', 'og:url', url)
  upsertLink('canonical', url)
  if (options.noindex) {
    upsertMeta('name', 'robots', 'noindex, nofollow')
  }
  if (options.jsonLd) {
    upsertJsonLd(options.jsonLd)
  }
}
