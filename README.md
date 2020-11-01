# 349-group-project

## Installation
Make sure you have python3 installed on your machine

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get -y install python3-pip
pip3 install --user Flask-API python-dotenv
flask init
flask run
```
## Environment Variables
In order to upload photos make sure to export the following environment variables from the command line:
* export S3_BUCKET_NAME="349-food-fights"
* export S3_ACCESS_KEY="..."
* export S3_SECRET_ACCESS_KEY="..."

AWS does not like when these values are hardcoded into the app code - account security issues

## Before Starting the Server.
Make sure to start up the database with the following command:
```
flask init
```
Then:
```
flask run
```

## Accessing Application
Go to browser and go to http://localhost:5000/

## Accessing posts
Recent posts will appear automatically.
Click on any post image to see post info and comments.

## Registration/Login
If you don't want to use the account below, you can create your own by clicking
the register link on the login form. Once submitted, you will receive a verification email.
You must verify your account before being able to login.

## Adding New Posts
Only registered users that are logged in can post new content.
* Login with email: jasonotter17@gmail.com
* Password: Password1!
* Click on ‘Create Post’
* Fill out the form
* Click ‘Submit’
* You will be redirected when your post is added

## Adding Comments
* Click on any post and you should see existing comments.
* Type out your comment in the form and then click ‘Add Comment’ to publish a comment.
