const { readFile, writeFile } = require('fs/promises')
const uuid = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()

    const question = questions.find(question => question.id === questionId)
    if (!question) {
      return null
    }

    return question
  }

  const addQuestion = async data => {
    const questions = await getQuestions()

    const id = uuid.v4()
    const question = { id, ...data, answers: [] }

    if (data.answers) {
      data.answers.forEach(answer => {
        question.answers.push({ id: uuid.v4(), ...answer })
      })
    }

    questions.push(question)
    await writeFile(fileName, JSON.stringify(questions))

    return question
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)

    if (!question) {
      return null;
    }

    return question.answers
  }

  const getAnswerById = async (questionId, answerId) => {
    const question = await getQuestionById(questionId)

    const answer = question.answers.find(answer => answer.id === answerId)

    if (!answer) {
      return null
    }

    return answer
  }

  const addAnswer = async (questionId, data) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    const answer = { id: uuid.v4(), ...data }

    const question = questions.find(question => question.id === questionId)
    if (!question) {
      return null;
    }

    question.answers.push(answer)

    await writeFile(fileName, JSON.stringify(questions))

    return answer
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswerById,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
