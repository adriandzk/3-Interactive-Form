// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// README: I know there is a lot (a looot) to refactor, and a lot to improve. I'll get back to it.
// Project 3: Interactive Form  / Adrian Dzienisik
// Thanks for the review and feedback.
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$('#name').focus(); // focus first field
$('#other-title').hide(); // hide job-role text-input
$('#color option').first().attr("selected","selected");
$('#color').hide(); // hide color select menu. And create another dynamically.
$('#colors-js-puns').addClass('is-hidden'); // Hide the entire color section menu until a design is selected.
$('#color').removeAttr('required');   // remove required attr from color menu, to prevent html build in validation error, when js is on.
const price = $('<div id="price">Total: $0</div>'); // create to show total price - activities section
$('.activities').append(price);
$('#paypal').hide();
$('#bitcoin').hide();  // hide payment methods
$('#credit-card').hide();

// ------ Create input for 'other job role' -------

$('#title').change(function(){
  if ($(this).val() === 'other') {
    $('#other-title').show().focus();
  } else {
    $('#other-title').hide();
  }
});

// -----  T-shirts Design ------

//create arrays:

const jsPuns = [
  {display: "Cornflower Blue", value: "cornflowerblue"},
  {display: "Dark Slate Grey", value: "darkslategrey"},
  {display: "Gold", value: "gold"}
];

const heartJS = [
  {display: "Tomato", value: "tomato"},
  {display: "Steel Blue", value: "steelblue"},
  {display: "Dim Grey", value: "dimgrey"}
];

const selectColor = $('<select name="select-color" id="select-color"></select>');  // create color select menu
$('#colors-js-puns').append(selectColor);

//If parent option is changed
$("#design").change(function() {
        const design = $(this).val(); //get option value from parent
        switch(design){ //using switch to compare selected option and populate child
              case 'js puns':
                list(jsPuns);
                break;
              case 'heart js':
                list(heartJS);
                break;
            default: //default child option is blank
                $('#colors-js-puns').addClass('is-hidden');
                break;
           }
});

//function to populate child select box
function list(array_list){
    $("#colors-js-puns").removeClass('is-hidden');
    $("#select-color").html(""); // reset child options
    $(array_list).each(function (i) { // populate child options
        $("#select-color").append('<option value=""+array_list[i].value+"">'+array_list[i].display+'</option>');
    });
};

// ----------------Activities Section-----------------------------------------

$('input[type="checkbox"]').change(function() {
  let total = 0;
  const label = $(this).parent();
  // Get activities that are at the same time:
  const jsFrameWorks = $('input[name="js-frameworks"]');
  const express = $('input[name="express"]');
  const node = $('input[name="node"]');
  const jsLibs = $('input[name="js-libs"]');
  const checkbox = this.name;

  // If one is selected, disable the other, and style with 'disabled' class.

  if (this.checked) {
    if(checkbox == 'js-frameworks') {
      express.prop('disabled', true);
      express.parent().addClass('disabled');
    }
    else if(checkbox == 'express') {
      jsFrameWorks.prop('disabled', true);
      jsFrameWorks.parent().addClass('disabled');
    }
    if(checkbox == 'js-libs') {
      node.prop('disabled', true);
      node.parent().addClass('disabled');
    }
    else if(checkbox == 'node') {
      jsLibs.prop('disabled', true);
      jsLibs.parent().addClass('disabled');
    }
  }

  else {
    if(checkbox == 'js-frameworks') {
      express.prop('disabled', false);
      express.parent().removeClass('disabled');
    }
    else if(checkbox == 'express') {
      jsFrameWorks.prop('disabled', false);
      jsFrameWorks.parent().removeClass('disabled');
    }
    if(checkbox == 'js-libs') {
      node.prop('disabled', false);
      node.parent().removeClass('disabled');
    }
    else if(checkbox == 'node') {
      jsLibs.prop('disabled', false);
      jsLibs.parent().removeClass('disabled');
    }
  }

  // Calculate and show Total Price:

  $('input:checked').each(function(){  // Select all checkbox that are checked, and loop with each method to calculate total price.
    total+=parseInt($(this).val());  // use parseInt because value attr is a string
  });
  $('#price').html('Total: $' + total);
    if (total == 0) {
      check_activities();    // Call function to check that at least one activitie is selected. Function is defined below in the validation section
    } else {
      $('#error-activities').hide();
      $("#price").css("color","white");
    }
});


// -------------------Payment Section -------------------------

$('#payment').change(function(){
  const method = $(this).val();
  if (method == 'bitcoin') {
    $('#paypal').hide();
    $('#credit-card').hide();     // Show Bitcoin
    $('#bitcoin').show();
    $('.card-error-message').hide();  // hide credit card errors messages.
  }
  else if (method == 'paypal') {
    $('#bitcoin').hide();
    $('#credit-card').hide();     // Show Paypal
    $('#paypal').show();
    $('.card-error-message').hide();
  }
  else {
    $('#bitcoin').hide();
    $('#paypal').hide();
    $('#credit-card').show();   // Show Credit Card
    $('#cc-num').focus();
    $('.card-error-message').show();
  }
});

//-------------- Form Validation ------------------------------------

// Create variables for error manipulation and initialize false:

let nameError = false;
let mailError = false;
let mailErrorEmpty = false;
let activitiesError = false;
let creditNumberError = false;
let creditCvvError = false;
let creditZipError = false;

// check Name:
$('#name').focusout(function(){
  check_name();
});

// Check Email format. Check on keypress, so there is real time format validation
$('#mail').keypress(function(){
  check_email();
});


