const { ValidationError } = require('joi')
const { questionSchema } = require('./question')

describe('question schema', () => {
  test('should return itself (correct data) without answers', async () => {
    const data = { author: 'John Doe', summary: 'Why?' }

    const result = await questionSchema.validateAsync(data)

    expect(result).toStrictEqual(data)
  })

  test('should return itself (correct data) with answers', async () => {
    const data = {
      author: 'John Doe',
      summary: 'Why?',
      answers: [{ author: 'John Doe', summary: 'Because.' }]
    }

    const result = await questionSchema.validateAsync(data)

    expect(result).toStrictEqual(data)
  })

  test('should throw error ("author" is required)', async () => {
    const data = { summary: 'Why?' }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"author" is required')
    }
  })

  test('should throw error ("author" shouldn\'t be empty)', async () => {
    const data = { author: '', summary: 'Why?' }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"author" is not allowed to be empty')
    }
  })

  test('should throw error ("summary" is required)', async () => {
    const data = { author: 'John Doe' }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"summary" is required')
    }
  })

  test('should throw error ("summary" should follow pattern)', async () => {
    const data = { author: 'John Doe', summary: 'Why' }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe(
        '"summary" with value "Why" fails to match the required pattern: /[?]$/'
      )
    }
  })

  test('should throw error ("summary" shouldn\'t be empty)', async () => {
    const data = { author: 'John Doe', summary: '' }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"summary" is not allowed to be empty')
    }
  })

  test('should throw error (answers.author is required)', async () => {
    const data = {
      author: 'John Doe',
      summary: 'Why?',
      answers: [{ summary: 'Because.' }]
    }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"answers[0].author" is required')
    }
  })

  test("should throw error (answers.author shouldn't be empty)", async () => {
    const data = {
      author: 'John Doe',
      summary: 'Why?',
      answers: [{ author: '', summary: 'Because.' }]
    }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"answers[0].author" is not allowed to be empty')
    }
  })

  test('should throw error (answers.summary is required)', async () => {
    const data = {
      author: 'John Doe',
      summary: 'Why?',
      answers: [{ author: 'John Doe' }]
    }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"answers[0].summary" is required')
    }
  })

  test("should throw error (answers.summary shouldn't be empty)", async () => {
    const data = {
      author: 'John Doe',
      summary: 'Why?',
      answers: [{ author: 'John Doe', summary: '' }]
    }

    try {
      await questionSchema.validateAsync(data)
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError)
      expect(e.message).toBe('"answers[0].summary" is not allowed to be empty')
    }
  })
})
