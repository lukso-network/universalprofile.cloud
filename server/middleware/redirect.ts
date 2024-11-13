export default defineEventHandler(event => {
  const url = getRequestURL(event)
  const host = url.hostname
  if (
    /^(universalprofile.cloud|universaleverything.cloud)$/i.test(host) ||
    (/^universaleverything\.io$/i.test(host) && url.protocol !== 'https:')
  ) {
    url.hostname = 'universaleverything.io'
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
      },
    })
  }
})
