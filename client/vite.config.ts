import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
    react(),
    {
      name: 'supabase-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            try {
              // Dynamically load the API handler module
              const apiModule = await server.ssrLoadModule(
                path.resolve(__dirname, '../api/index.js')
              )
              const apiHandler = apiModule.default

              // Polyfill Express/Vercel response methods if missing
              if (!res.status) {
                res.status = function (code: number) {
                  res.statusCode = code
                  return res
                }
              }
              if (!res.json) {
                res.json = function (data: any) {
                  if (!res.headersSent) {
                    res.setHeader('Content-Type', 'application/json')
                  }
                  res.end(JSON.stringify(data))
                  return res
                }
              }
              if (!res.send) {
                res.send = function (data: any) {
                  if (!res.headersSent) {
                    res.setHeader('Content-Type', 'text/plain')
                  }
                  res.end(typeof data === 'object' ? JSON.stringify(data) : data)
                  return res
                }
              }

              // Read request body
              const bodyChunks: any[] = []
              req.on('data', (chunk) => bodyChunks.push(chunk))
              req.on('end', async () => {
                const rawBody = Buffer.concat(bodyChunks).toString()
                if (rawBody) {
                  try {
                    ;(req as any).body = JSON.parse(rawBody)
                  } catch (e) {
                    ;(req as any).body = rawBody
                  }
                } else {
                  ;(req as any).body = ''
                }
                try {
                  await apiHandler(req, res)
                } catch (err: any) {
                  console.error('API Error in dev middleware:', err)
                  res
                    .status(500)
                    .json({ success: false, message: err.message || 'Internal Server Error' })
                }
              })
            } catch (err) {
              console.error('Failed to load API module:', err)
              next()
            }
          } else {
            next()
          }
        })
      },
    },
  ],
  }
})

