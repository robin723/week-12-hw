// Project Goals:

// Display items available for sale. This initial display includes the ids, names, and prices of products for sale.

// Prompt user. 
// Ask for ID of desired product. 
// Ask for quantity. 
// Ask if confirm order.
// Repeat until confirm.

// Check if product is in stock.
// If no, respond: "Insufficient quantity" and prevent the order from going through.
// If yes, show total cost of purchase.

// Prompt user to confirm.
// If no, reset.
// If yes, deduct from database and reset.


// Require dependencies 
var prompt = require('prompt');
var mysql = require('mysql');

// Create welcome message
var bamazonWelcome = "";

// Create empty array for products
var products = [];

// Create empty object for order
var customerOrder = {
  id: "",
  item: "",
  quantity: "",
  total: ""
}

// Create connection 
// Separate file for password
var connection = require("./connection.js");

// Initiate connection
connection.myConnection.connect(

  function(err){

  if (err) {
    console.error('There was an error connecting: ' + 
      err.stack);
    return;
  }

  console.log('### WELCOME TO BAMAZON ###');

});

updateStock();

// Update stock from database
function updateStock() {

  connection.myConnection.query(

  'SELECT * FROM products', 

  function(err, res){

    if (err) throw err;

    // console.log(res);

    // Empty array
    products = [];

    // Put result into array
    products = res;

    // Set welcome message
    bamazonWelcome = 'Choose a product from the catalog: \n';

    // Add to welcome message with products
    for (var i = 0, l = products.length; i < l; i++) {
        bamazonWelcome += 
          ' (' + (products[i].item_id) + ') / ' + 
          products[i].product_name + ' - ' + 
          '$' + products[i].product_price.toFixed(2) + '\n';
    };

    // Initiate prompt
    prompt.start();

    // Run prompt
    promptOrder();
  });
};

// Prompt customer for order
function promptOrder() {
  var getItemQty = [
    {
      name: 'item',
      description: bamazonWelcome,
      required: true,
      message: 'Please choose from 1' + ' to ' + 
        products.length + '. \n',
      conform: function(value) {
        value = parseInt(value);
        return value > 0 && value <= products.length
      }
    },
    {
      name: 'qty',
      description: "Enter quantity",
      required: true,
    }
  ];
  prompt.get(getItemQty, function(err,result){

    // Store result in order
    customerOrder.id = result.item;
    customerOrder.item = products[customerOrder.id - 1].product_name;
    customerOrder.qty = result.qty;

    // Display order
    console.log('Your order: ' + 
      '(' + customerOrder.id + ') / ' +
       customerOrder.item + ', ' + 
       customerOrder.qty);

    // Get confirmation
    promptConfirm();
  });
};

// Prompt customer to confirm quantity
function promptConfirm() {
  var confirmItemQty = [
    {
      name: 'confirm',
      message: 'Confirm quantity Y/N',
      required: true,
      warning: 'Y or N only!',
      validator: /^(?:y|Y|n|N)$/,
    }
  ];
  prompt.get(confirmItemQty, function(err,result){
    result.confirm = result.confirm.toUpperCase();

    if (result.confirm == "Y") {

      if (customerOrder.qty > products[customerOrder.id - 1].qty) {

        console.log('Sorry, insufficient quantity. \n');
        promptOrder();

      } else {
        customerOrder.total = customerOrder.qty * products[customerOrder.id - 1].product_price;
        console.log('Order total: $' + customerOrder.total.toFixed(2));
        confirmOrder();
      }
      
    } 
    else if (result.confirm == "N") {
      console.log('Order cancelled. \n');
      promptOrder();
    } 
  });
};

// Prompt customer to confirm purchase
function confirmOrder() {
  var promptConfirm = [
    {
      name: 'confirm',
      message: 'Confirm purchase Y/N',
      required: true,
      warning: 'Y or N only!',
      validator: /^(?:y|Y|n|N)$/,
    }
  ];
  prompt.get(promptConfirm, function(err,result){
    result.confirm = result.confirm.toUpperCase();
    if (result.confirm == "Y") {
      makeOrder();
    } else if (result.confirm == "N") {
      console.log('Order cancelled. Thanks for visiting! \n');
      
      promptOrder();
    } 
  });
};

// Update database
function makeOrder() {

  // Deduct order quantity
  var remainingQty = products[customerOrder.id - 1].qty - customerOrder.qty;
  
  // Update in database
  connection.myConnection.query(

    'UPDATE products SET qty = ' + remainingQty + ' WHERE item_id = ' + customerOrder.id, 

    function(err, res){
      if (err) throw err;

      console.log('Thanks for your order! \n');

      updateStock();

  });
};




