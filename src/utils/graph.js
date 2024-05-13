import Graph from 'js-graph';

function dijkstra(graph, start, targetValue) {
    let shortestPaths = new Map();
    let visited = new Set();

    function visit(node) {
        if (node === targetValue) {
            return true;
        }

        visited.add(node);

        for (let neighbor of graph.neighbors(node)) {
            if (!visited.has(neighbor)) {
                let newPath = shortestPaths.get(node) || Infinity;
                let newDistance = graph.distance(node, neighbor);
                let currentDistance = shortestPaths.get(neighbor) || Infinity;

                if (newDistance + newPath < currentDistance) {
                    shortestPaths.set(neighbor, newDistance + newPath);
                }
            }
        }

        return false;
    }

    function traverse(node) {
        if (visit(node)) {
            traverse(shortestPaths.get(node));
        }
    }

    traverse(start);

    let path = [];
    let currentNode = targetValue;
    while (currentNode!== start) {
        path.unshift(currentNode);
        currentNode = shortestPaths.get(currentNode);
    }

    path.unshift(start);

    return { path, distance: shortestPaths.get(targetValue) || Infinity };
}

// Create a graph
const graph = new Graph();

// Add nodes with values
graph.addNode('A', { values: ['alice'] });
graph.addNode('B', { values: ['bob'] });
graph.addNode('C', { values: ['catherine'] });
graph.addNode('D', { values: ['marie', 'karen'] });
graph.addNode('E', { values: ['karen'] });
graph.addNode('K', { values: ['john'] });

// Add edges with weights
graph.addEdge('A', 'B', 6);
graph.addEdge('A', 'D', 1);
graph.addEdge('B', 'A', 6);
graph.addEdge('B', 'D', 2);
graph.addEdge('B', 'E', 2);
graph.addEdge('B', 'C', 5);
graph.addEdge('C', 'B', 5);
graph.addEdge('C', 'E', 5);
graph.addEdge('D', 'A', 1);
graph.addEdge('D', 'B', 2);
graph.addEdge('D', 'E', 1);
graph.addEdge('E', 'B', 2);
graph.addEdge('E', 'C', 5);
graph.addEdge('E', 'D', 1);
graph.addEdge('D', 'K', 7);
graph.addEdge('A', 'K', 7);

// Execute Dijkstra's algorithm with 'A' as the starting node and 'john' as the target value
const result = dijkstra(graph, 'A', 'john');
console.log(`Shortest path from A to john is: ${result.path.join(' -> ')}, and its length is ${result.distance}`);
