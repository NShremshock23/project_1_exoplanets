class BarChart {
    
    constructor(_config, _data) {
        // console.log("[BarChart constructor start]");
        this.config = {
            parentElement: _config.parentElement,
            dataType: _config.dataType,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 600,
            margin: { top: 30, bottom: 50, right: 20, left: 60}
        }

        this.data = _data;
        // console.log("[BarChart constructor end]");
        this.initVis();
    }

    initVis() {
        let vis = this;

        if (vis.config.dataType == "discMethod") {
            vis.config.margin = {top: 60, bottom: 140, right: 60, left: 60};
        }
    
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
    
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.15);
    
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0);
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
            .text('# Exoplanets')
            .attr('dy', 1);
        
        // Rotate title
        vis.yAxisTitle
            .attr('transform', `rotate(270, ${vis.yAxisTitle.attr('x')}, ${vis.yAxisTitle.attr('y')})`);

        // Append X axis title
        vis.xAxisTitle = vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', (vis.width / 2) + vis.config.margin.left)
            .attr('y', vis.height + vis.config.margin.top + 40)
            .attr('text-anchor', 'middle');
        
        if (vis.config.dataType == "starType") {
            vis.titleLink = vis.svg.append('text')
                .attr('class', 'link')
                .attr('x', (vis.width / 2) + vis.config.margin.left)
                .attr('y', vis.height + vis.config.margin.top + 60)
                .attr('text-anchor', 'middle');
        }

    }

    updateVis() {
        let vis = this;

        // Prepare data based on barchart dataType
        vis.valuePairs = [];

        switch (vis.config.dataType) {
            case ("starCount"):

                vis.valuePairs =    [{"label": 1, "val": 0}, 
                                    {"label": 2, "val": 0}, 
                                    {"label": 3, "val": 0}, 
                                    {"label": 4, "val": 0}];

                vis.data.forEach(d => {
                    d.sy_snum = +d.sy_snum;
                    let obj = vis.valuePairs.find((o, i) => {
                        if (o.label == d.sy_snum) {
                            vis.valuePairs[i].val++;
                            return true;
                        }
                    });
                });

                vis.xAxisTitle.text("Stars in Exoplanet's System")
                break;
            

            case ("planetCount"):
                
                vis.valuePairs =    [{"label": 1, "val": 0}, 
                                    {"label": 2, "val": 0}, 
                                    {"label": 3, "val": 0}, 
                                    {"label": 4, "val": 0},
                                    {"label": 5, "val": 0},
                                    {"label": 6, "val": 0},
                                    {"label": 7, "val": 0},
                                    {"label": 8, "val": 0}];

                vis.data.forEach(d => {
                    d.sy_pnum = +d.sy_pnum;
                    let obj = vis.valuePairs.find((o, i) => {
                        if (o.label == d.sy_pnum) {
                            vis.valuePairs[i].val++;
                            return true;
                        }
                    });
                });

                vis.xAxisTitle.text("Planets in Exoplanet's System")
                break;


            case ("starType"):
                
                vis.valuePairs =    [{"label": "A", "val": 0}, 
                                    {"label": "F", "val": 0}, 
                                    {"label": "G", "val": 0}, 
                                    {"label": "K", "val": 0},
                                    {"label": "M", "val": 0},
                                    {"label": "Unknown", "val": 0}];

                vis.data.forEach(d => {
                    if (d.st_spectype == "BLANK") {
                        vis.valuePairs[5].val++;
                    }
                    else {
                        let obj = vis.valuePairs.find((o, i) => {
                            if (d.st_spectype.includes(o.label)) {
                                vis.valuePairs[i].val++;
                                return true;
                            }
                        });
                    }
                });

                vis.xAxisTitle.text("Orbited Star's Spectral Type")

                vis.titleLink = vis.svg.append('text')
                    .attr('class', 'link')
                    .attr('x', (vis.width / 2) + vis.config.margin.left + 120)
                    .attr('y', vis.height + vis.config.margin.top + 40)
                    .attr('text-anchor', 'middle')
                    .text('(?)')
                    .on('click', () => window.open("https://en.wikipedia.org/wiki/Stellar_classification"));
                break;
                

            case ("discMethod"):

                vis.data.forEach(d => {
                    let obj = vis.valuePairs.find((o, i) => {
                        if (o.label == d.discoverymethod) {
                            vis.valuePairs[i].val++;
                            return true;
                        }
                    });
                    if (!obj && d.discoverymethod != "") {
                        vis.valuePairs.push({"label": d.discoverymethod, "val": 1});
                    }
                });

                vis.valuePairs.sort((a, b) => {
                    if (a.val < b.val) return 1;
                    else return -1;
                });

                vis.xAxisTitle.text("Exoplanet Discovery Method")

                vis.titleLink = vis.svg.append('text')
                    .attr('class', 'link')
                    .attr('x', (vis.width / 2) + vis.config.margin.left + 120)
                    .attr('y', 40)
                    .attr('text-anchor', 'middle')
                    .text('(?)')
                    .on('click', () => window.open("https://en.wikipedia.org/wiki/Methods_of_detecting_exoplanets"));
                break;


            case ("habitableZone"):

                vis.valuePairs =    [{"label": "Inside", "val": 0}, 
                                    {"label": "Outside", "val": 0},
                                    {"label": "Unknown", "val": 0}];
            
                vis.data.forEach(d => {
                    d.pl_orbsmax = +d.pl_orbsmax;

                    if (d.st_spectype == "BLANK") {
                        vis.valuePairs[2].val++;
                    }
                    else if (d.st_spectype.includes('A')) {
                        if (8.5 <= d.pl_orbsmax && d.pl_orbsmax <= 12.5) {
                            vis.valuePairs[0].val++;
                        } else {
                            vis.valuePairs[1].val++;
                        }
                    }
                    else if (d.st_spectype.includes('F')) {
                        if (1.5 <= d.pl_orbsmax && d.pl_orbsmax <= 2.2) {
                            vis.valuePairs[0].val++;
                        } else {
                            vis.valuePairs[1].val++;
                        }
                    }
                    else if (d.st_spectype.includes('G')) {
                        if (0.95 <= d.pl_orbsmax && d.pl_orbsmax <= 1.4) {
                            vis.valuePairs[0].val++;
                        } else {
                            vis.valuePairs[1].val++;
                        }
                    }
                    else if (d.st_spectype.includes('K')) {
                        if (0.38 <= d.pl_orbsmax && d.pl_orbsmax <= 0.56) {
                            vis.valuePairs[0].val++;
                        } else {
                            vis.valuePairs[1].val++;
                        }
                    }
                    else if (d.st_spectype.includes('M')) {
                        if (0.08 <= d.pl_orbsmax && d.pl_orbsmax <= 0.12) {
                            vis.valuePairs[0].val++;
                        } else {
                            vis.valuePairs[1].val++;
                        }
                    }
                });

                vis.xAxisTitle.text("Planets In/Outside Habitable Zone")
                break;
            

            default:
                break;
        }

        vis.xScale.domain(vis.valuePairs.map(d => d.label));
        vis.yScale.domain([0, d3.max(vis.valuePairs, d => d.val)]).nice();

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // Add rectangles
        vis.bars = vis.chart.selectAll('.bar')
            .data(vis.valuePairs)
            .join('rect')
                .attr('class', 'bar')
                .attr('fill', 'hsl(271, 48%, 61%)')
                .attr('height', d => vis.height - vis.yScale(d.val))
                .attr('width', vis.xScale.bandwidth())
                .attr('y', d => vis.yScale(d.val))
                .attr('x', d => vis.xScale(d.label) + 1)
                .on('mouseenter', vis.tooltipDisplay)
                .on('mouseleave', () => {
                    d3.select('#tooltip').style('display', 'none');
                });
            

        // Add tracking areas for each bar
        vis.trackers = vis.chart.selectAll('.tracker')
            .data(vis.valuePairs)
            .join('rect')
                .attr('class', 'tracker')
                .attr('fill', '#f6eeee')
                .attr('height', d => vis.yScale(d.val) - 1)
                .attr('width', vis.xScale.bandwidth())
                .attr('y', 0)
                .attr('x', d => vis.xScale(d.label) + 1)    // Shifted over to keep from overlapping axis
                .on('mouseenter', vis.tooltipDisplay)
                .on('mouseleave', () => {
                    d3.select('#tooltip').style('display', 'none');
                });
                

        // Update axes
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);

        if (vis.config.dataType == "discMethod") {
            vis.xAxisGroup
                .selectAll('text')
                    .style('text-anchor', 'start')
                    .attr("dx", "7")
                    .attr("dy", "5")
                    .attr("transform", `rotate(55)`);

            vis.xAxisTitle.attr('y', 40);
        }
    }

    tooltipDisplay(event, d) {
        let tooltipText = `<p class="tip-text">${d.val} Planets</p>`;

        d3.select('#tooltip')
            .style('display', 'block')
            .style('text-align', 'center')
            .style('left', (event.pageX + 2) + 'px')   
            .style('top', (event.pageY + 2) + 'px')
            .html(tooltipText);
    }
}

