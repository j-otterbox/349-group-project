console.log('main.js running');

var loginBtn = document.getElementById('loginBtn');
var modalBody = document.getElementsByClassName("modal-body")[0];
var modalTitle = document.getElementById('modalTitle');
var signOutBtn = document.getElementById('signOutBtn');
var profileBtn = document.getElementById('profileBtn');
// aws cognito stuff
var data = { // check config.js for _config values
  UserPoolId : _config.cognito.userPoolId,
  ClientId : _config.cognito.clientId
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
var cognitoUser = userPool.getCurrentUser();

// non-login related things
var loadMorePostsBtn = document.getElementById('loadMorePostsBtn');
var createPostBtn = document.getElementById('createPostBtn');
//var posts = document.getElementsByClassName('post-preview');
var postPreviewsGrid = document.getElementById('postPreviewsGrid');
var postDeetsModalImg = document.getElementById('postDetailsModalImg');
var postsModalTitle = document.getElementById('postsModalTitle');
var postCommentsContainer = document.getElementById('commentsContainer');
var postsModalCaption = document.getElementById('postsModalCaption');
var postsModalAuthor = document.getElementById('postsModalAuthor');
// the text area beneath the post img
var postNewCommentForm = document.getElementById('postNewCommentForm');
var addCommentBtn = document.getElementById('addCommentBtn');
var addCommentTxt = document.getElementById('addCommentTxt');
var commentLoginBtn = document.getElementById('commentLoginBtn');


// handles everything that needs to be done on page load
window.onload = function() {

  // check for a valid session 
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
        
        // if the session is valid...
        //console.log(result[2].Value);
        if(session.isValid()) {
          console.log('hello');

          // hide the login button
          loginBtn.style.display = "none";
          // hide the comment login btn
          commentLoginBtn.style.display = "none";
          // set the profile btn to the user's email
          profileBtn.innerText = result[2].Value; 
          // save the username in the window (config.js) object for easy access
          _config.user = result[2].Value;
        }
      });			
    });
  }
  // if the session is not valid...
  else {
    // hide the profile btn until user signs in
    profileBtn.style.display = "none";
    // also hide the create new post btn
    createPostBtn.style.display = "none";
    // hide the new comment textarea
    postNewCommentForm.style.display = "none";
    // hide all the reply buttons
    $('.reply-btn').hide();
  }

  // then get post previews onto page
  renderPostPreviews();



};

// this function will create the post previews for the grid
function renderPostPreviews() {
  console.log('rendering-post-previews');
 
  // returns promise
  posts_promise = getAllPosts();
  // access the data within the promise
  posts_promise.then(function(posts) {

    for(post of posts) {

      // clone the preview template and append it to modal body
      var postPreviewTemplate = document.getElementById("postPreviewTemp");
      var postPreviewClone = postPreviewTemplate.content.cloneNode(true);
      // construct the url for the stock imgs
      var baseUrl = "https://349-food-fights.s3-us-west-2.amazonaws.com";
      var src = baseUrl + post.imgPath;
      // set the img src
      postPreviewClone.querySelector('.post-preview-img').setAttribute('src', src);
      // secretly hide post_id
      postPreviewClone.querySelector('.post-id').innerText = post.id;
      // append to the preview container
      postPreviewsGrid.append(postPreviewClone);
    }

    $('.post-preview').click(function() {

      // select the img from preview that was clicked
      postPreviewImg = this.querySelector(".post-preview-img");
      // set the posts modal image src to the selected preview's src
      postDeetsModalImg.setAttribute('src', postPreviewImg.src);
      // get the index of the chosen item for json array access
      // add 1 to account for offset

      // if you need the place in the DOM: $(this).parent().index()
      
      // gets the id from the hidden DOM element
      index = ($(this).parent().find('.post-id').text());
  
      // this creates the comments and adds their functionality, mainly REPLY
      loadPostDetailData(index);
    });
  });
}

