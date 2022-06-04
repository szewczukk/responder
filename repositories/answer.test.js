const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeAnswerRepository } = require('./answer')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let answerRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    answerRepo = makeAnswerRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
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
})