// Check if Email is entered:
$('#mail').focusout(function(){
  check_email_empty();
});

// Check Credit Card Number:
$('#cc-num').focusout(function(){
  check_credit_card();
});

// Check Zip Code:
$('#zip').focusout(function(){
  check_zip();
});

// Check CVV:
$('#cvv').focusout(function(){
  check_cvv();
});

// ----- Name validation -------

function check_name() {
  const name = $("#name").val();
  if (name !== '') {
      $("#error-name").hide();
      $("#name").addClass('input-ok').removeClass('input-error');
   } else {
      $("#error-name").html("Name is required");
      $("#error-name").show();
      $("#name").addClass('input-error');
      nameError = true;
   }
}

// ------ Email validation -------  I know especially this part requires refactoring. I'll get back to it.

function check_email() {
  const pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;   // Regex to check email format
  const email = $("#mail").val();
  $("#error-mail-empty").hide();  // hide "Email is required" message, so it only display format error message while typing.
   if(pattern.test(email)) {
     $("#error-mail").hide();  // if format is valid dont show format error message
   } else {
     $("#error-mail").html("Invalid email");
     $("#error-mail").show();
     mailError = true;
   }
}

// --------- Email Empty ---------

function check_email_empty() {
  const email = $("#mail").val();
  const pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   if(pattern.test(email) && email !== '') {
     $("#error-mail").hide();
     $("#error-mail-empty").hide();  // All good so hide both error messages
     $("#mail").addClass('input-ok').removeClass('input-error');
   } else if (email === "") {
     $("#error-mail").hide();
     $("#error-mail-empty").html("Email is required");
     $("#error-mail-empty").show();
     $("#mail").addClass('input-error');
     mailErrorEmpty = true;
   } else {
     $("#error-mail-empty").hide();  // email is not empty but format is invalid
     $("#error-mail").html('Invalid email');
     $("#error-mail").show();
     $('#mail').addClass('input-error');
     mailError = true;
   }
}

// ------------- Activitied Validation -----------------

function check_activities() {
  $('#error-activities').html('Please select at least one activity.');
  $('#error-activities').show();   // Show error
  activitiesError = true;
}


// ----- Credit Card Validation -------

function check_credit_card() {
  const pattern = new RegExp("^([0-9]{13,16})$");  // Regex to check format. Only numbers, between 13 and 16 digits.
  const cardNumber = $('#cc-num').val();
  if (pattern.test(cardNumber) && cardNumber !== '') {
    $('#error-card-number').hide();
    $('#error-card-number-empty').hide();
    $('#cc-num').addClass('input-ok').removeClass('input-error');  // All good
  } else if (cardNumber === '') {
    $('#error-card-number-empty').html('Credit card number is required')
    $('#error-card-number-empty').show();
    $('#error-card-number').hide();
    $('#cc-num').addClass('input-error');   // input is empty
    creditNumberError = true;
  } else {
    $('#error-card-number-empty').hide();
    $('#error-card-number').html('Card number invalid');
    $('#error-card-number').show();
    $('#cc-num').addClass('input-error');   // Format invalid
    creditNumberError = true;
  }
}

function check_zip() {
  const pattern = new RegExp("^([0-9]{5})$");
  const zipCode = $('#zip').val();
    if (pattern.test(zipCode) && zipCode !== '') {
      $('#error-zip').hide();
      $('#error-zip-empty').hide();
      $('#zip').addClass('input-ok').removeClass('input-error');
    } else if (zipCode === '') {
      $('#error-zip-empty').html('Zip code is required')
      $('#error-zip-empty').show();
      $('#error-zip').hide();
      $('#zip').addClass('input-error');
      creditZipError = true;
    } else {
      $('#error-zip-empty').hide();
      $('#error-zip').html('Zip code invalid');
      $('#error-zip').show();
      $('#zip').addClass('input-error');
      creditZipError = true;
    }
}

function check_cvv() {
  const pattern = new RegExp("^([0-9]{3})$");
  const cvvCode = $('#cvv').val();
    if (pattern.test(cvvCode) && cvvCode !== '') {
      $('#error-cvv').hide();
      $('#error-cvv-empty').hide();
      $('#cvv').addClass('input-ok').removeClass('input-error');
    } else if (cvvCode === '') {
      $('#error-cvv-empty').html('CVV code is required')
      $('#error-cvv-empty').show();
      $('#error-cvv').hide();
      $('#cvv').addClass('input-error');
      creditCvvError = true;
    } else {
      $('#error-cvv-empty').hide();
      $('#error-cvv').html('CVV code invalid');
      $('#error-cvv').show();
      $('#cvv').addClass('input-error');
      creditCvvError = true;
    }
}


// ------------------  On Submit Validation -----------------

$('#registration-form').submit(function(){

    // Set all errors variables to false:
    nameError = false;
    mailError = false;
    mailErrorEmpty = false;
    activitiesError = false;
    creditNumberError = false;
    creditCvvError = false;
    creditZipError = false;

    // Check again:
    check_name();
    check_email();
    check_email_empty();

    const creditPay = $('option[value="credit card"]');

    // If credit card is selected check. If not, no need to check.
    if (creditPay.is(':selected')) {
      check_credit_card();
      check_zip();
      check_cvv();
    } else if ($('#price').html() == 'Total: $0') {  // If no activities are selected, check and show message.
      check_activities();
    }

    if (nameError === false && mailError === false && mailErrorEmpty === false && activitiesError === false && creditNumberError === false && creditZipError === false && creditCvvError === false) {
      alert('Form Submitted!');
      return true;
    } else {
      alert('Oops, check for errors.');
      return false;
    }
});
