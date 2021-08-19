const names = [
  'Joan',
  'Indira',
  'Juan',
  'Raul',
  'Marcelo',
  'Aldair',
  'Jhon',
  'Kevin',
  'Brath'
];

const initialState = { nodes: [], links: [] };

const initialData = {
  nodes: [...names.map((item) => ({ id: item }))],
  links: [
    { source: 'Joan', target: 'Indira', value: 20 },
    { source: 'Indira', target: 'Raul', value: 10 },
    { source: 'Juan', target: 'Jhon', value: 12 },
    { source: 'Raul', target: 'Marcelo', value: 64 },
    { source: 'Aldair', target: 'Brath', value: 28 },
    { source: 'Jhon', target: 'Brath', value: 24 },
    { source: 'Kevin', target: 'Joan', value: 32 },
    { source: 'Brath', target: 'Indira', value: 25 },
    { source: 'Joan', target: 'Jhon', value: 7 },
    { source: 'Kevin', target: 'Raul', value: 17 },
    { source: 'Kevin', target: 'Juan', value: 13 },
    { source: 'Aldair', target: 'Juan', value: 56 },
    { source: 'Marcelo', target: 'Indira', value: 64 }
  ]
};

const App = () => {
  const dijkstra = new Graph();
  let selectedNodes = [];
  const width =
    window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 2;
  const height = window.innerHeight;

  const [data, setData] = React.useState({});
  const [graph, setGraph] = React.useState({});

  const [fmAdd, setFmAdd] = React.useState({ nameNode: '' });
  const [form, setForm] = React.useState({ source: '', target: '', value: '' });

  const handleChange = (e) =>
    setFmAdd({ ...fmAdd, [e.target.name]: e.target.value });

  const handleChangeSelect = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const init = (data) => {
    setData(data);
    // setForceGraph(data);
    data.nodes.forEach(({ id }) => dijkstra.addNode(id));
    data.links.forEach(({ source, target, value }) =>
      dijkstra.addEdge(source, target, value)
    );
  };

  const cleanGraph = () => setData(initialState);

  const addNode = (e) => {
    e.preventDefault();
    const nodes = [...data.nodes, { id: fmAdd.nameNode }];
    setData({ links: data.links, nodes });
    setFmAdd({ nameNode: '' });
  };

  const addEdge = (e) => {
    e.preventDefault();
    console.log(form);
    const links = [
      ...data.links,
      { source: form.source, target: form.target, value: form.value }
    ];
    setData({ nodes: data.nodes, links });
    setForm({ source: '', target: '', value: '' });
  };

  console.log(form);

  React.useEffect(() => {
    init(initialData);
  }, []);

  return (
    <React.Fragment>
      <header>
        <h1 className='text-center'>
          Aplicación de busqueda de la ruta más corta
        </h1>
      </header>
      <main className='d-flex w-100 h-100 flex-column flex-md-row'>
        <section className='p-3'>
          {Object.keys(data).length && (
            <ForceGraph2D
              width={width}
              height={height}
              nodeLabel={(node) =>
                `<div><b>${node.index}</b>: <span>${node.id}</span></div>`
              }
              linkLabel={({ source, target, value }) =>
                `<div><b>${source.id}</b> to <b>${target.id}</b>: <span>${value}</span></div>`
              }
              backgroundColor={'#202020'}
              d3Force={('center', null)}
              linkColor={() => '#f4f4f4'}
              graphData={data}
              linkVal={10}
              nodeCanvasObject={(node, ctx) =>
                nodePaint(node, getColor(node.id), ctx)
              }
              onNodeClick={(node, e) => {
                const untoggle = selectedNodes.length === 2;
                if (untoggle) selectedNodes = [];

                selectedNodes.push(node.id);

                if (selectedNodes.length === 2) {
                  const answer = graph.dijkstra(
                    selectedNodes[0],
                    selectedNodes[1]
                  );
                  console.log(answer);
                }
              }}
              nodePointerAreaPaint={nodePaint}
              linkCanvasObjectMode={() => 'before'}
              linkCanvasObject={(link, ctx) => linkCanvasObject(link, ctx)}
              autoPauseRedraw={false}
              linkWidth={5}
              // linkDirectionalParticles={4}
            />
          )}
        </section>
        <section className='p-5 w-100 h-100 bg-dark'>
          <button
            className='btn btn-info w-100 px-3 text-white fw-bold'
            onClick={cleanGraph}
          >
            Clean
          </button>
          <form className='w-100 h-100 d-flex flex-column justify-content-center'>
            <h2 className='py-3'>Añade un nodo</h2>
            <div className='form-group my-3 px-2 row d-flex align-items-center'>
              <label
                htmlFor='nameNode'
                className='col-4 fs-5 text-center col-form-label'
              >
                Nombre:
              </label>
              <div className='col-8'>
                <input
                  name='nameNode'
                  type='text'
                  className='mx-3 form-control'
                  placeholder='Ingrese el nombre del nodo'
                  value={fmAdd.nameNode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className='btn btn-success fw-bold' onClick={addNode}>
              Añadir Nodo
            </button>
          </form>

          <form className='w-100 h-100 d-flex flex-column justify-content-center'>
            <h2 className='py-3'>Añade una ruta</h2>
            <div className='form-group my-3 px-2 row d-flex align-items-center'>
              <label
                htmlFor='source'
                className='col-4 fs-5 text-center col-form-label'
              >
                Inicio:
              </label>
              <div className='col-8'>
                <select
                  name='source'
                  className='mx-1 form-control'
                  onChange={handleChangeSelect}
                  value={form.source}
                  required
                >
                  <option value=''>---</option>
                  {Object.keys(data).length &&
                    data.nodes.map(({ id }, idx) => (
                      <option key={idx} value={id}>
                        {id}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className='form-group my-3 px-2 row d-flex align-items-center'>
              <label
                htmlFor='target'
                className='col-4 fs-5 text-center col-form-label'
              >
                Final:
              </label>
              <div className='col-8'>
                <select
                  name='target'
                  className='mx-1 form-control'
                  onChange={handleChangeSelect}
                  value={form.target}
                  required
                >
                  <option value=''>---</option>
                  {Object.keys(data).length &&
                    data.nodes.map(({ id }, idx) => (
                      <option key={idx} value={id}>
                        {id}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className='form-group my-3 px-2 row d-flex align-items-center'>
              <label
                htmlFor='value'
                className='col-4 fs-5 text-center col-form-label'
              >
                Distancia:
              </label>
              <div className='col-8'>
                <input
                  name='value'
                  type='number'
                  className='form-control'
                  placeholder='Ingrese la distancia'
                  value={form.value}
                  onChange={handleChangeSelect}
                  required
                />
              </div>
            </div>
            <button className='btn btn-success fw-bold' onClick={addEdge}>
              Añadir Ruta
            </button>
          </form>
        </section>
      </main>
      <footer></footer>
    </React.Fragment>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('graph')
);
