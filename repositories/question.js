const { readFile } = require('fs/promises')

const readQuestionsFile = async fileName => {
  const fileContent = await readFile(fileName, { encoding: 'utf-8' })
  const questions = JSON.parse(fileContent)

  return questions
}

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const questions = await readQuestionsFile(fileName)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await readQuestionsFile(fileName)

    const question = questions.find(question => question.id === questionId)
    if (!question) {
      throw new Error('Question not found')
    }

    return question
  }
  const addQuestion = async question => {}
  const getAnswers = async questionId => {}
  const getAnswer = async (questionId, answerId) => {}
  const addAnswer = async (questionId, answer) => {}

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
