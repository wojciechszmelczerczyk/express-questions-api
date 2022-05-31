const { makeQuestionRepository } = require('../repositories/question')

module.exports = fileName => (req, res, next) => {
  req.repositories = { questionRepo: makeQuestionRepository(fileName) }
  next()
}
