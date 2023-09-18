export class EoAError extends Error {
  constructor() {
    super('The profile is an EoA')
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
