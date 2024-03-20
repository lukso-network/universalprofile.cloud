export class EoAError extends Error {
  constructor(address: string) {
    super(`The ${address} address is an EoA`)
  }
}

export class InterfaceError extends Error {
  constructor(interfaceId: string) {
    super(`This profile contract doesn't support ${interfaceId} interface`)
  }
}

export class SetupViewedProfileError extends Error {
  constructor() {
    super('Could not setup viewed profile')
  }
}

export class NotFoundIndexError extends Error {
  constructor(address: string) {
    super(`The ${address} was not found in the index`)
  }
}

export class StandardError extends Error {
  constructor() {
    super('Unknown asset standard')
  }
}
