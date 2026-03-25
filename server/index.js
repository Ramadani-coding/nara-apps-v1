import { createApp } from './app.js'
import { assertServerEnv, env } from './config/env.js'

assertServerEnv()

const app = createApp()

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Nara Premium backend running on port ${env.port}`)
})
