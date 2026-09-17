function hasValue(port) {
  return port.value !== null;
}

function getInternalPredecessors(port, ports, connections) {
  const isOutgoingPort = connections.some(
    (connection) => connection.sourcePortId === port.id
  );

  if (!isOutgoingPort) {
    return [];
  }

  return ports.filter(
    (candidate) =>
      candidate.nodeId === port.nodeId &&
      candidate.id !== port.id
  );
}

function getPredecessors(port, ports, connections) {
  const incomingConnection = connections.find(
    (connection) => connection.targetPortId === port.id
  );

  if (incomingConnection) {
    const sourcePort = ports.find(
      (candidate) => candidate.id === incomingConnection.sourcePortId
    );

    return sourcePort ? [sourcePort] : [];
  }

  return getInternalPredecessors(port, ports, connections);
}

function findNearestValuedSources(
  port,
  ports,
  connections,
  visited = new Set()
) {
  if (visited.has(port.id)) {
    return [];
  }

  const nextVisited = new Set(visited);
  nextVisited.add(port.id);

  if (hasValue(port)) {
    return [port];
  }

  const predecessors = getPredecessors(
    port,
    ports,
    connections
  );

  return predecessors.flatMap((predecessor) =>
    findNearestValuedSources(
      predecessor,
      ports,
      connections,
      nextVisited
    )
  );
}

function generateSegments(nodes, connections) {
  const ports = nodes.flatMap((node) => node.ports);
  const segments = [];

  for (const targetPort of ports) {
    if (!hasValue(targetPort)) {
      continue;
    }

    const predecessors = getPredecessors(
      targetPort,
      ports,
      connections
    );

    if (predecessors.length === 0) {
      continue;
    }

    const sources = predecessors.flatMap((predecessor) =>
      findNearestValuedSources(
        predecessor,
        ports,
        connections
      )
    );

    if (sources.length === 0) {
      continue;
    }

    const sourceTotal = sources.reduce(
      (total, source) => total + source.value,
      0
    );

    segments.push({
      target: targetPort.id,
      sources: sources.map((source) => source.id),
      targetValue: targetPort.value,
      sourceTotal,
      result: targetPort.value - sourceTotal,
    });
  }

  return segments;
}

module.exports = {
  generateSegments,
};