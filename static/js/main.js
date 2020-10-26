console.log('main.js running');

var loginBtn = document.getElementById('loginBtn');
var modalBody = document.getElementsByClassName("modal-body")[0];
var modalTitle = document.getElementById('modalTitle');
var signOutBtn = document.getElementById('signOutBtn');
var profileBtn = document.getElementById('profileBtn');
// non-login related things
var createPostBtn = document.getElementById('createPostBtn');
var posts = document.getElementsByClassName('post-preview');
var postDeetsModalImg = document.getElementById('postDetailsModalImg');
var postsModalTitle = document.getElementById('postsModalTitle');



dummyPostData = [
  {
    postTitle: "Who doesn't love ribs!?",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/beef-ribs.jpg",
    postCaption: "Honestly my ribs are the best. If you think you can do better, you can't"
  },
  {
    postTitle: "Simple but egg-celent...",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/egg-on-toast.jpg",
    postCaption: "I love bread, and I love eggs. Simple but tasty breakfast!"
  },
  {
    postTitle: "Breakfast: hands down the best meal of the day.",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/french-toast.jpg",
    postCaption: "French toast is a classic that is so tasty! Yum!"
  },
  {
    postTitle: "Homemade Pizza...",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/pizza.jpg",
    postCaption: "Just kidding I didn't make this, I suck at cooking"
  },
  {
    postTitle: "Tacos!? Yes Please!",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/tacos.jpg",
    postCaption: "Nothing hits the spot quite like street tacos."
  },
  {
    postTitle: "Classic Burger and Fries",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/burger-and-fries.jpg",
    postCaption: "Nothing beats a burger and fries after a day at the beach!"
  },
  {
    postTitle: "English Breakfast",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/english-breakfast.jpg",
    postCaption: "Now this is one hearty meal, and it tastes as good as it looks!"
  },
  {
    postTitle: "Cheese? Yes, Please!",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/cheese-and-crackers.jpg",
    postCaption: "I love cheese, and wine, cause I'm extra and I know it."
  },
  {
    postTitle: "Meatballs...",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/meatballs.jpg",
    postCaption: "Who knew little spheres of meat could be so tasty?"
  },
  {
    postTitle: "I have no idea what this is",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/seafood.jpg",
    postCaption: "Honestly, it's anyones guess, I thought it was shrimp, maybe chicken?"
  },
  {
    postTitle: "I love pies.",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/pie.jpg",
    postCaption: "However, my body disagrees. Maybe I'm allergic to something?"
  },
  {
    postTitle: "A little love for the veggies...",
    url: "https://349-food-fights.s3-us-west-2.amazonaws.com/stock-imgs/big-salad.jpg",
    postCaption: "Just kidding, vegetables are awful and should be hunted down and destroyed."
  },
]


for (var post of posts) {

  post.addEventListener('click', function() {
    
    postPreviewImg = this.querySelector(".post-preview-img");
    
    postDeetsModalImg.setAttribute('src', postPreviewImg.src);
    // get the index of the chosen item
    index = $(this).parent().index();


    postsModalTitle.innerText = dummyPostData[index].postTitle;

  });
}


// =================================================== //
// =====[ PROFILE ]=================================== // 

var data = { 
  UserPoolId : _config.cognito.userPoolId,
  ClientId : _config.cognito.clientId
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
var cognitoUser = userPool.getCurrentUser();

// checks for a valid current session
window.onload = function() {

  if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
      if (err) {
        alert(err);
        return;
      }
      console.log('session validity: ' + session.isValid());

      // get the profile info (username)
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        console.log(result[2].Value);



        if(session.isValid()) {
          console.log('hello');

          // hide the login button, if the session is valid
          loginBtn.style.display = "none";
          // set the profile btn to the user's email
          profileBtn.innerText = result[2].Value; 

          _config.user = result[2].Value;
        }
      });			
    });
  }
  else {
    // hide the profile btn until user signs in
    profileBtn.style.display = "none";
    // also hide the create new post btn
    createPostBtn.style.display = "none";
  }
};

