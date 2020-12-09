function plotAllocation(policy,greed_factor,ucb_scale,epsilon,strategy,order) {
    // get the container for the chart
    var container = d3.select("#allocation-plot")
    container.selectAll("svg").remove();

    // Get dimensions of parent container
    var rect = container.node().getBoundingClientRect();
    var container_width = rect.width;
    var container_height = container_width*0.75;
    
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 130, bottom: 50, left: 50},
    width = container_width - margin.left - margin.right,
    height = container_height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#allocation-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    var data_url = `${base_url}?policy=${policy}&greed_factor=${greed_factor}&ucb_scale=${ucb_scale}&epsilon=${epsilon}&strategy=${strategy}&order=${order}`
    d3.json(data_url, function(data){
        //////////
        // GENERAL //
        //////////
        var allocation_data = []

        for (var i =0;i<data.length;i++){
            j = {}
            j["timestep"] = i+1
            for (var k = 0; k<data[i].length;k++){
                j[data[i][k]["model_id"]] = data[i][k]["allocation"]
            }
            allocation_data.push(j)
        }
        // List of groups
        var model_names = ["Baseline", "Target Pool 1", "Target Pool 2", "Target Pool 3", "Target Pool 4", "Target Pool 5"]
        //var model_names = ["model_baseline","model1_rf", "model2_lr", "model3_lr","model4_xgb","model5_lgbm"]
        
        // color palette
        // taupe green, sun yellow, zeppelin orange, zeppelin brown, deep teal blue, purple
        var color_scheme = ["#A4BB9F","#F5CA34","#F98165","#DEBC97","#76A0F2","#546C8C"]
        var color_scheme_og = d3.schemeCategory10

        var color = d3.scaleOrdinal()
        .domain(model_names)
        .range(color_scheme);
    
        //stack the data?
        var stackedData = d3.stack()
        .keys(model_names)(allocation_data)

        //////////
        // AXIS //
        //////////
    
        // Add X axis
        var x = d3.scaleLinear()
        .domain([1,50])
        .range([ 0, width ]);
        var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
    
        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height+40 )
            .text("Timestep")
            .attr("font-size","12px");
    
        // Add Y axis label:
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -40 )
            .text("Allocation Fraction")
            .attr("text-anchor", "middle")
            .attr("font-size","12px");
    
        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
    
    
    
        //////////
        // BRUSHING AND CHART //
        //////////
    
        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);
    
        // Create the scatter variable: where both the circles and the brush take place
        var areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")
    
        // Area generator
        var area = d3.area()
        .x(function(d) { return x(d.data.timestep); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    
        // Show the areas
        areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
            .attr("class", function(d) { return "myArea " + d.key })
            .style("fill", function(d) { return color(d.key); })
            .attr("d", area)
    
        //////////
        // LEGEND //
        //////////
    
        // Add one dot in the legend for each name.
        var size = 20
        svg.selectAll("myrect")
            .data(model_names)
            .enter()
            .append("rect")
            .attr("x", container_width - 170)
            .attr("y", function(d,i){ return  i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)})
    
        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(model_names)
            .enter()
            .append("text")
            .attr("x", (container_width - 170) + size*1.2)
            .attr("y", function(d,i){ return 3 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "#000000")
            .style("font-size","10px")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    
    })
};

