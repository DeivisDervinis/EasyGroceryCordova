
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

// Constructor for the item
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


// A method that populates the products screen with products
$(document).on('pagecreate', '#products', function () {

    //Saves selector to a variable for an easier usage
    ul = $("#productsList");

    // Runs a for loop based on the size of the list
    for (x = 0; x < plist.length; x++) {
        // Adds the elements
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

            "<li li-id='" + x + "'>" + plist[x].iproductName + "</li>"
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

    // Clears the page
    $("#productName").empty();
    $("#productPrice").empty();
    $("#image").empty();

    //Builds the page based on the information from JSON 
    $("#image").append("<img src='./img/" +plist[rowid].ipicture +"' alt='' style='width: 150px', 'height: 150px';>");

    $("#productName").append(plist[rowid].iproductName);
    $("#productPrice").append(plist[rowid].iprice);

    // Declares and initializes data for graph use
    var calories = parseInt(plist[rowid].icalories);
    var fat = parseInt(plist[rowid].ifat);
    var sodium = parseInt(plist[rowid].isodium);
    var carbohydrate = parseInt(plist[rowid].icarbohydrate);
    var protein = parseInt(plist[rowid].iprotein);

    // Shows statistics 
    google.charts.load('current', { 'packages': ['corechart', 'bar'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

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

        // Draws the chart
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

});


// Method that gets triggered once user decides to add something to the cart
$(document).on("click", "#buyButton", function () {

    cartlist.push(plist[rowid]);
    $("#cartBtn").removeClass("ui-disabled");

    // Empties the list
    localStorage.setItem("cartlist", "");

    //Set Local Storage
    localStorage.setItem("cartlist", JSON.stringify(cartlist));
})

// Method that gets triggered when cart gets opened
$(document).on("pageshow", "#cart", function () {

    //Get Data from local Storage;
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
    //add empty cart Message
    if(cartlist.length==0)
        {
            $("#emptyCartText").show();
        }
    else{
        $("#emptyCartText").hide();
    }
    //refresh list view
    ul.listview('refresh');
    
    // Swipe to remove list item
    $( document ).on( "swipeleft swiperight", "#cartUserList li", function( event ) {
        var listitem = $( this ),
            // These are the classnames used for the CSS transition
            dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
            confirmAndDelete( listitem, transition );
    });
    
    // If it's not a touch device...
    if ( ! $.mobile.support.touch ) {
        // Remove the class that is used to hide the delete button on touch devices
        $( "#cartUserList" ).removeClass( "touch" );
        // Click delete split-button to remove list item
        $( ".delete" ).on( "click", function() {
            var listitem = $( this ).parent( "li" );
            confirmAndDelete( listitem );
        });
    }

    function confirmAndDelete( listitem, transition ) {
        // Highlight the list item that will be removed
        listitem.children( ".ui-btn" ).addClass( "ui-btn-active" );
        // Inject topic in confirmation popup after removing any previous injected topics
        $( "#confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter( "#question" );
        // Show the confirmation popup
        $( "#confirm" ).popup( "open" );
        // Proceed when the user confirms
        $( "#confirm #yes" ).on( "click", function() {
            //Get index of item and remove from list and local storage
            var tempid = $("#cartUserList li").index(listitem);
            console.log("this is id of listitem in cart"+tempid);
            if (tempid > -1) {
              cartlist.splice(tempid, 1);
            }
            
             //add empty cart Message
                if(cartlist.length==0)
                    {
                        $("#emptyCartText").show();
                    }
                else{
                    $("#emptyCartText").hide();
    }
            
            
            localStorage.setItem("cartlist", JSON.stringify(cartlist));
            
            
            listitem.remove();
            $( "#cartUserList" ).listview( "refresh" );
            
        });
        // Remove active state and unbind when the cancel button is clicked
        $( "#confirm #cancel" ).on( "click", function() {
            listitem.removeClass( "ui-btn-active" );
            $( "#confirm #yes" ).off();
        });
    }

});

//Gets the option selected on click or tap from cart on delete press
$(document).on('click tap', '#productsList>li', function () {
    rowid = $(this).closest("li").attr("li-id");
    console.log(rowid);
});

// If product gets deleted from a cart
$(document).on("pageshow", "#deleteCart", function () {
    // Removes the elements from the cartlist
    while (cartlist.length) {
        cartlist.pop();
    }
    localStorage.clear();
});