// gets the cognito username for the profile btn
function getUsername() {

  //var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();

  console.log('hello');

  if (cognitoUser != null) {

    console.log('we have a user');

    cognitoUser.getSession(function(err, session) {
      if (err) {
        alert(err);
        return;
      }
      console.log('session validity: ' + session.isValid());

      // get the profile info (username)
      cognitoUser.getUserAttributes(function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        if(session.isValid()) {
          console.log(result[2].Value);
          
          profileBtn.innerText = result[2].Value;
          _config.user = result[2].Value;
        }
      });			
    });
  }
}
// handles user signout
signOutBtn.addEventListener('click', function() {

  var cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
    cognitoUser.signOut();
    
    
    // change modal title
    modalTitle.innerText = "See you later!";
    // remove any existing modal body content
    modalBody.textContent = '';
    // create a new element
    var headerSuccess = document.createElement("h4");
    headerSuccess.innerText = "Signed out successfully!";
    // append it to modal
    modalBody.append(headerSuccess);

    // show response modal for 2 sec.
    setTimeout(function(){ window.location.reload(); }, 2000);
  }		
});

// =================================================== //
// =====[ LOGIN ]===================================== // 

// handles the login btn being clicked
loginBtn.addEventListener('click', function() {
  
  // change title of the modal template
  modalTitle.innerText = "Login"; 

  // remove any existing modal body content
  modalBody.textContent = '';

  // clone the template and append it to modal body
  var loginFormTemplate = document.getElementById("loginForm");
  var loginClone = loginFormTemplate.content.cloneNode(true);
  modalBody.append(loginClone);

  // custom validation
  $(".login-alert").hide();
  addValidation();

  // adding event listeners for form btns
  var loginFormSubmitBtn = document.getElementsByClassName("signin-btn")[0];
  var loginFormRegisterLink = document.getElementsByClassName("register-btn")[0];
  // handles register link
  loginFormRegisterLink.addEventListener('click', function() {
    registerLinkClick();
  });
  // handles form submission
  loginFormSubmitBtn.addEventListener('click', function() {
    loginFormSubmitBtnClick();
  });
});

// handles login form submit btn click
function loginFormSubmitBtnClick() {

  // boolean check 
  var formDataIsValid;
  // form data
  var loginUsername = document.getElementById("inputUsername").value;
  var loginPassword = document.getElementById("inputPassword").value;

  formDataIsValid = validateLoginFormData(loginUsername, loginPassword);

  if(formDataIsValid) {
    processLoginFormData(loginUsername, loginPassword);
  }
}

// validates the login form to determine if it will be processed
function validateLoginFormData(username, password) {
  
  var isLoginValid = true;

  // regex for username (email) validation
  var emailRegExp = /^\S+@\S+[\.][0-9a-z]+$/;
  // regex for password validation
  var passwordRegExp = /.+/;

  // validate username
  if(username.match(emailRegExp) === null) {
    isLoginValid = false;
  }  
  // validate password
  if(password.match(passwordRegExp) === null) {
    isLoginValid = false;
  }
  // if the username is formatted correctly
  return isLoginValid;
}

// handles login form submission
function processLoginFormData(username, password) {
  
  // get the form data
  var authenticationData = {
    Username : username,
    Password : password,
  };
  // directions on what user pool to use for our app
  var poolData = {
    UserPoolId : _config.cognito.userPoolId, // User Pool Id Here
    ClientId : _config.cognito.clientId, // App Client Id Here
  };
  // get response data from AWS Cognito
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
  var userData = {
    Username : document.getElementById("inputUsername").value,
    Pool : userPool,
  };
  // get data for the user trying to log in
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  // try to login in the user, notify if there's an error
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
      console.log(accessToken);	
      loginSuccess();
    },
    onFailure: function(err) {
      loginFailure(err);
    },
  });
}

function loginSuccess() {

  // change modal title
  modalTitle.innerText = "Success!";
  // remove any existing modal body content
  modalBody.textContent = '';
  // create a new element
  var headerSuccess = document.createElement("h4");
  headerSuccess.innerText = "Login successful, welcome back!";
  // append it to modal
  modalBody.append(headerSuccess);
  // get cognito user attribute
  getUsername();

  // hide the login btn
  loginBtn.style.display = "none";
  // show the profile btn
  profileBtn.style.display = "block";
  // show the create post btn
  createPostBtn.style.display = "block";
  
  // show response modal for 2 sec.
  setTimeout(function(){ $("#exampleModal").modal("hide"); }, 2000);
}

// handles login fail
function loginFailure(err) {
  var error = err.message || JSON.stringify(err);
  //alert(err.message || JSON.stringify(err));

  // handle case: invalid email w/ password
  if(error === "Unkown error") {
    $(".login-alert").text("Incorrect username or password.").show();
  }
  // just print all the other errors
  else {
    $(".login-alert").text(error).show();
  }
}

// ==================================================== //
// =====[ REGISTER ]=================================== // 

