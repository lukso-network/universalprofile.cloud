declare global {
  type Address = `0x${string}`

  type Base64EncodedImage = `data:image/jpeg;base64${string}`

  interface Window {
    lukso: any
    ethereum: any
  }
}

export {}
