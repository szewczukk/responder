const { Router } = require('express')
const { ValidationError } = require('joi')
const { answerSchema, questionSchema } = require('../schemas/question')

const router = Router()

/**
 * @openapi
 * /:
 *   get:
 *     description: Prints simple welcoming
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

/**
 * @openapi
 * /questions:
 *   get:
 *     description: Returns all questions in the database
 *     responses:
 *       200:
 *         description: Returns all questions in the database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionArray'
 */
router.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

/**
 * @openapi
 * /questions/{questionId}:
 *   get:
 *     description: Returns all questions in the database
 *     parameters:
 *       - $ref: "#/components/parameters/questionId"
 *     responses:
 *       200:
 *         description: Returns the question with given id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *          $ref: "#/components/responses/404"
 */
router.get('/questions/:questionId', async (req, res) => {
  const { questionId } = req.params

  const question = await req.repositories.questionRepo.getQuestionById(
    questionId
  )

  if (!question) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json(question)
})

/**
 * @openapi
 * /questions:
 *   post:
 *     description: Writes the given question into database and returns it
 *     requestBody:
 *       $ref: "#/components/requestBodies/addQuestion"
 *     responses:
 *       200:
 *         description: Returns the stored question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *          $ref: "#/components/responses/400"
 *       500:
 *          $ref: "#/components/responses/500"
 */
router.post('/questions', async (req, res) => {
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

/**
 * @openapi
 * /questions/{questionId}/answers:
 *   get:
 *     description: Returns all answers to the given question
 *     parameters:
 *       - $ref: "#/components/parameters/questionId"
 *     responses:
 *       200:
 *         description: Returns the stored question's answers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswerArray'
 *       404:
 *          $ref: "#/components/responses/404"
 *       500:
 *          $ref: "#/components/responses/500"
 *   post:
 *     description: Stores given answer and returns it
 *     requestBody:
 *       $ref: "#/components/requestBodies/addAnswer"
 *     parameters:
 *       $ref: "#/components/parameters/questionId"
 *     responses:
 *       200:
 *         description: Returns the stored answer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       404:
 *          $ref: "#/components/responses/404"
 */
router.get('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params

  const questions = await req.repositories.questionRepo.getAnswers(questionId)

  if (questions === null) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.json(questions)
})

router.post('/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params
    const data = await answerSchema.validateAsync(req.body)

    const answer = await req.repositories.questionRepo.addAnswer(
      questionId,
      data
    )

    if (!answer) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    res.json(answer)
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json({ error: e.message })
      return
    }
    res.status(500).json({ error: e.message })
  }
})

/**
 * @openapi
 * /questions/{questionId}/answers/{answerId}:
 *   get:
 *     description: Returns all questions in the database
 *     parameters:
 *       - $ref: "#/components/parameters/questionId"
 *       - $ref: "#/components/parameters/answerId"
 *     responses:
 *       200:
 *         description: Returns the question with given id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       404:
 *          $ref: "#/components/responses/404"
 */
router.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const { questionId, answerId } = req.params

  const question = await req.repositories.questionRepo.getQuestionById(
    questionId
  )

  if (!question) {
    res.status(404).json({ error: 'Question not found' })
    return
  }

  const answer = await req.repositories.questionRepo.getAnswerById(
    questionId,
    answerId
  )

  if (!answer) {
    res.status(404).json({ error: 'Answer not found' })
    return
  }

  res.json(answer)
})

module.exports = router
