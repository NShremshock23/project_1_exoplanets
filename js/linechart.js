class LineChart {
    
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 600,
            margin: { top: 30, bottom: 50, right: 60, left: 60}
        }

        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        // Set up chart area
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


        // Helper function for converting year strings to date objects
        vis.parseYear = d3.timeParse("%Y");
        
        // Initialize linear scales
        // Domain for each scale is set in updateVis() to match possibly filtered data
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);
    
        vis.xScale = d3.scaleTime()
            .range([0, vis.width])
    
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

        vis.marks = vis.chart.append('g');
        vis.trackingArea = vis.chart.append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');

        // Empty tooltip group (hidden by default)
        vis.tooltip = vis.chart.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');

        vis.tooltip.append('circle')
            .attr('r', 4);

        vis.tooltip.append('text');

        // Initialize line as part of the "marks" group
        vis.linePath = vis.marks.append('path')
            .attr('class', 'chart-line');
        
        // Append Y axis title
        vis.yAxisTitle = vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('text-anchor', 'middle')
            .attr('x', 15)
            .attr('y', (vis.height / 2) + vis.config.margin.top)
            .text('Exoplanet Discoveries')
            .attr('dy', 1)
            
        // Rotate title
        vis.yAxisTitle
            .attr('transform', `rotate(270, ${vis.yAxisTitle.attr('x')}, ${vis.yAxisTitle.attr('y')})`);

        // Append X axis title
        vis.xAxisTitle = vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', (vis.width / 2) + vis.config.margin.left)
            .attr('y', vis.height + vis.config.margin.top + 40)
            .attr('text-anchor', 'middle')
            .text('Year');
    }

    updateVis() {
        let vis = this;

        // Rollup data to get counts of discoveries per year
        vis.yearCounts = d3.rollup(vis.data, d => d.length, d => d.disc_year);
        // console.log(vis.yearCounts);

        // Structure data to be easily iteratable/sortable
        vis.dataOverTime = [];
        vis.yearCounts.forEach((value, key, map) => {
            // TODO: figure out where blank entries for coming from (currently ignoring them)
            if (key != "") {
                vis.dataOverTime.push({"time": vis.parseYear(key), "val": value});
            }
        });

        // Sort data by year
        vis.dataOverTime.sort((a, b) => {
            if (a.time < b.time) return -1;
            else return 1;
        });

        // OPTIONALLY Make data cumulative
        // for (let i = 1; i < vis.dataOverTime.length; i++) {
        //     vis.dataOverTime[i].val += vis.dataOverTime[i-1].val;
        // }        
        // console.log(vis.dataOverTime);
        
        vis.xValue = d => d.time;
        vis.yValue = d => d.val;

        vis.xScale.domain(d3.extent(vis.dataOverTime, d => vis.xValue(d)));
        vis.yScale.domain(d3.extent(vis.dataOverTime, d => vis.yValue(d)));

        vis.bisectDate = d3.bisector(vis.xValue).left;

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // Initialize line generator helper function
        vis.line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)));

        // Add line path 
        vis.linePath
            .data([vis.dataOverTime])
            .attr('stroke',  'hsl(270, 80%, 50%)')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('d', vis.line);

        vis.trackingArea
            .on('mouseenter', () => {
                vis.tooltip.style('display', 'block');
            })
            .on('mouseleave', () => {
                vis.tooltip.style('display', 'none');
            })
            .on('mousemove', function(event) {
                // Get date that corresponds to current mouse x-coordinate
                const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
                const date = vis.xScale.invert(xPos);
                console.log(date);
        
                // Find nearest data point
                const index = vis.bisectDate(vis.dataOverTime, date, 1);
                console.log(index);
                const a = vis.dataOverTime[index - 1];
                const b = vis.dataOverTime[index];
                const d = b && (date - a.time > b.time - date) ? b : a; 
                console.log(d);
        
                // Update tooltip
                vis.tooltip.select('circle')
                    .attr('transform', `translate(${vis.xScale(d.time)},${vis.yScale(d.val)})`);
                
                vis.tooltip.select('text')
                    .attr('transform', `translate(${vis.xScale(d.time)},${(vis.yScale(d.val) - 15)})`)
                    .text(Math.round(d.val));
            });

        // Update axes
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }
}
