export function watchDestination(value:unknown):string{
 return typeof value==='string'&&value===value.trim()&&/^\/(?:watch|verslag)\/[a-z0-9-]{1,80}$|^\/wedstrijd\/[a-zA-Z0-9-]{1,120}$/.test(value)?value:'/';
}
