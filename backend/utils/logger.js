/**
 * Logs the provided parameters to the console.
 *
 * @param {...any} params - The parameters to log.
 */
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

/**
 * Logs the provided parameters to the console as an error.
 * @param  {...any} params
 */
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}


module.exports = {
  info, error
}