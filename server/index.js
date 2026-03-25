import { createApp } from './app.js'
import { assertServerEnv, env } from './config/env.js'

assertServerEnv()

const app = createApp()

app.listen(env.port, () => {
  console.log(`Nara Premium backend running on http://localhost:${env.port}`)
})
