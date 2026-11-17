export function watchDestination(value:unknown):string{
 return typeof value==='string'&&/^\/watch\/[a-z0-9-]{1,80}$/.test(value)?value:'/';
}
