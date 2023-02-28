console.log("Start of main.js");

const datasheet = "data/exoplanets-1.csv";
let data;

// Initialize dispatcher that is used to orchestrate events
const dispatcher = d3.dispatch('filterBar');

d3.csv(datasheet)
    .then(_data => {
        console.log(`Data loaded successfully (${datasheet})`)
        data = _data;
        console.log(data);

        let bar_starCount = new BarChart({
            'parentElement': '#starCount',
            'dataType': 'starCount',
			'containerHeight': 300,
			'containerWidth': 500 
            }, data);
        bar_starCount.updateVis();

        let bar_planetCount = new BarChart({
            'parentElement': '#planetCount',
            'dataType': 'planetCount',
			'containerHeight': 300,
			'containerWidth': 500 
            }, data);
        bar_planetCount.updateVis();

        let bar_starType = new BarChart({
            'parentElement': '#starType',
            'dataType': 'starType',
			'containerHeight': 300,
			'containerWidth': 500 
            }, data);
        bar_starType.updateVis();

        let bar_discMethod = new BarChart({
            'parentElement': '#discMethod',
            'dataType': 'discMethod',
			'containerHeight': 300,
			'containerWidth': 500 
            }, data);
        bar_discMethod.updateVis();

        let bar_habitableZone = new BarChart({
            'parentElement': '#habitableZone',
            'dataType': 'habitableZone',
			'containerHeight': 300,
			'containerWidth': 500 
            }, data);
        bar_habitableZone.updateVis();

        let histogram = new Histogram({
            'parentElement': '#histogram',
			'containerHeight': 300,
			'containerWidth': 500 
            }, data);
        histogram.updateVis();

        let line = new LineChart({
            'parentElement': '#line',
			'containerHeight': 500,
			'containerWidth': 1500 
        }, data);
        line.updateVis();

        let scatter = new Scatterplot({
            'parentElement': '#scatter',
			'containerHeight': 500,
			'containerWidth': 1500 
        }, data);
        scatter.updateVis();
});

dispatcher.on('filterBar', selectedData => {
    // TODO: data filtering based on selection -> update all charts
});