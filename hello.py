import boto3
import botocore
import logging
from flask import Flask, jsonify, request, render_template
from botocore.exceptions import ClientError

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def hello_world():

  # Let's use Amazon S3
  s3 = boto3.resource('s3')

  # Upload a new file
  #data = open('.\static\imgs\portfolio\s3-test-img-1.jpeg', 'rb')
  #s3.Bucket('349-food-fights').put_object(Key='chicken-pot-pie.jpg', Body=data)

  return render_template('index.html', name='home')


@app.route('/fetch-test', methods=['GET'])
def createNewPost():
  message = {'greeting':'hello from the fetch-test endpoint!'}
  return jsonify(message)  # serialize and use JSON headers
