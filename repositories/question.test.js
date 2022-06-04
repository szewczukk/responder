const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo, answerRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
    answerRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a question', async () => {
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

    expect(await questionRepo.getQuestionById(testId)).toStrictEqual(
      testQuestions[0]
    )
  })

  test('should return null', async () => {
    const testId = faker.datatype.uuid()

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    expect(await questionRepo.getQuestionById(testId)).toBeNull()
  })

  test('should create a new question (with answers)', async () => {
    const testQuestion = {
      summary: 'What is my name?',
      author: 'Jack London',
      answers: [{ author: 'John Doe', summary: 'Jack' }]
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    const result = await questionRepo.addQuestion(testQuestion)
    expect(result.summary).toBe(testQuestion.summary)
    expect(result.author).toBe(testQuestion.author)
    expect(result).toHaveProperty('id')
    expect(result.answers[0].summary).toBe(testQuestion.answers[0].summary)
    expect(result.answers[0].author).toBe(testQuestion.answers[0].author)
    expect(result.answers[0]).toHaveProperty('id')

    expect(await questionRepo.getQuestions()).toStrictEqual([result])
  })

  test('should create a new question (without answers)', async () => {
    const testQuestion = {
      summary: 'What is my name?',
      author: 'Jack London',
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    const result = await questionRepo.addQuestion(testQuestion)
    expect(result.summary).toBe(testQuestion.summary)
    expect(result.author).toBe(testQuestion.author)
    expect(result).toHaveProperty('id')
    expect(result.answers).toHaveLength(0)

    expect(await questionRepo.getQuestions()).toStrictEqual([result])
  })

  test('should return a list of 0 answers', async () => {
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

    expect(await answerRepo.getAnswers(testId)).toHaveLength(0)
  })

  test('should return a list of 2 answers', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: testId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: faker.datatype.uuid(),
            summary: 'Jack',
            author: 'John Doe'
          },
          {
            id: faker.datatype.uuid(),
            summary: 'Jack',
            author: 'Jack London'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await answerRepo.getAnswers(testId)).toHaveLength(2)
  })

  test('should return null', async () => {
    const testId = faker.datatype.uuid()
    const testQuestions = []

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await answerRepo.getAnswers(testId)).toBeNull()
  })

  test('should return an answer', async () => {
    const questionId = faker.datatype.uuid()
    const answerId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: questionId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: answerId,
            summary: 'Jack',
            author: 'John Doe'
          },
          {
            id: faker.datatype.uuid(),
            summary: 'Jack',
            author: 'Jack London'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await answerRepo.getAnswerById(questionId, answerId)).toStrictEqual(
      testQuestions[0].answers[0]
    )
  })

  test('should return null', async () => {
    const questionId = faker.datatype.uuid()
    const answerId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: questionId,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await answerRepo.getAnswerById(questionId, answerId)).toBeNull()
  })

  test('should return created element', async () => {
    const testQuestionId = faker.datatype.uuid()
    const testQuestions = [{
      id: testQuestionId,
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }];
    const testAnswer = {
      summary: "Jack",
      author: "John Doe"
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const result = await questionRepo.addAnswer(testQuestionId, testAnswer)
    expect(result.summary).toBe(testAnswer.summary)
    expect(result.author).toBe(testAnswer.author)
    expect(result).toHaveProperty('id')

    expect(await questionRepo.getAnswers(testQuestionId)).toStrictEqual([result])
  })

  test('should return null', async () => {
    const testQuestions = [{
      id: faker.datatype.uuid(),
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }];
    const testAnswer = {
      summary: "Jack",
      author: "John Doe"
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const result = await questionRepo.addAnswer(faker.datatype.uuid(), testAnswer)
    expect(result).toBeNull()
  })
})
