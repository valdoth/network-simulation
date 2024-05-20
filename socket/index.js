import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const server = http.createServer(app)

app.use(cors)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`)
// })

io.on('connection', (socket) => {
  console.log('Nouvelle connexion socket')

  socket.on('message', (data) => {
    console.log(`Message reçu pour le nœud ${data.node}: ${data.fileData}`)
    // Vous pouvez traiter le message ici selon vos besoins
    // Pour l'exemple, nous allons simplement renvoyer le message
    io.emit('message', {
      node: data.node,
      message: `Message reçu pour le nœud ${data.node}: ${data.fileData}`,
    })
  })

  socket.on('file', (data) => {
    console.log('Fichier reçu:', data)
    // Vous pouvez traiter le fichier reçu ici
    // Par exemple, vous pouvez le diffuser à tous les autres clients connectés
    io.emit('file', data)
  })

  socket.on('disconnect', () => {
    console.log('Déconnexion socket')
  })
})

server.listen(3000, () => {
  console.log('Server is running')
})
