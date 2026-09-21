import express from 'express'
import localDeVotacaoRouter from './local_de_votacao/localDeVotacaoRouter.js'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3000 

app.get('/', (req, res) => {
  res.send('Olá Mundo!')
})

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`)
})

app.use('/local', localDeVotacaoRouter)


export default app 
