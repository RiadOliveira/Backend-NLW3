import express from 'express'

import './database/connection'

const app = express()

app.use(express.json())
app.listen(3000)

app.get('/', (req, res) => {

    return res.json({message: 'Hello World'})
})