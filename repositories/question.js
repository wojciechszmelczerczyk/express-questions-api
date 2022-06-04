const { readFile, writeFile } = require('fs/promises')

// uuid regex for validation purposes
const uuidReg = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
)

const makeQuestionRepository = fileName => {
  // read json database and parse to object
  const getDatabase = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    return JSON.parse(fileContent)
  }

  // modify json database
  const updateDatabase = async content => {
    return await writeFile(fileName, JSON.stringify(content), {
      encoding: 'utf-8'
    })
  }

  const getQuestions = async () => await getDatabase()

  const getQuestionById = async questionId => {
    try {
      // validate if id match uuid pattern
      if (questionId.match(uuidReg)) {
        const questions = await getDatabase()

        const question = questions.find(q => q.id === questionId)

        if (question === undefined) {
          throw new Error("question with this id doesn't exist")
        }

        return question
      } else {
        throw new Error("id doesn't match uuidv4 pattern")
      }
    } catch (err) {
      return {
        fail: true,
        err: err.message
      }
    }
  }

  const addQuestion = async question => {
    try {
      let { summary, author } = question

      if (typeof summary === 'string' && typeof author === 'string') {
        const questions = await getDatabase()

        // check if question with such title already exist
        const sameQuestion = questions.find(q => q.summary === question.summary)

        // if not proceed
        if (sameQuestion === undefined) {
          // add new question
          questions.push(question)

          // write modified question list to file
          await updateDatabase(questions)

          return questions

          // otherwise return error
        } else {
          throw new Error('This question already exist')
        }
      } else {
        throw new Error(
          'Inappropriate question provided. Author and title has to be string value'
        )
      }
    } catch (err) {
      return {
        fail: true,
        err: err.message
      }
    }
  }

  const getAnswers = async questionId => {
    try {
      if (questionId.match(uuidReg)) {
        const questions = await getDatabase()

        const question = questions.find(q => q.id === questionId)

        if (question === undefined) {
          throw new Error("question with such id doesn't exist")
        }

        const { answers } = question

        return answers
      } else {
        throw new Error("id doesn't match uuidv4 pattern")
      }
    } catch (err) {
      return {
        fail: true,
        err: err.message
      }
    }
  }

  const getAnswer = async (questionId, answerId) => {
    try {
      if (questionId.match(uuidReg) && answerId.match(uuidReg)) {
        // get questions
        const questions = await getDatabase()

        // find question with provided id
        const question = questions.find(q => q.id === questionId)

        // if question doesn't exist, return error
        if (question === undefined) {
          throw new Error("question with such id doesn't exist")
        }

        // find answer with provided id
        const answer = question.answers.find(a => a.id === answerId)

        // if answer doesn't exist, return error
        if (answer === undefined) {
          throw new Error("answer with such id doesn't exist")
        }

        return answer
      } else {
        throw new Error("Provided id's have doesn't match uuidv4 pattern")
      }
    } catch (err) {
      return {
        fail: true,
        err: err.message
      }
    }
  }

  const addAnswer = async (questionId, answer) => {
    try {
      const { author, summary } = answer
      // validate if id match uuidv4 pattern
      if (questionId.match(uuidReg)) {
        // get questions database
        const questions = await getDatabase()

        // find question by provided id
        const question = questions.find(q => q.id === questionId)

        // if question with provided id doesn't exist, return error
        if (question === undefined)
          throw new Error("question with this id doesn't exist")

        // get answers list
        const { answers } = question

        // if answer properties aren't string values, return error
        if (typeof author !== 'string' && typeof summary !== 'string') {
          throw new Error(
            'Author and title of question have to be string value'
          )
        }

        // check if user already answered the question
        const duplicateAnswer = answers.find(a => a.author === author)

        // if not, proceed
        if (duplicateAnswer === undefined) {
          answers.push(answer)

          await updateDatabase(questions)

          return question
          // otherwise return error
        } else {
          throw new Error('User cannot answer the same question more than once')
        }
      } else {
        throw new Error("id doesn't match uuidv4 pattern")
      }
    } catch (err) {
      return {
        fail: true,
        err: err.message
      }
    }
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
