const Node = () => {
  const [graph, setGraph] = React.useState(new Graph());

  console.log(graph);

  return (
    <React.Fragment>{graph ? 'Hay nodos' : 'NO hay nodos'}</React.Fragment>
  );
};

// console.log(nodes);

const data = genRandomTree(30);

ReactDOM.render(
  <React.Fragment>
    <Node />
    <ForceGraph2D
      nodeLabel='id'
      nodeId='id'
      backgroundColor={'#202020'}
      linkColor={() => '#f4f4f4'}
      graphData={data}
      nodeCanvasObject={(node, ctx) => nodePaint(node, getColor(node.id), ctx)}
      nodePointerAreaPaint={nodePaint}
      linkCanvasObjectMode={() => 'after'}
      linkCanvasObject={linkCanvasObject}
    />
  </React.Fragment>,
  document.getElementById('graph')
);
