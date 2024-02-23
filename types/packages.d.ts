declare module 'mime-to-extensions' {
  const mime: {
    extension: (fileType: string) => string | undefined
  }
  export default mime
}
