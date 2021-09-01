import { useEffect, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3'

function Graph(props, ref) {

  const { nodes, links, handleChoose } = props;
  var simulationRef = null;

  const drag = (simulation) => {
    const dragstarted = (event) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };

    const dragged = (event) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragended = (event) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    };

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  const nodeColor = (d) => {
    return '#58D3F7';
  };

  const linkColor = (d) => {
    return '#888';
  };

  const drawChart = () => {
    const width = 800;
    const height = 400;

    const chart = d3.select('#chart');
    chart.selectAll('svg').remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(5)
      )
      .force('x', d3.forceX(height / 2))
      .force('y', d3.forceY(width / 2))
      .force('charge', d3.forceManyBody().strength(nodes.length > 10 ? -50 : -150))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const svg = chart
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .style('font', '12px sans-serif');

    // Per-type markers, as they don't inherit styles.
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', linkColor)
      .attr('d', 'M0,-5L12,0L0,5');

    const link = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 1)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', linkColor)
      .attr('stroke-width', 1)
      .attr('marker-end', 'url(#arrow)');

    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation));

    node
      .append('circle')
      .attr('fill', nodeColor)
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('r', 5)
      .on('mouseover', (e, d) => {
        if (!d.show) {
          d3.select(`#text_${d.id}`)
            .text(d.name);
        }
      })
      .on('mouseout', (e, d) => {
        if (!d.show) {
          d3.select(`#text_${d.id}`).text('');
        }
      })
      .on('click', (e, d) => {
        d.fx = d.x;
        d.fy = d.y;
        handleChoose(d);
      });

    node
      .append('text')
      .attr('x', 10)
      .attr('y', '0.3em')
      .attr('id', (d) => `text_${d.id}`)
      .text((d) => d.show ? d.name : '');

    simulation.on('tick', () => {
      link.attr('d', (d) => {
        // curve
        // const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        // return `M${d.source.x},${d.source.y} A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;

        // straight line
        return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
      });
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return simulation;
  };

  useEffect(() => {
    simulationRef = drawChart();
  });

  useImperativeHandle(ref, () => {
    return {
      getDataRef: () => {
        return { nodes: simulationRef.nodes(), links: links };
      }
    };
  });

  return (
    <div id='chart' />
  );
};

export default forwardRef(Graph);
