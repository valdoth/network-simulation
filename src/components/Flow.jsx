import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 100, y: 100 }, data: { label: '3' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // État pour gérer les valeurs du formulaire
  const [formValues, setFormValues] = useState({ label: '', id: '', source: '', target: '' });

  // Fonction pour ajouter un nœud
  const handleAddNode = () => {
    setNodes((nds) => nds.concat({ id: (nodes.length + 1).toString(), position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }, data: { label: formValues.label }, width: 0, height: 0 }));
    setFormValues({ label: '', id: '', source: '', target: '' });
  };

  // Fonction pour supprimer un nœud
  const handleDeleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id!== id));
  };

  // Fonction pour modifier un nœud
  const handleUpdateNode = (id, newLabel) => {
    setNodes((nds) => nds.map((node) => (node.id === id? {...node, data: { label: newLabel } } : node)));
  };

  // Fonction pour ajouter une arête
  const handleAddEdge = () => {
    setEdges((eds) => eds.concat({ id: 'e' + formValues.source + '-' + formValues.target, source: formValues.source, target: formValues.target }));
    setFormValues({ label: '', id: '', source: '', target: '' });
  };

  // Fonction pour supprimer une arête
  const handleDeleteEdge = (id) => {
    setEdges((eds) => eds.filter((edge) => edge.id!== id));
  };

  console.log(nodes)
  console.log(edges);

  return (
    <div className="flex h-screen flex-column item-center justify-center bg-red">
      {/* Formulaire pour ajouter, supprimer et modifier les nœuds et les arêtes */}
      <div className="w-full border-r border-gray-300 p-5 bg-blue-500" style={{height: '20vh'}}>
        {/* Ajouter un nœud */}
        <div className="mb-4">
          <input type="text" value={formValues.label} onChange={(e) => setFormValues({...formValues, label: e.target.value })} placeholder="Label" className="w-full border border-gray-300 p-2 mb-2 rounded" />
          <button onClick={handleAddNode} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Ajouter un nœud</button>
        </div>
        {/* Supprimer un nœud */}
        <div className="mb-4">
          <input type="text" value={formValues.id} onChange={(e) => setFormValues({...formValues, id: e.target.value })} placeholder="id" className="w-full border border-gray-300 p-2 mb-2 rounded" />
          <button onClick={() => handleDeleteNode(formValues.id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Supprimer un nœud</button>
        </div>
        {/* Ajouter une arête */}
        <div className="mb-4">
          <input type="text" value={formValues.source} onChange={(e) => setFormValues({...formValues, source: e.target.value })} placeholder="Source" className="w-full border border-gray-300 p-2 mb-2 rounded" />
          <input type="text" value={formValues.target} onChange={(e) => setFormValues({...formValues, target: e.target.value })} placeholder="Target" className="w-full border border-gray-300 p-2 mb-2 rounded mt-2" />
          <button onClick={handleAddEdge} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Ajouter une arête</button>
        </div>
        {/* Supprimer une arête */}
        <div className="mb-4">
          <input type="text" value={formValues.id} onChange={(e) => setFormValues({...formValues, id: e.target.value })} placeholder="id" className="w-full border border-gray-300 p-2 mb-2 rounded" />
          <button onClick={() => handleDeleteEdge(formValues.id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Supprimer une arête</button>
        </div>
      </div>
  
      {/* Zone de visualisation de ReactFlow */}
      <div className="main-app">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
  
}
