
$(document).on('pagecreate', '#home', function(){    
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
  
    $prod = $("#prod");
    var title = $prod.text(); // Will be dynamically updated
    
    function drawChart(title) {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Nutrition');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Calories', 200],
          ['Fat', 0.1],
          ['Sodium', 40],
          ['Carbohydrate', 55],
          ['Protein', 0.1]
        ]);

        // Set chart options
        var options = {'title': 'Product',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
});
  