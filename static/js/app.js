// Set the URL for the JSON data source
var url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use D3 to fetch the JSON data and log it to the console
d3.json(url).then(function(data) {
    buildCharts(data.names[0]);
    buildMetadata(data.names[0]);
});

// Define function to initialize the dropdown menu
function init() {
  // Select the dropdown menu element
  var selector = d3.select("#selDataset");

  // Use D3 to get the list of sample names
  d3.json(url).then((data) => {
    var sampleNames = data.names;
    // Loop through the sample names and append an options
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();
// Define function to update charts and metadata
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Define function to build metadata panel 
function buildMetadata(sample) {
  // Use D3 to get the metadata for all samples
  d3.json(url).then((data) => {
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
  
    // Select the metadata panel element
    var PANEL = d3.select("#sample-metadata");

    // Clear the previous contents of the metadata panel
    PANEL.html("");

    // Loop through each key-value pair in the result object and append the metadata panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });
  });
}


// Build the horizontal bar chart
function buildCharts(sample) {
  // Use D3 to get the data for all samples
  d3.json(url).then((data) => {
    var samples = data.samples;

    // Filter the data for the object with the desired sample number
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Get the top 10 OTUs and their values
    var otuIds = result.otu_ids.slice(0, 10).reverse();
    var otuLabels = result.otu_labels.slice(0, 10).reverse();
    var sampleValues = result.sample_values.slice(0, 10).reverse();

    // Format the OTU IDs for display on the bar chart
    var otuIdsFormatted = otuIds.map(id => "OTU " + id);

    // Create the bar chart trace
    var trace = {
      x: sampleValues,
      y: otuIdsFormatted,
      text: otuLabels,
      type: "bar",
      orientation: "h",
      marker: {color: otuIds}
      };

      // Add the bar chart trace to the data array
      var data = [trace];

      // Define the chart layout
      var layout = {
      title: "Top 10 Bacteria Cultures Found",
      };
      // Create the bar chart
      Plotly.newPlot("bar", data, layout);
      
// Create the trace for the bubble chart
    var trace2 = {
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids
      }
    };

// Add the bubble chart trace to the data array
    var data2 = [trace2];

    // Define the bubble chart layout
    var layout2 = {
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      hovermode: "closest",
      showlegend: false
    };
    // Create the bubble chart
    Plotly.newPlot("bubble", data2, layout2);

});
}