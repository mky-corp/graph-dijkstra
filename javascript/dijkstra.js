/**
 * @firepower Script para la creación de un grafo que sirve para implementar el algoritmo de dijkstra
 *
 * @version 1.0.0
 *
 * @license Apache
 *
 * @author Jochizan (Roca Hormaza Joan José) <remnyachizot2015@gmail.com>
 *
 * History
 *
 * v1.0.0 Implementando clases para la implementación de dijkstra
 *
 */


class Graph {

  /**
   * Función constructora versión JavaScript para inicializar una instancia de la clase Graph
   */
  constructor() {
    this.nodes = []; // arreglo con los nombres de los nodos
    this.adjacentList = {}; // objeto con la definición de todas las rutas que existen en el grafo
  }

  /**
   * Función que añade un nodo a la lista de nodos "nodes" y luego también añade una propiedad con
   * el nombre que se le pasó al objeto "adjacentList" para implementar después las rutas en el grafo.
   *
   * @param node{string}
   */
  addNode(node) {
    this.nodes.push(node); // Añadiendo un nodo al arreglo de nodos
    this.adjacentList[node] = []; // asignación de un arreglo a partir de una propiedad del objeto adjacentList
  }

  /**
   * Función para crear una ruta entre un "nodo1" y un "nodo2" asignándole su respectivo "peso" que
   * hace referencia a la distancia entre los dos nodos o en caso ya exista la ruta solo actualizar
   * la ruta existente
   *
   * @param node1{string}
   * @param node2{string}
   * @param weight{number}
   */
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

  /**
   * Función para la búsqueda a través de dos nombres que existan en el arreglo de nodos para la ruta
   * más corta entre estos dos siempre y cuando ninguno este completamente solo o no ligado al grupo
   * de conexiones del otro
   *
   * @param startNode
   * @param endNode
   * @returns {(string[]|number)[]|(*[]|*)[]}
   */
  dijkstra(startNode, endNode) {
    if (
      !this.adjacentList[startNode].length ||
      !this.adjacentList[endNode].length
    )
      return [['none'], 0]; // esto se retorna si el nodo esta completamente solo

    let paths = {}; // objeto que guarda los pesos para hacer las comparaciones
    let backtrace = {}; // objeto que guarda los nombres para buscar la ruta más corta
    let pq = new PriorityQueue(); // instancia que crea la cola de prioridad para cada iteración

    paths[startNode] = 0; // asignamos el valor el peso de 0 para el nodo inicial
    this.nodes.forEach((node) => {
      if (node !== startNode)
        paths[node] = Infinity; // asignamos infinito a cada nodo que sea diferente al nodo inicial
    });

    pq.enqueue([startNode, 0]); // añadimos el primer elemento de la cola prioridad

    // while que se seguirá la iteración siempre y cuando la cola de prioridad no esta vacío
    while (!pq.isEmpty()) {

      let shortestStep = pq.dequeue(); // Nos traemos el nodo que tenga más importancia
      let currentNode = shortestStep[0]; // Nos traemos el nombre del nodo que tiene más prioridad

      this.adjacentList[currentNode].forEach((neighbor) => { // Iteramos sobre los vecinos del nodo actual
        let weight = paths[currentNode] + neighbor.weight; // Sumamos le peso actual con el peso del nodo vecino

        if (weight < paths[neighbor.node]) { // si el peso es menor con el valor actual que tiene en los pesos totales
          paths[neighbor.node] = weight; // asignamos el nuevo valor con ese nodo en las rutas
          backtrace[neighbor.node] = currentNode; // asignamos el nombre del nodo actual para identificarlos después
          pq.enqueue([neighbor.node, weight]); // añadimos otro nodo a la cola de prioridad por el peso "weight"
        }
      });
    }

    let path = [endNode]; // creamos la ruta más corta empezando desde el último número
    let lastStep = endNode; // creamos un valor que comience con el nodo final para iterar en el while

    while (lastStep !== startNode) {
      path.unshift(backtrace[lastStep]); // subimos al principio de arreglo los valores del backtrace con el actual "lastStep"
      lastStep = backtrace[lastStep]; // asignamos el valor del backtrace con el nodo actual seguir obteniendo la ruta más corta
    }

    // retornamos un arreglo con dos posiciones que nos devolverá la ruta por nombres en un arreglo
    // y la distancia total más corta
    return [path, paths[endNode]];
  }
}

class PriorityQueue {

  /**
   * Función constructora para la implementación de una cola de prioridad de dos posiciones
   * [x, y] -> [string, number]
   */
  constructor() {
    this.collection = [];
  }

  /**
   * Función que añade un nodo a la cola de prioridad teniendo en cuenta que el element tiene
   * dos posiciones que identifican al nodo de la clase Graph y su valor acumulado con respecto al
   * nodo inicial para luego poder utilizarlo en el algoritmo de dijkstra
   *
   * @param element
   */
  enqueue(element) {
    if (this.isEmpty()) {
      this.collection.push(element);
    } else {
      let added = false;

      for (let i = 1; i < this.collection.length; ++i) { // iteramos sobre la cola de prioridad
        if (element[1] < this.collection[i - 1][1]) { // solo si es menor el peso del elemento a alguno de la cola se le asignara en esa ubicación
          this.collection.splice(i - 1, 0, element);
          added = true; // lo ponemos en true si el "element" tiene un peso menor al que ya existen en la cola
          break; // forzamos la salida del bucle
        }
      }
      if (!added) {
        this.collection.push(element); // Solo si "added" es false añadimos el elemento al final cola
      }
    }
  }

  /**
   * Función que retorna el número inicial del arreglo [x, y, z] sale -> x
   *
   * @returns {number}
   */
  dequeue() {
    return this.collection.shift();
  }

  /**
   * Función que retorna un boolean que identifica si la cola esta vacía
   * @returns {boolean}
   */
  isEmpty() {
    return this.collection.length === 0;
  }
}
