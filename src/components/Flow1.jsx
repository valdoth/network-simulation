import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'

let initialNodes = []
let initialEdges = []

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [path, setPath] = useState([])

  initialEdges = edges
  initialNodes = nodes

  const onConnect = useCallback(
    (params) => {
      return setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

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

  const addNodeToApi = async (label, values) => {
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

  const handleAddNode = () => {
    addNodeToApi(formValues.label, formValues.values)
    let label = formValues.label
    setNodes((nds) =>
      nds.concat({
        // id: (nodes.length + 1).toString(),
        id: label,
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
    setPath(data.result)
  }

  const handleFindPath = () => {
    getPathToApi(formPath.server_name, formPath.target_value)
  }

  const handleDeleteNode = () => {
    let id = formValues.id
    setNodes((nds) => nds.filter((node) => node.id !== id))
    deleteNodeFromApi(formValues.id)
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
    // console.log('###########################')
    // setEdges((eds) =>
    //   eds.concat({
    //     id: 'reactflow__edge-' +  formValues.source + '-' + formValues.target,
    //     source: formValues.source,
    //     target: formValues.target,
    //     label: formValues.weight,
    //   })
    // )
    setEdges((prevEdges) => [
      ...prevEdges,
      {
        id: 'reactflow__edge-' + formValues.source + '-' + formValues.target,
        source: formValues.source,
        target: formValues.target,
        label: formValues.weight,
        type: 'smoothstep',
        style: {
          stroke: 'crimson',
          strokeWidth: '4',
        },
      },
    ])
    addEdgeToApi(formValues.source, formValues.target, formValues.weight)
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
    setEdges((eds) => eds.filter((edge) => edge.id !== formValues.id))
    deleteEdgeFromApi(formValues.id)
    setFormValues({
      label: '',
      id: '',
      source: '',
      target: '',
      values: '',
      weight: '',
    })
  }

  const getColor = (name) => {
    if (path.includes(name.data.label)) {
      return 'green'
    }
    return 'red'
  }

  const edgeAnimated = (edge) => {
    if (path.includes(edge.source) && path.includes(edge.target)) {
      return true
    }
    return false
  }

  useEffect(() => {
    console.log('Edges updated', edges)
  }, [edges])

  useEffect(() => {
    console.log('nodes updated', nodes)
  }, [nodes])

  // console.log('************************')
  // console.log(edges)
  // console.log('************************')
  // console.log(nodes)
  // console.log('************************')

  return (
    <div>
      <div
        className='w-full border-r border-gray-300 p-5 bg-blue-500'
        style={{ height: '20vh' }}
      >
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
        <div className='mb-4'>
          <button
            onClick={handleGetNode}
            className='bg-red-500 text-white px-4 py-2 rounded mt-2'
          >
            get all nodes
          </button>
        </div>
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

      <div className='main-app'>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            style: {
              background: getColor(node),
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            },
          }))}
          edges={edges.map((edge) => ({
            ...edge,
            animated: edgeAnimated(edge),
            style: {
              stroke: 'crimson',
              strokeWidth: '6',
            },
          }))}
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
