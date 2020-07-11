function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      optionChanged(data.names[0]);
     })}
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildBarChart(sample);
    buildBubbleChart(sample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID:" + " " + (result.location));
      PANEL.append("h6").text("ETHNICITY:" + " " + (result.ethinicty));
      PANEL.append("h6").text("GENDER:" + " " + (result.gender));
      PANEL.append("h6").text("AGE:" + " " + (result.age));
      PANEL.append("h6").text("LOCATION:" + " " + (result.location));
      PANEL.append("h6").text("BBTYPE:" + " " + (result.bbtype));
      PANEL.append("h6").text("WFREQ:" + " " + (result.wfreq));
    });

}

function buildBarChart(sample){
  d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  var otu_ids_arr = result.otu_ids;
  var otu_labels_arr = result.otu_labels;
  var sample_values_arr = result.sample_values;
  var dict = {}

 
  for (let i = 0; i < otu_labels_arr.length; i++){
      dict[i] = [otu_labels_arr[i],sample_values_arr[i], otu_ids_arr[i]];
  }

 
  var items = Object.keys(dict).map(function(key){
      return[key, dict[key][0], dict[key][1], dict[key][2]];
  });

  
  items.sort(function(first, second){
      return second[2]-first[2];
  });

 
  var plot_material = [];
  plot_material = items.slice(0,10);

  var plot_values = [];
  var plot_labels = [];
  var plot_description = [];

  
  plot_material.forEach(function(item){
      plot_description.push(item[1]);
      plot_values.push(item[2]);
      plot_labels.push("OTU "+item[3]);
  });

  
  var trace = {
      y: plot_labels.reverse(),
      x: plot_values.reverse(),
      text: plot_description.reverse().map(a => a.split(';').join(',<br>')),
      hoverinfo: 'text',
      type: "bar",
      orientation: 'h'
     };
  var data_bar = [trace];
  var layout = {
      annotation: {align: 'left'},
  };
  Plotly.newPlot("bar", data_bar, layout);
});
}

function buildBubbleChart(sample){
  d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  var otu_ids_arr = result.otu_ids;
  var otu_labels_arr = result.otu_labels;
  var sample_values_arr = result.sample_values;
  var dict = {}

  
  var trace = {
      x: otu_ids_arr,
      y: sample_values_arr,
      mode: 'markers',
      marker: {
          size: sample_values_arr,
          color: otu_ids_arr,
          colorscale: [[0, 'rgb(255, 0, 0)'], [1, 'rgb(100,0,100)']],
      },
      text: otu_labels_arr.map(a => a.split(';').join(',<br>')),
      hoverinfo: 'text',
     };
  var data_bar = [trace];
  var layout = {
      annotation: {align: 'left'},
      xaxis: { title: "OTU ID"},
  };
  Plotly.newPlot("bubble", data_bar, layout);
});

  init();}