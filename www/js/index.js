/*Things that still need to be added
1. Dynamically updated graph based on the clicked object
2. Dynamically updated image should be displayed when clicked on the product
3. Organize the code better
4. Solve the async issue with the product info, unable to go back with the button
5. Update JSON file to store products and not humans

*/

//creating objects of grocery items
//Fullproductlist
var plist = new Array();
//CartList
var cartlist = new Array();
//reference object
var newItem;
//keeps id of selected list
var rowid;
//keeps last PageID
var pageID;
var nextPageID
var prevPageID

function Item(itemID, iproductName, iprice, ipicture, icalories, ifat, isodium, icarbohydrate, iprotein) {
    this.itemID = itemID;
    this.iproductName = iproductName;
    this.iprice = iprice;
    this.ipicture = ipicture;
    this.icalories = icalories;
    this.ifat = ifat;
    this.isodium = isodium;
    this.icarbohydrate = icarbohydrate;
    this.iprotein = iprotein;
}

//Load once on intial document load
$(document).one('ready', function () {
    //get data from JSON file
    $.getJSON("groceryItems.json", function (data) {
        console.log(data);

        //make the data start point
        start = data.groceryItems;

        for (x = 0; x < start.length; x++) {
            //get Item from JSON and make object 
            newItem = new Item(
                start[x].id,
                start[x].productName,
                start[x].price,
                start[x].picture,
                start[x].nutritionFacts.calories,
                start[x].nutritionFacts.fat,
                start[x].nutritionFacts.sodium,
                start[x].nutritionFacts.carbohydrate,
                start[x].nutritionFacts.protein
            );
            //insert object into array lost of products
            plist.push(newItem);

        }

    });

});


//Loads on the home page !Blocks other JS!
$(document).on('pagecreate', '#home', function () {

});

//loaded when the products page is lanched
$(document).on('pagecreate', '#products', function () {

    //Display the JSON data to user.
    //for loop through the array list 
    ul = $("#productsList");
    for (x = 0; x < plist.length; x++) {
        //append to list view
        ul.append(

            "<li li-id='" + x + "'><a href='#product_info'>" + plist[x].iproductName + "</a></li>"
        );

    }
    //refresh list view
    ul.listview('refresh');


});

//Loaded when search page is opened
$(document).on('pagecreate', '#searchPage', function () {

    //Load List 
    ul = $("#productsListSearch");
    for (x = 0; x < plist.length; x++) {

        //append to list view
        ul.append(

            "<li li-id='" + x + "'><a>" + plist[x].iproductName + "</a></li>"
        );

    }
    //refresh list view
    ul.listview('refresh');

    //Create Trigger for key press to search 
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#productsListSearch li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

});
//Gets the option selected on click or tap 
$(document).on('click tap', '#productsList>li', function () {
    rowid = $(this).closest("li").attr("li-id");
    console.log(rowid);
});

//On product-info open
$(document).on("pagebeforeshow", "#product_info", function () {
    //$("#productName").html("");
    //$("#productPrice").html("");
    //rowID has to be preassigned or code breaks    
    //Incomplete depending on Product-Info page Changes should be done here
    $("#productName").empty();
    $("#productPrice").empty();
    $("#image").empty();

    $("#image").append("<img src='./img/" +plist[rowid].ipicture +"' alt='' style='width: 150px', 'height: 150px';>");

    $("#productName").append(plist[rowid].iproductName);
    $("#productPrice").append(plist[rowid].iprice);

    var calories = parseInt(plist[rowid].icalories);
    var fat = parseInt(plist[rowid].ifat);
    var sodium = parseInt(plist[rowid].isodium);
    var carbohydrate = parseInt(plist[rowid].icarbohydrate);
    var protein = parseInt(plist[rowid].iprotein);

    // Shows statistics 
    google.charts.load('current', { 'packages': ['corechart', 'bar'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    $prod = $("#prod");
    var title = $prod.text(); // Will be dynamically updated

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Nutrition', 'Values', { role: 'style' }],
            ['Calories', calories, 'color: #448cff'],
            ['Fat', fat, 'color: #448cff'],
            ['Sodium', sodium, 'color: #448cff'],
            ['Carbohydrate',carbohydrate, 'color: #448cff'],
            ['Protein', protein, 'color:  #448cff']
        ]);

        var options = {
            title: 'Nutrition Facts',
            chartArea: { width: '50%' },
            hAxis: {
                title: 'Values',
                minValue: 0,
                textStyle: {
                    bold: true,
                    fontSize: 12,
                    color: '#4d4d4d'
                },
                titleTextStyle: {
                    bold: true,
                    fontSize: 18,
                    color: '#4d4d4d'
                }
            },
            vAxis: {
                titleTextStyle: {
                    fontSize: 14,
                    bold: true,
                    color: '#848484'
                }
            },
            legend: {position: 'none'}
        };
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

});

//Swipe functions if want to add later
/*$(document).one('pagecreate',function(){ 
    $('[data-role=page]').on('swipeleft',function(){
        nextPageID =$(this).next().attr('ID');
        $.mobile.changePage('#'+nextPageID, {transition: 'slide'} );
    });
    
    $('[data-role=page]').on('swiperight',function(){
        prevPageID =$(this).prev().attr('ID');
        $.mobile.changePage('#'+prevPageID, {transition: 'slide',reverse :true});
    });
});*/

//Add to Cart Button 
$(document).on("click", "#buyButton", function () {
    //rowid = $(this).closest("li").attr("li-id");
    cartlist.push(plist[rowid]);
    //localStorage.setItem("rowid",rowid);
    //empty Local Stroage
    localStorage.setItem("cartlist", "");
    //Set Local Storage
    localStorage.setItem("cartlist", JSON.stringify(cartlist));
})

//On Cart Page loaded
$(document).on("pageshow", "#cart", function () {
    //Get Data from local Storage
    //rowid = localStorage.getItem("rowid");
    cartlist = JSON.parse(localStorage.getItem("cartlist"));
    //add to List in cart
    ul = $("#cartUserList");
    ul.empty();
    for (x = 0; x < cartlist.length; x++) {

        //append to list view
        ul.append(

            "<li li-id='" + x + "' data-icon='delete'><a>" + cartlist[x].iproductName + "</a></li>"
        );

    }
    //refresh list view
    ul.listview('refresh');

});

$(document).on("pageshow", "#deleteCart", function () {
    while (cartlist.length) {
        cartlist.pop();
    }
    localStorage.clear();
});