// handles register link click 
function registerLinkClick() {
  
  // remove any existing modal body content
  modalBody.textContent = '';

  var registerFormTemplate = document.getElementById("registerForm");
  var registerClone = registerFormTemplate.content.cloneNode(true);
  modalBody.append(registerClone);

  addValidation();
  document.getElementById("confirmPasswordInput").onchange = confirmPassword;

  var registerFormSubmitBtn = document.getElementById("registerBtn");

  registerFormSubmitBtn.addEventListener("click", function() {
    registerFormSubmitBtnClick();
  });

  modalTitle.innerText = "Register"; 
}

// handles register form submit btn click
function registerFormSubmitBtnClick() {
  
  // boolean check 
  var formDataIsValid;
  // form data
  var userEmail = document.getElementById("emailRegisterInput").value;
  var password = document.getElementById("registerPasswordInput").value;
  var password2 = document.getElementById("confirmPasswordInput").value;

  formDataIsValid = validateRegisterFormData(userEmail, password, password2);

  if(formDataIsValid) {
    processRegisterFormData(userEmail, password);
  }
}

// validates the register form to determine if it will be processed
function validateRegisterFormData(userEmail, password, password2) {

  // regex for email validation
  var emailRegExp = /^\S+@\S+[\.][0-9a-z]+$/;
  //  regex for password validation
  var passwordRegExp = /(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  // READ: match funct returns null if the reg exp doesnt find a string that fits the condition

  // validate email
  if(userEmail.match(emailRegExp) === null) {
    return false;
  }
  // validate password
  if(password.match(passwordRegExp) === null) {
    return false;
  }
  // confirm equal password input
  if(confirmPassword(password, password2)) {
    return false;
  }

  // if all the data checks out
  return true;
}

// handles validating the password confirmation input
function confirmPassword(password, password2) {
  
  //console.log(password + " vs. " + password2);

  if (password != password2) {
    // the contents of the string in setCustomValidity don't really do anything, but a non-empty string basically means "wrong"
    document.getElementById("confirmPasswordInput").setCustomValidity("Passwords did not match.");
    return true;
  } 
  else {
    // an empty string is saying that the value is correct.
    document.getElementById("confirmPasswordInput").setCustomValidity("");
    return false;	
  }  
}

// handles register form submission
function processRegisterFormData(userEmail, password) {

  poolData = {
    UserPoolId : _config.cognito.userPoolId, // Your user pool id here
    ClientId : _config.cognito.clientId // Your client id here
  };
  
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var attributeList = [];

  // username (email)
  var dataEmail = {
    Name : 'email', 
    Value : userEmail, 
  };
    
  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);

  userPool.signUp(userEmail, password, attributeList, null, function(err, result){

    if (err) {
      //alert(err.message || JSON.stringify(err));
      registerFail(err);
      return;
    }
    // else
    registerSuccess(result);
  });
}

function registerSuccess(result) {
  
  var cognitoUser = result.user;

  // remove previous content
  modalBody.textContent = '';

  // change modal title
  modalTitle.innerText = "Almost there!";

  // create response with error feedback
  var responseSuccess = document.createElement("p");
  var feedback = document.createElement("p");

  responseSuccess.innerText = "Please check your email for an account verification link.";
  feedback.innerText = "user name is " + cognitoUser.getUsername();

  // append to the modal
  modalBody.append(responseSuccess);
  modalBody.append(feedback);
}

function registerFail(err) {

  // remove previous content
  modalBody.textContent = '';

  // change modal title
  modalTitle.innerText = "Uh-oh!";
  var errorMessage = err.message || JSON.stringify(err);

  // create response with error feedback
  var responseFail = document.createElement("p");
  var feedback = document.createElement("p");

  responseFail.innerText = "There was a problem with your registration.";
  feedback.innerText = errorMessage;

  // append to the modal
  modalBody.append(responseFail);
  modalBody.append(feedback);
}

// ====================================================== //
// =====[ VALIDATION ]=================================== // 

// helper function for form validation
function addValidation() {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  //console.log(forms);

  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
      // prevent any form submission at all - even if all data is validated
      event.preventDefault();

      /*if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }*/
      form.classList.add('was-validated');
    }, false);
  });
}

// ========================================================= //
// =====[ CREATING POST ]=================================== // 

createPostBtn.addEventListener('click', function() {
  
  // change modal title
  modalTitle.innerText = "Create New Post";
  // remove any existing modal body content
  modalBody.textContent = '';

  // clone the template and append it to modal body
  var createPostFormTemplate = document.getElementById("createPostForm");
  var createPostClone = createPostFormTemplate.content.cloneNode(true);
  modalBody.append(createPostClone);

  var authorInput = document.getElementById('createPostAuthorInput');

  authorInput.value = _config.user;

});
