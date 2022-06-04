const { readFile, writeFile } = require('fs/promises')
const uuid = require('uuid')

const readQuestion = async (fileName, questionId) => {
  const fileContent = await readFile(fileName, { encoding: 'utf-8' })
  const questions = JSON.parse(fileContent)

  return questions.find(question => question.id === questionId)
}

const makeAnswerRepository = fileName => {
  const getAnswers = async questionId => {
    const question = await readQuestion(fileName, questionId)

    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const question = await readQuestion(fileName, questionId)

    const answer = question.answers.find(answer => answer.id === answerId)

    if (!answer) {
      return null
    }

    return answer
  }

  const addAnswer = async (questionId, answer) => {}

  return {
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeAnswerRepository }