export class EoAError extends Error {
  constructor() {
    super('The address is an EoA')
  }
}

export class InterfaceError extends Error {
  constructor(interfaceId: string) {
    super(`This profile contract doesn't support ${interfaceId} interface`)
  }
}
