const { makeAnswerRepository } = require('../repositories/answer')
const { makeQuestionRepository } = require('../repositories/question')

module.exports = fileName => (req, res, next) => {
  req.repositories = {
    questionRepo: makeQuestionRepository(fileName),
    answerRepo: makeAnswerRepository(fileName)
  }
  next()
}
