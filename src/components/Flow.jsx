import { useCallback, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'

import 'reactflow/dist/style.css'

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
//   { id: '3', position: { x: 100, y: 100 }, data: { label: '3' } },
// ]
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

const initialNodes = []
const initialEdges = []

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [path, setPath] = useState([])

  const onConnect = useCallback(
    (params) => {
      console.log(params)
      return setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  // État pour gérer les valeurs du formulaire
  const [formValues, setFormValues] = useState({
    label: '',
    id: '',
    source: '',
    target: '',
    values: '',
    weight: '',
  })
  const [formPath, setFormPath] = useState({
    server_name: '',
    target_value: '',
  })

  // Fonctions pour interagir avec l'API
  const addNodeToApi = async (label, values) => {
    console.log('api', { node_name: label, values: values })
    const response = await fetch('http://localhost:5000/add_node', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ node_name: label, values: values }),
    })
    const data = await response.json()
    console.log(data)
  }

  const deleteNodeFromApi = async (id) => {
    const response = await fetch(`http://localhost:5000/remove_node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ node_name: id }),
    })
    const data = await response.json()
    console.log(data)
  }

  const addEdgeToApi = async (source, target, weight) => {
    const response = await fetch('http://localhost:5000/add_edge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ node1: source, node2: target, weight: weight }),
    })
    const data = await response.json()
    console.log(data)
  }

  const deleteEdgeFromApi = async (id) => {
    const response = await fetch(`http://localhost:5000/remove_edge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        node1: id.split('-')[0],
        node2: id.split('-')[1],
      }),
    })
    const data = await response.json()
    console.log(data)
  }

  // Gestionnaires de formulaire
  const handleAddNode = () => {
    addNodeToApi(formValues.label, formValues.values)
    setNodes((nds) =>
      nds.concat({
        id: (nodes.length + 1).toString(),
        position: {
          x: (100 * nodes.length) % 500,
          y: (100 * nodes.length) % 300,
        },
        data: { label: formValues.label },
        width: 0,
        height: 0,
      })
    )
    setFormValues({
      label: '',
      id: '',
      source: '',
      target: '',
      values: '',
      weight: '',
    })
  }

  const getNodeToApi = async () => {
    const response = await fetch('http://localhost:5000/nodes', {
      method: 'GET',
    })
    const data = await response.json()
    console.log(data)
  }

  const handleGetNode = () => {
    getNodeToApi()
  }

  const getPathToApi = async (server_name, target_value) => {
    const response = await fetch('http://localhost:5000/find_path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        server_name: server_name,
        target_value: target_value,
      }),
    })
    const data = await response.json()
    console.log(data)
  }

  const handleFindPath = () => {
    getPathToApi(formPath.server_name, formPath.target_value)
  }

  const handleDeleteNode = () => {
    let id = formValues.id
    deleteNodeFromApi(formValues.id)
    setNodes((nds) => nds.filter((node) => node.id !== id))
    setFormValues({
      label: '',
      id: '',
      source: '',
      target: '',
      values: '',
      weight: '',
    })
  }

  const handleAddEdge = () => {
    addEdgeToApi(formValues.source, formValues.target, formValues.weight)
    setEdges((eds) =>
      eds.concat({
        id: 'e' + formValues.source + '-' + formValues.target,
        source: formValues.source,
        target: formValues.target,
        label: formValues.weight,
      })
    )
    setFormValues({
      label: '',
      id: '',
      source: '',
      target: '',
      values: '',
      weight: '',
    })
  }

  const handleDeleteEdge = () => {
    deleteEdgeFromApi(formValues.id)
    setEdges((eds) => eds.filter((edge) => edge.id !== formValues.id))
    setFormValues({
      label: '',
      id: '',
      source: '',
      target: '',
      values: '',
      weight: '',
    })
  }

  // console.log(nodes)
  // console.log(edges)

  return (
    <div className='flex h-screen flex-column item-center justify-center bg-red'>
      {/* Formulaire pour ajouter, supprimer et modifier les nœuds et les arêtes */}
      <div
        className='w-full border-r border-gray-300 p-5 bg-blue-500'
        style={{ height: '20vh' }}
      >
        {/* Ajouter un nœud */}
        <div className='mb-4'>
          <input
            type='text'
            value={formValues.label}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                label: e.target.value,
                values: formValues.values,
              })
            }
            placeholder='Label'
            className='w-full border border-gray-300 p-2 mb-2 rounded'
          />
          <input
            type='text'
            value={formValues.values}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                values: e.target.value,
                label: formValues.label,
              })
            }
            placeholder='Values'
            className='w-full border border-gray-300 p-2 mb-2 rounded'
          />
          <button
            onClick={handleAddNode}
            className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
          >
            Ajouter un nœud
          </button>
        </div>
        {/* Supprimer un nœud */}
        <div className='mb-4'>
          <input
            type='text'
            value={formValues.id}
            onChange={(e) =>
              setFormValues({ ...formValues, id: e.target.value })
            }
            placeholder='id'
            className='w-full border border-gray-300 p-2 mb-2 rounded'
          />
          <button
            onClick={handleDeleteNode}
            className='bg-red-500 text-white px-4 py-2 rounded mt-2'
          >
            Supprimer un nœud
          </button>
        </div>
        {/* Ajouter une arête */}
        <div className='mb-4'>
          <input
            type='text'
            value={formValues.source}
            onChange={(e) =>
              setFormValues({ ...formValues, source: e.target.value })
            }
            placeholder='Source'
            className='w-full border border-gray-300 p-2 mb-2 rounded'
          />
          <input
            type='text'
            value={formValues.target}
            onChange={(e) =>
              setFormValues({ ...formValues, target: e.target.value })
            }
            placeholder='Target'
            className='w-full border border-gray-300 p-2 mb-2 rounded mt-2'
          />
          <input
            type='text'
            value={formValues.weight}
            onChange={(e) =>
              setFormValues({ ...formValues, weight: e.target.value })
            }
            placeholder='Weight'
            className='w-full border border-gray-300 p-2 mb-2 rounded mt-2'
          />
          <button
            onClick={handleAddEdge}
            className='bg-green-500 text-white px-4 py-2 rounded mt-2'
          >
            Ajouter une arête
          </button>
        </div>
        {/* Supprimer une arête */}
        <div className='mb-4'>
          <input
            type='text'
            value={formValues.id}
            onChange={(e) =>
              setFormValues({ ...formValues, id: e.target.value })
            }
            placeholder='id'
            className='w-full border border-gray-300 p-2 mb-2 rounded'
          />
          <button
            onClick={handleDeleteEdge}
            className='bg-red-500 text-white px-4 py-2 rounded mt-2'
          >
            Supprimer une arête
          </button>
        </div>
        {/* get node */}
        <div className='mb-4'>
          <button
            onClick={handleGetNode}
            className='bg-red-500 text-white px-4 py-2 rounded mt-2'
          >
            get all nodes
          </button>
        </div>
        {/* findpath */}
        <div className='mb-4'>
          <input
            type='text'
            value={formPath.server_name}
            onChange={(e) =>
              setFormPath({
                ...formPath,
                server_name: e.target.value,
              })
            }
            placeholder='source'
            className='w-full border border-gray-300 p-2 mb-2 rounded'
          />
          <input
            type='text'
            value={formPath.target_value}
            onChange={(e) =>
              setFormPath({
                ...formPath,
                target_value: e.target.value,
              })
            }
            placeholder='target domain'
            className='w-full border border-gray-300 p-2 mb-2 rounded'
          />
          <button
            onClick={handleFindPath}
            className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
          >
            simulate
          </button>
        </div>
      </div>

      {/* Zone de visualisation de ReactFlow */}
      <div className='main-app'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant='dots' gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}
