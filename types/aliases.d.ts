// Ambient module declarations to help TypeScript resolve Nuxt ~ aliases during dev/editor time
declare module '~/*' {
  const whatever: any
  export default whatever
}

declare module '~~/*' {
  const whatever: any
  export default whatever
}

declare module '#app' {
  const whatever: any
  export default whatever
}

declare module '#build' {
  const whatever: any
  export default whatever
}
