const nodePaint = ({ id, x, y }, color, ctx) => {
  ctx.fillStyle = color;
  (() => {
    const label = id;
    const fontSize = 8;

    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 4 * Math.PI, false);
    ctx.fill();

    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(label, x, y);
  })();
};

const linkCanvasObject = (link, ctx) => {
  const MAX_FONT_SIZE = 4;
  const LABEL_NODE_MARGIN = 6;

  const start = link.source;
  const end = link.target;

  // ignore unbound links
  if (typeof start !== 'object' || typeof end !== 'object') return;

  // calculate label positioning
  const textPos = Object.assign(
    ...['x', 'y'].map((c) => ({
      [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
    }))
  );

  const relLink = { x: end.x - start.x, y: end.y - start.y };

  const maxTextLength =
    Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
    LABEL_NODE_MARGIN * 2;

  let textAngle = Math.atan2(relLink.y, relLink.x);
  // maintain label vertical orientation for legibility
  if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
  if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

  const label = `${link.value.toFixed(2)}`;

  // estimate fontSize to fit in link length
  ctx.font = '2px Sans-Serif';
  const fontSize = Math.min(
    MAX_FONT_SIZE,
    maxTextLength / ctx.measureText(label).width
  );
  ctx.font = `${fontSize}px Sans-Serif`;
  const textWidth = ctx.measureText(label).width;
  const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

  // draw text label (with background rect)
  ctx.save();
  ctx.translate(textPos.x, textPos.y);
  ctx.rotate(textAngle);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(
    -bckgDimensions[0] / 2,
    -bckgDimensions[1] / 2,
    ...bckgDimensions
  );

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(label, 0, 0);
  ctx.restore();
};

// gen a number persistent color from around the palette
const getColor = (n) =>
  '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');
