import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'
import { parseMermaid } from '#utils/mermaidParser'
import dagre from 'dagre'

/**
 * Apply Dagre layout to nodes and edges
 */
function applyDagreLayout(nodes, edges, options = {}) {
  const {
    direction = 'LR',
    nodeWidth = 180,
    nodeHeight = 80,
    circleSize = 100,
    diamondSize = 120,
    nodesep = 80,
    ranksep = 100,
  } = options;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep,
    ranksep,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre
  nodes.forEach((node) => {
    let width = nodeWidth;
    let height = nodeHeight;

    if (node.type === 'circle') {
      width = circleSize;
      height = circleSize;
    } else if (node.type === 'diamond') {
      width = diamondSize;
      height = diamondSize;
    }

    dagreGraph.setNode(node.id, { width, height });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Update nodes with calculated positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    let width = nodeWidth;
    let height = nodeHeight;

    if (node.type === 'circle') {
      width = circleSize;
      height = circleSize;
    } else if (node.type === 'diamond') {
      width = diamondSize;
      height = diamondSize;
    }

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Convert positioned nodes/edges to Excalidraw skeleton
 */
function convertToExcalidrawSkeleton(nodes, edges) {
  const elements = [];
  const colorPalette = [
    'rgba(153, 204, 255, 0.4)',
    'rgba(255, 255, 102, 0.4)',
    'rgba(255, 204, 153, 0.4)',
    'rgba(204, 255, 153, 0.4)',
    'rgba(255, 153, 204, 0.4)',
    'rgba(204, 153, 255, 0.4)',
  ];

  // Convert nodes
  nodes.forEach((node, index) => {
    let type = 'rectangle';
    let width = 180;
    let height = 80;

    if (node.type === 'circle') {
      type = 'ellipse';
      width = 100;
      height = 100;
    } else if (node.type === 'diamond') {
      type = 'diamond';
      width = 120;
      height = 120;
    }

    elements.push({
      id: node.id,
      type,
      x: node.position.x,
      y: node.position.y,
      width,
      height,
      backgroundColor: colorPalette[index % colorPalette.length],
      strokeColor: '#000000',
      label: {
        text: node.data.label || '',
      },
    });
  });

  // Convert edges to arrows
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);

    if (!sourceNode) {
      console.warn(`Edge ${edge.id} references missing source node: ${edge.source}`);
      return;
    }

    let sourceWidth = 180;
    let sourceHeight = 80;

    if (sourceNode.type === 'circle') {
      sourceWidth = 100;
      sourceHeight = 100;
    } else if (sourceNode.type === 'diamond') {
      sourceWidth = 120;
      sourceHeight = 120;
    }

    const arrow = {
      id: edge.id,
      type: 'arrow',
      x: sourceNode.position.x + sourceWidth / 2,
      y: sourceNode.position.y + sourceHeight / 2,
      start: {
        id: edge.source,
      },
      end: {
        id: edge.target,
      },
    };

    if (edge.label) {
      arrow.label = { text: edge.label };
    }

    elements.push(arrow);
  });

  return elements;
}

export class GenerateDiagramMermaidService extends BaseService {
  static async call({ tabId, userId, diagramConfig }) {
    const { type, detailLevel, orientation, layoutStyle, description } = diagramConfig

    // Validate required fields
    if (!description || !description.trim()) {
        throw new ValidationError('Deskripsi diagram tidak boleh kosong')
    }

    if (!type) {
        throw new ValidationError('Tipe diagram tidak boleh kosong')
    }

    // Verify ownership through the set
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab not found')
    }

    // Verify tab type is diagram_builder
    if (tab.tab_type !== 'diagram_builder') {
      throw new ValidationError('This tab is not a diagram builder tab')
    }

