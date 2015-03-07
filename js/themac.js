// Add buttons to the page
subid_min = 1
subid_max = 20

// Function to add attributes
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

var sidebar = document.getElementsByClassName("sidebar")[0]
for (var i = subid_min; i <= subid_max; i++) {
  var button = document.createElement("button");
  //var span = document.createElement("span");
  setAttributes(button, {"class": "btn btn-default btn-sm", "type": "button", "onClick": "location.href='?data=sub" + i +"'"});
  //setAttributes(span,{"class": "glyphicon glyphicon-star", "aria-hidden": "true"});
  button.appendChild(document.createTextNode(["Sub" + i]));
  //button.appendChild(span);
  sidebar.appendChild(button);
}

// Read in subject file from url
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//Get json name from the browser url
var csv_data = getUrlVars()
if (typeof csv_data["data"] == 'undefined'){ csv_data = "sub1";}
else { csv_data = csv_data["data"].replace("/",""); }

// Read in data from json
var data;
d3.csv("data/" + csv_data + ".csv", function(error, macdata) {
  if (error) return console.warn(error);
  data = macdata;
  visualizeMAC(data);
});


// Main visualization function
function visualizeMAC(data){

    nodes = []
    timepoints = []
    //weights = []
    data.forEach(function(d) {
        d.node1 = +d.node1;
        d.node2 = +d.node2;
        d.time1 = +d.time1;
        d.time2 = +d.time2;
        d.weight = +d.weight;
        nodes.push(d.node1);
        nodes.push(d.node2);
        timepoints.push(d.time1);
        timepoints.push(d.time2);
        //weights.push(d.weight);
    })

     nodes = d3.set(nodes).values(); 
     timepoints = d3.set(timepoints).values(); 
     timepoints = timepoints.sort()

     // We need colors! (produced with mac_functions make_color_string
     colors = ["#61C0FC","#FF61DF","#A48EC5","#F77DBF","#2D9020","#EDE118","#2502BF","#541343","#60CFAB","#F04833","#108262","#7FA0FE","#25D36B","#F89014","#70E264","#67F269","#DF5FE0","#770ADE","#07B051","#0A3FF5","#87F02A","#ABF2E7","#75DE17","#7D66DF","#2FB213","#2EDD8C","#D6057C","#9B1F98","#D22DCF","#6D6702","#7050B9","#2F29D5","#29A2E4","#AED6C7","#CF2A1A","#5F8ADE","#585853","#964144","#4676AF","#D89D16","#4ADA78","#887FD3","#6304A2","#A96288","#54112C","#30D305","#58A11A","#8AC430","#41370F","#BCF9DF","#B02F86","#65090E","#A79CE6","#199B2B","#598448","#FF2B9A","#63A138","#F722A7","#59AD92","#BD620C","#82EA18","#C26DB5","#55F868","#913945","#689EBA","#E581AC","#13A5AB","#AE7CE1","#B1F6D0","#9F635A","#FA5427","#685D8D","#C6CA03","#3C21CA","#4CF63D","#8397F6","#DCE928","#A73DA7","#EEC5CF","#EC87F1","#49F2AF","#AB3E64"]
     var chartPlaceholder = document.getElementById('mac_placeholder');
     timeBegin = 0,
     timeEnd = timepoints.length;
     // top right bottom left
     var m = [20, 15, 15, 120],
	 w = 20000 - m[1] - m[3],
	 h = 1500 - m[0] - m[2],
	 macHeight = h - 50;
     
     // scales
     var x = d3.scale.linear()
	.domain([0, timepoints.length])
	.range([0, w]);
     var x1 = d3.scale.linear()
	.range([0, w]);
     var y1 = d3.scale.linear()
	.domain([0, nodes.length])
	.range([0, macHeight]);
     var weight = d3.scale.linear()
	.domain([0, 1])
	.range([0, 1]);  

     // add chart to body
     var chart = d3.select("#mac_placeholder")
	.append("svg")
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.attr("class", "chart");
		
     chart.append("defs").append("clipPath")
	 .attr("id", "clip")
	 .append("rect")
	 .attr("width", w)
	 .attr("height", macHeight);

     var mac = chart.append("g")
	 .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
	 .attr("width", w)
	 .attr("height", macHeight)
	 .attr("class", "main");

     // Tooltips for nodes
     var node_tip = d3.tip()
         .attr('class', 'd3-tip')
         .offset([-10, 0])
         .html(function(d) {
            return "<strong>id:</strong><span style='color:tomato'>" + d.node1 + "</span><br>";
          })

     // Tooltips for links
     var link_tip = d3.tip()
         .attr('class', 'd3-tip')
         .offset([-10, 0])
         .html(function(d) {
            return "<strong>weight:</strong><span style='color:tomato'>" + d.weight + "</span><br>";
          })

     // Call tooltips function
     chart.call(node_tip);
     chart.call(link_tip);
	
     // mac lanes
     mac.append("g").selectAll(".macLines")
        .data(data)
	.enter().append("circle")
	.attr("cx", function(d,i) {return x(d.time1)})
	.attr("cy", function(d) {return y1(d.node1);})
	.attr("r", 5)
	.style("fill",function(d,i){ return colors[d.node1]})
        .style("stroke", "lightgray")
        .style("stroke-width", 0.5)
        .on('mouseout.tip', node_tip.hide)
        .on('mouseover.tip', node_tip.show)
        .on('mouseover.color', function(d) {
           d3.select(this).style("fill", "orange");
        })
        .on('mouseout.color', function(d) {
           d3.select(this).style("fill", function(d) {return colors[d.node1]});
        })
        .on('mouseover.size', function(d) {
           d3.select(this).attr("r", 10);
        })
        .on('mouseout.size', function(d) {
           d3.select(this).attr("r", 5);
        });


     // mac texts
     mac.append("g").selectAll(".macText")
       .data(nodes)
       .enter().append("text")
       .text(function(d) {return d;})
       .attr("x", -10)
       .attr("y", function(d, i) {return y1(i + 1);})
       .attr("dy", ".5ex")
       .attr("text-anchor", "end")
       .attr("class", "laneText");

      //draw links
      mac.append("g").selectAll(".macLinks")
        .data(data)
	.enter().append("line")
	.attr("x1", function(d) {return x(d.time1)})
	.attr("y1", function(d) {return y1(d.node1);})
	.attr("x2", function(d) {return x(d.time2)})
	.attr("y2", function(d) {return y1(d.node2);})
	.attr("stroke", "red")
        .attr("stroke-width",2)
        .attr("opacity",function(d){return weight(d.weight)})
        .on('mouseout.tip', link_tip.hide)
        .on('mouseover.tip', link_tip.show)
  };
