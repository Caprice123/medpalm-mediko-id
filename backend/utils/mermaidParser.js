/**
 * Simple Mermaid Flowchart Parser
 * Parses basic Mermaid syntax into nodes and edges structure
 */

/**
 * Parse Mermaid flowchart syntax
 * @param {string} mermaidText - Mermaid syntax
 * @returns {Object} { nodes: [], edges: [], direction: 'LR'|'TB' }
 */
export function parseMermaid(mermaidText) {
  const nodes = [];
  const edges = [];
  let direction = 'LR'; // Default direction

  // Clean the text
  const lines = mermaidText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('%%')); // Remove comments

  // Extract direction from first line
  const firstLine = lines[0];
  if (firstLine.startsWith('graph ')) {
    const dirMatch = firstLine.match(/graph\s+(LR|TB|TD|RL|BT)/);
    if (dirMatch) {
      direction = dirMatch[1] === 'TD' ? 'TB' : dirMatch[1]; // TD is same as TB
    }
  }

  const nodeMap = new Map(); // Track all nodes

  // Process each line
  for (const line of lines) {
    if (line.startsWith('graph ')) continue; // Skip graph declaration

    // Pattern: nodeId[Label] --> nodeId2[Label2]
    // Pattern: nodeId[Label] -->|Edge Label| nodeId2[Label2]
    // Pattern: nodeId([Label]) for circles
    // Pattern: nodeId{Label} for diamonds

    // Extract all node definitions and connections
    const connectionMatch = line.match(/([A-Za-z0-9_]+)([\[\(\{][^\]\)\}]*[\]\)\}])?[\s]*(-+>|---)[|]?([^|]*)[|]?[\s]*([A-Za-z0-9_]+)([\[\(\{][^\]\)\}]*[\]\)\}])?/);

    if (connectionMatch) {
      const [, sourceId, sourceLabel, arrow, edgeLabel, targetId, targetLabel] = connectionMatch;

      // Add source node if not exists
      if (!nodeMap.has(sourceId)) {
        const node = parseNodeDefinition(sourceId, sourceLabel);
        nodeMap.set(sourceId, node);
      }

      // Add target node if not exists
      if (!nodeMap.has(targetId)) {
        const node = parseNodeDefinition(targetId, targetLabel);
        nodeMap.set(targetId, node);
      }

      // Add edge
      const edge = {
        id: `${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId
      };

      if (edgeLabel && edgeLabel.trim()) {
        edge.label = edgeLabel.trim();
      }

      edges.push(edge);
    } else {
      // Standalone node definition (no connection)
      const nodeMatch = line.match(/([A-Za-z0-9_]+)([\[\(\{][^\]\)\}]*[\]\)\}])/);
      if (nodeMatch) {
        const [, nodeId, nodeLabel] = nodeMatch;
        if (!nodeMap.has(nodeId)) {
          const node = parseNodeDefinition(nodeId, nodeLabel);
          nodeMap.set(nodeId, node);
        }
      }
    }
  }

  // Convert map to array
  nodeMap.forEach(node => nodes.push(node));

  return { nodes, edges, direction };
}

/**
 * Parse a single node definition
 * @param {string} nodeId - Node ID
 * @param {string} definition - Node definition like [Label], ([Label]), {Label}
 * @returns {Object} Node object
 */
function parseNodeDefinition(nodeId, definition) {
  if (!definition) {
    return {
      id: nodeId,
      type: 'rectangle',
      data: { label: nodeId }
    };
  }

  let type = 'rectangle';
  let label = nodeId;

  // Circle/Ellipse: ([Label])
  if (definition.startsWith('([') && definition.endsWith('])')) {
    type = 'circle';
    label = definition.slice(2, -2);
  }
  // Double Circle: (([Label]))
  else if (definition.startsWith('(([') && definition.endsWith(']))')) {
    type = 'circle';
    label = definition.slice(3, -3);
  }
  // Diamond: {Label}
  else if (definition.startsWith('{') && definition.endsWith('}')) {
    type = 'diamond';
    label = definition.slice(1, -1);
  }
  // Rectangle: [Label]
  else if (definition.startsWith('[') && definition.endsWith(']')) {
    type = 'rectangle';
    label = definition.slice(1, -1);
  }
  // Round edges: (Label)
  else if (definition.startsWith('(') && definition.endsWith(')')) {
    type = 'rectangle';
    label = definition.slice(1, -1);
  }

  return {
    id: nodeId,
    type,
    data: { label: label.trim() }
  };
}

/**
 * Convert Mermaid to React Flow format (same as AI would generate)
 * @param {string} mermaidText - Mermaid syntax
 * @returns {Object} { nodes: [], edges: [], direction: 'LR'|'TB' }
 */
export function mermaidToReactFlow(mermaidText) {
  return parseMermaid(mermaidText);
}

/**
 * Example usage and test
 */
export function testMermaidParser() {
  const example = `
graph LR
    Start([Start Process]) --> Input[Get User Input]
    Input --> Validate{Valid?}
    Validate -->|Yes| Process[Process Data]
    Validate -->|No| Error[Show Error]
    Process --> Success([Success])
    Error --> Input
  `;

  const result = parseMermaid(example);
  console.log('Parsed Mermaid:');
  console.log('Nodes:', result.nodes);
  console.log('Edges:', result.edges);
  console.log('Direction:', result.direction);

  return result;
}
