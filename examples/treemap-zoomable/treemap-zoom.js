var w = 1280 - 80,
    h = 800 - 180,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([0, h]),
    color = { red: d3.rgb(193,39,45),
      green: d3.rgb(95,192,128),
      yellow: d3.rgb(255,200,0),
      blue: d3.rgb(77,173,214) },
    root,
    node;

var fill_color = function(name) {
  if (name == 3) {
    return color.red;
  }
  else if (name == 5){
    return color.yellow;
  }
  else if (name == 7) {
    return color.green;
  }
  else {
    return color.blue;
  }
}

var treemap = d3.layout.treemap()
  .round(false)
  .size([w, h])
  .sticky(true)
  .value(function(d) { return d.size; });

var svg = d3.select("#body").append("div")
  .attr("class", "chart")
  .style("width", w + "px")
  .style("height", h + "px")
  .append("svg:svg")
  .attr("width", w)
  .attr("height", h)
  .append("svg:g")
  .attr("transform", "translate(.5,.5)");

d3.json("../data/flare-students.json", function(data) {
  node = root = data;

  var nodes = treemap.nodes(root)
    .filter(function(d) {
      return !d.children;
    });

  var img = document.createElementNS('http://www.w3.org/2000/svg','image');
  img.setAttributeNS(null,'height','32');
  img.setAttributeNS(null,'width','32');
  img.setAttributeNS('http://www.w3.org/1999/xlink','href','http://s3.amazonaws.com/redu_uploads/users/avatars/117/thumb_32/sergio%203x4.jpg?1321655764');
  img.setAttributeNS(null,'x','32');
  img.setAttributeNS(null,'y','32');
  img.setAttributeNS(null, 'visibility', 'visible');

  var cell = svg.selectAll("g")
    .data(nodes)
    .enter().append("svg:g")
    .attr("class", "cell")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .attr("alt", function(d) {
        return "<img src='http://s3.amazonaws.com/redu_uploads/users/avatars/117/thumb_32/sergio%203x4.jpg?1321655764'></img>"
        + "</br>Nome: " + d.name
        + "</br>Comentários: " + d.size
        + "</br>Pedidos de Ajuda: 12"
        + "</br>Respostas à comentários: 22"
        + "</br>Respostas à pedidos de ajuda: 2"
        + "</br>Módulos finalizados: 2/10"
        + "</br>Aulas finalizadas: 8/18"
        + "</br>Nota: " + d.parent.name })
    .on("click", function(d) {
      console.log(d);
        return zoom(node == d.parent ? root : d.parent);
      });


  cell.append("svg:rect")
    .attr("width", function(d) { return d.dx - 1; })
    .attr("height", function(d) { return d.dy - 1; })
    .style("fill", function(d) { return fill_color(d.parent.name); });

  cell.append("svg:image")
    .attr("xlink:href", "http://s3.amazonaws.com/redu_uploads/users/avatars/117/thumb_32/sergio%203x4.jpg?1321655764")
    .attr("width", 32)
    .attr("height", 32)
    .style("opacity", function(d) { return d.dx > 32 ? 1 : 0; });

  cell.append("svg:text")
    .attr("x", function(d) { return d.dx / 2; })
    .attr("y", function(d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return  d.name; })
    .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

  d3.select(window).on("click", function() { zoom(root); });

  // Tooltip da célula
  $(".cell").tipTip({ defaultPosition: "right",
    attribute: "alt" });
});

function zoom(d) {
  var kx = w / d.dx, ky = h / d.dy;
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, d.y + d.dy]);

  var t = svg.selectAll("g.cell").transition()
    .duration(d3.event.altKey ? 7500 : 750)
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  t.select("rect")
    .attr("width", function(d) { return kx * d.dx - 1; })
    .attr("height", function(d) { return ky * d.dy - 1; });

  t.select("image")
   .style("opacity", function(d) { return kx * d.dx > 32 ? 1 : 0; });

  t.select("text")
    .attr("x", function(d) { return kx * d.dx / 2; })
    .attr("y", function(d) { return ky * d.dy / 2; })
    .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}