// handles loading the data for a particular post preview to the modal
function loadPostDetailData(index) {

  //console.log(index);

  // clear the modal of the comments from prev post
  postCommentsContainer.textContent = '';

  post = getPostById(index);
  post.then(function(result){
    //console.log(result);
    post_obj = result[0];

    // set the title of the post
    postsModalTitle.innerText = post_obj.title;
    // set the caption
    postsModalCaption.innerText = post_obj.caption;
    // set the author
    postsModalAuthor.innerText = `By: ${post_obj.author}`;
    // set the id for posting comments
    $('#post-id').text(post_obj.id);

  });

  comments = getPostCommentsById(index);
  comments.then(function(result) {
    //console.log(result);
    comments_obj = result;

    for (var comment of comments_obj) {
      
      // clone the template and append it to modal body
      var commentTemplate = document.getElementById("commentTemp");
      var commentClone = commentTemplate.content.cloneNode(true);
      // boolean check for session status
      var isSessionValid = getSessionStatus();

      commentClone.querySelector('.comment-body-content').innerText = comment.content;
      commentClone.querySelector('.comment-author').innerText = comment.author;
      commentClone.querySelector('.comment-date').innerText = comment.createDate;
      // hide or show reply btn based on user session status
      if(isSessionValid) {
        // add the reply functionality to the button
        commentClone.querySelector('.reply-btn').addEventListener('click', function() {
          createReplyForm(this);
        });
      }
      else {
        // hide the reply button until user logs in
        commentClone.querySelector('.reply-btn').style.display = "none";
      }
      // append the comment template to the container
      postCommentsContainer.append(commentClone); 
    }    
  });
}

// handles loading more post previews with the template
loadMorePostsBtn.addEventListener('click', function() {
  console.log('hello from loadMorePosts');
});

// handles adding a new comment, NOT a reply
addCommentBtn.addEventListener('click', function() {

  // get the value of the textarea
  var newComment = addCommentTxt.value;
  // get the only element that has this class, but there might be more, otherwise i'd use an ID
  var addCommentFeedback = document.getElementsByClassName('comment-validation')[0];

  // check for no input
  if(newComment === "") {
    //console.log('no input detected');
    // give feed back to user, make alert visible
    addCommentTxt.style.borderColor = "#dc3545";
    addCommentFeedback.style.display = "block";
  }
  // proceed if there is any input
  else {
    // get the parent id
    var parent_id = $('#post-id').text();
    // get the username of the current user
    var newAuthor = _config.user;
    // fake date
    var newDate = "January 1, 2020 - 12:00AM";

    postNewComment(parent_id, newAuthor, newComment);

    // clone the template and append it to modal body
    var commentTemplate = document.getElementById("commentTemp");
    var commentClone = commentTemplate.content.cloneNode(true);
  
    // append comment data to template
    commentClone.querySelector('.comment-body-content').innerText = newComment;
    commentClone.querySelector('.comment-author').innerText = newAuthor;
    commentClone.querySelector('.comment-date').innerText = newDate;
    commentClone.querySelector('.reply-btn').addEventListener('click', function() {
      //console.log(this);
      createReplyForm(this);
    });
    
    postCommentsContainer.prepend(commentClone);

    // reset the form
    addCommentTxt.value = "";
    addCommentTxt.style.borderColor = "#ced4da";
    addCommentFeedback.style.display = "none";
  }
});

// handles toggling of the reply form in the comments section
function createReplyForm(replyBtnParam) {

  // remove any open comment reply forms
  $('.comment-reply-form').remove();
  // make the reply btn visible again
  $('.reply-btn').css('display', 'block');
  

  // clone the template and append it to modal body
  var addCommentReplyFormTemplate = document.getElementById("addCommentReplyFormTemp");
  var addCommentReplyFormClone = addCommentReplyFormTemplate.content.cloneNode(true);

  // handles submission of a new reply
  addCommentReplyFormClone.querySelector('#addReplyBtn').addEventListener('click', function() {
    
    var addReplyText = $(this).parents()[1].querySelector('#addCommentReplyTxt');
    var addReplyFeedback = document.getElementsByClassName('comment-validation')[1];

    // check for input
    if(addReplyText.value === "") {

      // do not proceed if there is no input
      console.log('no input detected');
      // give feed back to user, make alert visible
      addReplyText.style.borderColor = "#dc3545";
      addReplyFeedback.style.display = "block";

    }
    else {

      // clone the reply template and append it to modal body
      var replyTemplate = document.getElementById("replyTemplate");
      var replyClone = replyTemplate.content.cloneNode(true);
      
      replyClone.querySelector('.reply-author').innerText = _config.user;
      replyClone.querySelector('.reply-date').innerText = "January 1, 2020 - 12:00AM";
      replyClone.querySelector('.reply-comment-body').innerText = addReplyText.value;

      // append template to the parent comment
      $(this).parents()[3].querySelector('.replies-container').prepend(replyClone);

      //console.log($(this).parents()[3].querySelector('.replies-container'));
      //console.log(replyClone);
      // remove the reply form from the selected comment
      $(this).parents()[1].remove();
      // make the reply btn visible again
      $('.reply-btn').css('display', 'block');

      // reset the form
      addReplyText.value = "";
      addReplyText.style.borderColor = "#ced4da";
      addReplyFeedback.style.display = "none";
    }


    // get the only element that has this class, but there might be more, otherwise i'd use an ID
    //var addReplyFeedback = document.getElementsByClassName('comment-validation')[1];
    //console.log(addReplyFeedback);
    //addReplyFeedback.style.display = "block";
  });

  // handles clicking the cancel button on the reply form
  addCommentReplyFormClone.querySelector('#cancelBtn').addEventListener('click', function() {

    // remove the reply form from the selected comment
    $(this).parents()[1].remove();
    // make the reply btn visible again
    $('.reply-btn').css('display', 'block');
  });

  // append the reply form to the comment that contains the calling reply button
  $(replyBtnParam).parents()[1].append(addCommentReplyFormClone);
  // hide the reply button on the comment that is being replied to
  $(replyBtnParam)[0].style.display = "none";
}

