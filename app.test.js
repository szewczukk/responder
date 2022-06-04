const { writeFile, rm } = require('fs/promises')
const request = require('supertest')
const { faker } = require('@faker-js/faker')
const app = require('./app')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = process.env.FILE

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    const result = await request(app).get('/')

    expect(result.body.message).toBe('Welcome to responder!')
  })

  test('should return an empty list', async () => {
    const result = await request(app).get('/questions')

    expect(result.body).toStrictEqual([])
  })

  test('should return an array', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: testId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get('/questions')

    expect(result.body).toStrictEqual(testQuestions)
  })

  test('should return the question', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: testId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(`/questions/${testId}`)

    expect(result.body).toStrictEqual(testQuestions[0])
  })

  test('should return 404', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = []

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(`/questions/${testId}`)

    expect(result.status).toBe(404)
  })

  test('should return created element (without answer)', async () => {
    const testQuestions = []
    const question = {
      author: 'John Doe',
      summary: 'What is my name?'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).post(`/questions`).send(question)

    expect(result.body.author).toBe(question.author)
    expect(result.body.summary).toBe(question.summary)
    expect(result.body).toHaveProperty('id')
  })

  test('should return created element (with answer)', async () => {
    const testQuestions = []
    const question = {
      author: 'John Doe',
      summary: 'What is my name?',
      answers: [{ author: 'Jane Doe', summary: 'Joe' }]
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).post(`/questions`).send(question)

    expect(result.body.author).toBe(question.author)
    expect(result.body.summary).toBe(question.summary)
    expect(result.body).toHaveProperty('id')
    expect(result.body.answers).toHaveLength(1)
    expect(result.body.answers[0]).toHaveProperty('id')
    expect(result.body.answers[0].author).toBe(question.answers[0].author)
    expect(result.body.answers[0].summary).toBe(question.answers[0].summary)
  })

  test('should return error', async () => {
    const testQuestions = []
    const question = {
      author: 'John Doe'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).post(`/questions`).send(question)

    expect(result.status).toBe(400)
    expect(result.body.error).toBe('"summary" is required')
  })

  test('should return error', async () => {
    const testQuestions = []
    const question = {
      summary: 'What is my name?'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).post(`/questions`).send(question)

    expect(result.status).toBe(400)
    expect(result.body.error).toBe('"author" is required')
  })

  test('should return error', async () => {
    const testQuestions = []
    const question = {
      author: 'John Doe',
      summary: 'What is my name'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).post(`/questions`).send(question)

    expect(result.status).toBe(400)
    expect(result.body.error).toBe(
      `"summary" with value "${question.summary}" fails to match the required pattern: /[?]$/`
    )
  })

  test('should return the array', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: testId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: faker.datatype.uuid(),
            author: 'John Doe',
            summary: 'Jack'
          },

          {
            id: faker.datatype.uuid(),
            author: 'Jane Doe',
            summary: 'Jack'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(`/questions/${testId}/answers`)

    expect(result.body).toStrictEqual(testQuestions[0].answers)
  })

  test('should return empty array', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: testId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(`/questions/${testId}/answers`)

    expect(result.body).toStrictEqual(testQuestions[0].answers)
  })

  test('should return empty array', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = []

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(`/questions/${testId}/answers`)

    expect(result.status).toBe(404)
  })

  test('should return created answer', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: testId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]
    const testAnswer = {
      author: 'John Doe',
      summary: 'Jack'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app)
      .post(`/questions/${testId}/answers`)
      .send(testAnswer)

    expect(result.status).toBe(200)
    expect(result.body).toHaveProperty('id')
    expect(result.body.author).toBe(testAnswer.author)
    expect(result.body.summary).toBe(testAnswer.summary)
  })

  test('should return 404', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = []
    const testAnswer = {
      author: 'John Doe',
      summary: 'Jack'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app)
      .post(`/questions/${testId}/answers`)
      .send(testAnswer)

    expect(result.status).toBe(404)
  })

  test('should return validation error', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = []
    const testAnswer = {
      author: 'John Doe'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app)
      .post(`/questions/${testId}/answers`)
      .send(testAnswer)

    expect(result.status).toBe(400)
  })

  test('should return validation error', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = []
    const testAnswer = {
      summary: 'John'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app)
      .post(`/questions/${testId}/answers`)
      .send(testAnswer)

    expect(result.status).toBe(400)
  })

  test('should return the answer', async () => {
    const questionTestId = faker.datatype.uuid()
    const answerTestId = faker.datatype.uuid()

    const testQuestions = [
      {
        id: questionTestId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [{ id: answerTestId, author: 'John Doe', summary: 'Jack' }]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(
      `/questions/${questionTestId}/answers/${answerTestId}`
    )

    expect(result.status).toBe(200)
    expect(result.body).toStrictEqual(testQuestions[0].answers[0])
  })

  test('should return 404 (answer not found)', async () => {
    const questionTestId = faker.datatype.uuid()
    const answerTestId = faker.datatype.uuid()

    const testQuestions = [
      {
        id: questionTestId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(
      `/questions/${questionTestId}/answers/${answerTestId}`
    )

    expect(result.status).toBe(404)
    expect(result.body.error).toBe('Answer not found')
  })

  test('should return 404 (answer not found)', async () => {
    const questionTestId = faker.datatype.uuid()
    const answerTestId = faker.datatype.uuid()

    const testQuestions = []

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const result = await request(app).get(
      `/questions/${questionTestId}/answers/${answerTestId}`
    )

    expect(result.status).toBe(404)
    expect(result.body.error).toBe('Question not found')
  })
})
