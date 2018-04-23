//creating objects of grocery items
//productlist
var plist = new Array();
//reference object
var newItem;
//keeps id of selected list
var rowid;
//keeps last PageID
var pageID;

function Item(itemID, iproductName, iprice, ipicture, icalories,inutFree,isugar,idairy) {
	this.itemID = itemID;
	this.iproductName = iproductName;
	this.iprice = iprice;
	this.ipicture = ipicture;
    this.icalories = icalories;
    this.inutFree = inutFree;
    this.isugar = isugar;
	this.idairy = idairy;
}

//Load once on intial document load
$(document).one('ready',function(){
    //get data from JSON file
    $.getJSON("groceryItems.json",function(data){
       console.log(data); 
        
        //make the data start point
        start = data.groceryItems;
        
        for(x=0;x<start.length;x++)
            {
                //get Item from JSON and make object 
                newItem = new Item(start[x].id,start[x].productName,start[x].price,start[x].picture,start[x].nutritionFacts.calories,start[x].nutritionFacts.nutFree,start[x].nutritionFacts.sugar,start[x].nutritionFacts.dairy);
                
                //insert object into array lost of products
                plist.push(newItem);
                
            }
        
    });
    
});

//loads on home page
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

//loaded when the products page is lanched
$(document).on('pagecreate','#products',function(){
    
        //Display the JSON data to user.
        //for loop through the array list 
        ul = $("#productsList");
        for(x=0;x<plist.length;x++)
            {
                
                //append to list view
                 ul.append(
                    
                    "<li li-id='"+x+"'><a href='#product_info'>"+plist[x].iproductName+"</a></li>"
                );
                
            }
        //refresh list view
        ul.listview('refresh');
        
    
});

//Loaded when search page is opened
$(document).on('pagecreate','#searchPage',function(){
    
    //Load List 
    ul = $("#productsListSearch");
    for(x=0;x<plist.length;x++)
            {
                
                //append to list view
                 ul.append(
                    
                    "<li><a>"+plist[x].iproductName+"</a></li>"
                );
                
            }
        //refresh list view
        ul.listview('refresh');
    
    
    //var input, filter, ul, li, a, i;
    //input = $("#myInput");
    //filter = input.text().toUpperCase();
    //li = ul.getElementsByTagName("li");
    
    //Create Trigger for key press to search 
     $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#productsListSearch li").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    
});
//Gets the option selected 
$(document).on('click','#productsList>li',function(){
        rowid = $(this).closest("li").attr("li-id");
    console.log(rowid);
    });

//On product info open
$(document).on("pageshow","#product_info",function(){
        //$("#productName").html("");
        //$("#productPrice").html("");
        
        $("#productName").append(plist[rowid].iproductName);
        
        $("#productPrice").append(plist[rowid].iprice);
    });