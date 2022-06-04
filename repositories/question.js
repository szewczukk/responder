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
      throw new Error('Question not found')
    }

    return question
  }

  const addQuestion = async data => {
    const questions = await getQuestions()

    const id = uuid.v4()
    const question = { id, ...data, answers: [] }

    data.answers.forEach(answer => {
      question.answers.push({ id: uuid.v4(), ...answer })
    })

    questions.push(question)
    await writeFile(fileName, JSON.stringify(questions))

    return question
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)

    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
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

    questions.find(question => question.id === questionId).answers.push(answer)
    await writeFile(fileName, JSON.stringify(questions))

    return answer
  }

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
