const express = require('express')
const { urlencoded, json } = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const questionRouter = require('./routers/question')
const makeRepositories = require('./middleware/repositories')
const options = require('./openapi.json')

const STORAGE_FILE_PATH = process.env.FILE

const openapiSpecification = swaggerJsdoc(options)

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use(questionRouter)

module.exports = app
