class Histogram {
    
    constructor(_config, _data) {
        // console.log("[BarChart constructor start]");
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 600,
            margin: { top: 30, bottom: 60, right: 20, left: 60}
        }

        this.data = _data;
        // console.log("[BarChart constructor end]");
        this.initVis();
    }

    initVis() {
        let vis = this;
    
        // vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        // vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        // vis.svg = d3.select(vis.config.parentElement)
        //     .attr('width', vis.config.containerWidth)
        //     .attr('height', vis.config.containerHeight);

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', '100%')
            .attr('height', '100%');

        vis.width = vis.svg.node().getBoundingClientRect().width - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.svg.node().getBoundingClientRect().height - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);
        
        // Initialize linear and ordinal scales (input domain and output range)
        // Domain for each scale is set in updateVis() to match possibly filtered data
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);
    
        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);

        // Initialize histogram function to get bins
        vis.histogram = d3.histogram()
            .value(d => d.sy_dist)
    
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);
    
        // Draw axes (at first without accurate scale domains, fixed by renderVis)
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`) 
            .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);
        
        // Append Y axis title
        vis.yAxisTitle = vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('text-anchor', 'middle')
            .attr('x', 20)
            .attr('y', (vis.height / 2) + vis.config.margin.top)
            .text('# Exoplanets')
            .attr('dy', 1)

        // Rotate title
        vis.yAxisTitle
            .attr('transform', `rotate(270, ${vis.yAxisTitle.attr('x')}, ${vis.yAxisTitle.attr('y')})`);

        // Append X axis title
        vis.xAxisTitle = vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', (vis.width / 2) + vis.config.margin.left)
            .attr('y', vis.height + vis.config.margin.top + 50)
            .attr('text-anchor', 'middle')
            .text('Distance from Earth (parsecs)');

        vis.data.forEach(d => {
            d.sy_dist = +d.sy_dist;
        });
    }

    updateVis() {
        let vis = this;

        vis.xScale
            // .domain([0, d3.max(vis.data, d => d.sy_dist)])
            .domain([0, 2000])
            .nice();

        vis.histogram
            .domain(vis.xScale.domain())
            .thresholds(vis.xScale.ticks(30));

        vis.bins = vis.histogram(vis.data);

        vis.yScale
            .domain([0, d3.max(vis.bins, d => d.length)])
            .nice();

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // Add rectangles
        vis.bars = vis.chart.selectAll('.bar')
            .data(vis.bins)
            .join('rect')
                .attr('class', 'bar')
                .attr('fill', 'hsl(271, 48%, 61%)')
                .attr('x', 1)
                .attr('transform', d => `translate(${vis.xScale(d.x0)}, ${vis.yScale(d.length)})`)
                .attr('height', d => vis.height - vis.yScale(d.length))
                .attr('width', d => vis.xScale(d.x1) - vis.xScale(d.x0) - 1)
                .on('mouseenter', vis.tooltipDisplay)
                .on('mouseleave', () => {
                    d3.select('#tooltip').style('display', 'none');
                });
                // TODO: Add on click event for filtering

        vis.trackers = vis.chart.selectAll('.tracker')
            .data(vis.bins)
            .join('rect')
                .attr('class', 'tracker')
                .attr('fill', '#f6eeee')
                .attr('x', 1)
                .attr('transform', d => `translate(${vis.xScale(d.x0)}, 0)`)
                .attr('height', d => vis.yScale(d.length))
                .attr('width', d => vis.xScale(d.x1) - vis.xScale(d.x0) - 1)
                .on('mouseenter', vis.tooltipDisplay)
                .on('mouseleave', () => {
                    d3.select('#tooltip').style('display', 'none');
                });

        // Update axes
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);

        vis.xAxisGroup
            .selectAll('text')
                .style('text-anchor', 'end')
                .attr("dx", "-3")
                .attr("dy", "6")
                .attr("transform", `rotate(-30)`);
    }

    tooltipDisplay(event, d) {
        let tooltipText = `
            <p class="tip-text">Distance: ${d.x0} - ${d.x1} parsecs</p>    
            <p class="tip-text">${d.length} Planets</p>
        `;

        d3.select('#tooltip')
            .style('display', 'block')
            .style('text-align', 'center')
            .style('left', (event.pageX + 2) + 'px')   
            .style('top', (event.pageY + 2) + 'px')
            .html(tooltipText);
    }
}