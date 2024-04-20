export class MalformedDataError extends Error {
  constructor(message: string | undefined) {
    super(message);
    Object.setPrototypeOf(this, MalformedDataError.prototype);
  }

  toString() {
    return `MalformedDataError: ${this.message}`;
  }
}

export class MalformedDecisionTreeError extends Error {
  constructor(message: string | undefined) {
    super(message);
    Object.setPrototypeOf(this, MalformedDecisionTreeError.prototype);
  }

  toString() {
    return `MalformedDecisionTreeError: ${this.message}`;
  }
}
