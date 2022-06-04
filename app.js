const express = require('express')
const { urlencoded, json } = require('body-parser')
const questionRouter = require('./routers/question')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = process.env.FILE

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.use(questionRouter)

module.exports = app
