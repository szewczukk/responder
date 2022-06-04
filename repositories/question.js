const { readFile, writeFile } = require('fs/promises')
const uuid = require('uuid')

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

  const addQuestion = async data => {
    const questions = await readQuestionsFile(fileName)

    const id = uuid.v4()
    const question = { id, ...data, answers: [] }

    data.answers.forEach(answer => {
      question.answers.push({ id: uuid.v4(), ...answer })
    })

    questions.push(question)
    await writeFile(fileName, JSON.stringify(questions))

    return question
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion
  }
}

module.exports = { makeQuestionRepository }