function plotLines(policy,greed_factor,ucb_scale,epsilon,strategy,order) {
    // get the container for the chart
    var container = d3.select("#line-plot")
    container.selectAll("svg").remove();

    // Get dimensions of parent container
    var rect = container.node().getBoundingClientRect();
    var container_width = rect.width;
    var container_height = container_width*0.75;
    
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 130, bottom: 50, left: 50},
    width = container_width - margin.left - margin.right,
    height = container_height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#line-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    var data_url = `${base_url}?policy=${policy}&greed_factor=${greed_factor}&ucb_scale=${ucb_scale}&epsilon=${epsilon}&strategy=${strategy}&order=${order}`
    d3.json(data_url, function(data){
        //////////
        // GENERAL //
        //////////
        var reward_data = []
        var regret_data = []
        //iterate over timesteps
        for (var i = 0; i<data.length; i++){
            reward_data.push({'x':i+1,'y':data[i][0]['target_reward_sum']})
            regret_data.push({'x':i+1,'y':data[i][0]['target_regret_sum']})
        }
        //////////
        // AXIS //
        //////////
    
        // Add X axis
        var x = d3.scaleLinear()
                  .domain([1,50])
                  .range([ 0, width ]);
        var xAxis = svg.append("g")
                       .attr("transform", "translate(0," + height + ")")
                       .call(d3.axisBottom(x).ticks(5))
    
        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height+40 )
            .text("Timestep")
            .attr("font-size","12px");
    
        // Add Y axis label:
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -40 )
            .text("Cumulative Reward or Regret")
            .attr("text-anchor", "middle")
            .attr("font-size","12px")

        var yMaxReward = reward_data[reward_data.length-1].y
        var yMaxRegret = regret_data[regret_data.length-1].y

        var yScaleMax = d3.max([yMaxReward,yMaxRegret])
    
        // Add Y axis
        var y = d3.scaleLinear()
                  .domain([0, yScaleMax])
                  .range([ height, 0 ]);
        var yAxis = svg.append("g")
                       .call(d3.axisLeft(y).ticks(5))
    
        //////////
        // CHART //
        //////////
        svg.append("path")
            .datum(reward_data)
            .attr("fill", "none")
            .attr("stroke", "#29ABE2")
            .attr("stroke-width", 2.5)
            .attr("d", d3.line()
                         .x(function(d) { return x(d.x); })
                         .y(function(d) { return y(d.y); })  
            );

        svg.append("path")
            .datum(regret_data)
            .attr("fill", "none")
            .attr("stroke", "#FF5500")
            .attr("stroke-width", 2.5)
            .attr("d", d3.line()
                         .x(function(d) { return x(d.x); })
                         .y(function(d) { return y(d.y); })  
            );

        // Labels
        svg.append('text')
            .attr('text-anchor', 'start')
            .attr("x", x(reward_data[reward_data.length-1].x) + 10)
            .attr("y", y(reward_data[reward_data.length-1].y) + 6 )
            .style("fill", "#29ABE2")
            .text("Reward");

        svg.append('text')
            .attr('text-anchor', 'start')
            .attr("x", x(regret_data[regret_data.length-1].x) + 10)
            .attr("y", y(regret_data[regret_data.length-1].y) + 6 )
            .style("fill", "#FF5500")
            .text("Regret");
    
    })
};

function getSelection(id) {
    var e = document.getElementById(id);
    var selection = e.options[e.selectedIndex].value;
    return selection;
};

function reDrawCharts(){
    // Get dropdown values
    var selectedPolicy = getSelection("inlineFormCustomSelectPolicy");
    var selectedGreedFactor = getSelection("inlineFormCustomSelectGreedFactor");
    var selectedUCBScale = getSelection("inlineFormCustomSelectUCBScale");
    var selectedEpsilon = getSelection("inlineFormCustomSelectEpsilon");
    var selectedStrategy = getSelection("inlineFormCustomSelectStrategy");
    var selectedOrder = getSelection("inlineFormCustomSelectOrder");

    if (selectedPolicy == "UCB1"){
        plotAllocation(selectedPolicy,parseFloat(selectedGreedFactor),null,null,selectedStrategy,selectedOrder)
        plotLines(selectedPolicy,parseFloat(selectedGreedFactor),null,null,selectedStrategy,selectedOrder)
    }
    else if (selectedPolicy == "Bayes_UCB") {
        plotAllocation(selectedPolicy,parseFloat(selectedGreedFactor),parseInt(selectedUCBScale),null,selectedStrategy,selectedOrder)
        plotLines(selectedPolicy,parseFloat(selectedGreedFactor),parseInt(selectedUCBScale),null,selectedStrategy,selectedOrder)
    }
    else if (selectedPolicy == "epsilon_greedy") {
        plotAllocation(selectedPolicy,parseFloat(selectedGreedFactor),null,parseFloat(selectedEpsilon),selectedStrategy,selectedOrder)
        plotLines(selectedPolicy,parseFloat(selectedGreedFactor),null,parseFloat(selectedEpsilon),selectedStrategy,selectedOrder)
    }
};


plotAllocation("UCB1",1,null,null,"round-robin","best")
plotLines("UCB1",1,null,null,"round-robin","best")

document.getElementById('inlineFormCustomSelectPolicy').addEventListener('change',function(){
    reDrawCharts();
});
document.getElementById('inlineFormCustomSelectGreedFactor').addEventListener('change',function(){
    reDrawCharts();
});
document.getElementById('inlineFormCustomSelectUCBScale').addEventListener('change',function(){
    reDrawCharts();
});
document.getElementById('inlineFormCustomSelectEpsilon').addEventListener('change',function(){
    reDrawCharts();
});
document.getElementById('inlineFormCustomSelectStrategy').addEventListener('change',function(){
    reDrawCharts();
});
document.getElementById('inlineFormCustomSelectOrder').addEventListener('change',function(){
    reDrawCharts();
});

window.onresize = reDrawCharts;