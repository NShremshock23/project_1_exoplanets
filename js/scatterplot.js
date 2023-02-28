class Scatterplot {
    
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

        // Add data for solar system
        // (https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html)
        vis.data.push({
            pl_name: "Mercury",
            hostname: "Solar System",
            sys_name: "Solar System",
            sy_snum: "1",
            sy_pnum: "8",
            discoverymethod: "",
            disc_year: "",
            pl_orbsmax: "",
            pl_rade: "0.383",
            pl_bmasse: "0.0553",
            pl_orbeccen: "",
            st_spectype: "",
            st_rad: "",
            st_mass: "",
            sy_dist: "",
            disc_facility: ""
        });

        vis.data.push({
            pl_name: "Venus",
            hostname: "Solar System",
            sys_name: "Solar System",
            sy_snum: "1",
            sy_pnum: "8",
            discoverymethod: "",
            disc_year: "",
            pl_orbsmax: "",
            pl_rade: "0.949",
            pl_bmasse: "0.815",
            pl_orbeccen: "",
            st_spectype: "",
            st_rad: "",
            st_mass: "",
            sy_dist: "",
            disc_facility: ""
        });

        vis.data.push({
            pl_name: "Mars",
            hostname: "Solar System",
            sys_name: "Solar System",
            sy_snum: "1",
            sy_pnum: "8",
            discoverymethod: "",
            disc_year: "",
            pl_orbsmax: "",
            pl_rade: "0.2724",
            pl_bmasse: "0.107",
            pl_orbeccen: "",
            st_spectype: "",
            st_rad: "",
            st_mass: "",
            sy_dist: "",
            disc_facility: ""
        });

        vis.data.push({
            pl_name: "Jupiter",
            hostname: "Solar System",
            sys_name: "Solar System",
            sy_snum: "1",
            sy_pnum: "8",
            discoverymethod: "",
            disc_year: "",
            pl_orbsmax: "",
            pl_rade: "11.21",
            pl_bmasse: "317.8",
            pl_orbeccen: "",
            st_spectype: "",
            st_rad: "",
            st_mass: "",
            sy_dist: "",
            disc_facility: ""
        });

        vis.data.push({
            pl_name: "Saturn",
            hostname: "Solar System",
            sys_name: "Solar System",
            sy_snum: "1",
            sy_pnum: "8",
            discoverymethod: "",
            disc_year: "",
            pl_orbsmax: "",
            pl_rade: "9.45",
            pl_bmasse: "95.2",
            pl_orbeccen: "",
            st_spectype: "",
            st_rad: "",
            st_mass: "",
            sy_dist: "",
            disc_facility: ""
        });

        vis.data.push({
            pl_name: "Uranus",
            hostname: "Solar System",
            sys_name: "Solar System",
            sy_snum: "1",
            sy_pnum: "8",
            discoverymethod: "",
            disc_year: "",
            pl_orbsmax: "",
            pl_rade: "4.01",
            pl_bmasse: "14.5",
            pl_orbeccen: "",
            st_spectype: "",
            st_rad: "",
            st_mass: "",
            sy_dist: "",
            disc_facility: ""
        });

        vis.data.push({
            pl_name: "Neptune",
            hostname: "Solar System",
            sys_name: "Solar System",
            sy_snum: "1",
            sy_pnum: "8",
            discoverymethod: "",
            disc_year: "",
            pl_orbsmax: "",
            pl_rade: "3.88",
            pl_bmasse: "17.1",
            pl_orbeccen: "",
            st_spectype: "",
            st_rad: "",
            st_mass: "",
            sy_dist: "",
            disc_facility: ""
        });

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', '100%')
            .attr('height', '100%');

        vis.width = vis.svg.node().getBoundingClientRect().width - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.svg.node().getBoundingClientRect().height - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        // Initialize line
        vis.linePath = vis.chart.append('path')
            .attr('class', 'chart-line');
        
        // Initialize linear scales
        // Domain for each scale is set in updateVis() to match possibly filtered data
        vis.yScale = d3.scaleLog()
            .range([vis.height, 1])
            .base(10);
    
        vis.xScale = d3.scaleLog()
            .range([1, vis.width])
            .base(10);
    
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
            .attr('x', 15)
            .attr('y', (vis.height / 2) + vis.config.margin.top)
            .text('Exoplanet Mass (Earth Mass)')
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
            .text('Exoplanet Radius (Earth Radius)');
    }

    updateVis() {
        let vis = this;

        vis.valuePairs = [];

        vis.data = vis.data.filter(d => {
            return (d.pl_bmasse != "BLANK" && d.pl_rade != "BLANK" && d.pl_bmasse != "" && d.pl_rade != "")
        });

        vis.xValue = d => +d.pl_rade;
        vis.yValue = d => +d.pl_bmasse;

        // Domains are scaled to give some space between extreme values and chart borders/axes
        vis.xScale.domain([d3.min(vis.data, d => vis.xValue(d)) * 0.95, 
                           d3.max(vis.data, d => vis.xValue(d)) * 1.05]);
        vis.yScale.domain([d3.min(vis.data, d => vis.yValue(d)) * 0.8, 
                           d3.max(vis.data, d => vis.yValue(d)) * 1.2]);

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // Add circles
        vis.circles = vis.chart.selectAll('.point')
            .data(vis.data)
            .join('circle')
                .attr('class', 'point')
                .attr('r', 2)
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('fill', d => {
                    if (d.sys_name == "Solar System") return "hsl(0, 74%, 53%)";
                    else return "hsl(205, 74%, 49%)";
                })
                .on('mouseover', (event,d) => {
                    d3.select('#tooltip')
                        .style('display', 'block')
                        .style('left', (event.pageX + 10) + 'px')   
                        .style('top', (event.pageY + 10) + 'px')
                        .style('text-align', 'left')
                        .html(`
                            <div class="tooltip-title">${d.pl_name}</div>
                            <div><i>System: ${d.sys_name}</i></div>
                            <div>(${d.pl_rade} Earth Radii, ${d.pl_bmasse} Earth Masses)</div>
                        `);
                })
                  .on('mouseleave', () => {
                    d3.select('#tooltip').style('display', 'none');
                  });;

        // Update axes
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }
}