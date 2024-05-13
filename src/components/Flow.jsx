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
    setNodes((nds) => nds.concat({...formValues, position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }, id: nodes.length + 1, data: { label: formValues.label } }));
    setFormValues({ label: '', id: ''});
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
    setEdges((eds) => eds.concat({...formValues, id: 'e' + formValues.source + '-' + formValues.target, source: formValues.source, target: formValues.target }));
    setFormValues({ id: '', source: '', target: '' });
  };

  // Fonction pour supprimer une arête
  const handleDeleteEdge = (id) => {
    setEdges((eds) => eds.filter((edge) => edge.id!== id));
  };

  console.log(nodes)
  console.log(edges);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Formulaire pour ajouter, supprimer et modifier les nœuds et les arêtes */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '20px' }}>
        <input type="text" value={formValues.label} onChange={(e) => setFormValues({...formValues, label: e.target.value })} placeholder="Label" />
        <button onClick={handleAddNode}>Ajouter un nœud</button>
        <input type="text" value={formValues.id} onChange={(e) => setFormValues({...formValues, id: e.target.value })} placeholder="id" />
        <button onClick={() => handleDeleteNode(formValues.id)}>Supprimer un nœud</button>
        <input type="text" value={formValues.source} onChange={(e) => setFormValues({...formValues, source: e.target.value })} placeholder="Source" />
        <input type="text" value={formValues.target} onChange={(e) => setFormValues({...formValues, target: e.target.value })} placeholder="Target" />
        <button onClick={handleAddEdge}>Ajouter une arête</button>
        <input type="text" value={formValues.id} onChange={(e) => setFormValues({...formValues, id: e.target.value })} placeholder="id" />
        <button onClick={() => handleDeleteEdge(formValues.id)}>Supprimer une arête</button>
      </div>

      {/* Zone de visualisation de ReactFlow */}
      <div style={{ flex: 1, overflow: 'auto' }}>
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
