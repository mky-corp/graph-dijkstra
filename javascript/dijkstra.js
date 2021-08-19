class Graph {
  constructor() {
    this.nodes = [];
    this.adjacentList = {};
  }

  addNode(node) {
    this.nodes.push(node);
    this.adjacentList[node] = [];
  }

  addEdge(node1, node2, weight) {
    let n1 = this.adjacentList[node1].findIndex((el) => el.node === node2);
    let n2 = this.adjacentList[node2].findIndex((el) => el.node === node1);

    if (n1 !== -1 && n2 !== -1) {
      this.adjacentList[node1][n1] = { node: node2, weight };
      this.adjacentList[node2][n2] = { node: node1, weight };
    } else {
      this.adjacentList[node1].push({ node: node2, weight });
      this.adjacentList[node2].push({ node: node1, weight });
    }
  }

  dijkstra(startNode, endNode) {
    if (
      !this.adjacentList[startNode].length ||
      !this.adjacentList[endNode].length
    ) {
      return [['none'], 0];
    }

    let times = {};
    let backtrace = {};
    let pq = new PriorityQueue();

    times[startNode] = 0;
    this.nodes.forEach((node) => {
      if (node !== startNode) {
        times[node] = Infinity;
      }
    });

    pq.enqueue([startNode, 0]);

    while (!pq.isEmpty()) {
      let shortestStep = pq.dequeue();
      let currentNode = shortestStep[0];

      this.adjacentList[currentNode].forEach((neighbor) => {
        let time = times[currentNode] + neighbor.weight;

        if (time < times[neighbor.node]) {
          times[neighbor.node] = time;
          backtrace[neighbor.node] = currentNode;
          pq.enqueue([neighbor.node, time]);
        }
      });
    }

    let path = [endNode];
    let lastStep = endNode;

    while (lastStep !== startNode) {
      path.unshift(backtrace[lastStep]);
      lastStep = backtrace[lastStep];
    }

    return [path, times[endNode]];
  }
}

class PriorityQueue {
  constructor() {
    this.collection = [];
  }

  enqueue(element) {
    if (this.isEmpty()) {
      this.collection.push(element);
    } else {
      let added = false;
      for (let i = 1; i < this.collection.length; ++i) {
        if (element[1] < this.collection[i - 1][1]) {
          this.collection.splice(i - 1, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.collection.push(element);
      }
    }
  }

  dequeue() {
    return this.collection.shift();
  }

  isEmpty() {
    return this.collection.length === 0;
  }
}
