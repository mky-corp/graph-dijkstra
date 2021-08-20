const nodes = [
  { id: 'Joan' },
  { id: 'Indira' },
  { id: 'Juan' },
  { id: 'Raul' },
  { id: 'Marcelo' },
  { id: 'Aldair' },
  { id: 'Jhon' },
  { id: 'Kevin' },
  { id: 'Brath' }
];

const links = [
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
];

const initialState = { nodes: [], links: [] };

const initialForm = { name: '', source: '', target: '', value: '' };

const initialData = {
  nodes,
  links
};

const App = () => {
  const { useEffect, useState, Fragment } = React;

  let selectedNodes = [];

  const highlightNodes = new Set();
  const highlightLinks = new Set();
  const answer = [];

  const width =
    window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 2;
  const height = window.innerHeight - 100;

  const [data, setData] = useState({});
  const [more, setMore] = useState({ value: '', form: 0 });
  const [graph, setGraph] = useState(new Graph());
  const [form, setForm] = useState(initialForm);

  const handleChange = (e, ok = 0) => {
    if (ok === 1) {
      setMore({ value: e.target.value, form: 1 });
    } else if (ok === 2) {
      setMore({ value: e.target.value, form: 2 });
    }

    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const init = (data) => {
    setData(data);

    data.nodes.forEach(({ id }) => graph.addNode(id));
    data.links.forEach(({ source, target, value }) =>
      graph.addEdge(source, target, value)
    );
  };

  const cleanGraph = () => {
    setData(initialState);
    setGraph(new Graph());
  };

  const addNode = (e) => {
    e.preventDefault();

    const nodes = [...data.nodes, { id: form.name }];
    setData({ links: data.links, nodes });
    graph.addNode(form.name);

    setForm(initialForm);
  };

  const addEdge = (e) => {
    e.preventDefault();
    const { source, target, value } = form;

    const links = [...data.links, { source, target, value }];
    setData({ nodes: data.nodes, links });

    graph.addEdge(source, target, Number(value));
    setForm(initialForm);
  };

  useEffect(() => {
    init(initialData);
  }, []);

  return (
    <Fragment>
      <a href='#form' className='d-flex d-md-none container-fixed two'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-arrow-down'
          viewBox='0 0 16 16'
        >
          <path
            fillRule='evenodd'
            d='M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z'
          />
        </svg>
      </a>
      <a href='#graph' className='d-flex d-md-none container-fixed one'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-arrow-up'
          viewBox='0 0 16 16'
        >
          <path
            fillRule='evenodd'
            d='M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z'
          />
        </svg>
      </a>
      <header className='bg-dark'>
        <h1 className='fs-1 p-0 py-2 text-center'>
          Aplicación de búsqueda con dijkstra
        </h1>
      </header>
      <main className='d-flex w-100 h-100 flex-column flex-md-row'>
        <section id='graph' className='p-3'>
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
              autoPauseRedraw={false}
              linkColor={(link) =>
                highlightLinks.has(link) ? 'red' : '#f4f4f4'
              }
              linkWidth={(link) => (highlightLinks.has(link) ? 6 : 4)}
              graphData={data}
              nodeCanvasObjetMode={() => 'before'}
              nodeCanvasObject={(node, ctx) =>
                nodePaint(node, getColor(node, highlightNodes), ctx)
              }
              onNodeClick={(node) => {
                const untoggle = selectedNodes.length === 2;

                if (untoggle) {
                  selectedNodes = [];
                  highlightLinks.clear();
                  highlightNodes.clear();
                }

                selectedNodes.push(node.id);
                highlightNodes.add(node);

                if (selectedNodes.length === 2) {
                  const [path, distance] = graph.dijkstra(
                    selectedNodes[0],
                    selectedNodes[1]
                  );

                  answer.pop();
                  answer.pop();
                  answer.pop();
                  answer.push(distance);
                  answer.push(selectedNodes[0]);
                  answer.push(selectedNodes[1]);

                  for (let i = 0; i < path.length - 1; ++i) {
                    data.links.forEach((link) => {
                      if (
                        (path[i] === link.source.id &&
                          path[i + 1] === link.target.id) ||
                        (path[i + 1] === link.source.id &&
                          path[i] === link.target.id)
                      )
                        highlightLinks.add(link);
                    });
                  }

                  path.shift();
                  path.pop();

                  path.forEach((el) => {
                    data.nodes.forEach((item) => {
                      if (item.id === el) highlightNodes.add(item);
                    });
                  });
                }
              }}
              nodePointerAreaPaint={nodePaint}
              linkCanvasObjectMode={() => 'after'}
              linkCanvasObject={(link, ctx) => linkCanvasObject(link, ctx)}
            />
          )}
        </section>
        <section
          id='form'
          className='p-3 p-md-5 w-100 h-100 bg-dark bg-opacity-100'
        >
          <button
            className='btn btn-secondary w-100 px-3 text-white fw-bold'
            onClick={cleanGraph}
          >
            Clean
          </button>
          <form className='w-100 h-100 d-flex flex-column justify-content-center'>
            <h2 className='py-3'>Añade un nodo</h2>
            <div className='form-group my-3 px-1 row d-flex align-items-center'>
              <label
                htmlFor='nameNode'
                className='col-4 fs-5 text-center col-form-label'
              >
                Nombre:
              </label>
              <div className='col-8'>
                <input
                  name='name'
                  type='text'
                  className='mx-3 form-control'
                  placeholder='Ingrese su nombre'
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className='btn btn-primary fw-bold' onClick={addNode}>
              Añadir Nodo
            </button>
          </form>

          <form className='w-100 h-100 d-flex flex-column justify-content-center'>
            <h2 className='py-3'>Añade una ruta</h2>
            <div className='form-group my-3 px-1 row d-flex align-items-center'>
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
                  onChange={(e) => handleChange(e, 2)}
                  value={form.source}
                  required
                >
                  <option value=''>---</option>
                  {Object.keys(data).length &&
                  data.nodes.map(
                    ({ id }, idx) =>
                      (more.form !== 1 || more.value !== id) && (
                        <option key={idx} value={id}>
                          {id}
                        </option>
                      )
                  )}
                </select>
              </div>
            </div>

            <div className='form-group my-3 px-1 row d-flex align-items-center'>
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
                  onChange={(e) => handleChange(e, 1)}
                  value={form.target}
                  required
                >
                  <option value=''>---</option>
                  {Object.keys(data).length &&
                  data.nodes.map(
                    ({ id }, idx) =>
                      (more.form !== 2 || more.value !== id) && (
                        <option key={idx} value={id}>
                          {id}
                        </option>
                      )
                  )}
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
                  type='number'
                  name='value'
                  className='form-control'
                  placeholder='Ingrese la distancia'
                  value={form.value}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button className='btn btn-primary fw-bold' onClick={addEdge}>
              Añadir Ruta
            </button>
          </form>
          <p className='text-white fs-6'>
            Haga click en dos nodos del gráfico para obtener la distancia más corta entre estos
            dos
          </p>
        </section>
      </main>
    </Fragment>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('graph')
);