    // Fetch constants for access control
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_access_type',
            'skripsi_diagram_builder_enabled',
            'skripsi_diagram_builder_cost'
          ]
        }
      }
    })
    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if diagram builder is enabled
    const diagramBuilderEnabled = constantsMap.skripsi_diagram_builder_enabled === 'true'
    if (!diagramBuilderEnabled) {
      throw new ValidationError('Fitur Diagram Builder sedang tidak aktif')
    }

    // Check user access based on access type
    const accessType = constantsMap.skripsi_access_type || 'subscription'
    const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

    let diagramCost = 0
    let hasSubscription = false

    if (requiresSubscription) {
      hasSubscription = await HasActiveSubscriptionService.call(userId)

      if (accessType === 'subscription_and_credits' && hasSubscription) {
        // Free for subscribers
      } else if (!hasSubscription && accessType === 'subscription') {
        throw new ValidationError('Anda memerlukan langganan aktif untuk menggunakan fitur Diagram Builder')
      }
    }

    // Check credits if required
    if (requiresCredits && (!hasSubscription || accessType === 'credits')) {
      diagramCost = parseFloat(constantsMap.skripsi_diagram_builder_cost) || 0

      if (diagramCost > 0) {
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        if (!userCredit || userCredit.balance < diagramCost) {
          throw new ValidationError(`Kredit tidak cukup. Anda memerlukan ${diagramCost} kredit untuk membuat diagram`)
        }
      }
    }

    // Get Mermaid prompt from constants
    const mermaidConstants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_diagram_builder_model',
            'skripsi_diagram_mermaid_prompt'
          ]
        }
      }
    })

    const mermaidConstantsMap = {}
    mermaidConstants.forEach(c => { mermaidConstantsMap[c.key] = c.value })

    const modelName = mermaidConstantsMap.skripsi_diagram_builder_model || 'gemini-2.0-flash-exp'
    let mermaidPrompt = mermaidConstantsMap.skripsi_diagram_mermaid_prompt

    if (!mermaidPrompt) {
      throw new ValidationError('Mermaid prompt untuk Diagram Builder belum dikonfigurasi')
    }

    // Get AI service from router
    const ModelService = RouterUtils.call(modelName)
    if (!ModelService) {
      throw new ValidationError(`Model ${modelName} tidak didukung`)
    }

    // Generate Mermaid diagram
    const templateData = {
        detailLevel: detailLevel,
        description: description,
    }

    Object.entries(templateData).forEach(([key, value]) => {
        mermaidPrompt = mermaidPrompt.replaceAll(`{{${key}}}`, value)
    });

    console.log('=== GENERATING MERMAID DIAGRAM ===')
    console.log('Model:', modelName)
    console.log('Prompt:', mermaidPrompt)

    const mermaidResponse = await ModelService.generateFromText(
        modelName,
        mermaidPrompt,
        [],
    )

    console.log('=== MERMAID RESPONSE ===')
    console.log(mermaidResponse)

    // Clean response (remove markdown code blocks if present)
    let mermaidText = mermaidResponse
      .replaceAll('```mermaid', '')
      .replaceAll('```', '')
      .trim()

    // Parse Mermaid to nodes and edges
    let parsedMermaid
    try {
      parsedMermaid = parseMermaid(mermaidText)
      console.log('=== PARSED MERMAID ===')
      console.log('Nodes:', parsedMermaid.nodes.length)
      console.log('Edges:', parsedMermaid.edges.length)
      console.log('Direction:', parsedMermaid.direction)
    } catch (error) {
      console.error('Failed to parse Mermaid:', error)
      throw new ValidationError('AI gagal menghasilkan Mermaid yang valid: ' + error.message)
    }

    if (parsedMermaid.nodes.length === 0) {
      throw new ValidationError('Diagram tidak memiliki node')
    }

    // Apply Dagre layout based on orientation
    const dagreDirection = orientation === 'horizontal' ? 'LR' : 'TB'
    const layouted = applyDagreLayout(parsedMermaid.nodes, parsedMermaid.edges, {
      direction: dagreDirection,
      nodesep: 100,
      ranksep: 150
    })

    console.log('=== DAGRE LAYOUT APPLIED ===')
    console.log('Positioned nodes:', layouted.nodes.length)

    // Convert to Excalidraw skeleton
    const excalidrawElements = convertToExcalidrawSkeleton(layouted.nodes, layouted.edges)

    console.log('=== EXCALIDRAW CONVERSION ===')
    console.log('Elements:', excalidrawElements.length)

    // Wrap in Excalidraw structure
    const diagramData = {
      type: 'excalidraw',
      version: 2,
      source: 'medpalm-mediko-mermaid',
      elements: excalidrawElements,
      appState: {
        viewBackgroundColor: '#ffffff',
        gridSize: 20,
        zoom: { value: 1 }
      },
      files: {}
    }

    // Save diagram to database
    const diagram = await prisma.skripsi_diagrams.create({
      data: {
        tab_id: tabId,
        diagram_type: type,
        detail_level: detailLevel,
        orientation: orientation,
        layout_style: layoutStyle,
        description: description,
        diagram_data: JSON.stringify(diagramData),
        credits_used: diagramCost,
        // Store original Mermaid for reference
        metadata: JSON.stringify({
          mermaid: mermaidText,
          parsedNodes: parsedMermaid.nodes.length,
          parsedEdges: parsedMermaid.edges.length
        })
      }
    })

    // Deduct credits if cost > 0
    if (diagramCost > 0) {
      const userCredit = await prisma.user_credits.findUnique({
        where: { user_id: userId }
      })

      const balanceBefore = userCredit ? parseFloat(userCredit.balance.toString()) : 0
      const balanceAfter = balanceBefore - diagramCost

      await prisma.user_credits.update({
        where: { user_id: userId },
        data: {
          balance: { decrement: diagramCost }
        }
      })

      await prisma.credit_transactions.create({
        data: {
          user_id: userId,
          user_credit_id: userCredit.id,
          amount: -diagramCost,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          type: 'deduction',
          description: `Diagram Builder (Mermaid) - ${type}`
        }
      })
    }

    // Update tab and set timestamps
    await prisma.skripsi_tabs.update({
      where: { id: tabId },
      data: { updated_at: new Date() }
    })

    await prisma.skripsi_sets.update({
      where: { id: tab.set_id },
      data: { updated_at: new Date() }
    })

    return {
      diagramId: diagram.id,
      diagram: diagramData
    }
  }
}
