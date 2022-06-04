const express = require('express')
const { urlencoded, json } = require('body-parser')
const { ValidationError } = require('joi')
const { answerSchema, questionSchema } = require('./schemas/question')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params

    const question = await req.repositories.questionRepo.getQuestionById(
      questionId
    )

    res.json(question)
  } catch (e) {
    res.status(404).json({ error: e.message })
  }
})

app.post('/questions', async (req, res) => {
  try {
    const data = await questionSchema.validateAsync(req.body)

    const question = await req.repositories.questionRepo.addQuestion(data)

    res.json(question)
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json({ error: e.message })
      return
    }
    res.status(500).json({ error: e.message })
  }
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params

  const questions = await req.repositories.questionRepo.getAnswers(questionId)

  res.json(questions)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params
    const data = await answerSchema.validateAsync(req.body)

    const answer = await req.repositories.questionRepo.addAnswer(
      questionId,
      data
    )

    res.json(answer)
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json({ error: e.message })
      return
    }
    res.status(500).json({ error: e.message })
  }
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const { questionId, answerId } = req.params

  const question = await req.repositories.questionRepo.getAnswerById(
    questionId,
    answerId
  )

  res.json(question)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
