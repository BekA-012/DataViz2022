async function drawHistogram(metricAccessor) {

    const dataset = await d3.json("../my_weather_data.json")
    const yAccessor = d => d.length

    const width = 700
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 30,
            right: 10,
            bottom: 50,
            left: 50,
        },
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom


    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)


    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, metricAccessor))
        .range([75, dimensions.boundedWidth])
        .nice()

    const binsGenerator = d3.bin()
        .domain(xScale.domain())
        .value(metricAccessor)
        .thresholds(12)

    const bins = binsGenerator(dataset)
    console.log(bins)

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.boundedHeight, 20])
        .nice()


    const binGroups = bounds.selectAll("g")
        .data(bins)
        .join("g")

    const barPadding = 1
    const barRects = binGroups.append("rect")
        .attr("x", d => xScale(d.x0) + barPadding / 2)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", d => d3.max([
            0,
            xScale(d.x1) - xScale(d.x0) - barPadding
        ]))
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr("fill", "cornflowerblue")

    const x_axis_gen = d3.axisBottom().scale(xScale);
    const x_axis = bounds.append("g").style("transform", `translateY(${dimensions.boundedHeight}px)`).call(x_axis_gen);

    const countText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr("y", d => yScale(yAccessor(d)) - 5)
        .text(yAccessor)
        .style("text-anchor", "middle")
        .attr("fill", "darkgrey")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")


    var y = d3.scaleLinear().domain([0, d3.max(bins, function (d) {
        return d.length;
    })]).range([dimensions.boundedHeight, 20])
  
    bounds.append("g")
        .attr("transform", "translate(" + 75 + "," + 0 + ")")
        .call(d3.axisLeft(y));

    bounds.append('text')
        .attr("text-anchor", "end")
        .attr("class", "y label")
        .attr("y", 30)
        .attr("x", -250)
        .attr("transform", "rotate(-90)")
        .text("Count");

    bounds.append('text')
        .attr("text-anchor", "end")
        .attr("class", "x label")
        .attr("x", 500)
        .attr("y", 500)
        .text("Temperature");
}
const getMax = d => d.temperatureMax;
const getMin = d => d.temperatureMin;
const getLow = d => d.temperatureLow;
const getHigh = d => d.temperatureHigh;
