import { defineConfig } from 'vite'
import { spawn, type ChildProcessWithoutNullStreams } from 'child_process'
import fs from 'fs'
import net from 'net'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


const apiHost = '127.0.0.1'
const apiPort = 8000
const laragonPhp = 'C:\\laragon\\bin\\php\\php-8.3.30-Win32-vs16-x64\\php.exe'

function isPortOpen(host: string, port: number) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port })

    socket.setTimeout(500)
    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.on('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.on('error', () => {
      resolve(false)
    })
  })
}

function phpApiDevServer() {
  let apiProcess: ChildProcessWithoutNullStreams | null = null

  return {
    name: 'php-api-dev-server',
    async configureServer(server) {
      if (process.env.HRIS_SKIP_API_AUTO_START === '1') {
        console.info('[php-api] Auto-start disabled by HRIS_SKIP_API_AUTO_START=1.')
        return
      }

      const apiIsRunning = await isPortOpen(apiHost, apiPort)

      if (apiIsRunning) {
        console.info(`[php-api] Reusing existing API server at http://${apiHost}:${apiPort}.`)
        return
      }

      const phpBinary = fs.existsSync(laragonPhp) ? laragonPhp : 'php'

      apiProcess = spawn(phpBinary, ['-S', `${apiHost}:${apiPort}`, '-t', 'backend'], {
        cwd: __dirname,
        stdio: 'inherit',
        windowsHide: true,
      })

      console.info(`[php-api] Started API server at http://${apiHost}:${apiPort}.`)

      apiProcess.on('error', (error) => {
        console.error(`[php-api] Failed to start PHP API server: ${error.message}`)
      })

      apiProcess.on('exit', (code) => {
        if (code !== null && code !== 0) {
          console.error(`[php-api] API server exited with code ${code}.`)
        }
        apiProcess = null
      })

      server.httpServer?.once('close', () => {
        if (apiProcess && !apiProcess.killed) {
          apiProcess.kill()
        }
      })
    },
  }
}

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    phpApiDevServer(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: `http://${apiHost}:${apiPort}`,
        changeOrigin: true,
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
