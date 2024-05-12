import ReactFlow, { Controls, Background, BackgroundVariant } from 'reactflow'
import 'reactflow/dist/style.css'

function Flow() {
  return (
    <>
      <ReactFlow>
        <Background color='red' variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </>
  )
}

export default Flow
