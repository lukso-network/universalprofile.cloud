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

export class NoAccountsError extends Error {
  constructor() {
    super('No accounts available')
  }
}

export class NetworkError extends Error {
  statusCode: number

  constructor(error: Error, statusCode = 500) {
    super(`Network error status code: ${statusCode}. Message: ${error.message}`)
    this.stack = error.stack
    this.name = error.name
    this.cause = error.cause
    this.message = error.message
    this.statusCode = statusCode
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}