// returns a boolean value of the current sessions status
function getSessionStatus() {

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();
  // boolean check for later
  var isSessionValid;

  // determine if the sessions is valid
  if(cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
      if (err) {
        alert(err);
        return;
      }

      // if the session is valid...
      if(session.isValid()) {
        //console.log('our current session is valid');
        isSessionValid = true;
      }
      else {
        //console.log('our current session is NOT valid');
        isSessionValid = false;
      }
    });
  }
  // there is no current user
  else {
    //console.log('there is NO cognito user');
    isSessionValid = false;
  }

  return isSessionValid;
}

// =================================================== //
// =====[ PROFILE ]=================================== // 

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
  // just gotta attach the form
  renderLoginForm();
});

// handles login from the post details modal
commentLoginBtn.addEventListener('click', function() {

  // the data attribute on the button toggles the posts modal
  // so we have to manually toggle the login/register modal here
  $('#exampleModal').modal('toggle');
  // attach the login form to it
  renderLoginForm();
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
      //var accessToken = result.getAccessToken().getJwtToken();
      //console.log(accessToken);	
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
  // show the add new comment form
  postNewCommentForm.style.display = "block";
  // hide the comment login btn
  commentLoginBtn.style.display = "none";
  
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
// handles creating the login form when needed
function renderLoginForm() {
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
  // insert the user into the DB on successful reg.
  insertUserIntoDb(cognitoUser);

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
// NOTE:
// you need to call this function everytime you want to have
// custom validation messages from bootstrap
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

  addValidation();

  var createPostBtn = document.getElementById('createPostFormBtn');
  var postAuthorInput = document.getElementById('postAuthorInput');
  postAuthorInput.value = _config.user;

  // add create post submit listener
  /*createPostBtn.addEventListener('click', function() {
    // get the values from the input
    var postTitle = document.getElementById('postTitleInput').value;
    var postCaption = document.getElementById('postCaptionInput').value;
    // check validity
    if(postTitle && postCaption) {
      console.log('form is valid');
    }
    else {
      console.log('form is not valid');
    }
  });*/
});

// ========================================================= //
// =====[ API METHODS ]===================================== //

// yes, we know this is bad practice, but we were short on time

function insertUserIntoDb(username) {

  // insert into users
  fetch('/users', {
    // Declare what type of data we're sending
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Specify the method
    method: 'POST',
    // A JSON payload
    body: JSON.stringify({
        "id": "null",
        "username": username,
        "createDate": "CURRENT_TIMESTAMP"
    })
  }).then(function(response){ // At this point, Flask has printed our JSON
    return response.json();
  }).then(function (json) {

    console.log('POST response: ');
    // Should be 'OK' if everything was successful
    console.log(json);
  });
}

// wherever this is called, it only returns a promise
// theres an extra step to access the data within
async function getAllPosts() {
  var response = await fetch('/posts/all');
  var posts_data = await response.json();

  return posts_data;
}

// wherever this is called, it only returns a promise
// theres an extra step to access the data within
async function getPostById(id) {
  var response = await fetch('/posts/' + id);
  var post_data = await response.json();

  return post_data;
}

async function postNewComment(parent_id, author, content) {
  var response = await fetch('/comments', {
    // Declare what type of data we're sending
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      "parent_id": parent_id,
      "author": author,
      "content": content
    })
  });
  var json = await response.json();
  console.log(json);
}

// wherever this is called, it only returns a promise
// theres an extra step to access the data within
async function getPostCommentsById(id) {
  var response = await fetch('/posts/' + id + '/comments');
  var comment_data = await response.json();

  return comment_data;
}
