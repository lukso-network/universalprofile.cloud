export class EoAError extends Error {
  constructor() {
    super('The profile is an EoA')
  }
}
