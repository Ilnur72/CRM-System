class BadRequestError extends Error {
  constructor(msg) {
    super(msg);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError);
    }
  }
}

class NotFoundError extends Error {
  constructor(msg) {
    super(msg);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

class RequiredParameterError extends Error {
  constructor(param) {
    super(param);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError);
    }
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  RequiredParameterError,
};

// export class UniqueConstraintError extends Error {
//   constructor (value) {
//     super(`${value} must be unique.`)

//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, UniqueConstraintError)
//     }
//   }
// }

// export class InvalidPropertyError extends Error {
//   constructor (msg) {
//     super(msg)

//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, InvalidPropertyError)
//     }
//   }
// }

// export class RequiredParameterError extends Error {
//   constructor (param) {
//     super(`${param} can not be null or undefined.`)

//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, RequiredParameterError)
//     }
//   }
// }
