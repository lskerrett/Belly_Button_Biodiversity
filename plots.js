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
})}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text('ID: ' + result.id);
    PANEL.append("h6").text('ETHNICITY: ' + result.ethnicity);
    PANEL.append("h6").text('GENDER: ' + result.gender);
    PANEL.append("h6").text('AGE: ' + result.age);
    PANEL.append("h6").text('LOCATION: ' + result.location);
    PANEL.append("h6").text('BBTYPE: ' + result.bbtype);
    PANEL.append("h6").text('WFREQ: ' + result.wfreq);
    
  });
};

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
      var valuesamples = data.samples;
      var newarray = valuesamples.filter(sampledata => sampledata.id == sample);
      var result = newarray[0];
// Build the bar graph 
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var samplevalues = result.sample_values;
      var Filterdata = otu_ids.slice(0, 10).map(otuID => `OTU${otuID}`).reverse();
      var tracedata = {
          x: samplevalues.slice(0, 10).reverse(),
          y: Filterdata,
          text: otu_labels.slice(0, 10).reverse(),
          orientation: "h",
          type: "bar",
          marker: {
          color: "Green",
          }
      };
      var data = [tracedata];
      var layout = {
          title: "<b>Bacterial Species per Sample </b> <br> Top 10 bacterial species (OTUs)",
          margin: { t: 50, l: 150 },
      };
      Plotly.newPlot("bar", data, layout);
//Build bubble charts 
      var tracesample = {
          x: otu_ids,
          y: samplevalues,
          text: otu_labels,
          type: "scatter",
          mode: 'markers',
          marker: {
              color: otu_ids,
              colorscale: 'Greens',
              opacity: 0.8,
              size: samplevalues,
              sizemode: 'diameter'
          }
      };
      var data = [tracesample];
      var chartlayout = {
          title: "<b> All the Bacterial Species per Sample",
          xaxis: { title: "OTU ID" },
          showlegend: false,
          height: 600,
          width: 1200
      };
      Plotly.newPlot("bubble", data, chartlayout);
  });
}

init();


