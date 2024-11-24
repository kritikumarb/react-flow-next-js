// @ts-nocheck
'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  addEdge,
  BackgroundVariant,
  Handle,
  Position,
} from 'reactflow';
import { useSearchParams } from 'next/navigation';
import 'reactflow/dist/style.css';

const CustomNode = ({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter' || evt.key === 'Escape') {
      setIsEditing(false);
      if (evt.key === 'Escape') {
        inputRef.current!.value = data.label;
      } else if (data.onLabelChange) {
        data.onLabelChange(id, inputRef.current!.value);
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onLabelChange) {
      data.onLabelChange(id, inputRef.current!.value);
    }
  };

  return (
    <div style={{ 
      padding: '10px', 
      border: '1px solid #1a192b',
      borderRadius: '3px',
      background: 'white',
      position: 'relative',
    }}>
      <Handle type="target" position={Position.Top} />
      <div 
        onClick={() => data.onRemove(id)}
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '16px',
          height: '16px',
          background: '#ff0072',
          border: '2px solid white',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 0 2px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 1,
        }}
      >
        ×
      </div>
      {isEditing ? (
        <input
          ref={inputRef}
          defaultValue={data.label}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: data.color || '#ff6b6b',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            outline: 'none',
            padding: 0,
          }}
        />
      ) : (
        <div 
          onDoubleClick={handleDoubleClick}
          style={{ 
            color: data.color || '#ff6b6b',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'text',
          }}
        >
          {data.label}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { 
      label: 'Node 1',
      color: '#ff6b6b',
      onRemove: (id: string) => {
        // This function will be replaced when the component is rendered
      },
      onLabelChange: (id: string, newLabel: string) => {
        // This function will be replaced when the component is rendered
      }
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    data: { 
      label: 'Node 2',
      color: '#ff6b6b',
      onRemove: (id: string) => {
        // This function will be replaced when the component is rendered
      },
      onLabelChange: (id: string, newLabel: string) => {
        // This function will be replaced when the component is rendered
      }
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'custom',
    data: { 
      label: 'Node 3',
      color: '#ff6b6b',
      onRemove: (id: string) => {
        // This function will be replaced when the component is rendered
      },
      onLabelChange: (id: string, newLabel: string) => {
        // This function will be replaced when the component is rendered
      }
    },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function FlowDemo() {
  const searchParams = useSearchParams();
  
  // Parse nodes from query parameters (array of strings)
  const getNodesFromQuery = useCallback(() => {
    const nodeParams = searchParams.get('nodes');
    if (!nodeParams) return initialNodes;

    try {
      const nodeLabels = JSON.parse(decodeURIComponent(nodeParams));
      if (!Array.isArray(nodeLabels)) return initialNodes;

      return nodeLabels.map((label: string, index: number) => ({
        id: (index + 1).toString(),
        type: 'custom',
        data: {
          label: label,
          color: '#ff6b6b',
          onRemove: (id: string) => {
            setNodes(nodes => nodes.filter(node => node.id !== id));
            setEdges(edges => edges.filter(edge => edge.source !== id && edge.target !== id));
          },
          onLabelChange: (id: string, newLabel: string) => {
            setNodes(nodes => 
              nodes.map(node => 
                node.id === id 
                  ? { ...node, data: { ...node.data, label: newLabel } }
                  : node
              )
            );
          }
        },
        position: { 
          x: 200 + (index * 100), 
          y: 100 + (index * 50)  // Arrange nodes in a diagonal pattern
        },
      }));
    } catch (error) {
      console.error('Error parsing nodes from query:', error);
      return initialNodes;
    }
  }, [searchParams]);

  const [nodes, setNodes, onNodesChange] = useNodesState(getNodesFromQuery().map(node => ({
    ...node,
    data: {
      ...node.data,
      onRemove: (id: string) => {
        setNodes(nodes => nodes.filter(node => node.id !== id));
        setEdges(edges => edges.filter(edge => edge.source !== id && edge.target !== id));
      },
      onLabelChange: (id: string, newLabel: string) => {
        setNodes(nodes => 
          nodes.map(node => 
            node.id === id 
              ? { ...node, data: { ...node.data, label: newLabel } }
              : node
          )
        );
      }
    }
  })));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  const addNewNode = useCallback(() => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      data: { 
        label: `Node ${nodes.length + 1}`,
        color: '#ff6b6b',
        onRemove: (id: string) => {
          setNodes(nodes => nodes.filter(node => node.id !== id));
          setEdges(edges => edges.filter(edge => edge.source !== id && edge.target !== id));
        },
        onLabelChange: (id: string, newLabel: string) => {
          setNodes(nodes => 
            nodes.map(node => 
              node.id === id 
                ? { ...node, data: { ...node.data, label: newLabel } }
                : node
            )
          );
        },
        animated: true
      },
      position: { 
        x: Math.random() * 500, 
        y: Math.random() * 300 
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <button 
        onClick={addNewNode}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 4,
          padding: '8px 16px',
          backgroundColor: '#1a192b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
