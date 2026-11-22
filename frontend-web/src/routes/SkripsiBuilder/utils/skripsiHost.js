// V2 is still being shaken out on staging, so the production hosts keep serving
// V1 and every other host — dev.medpal.id, previews, localhost — gets V2.
const V1_HOSTS = ['medpal.id', 'www.medpal.id']

export function isSkripsiV2Host(hostname = window.location.hostname) {
  return !V1_HOSTS.includes(hostname.toLowerCase())
}
