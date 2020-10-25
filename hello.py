import boto3
import botocore
import logging
from flask import Flask, jsonify, render_template

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def hello_world():

  # Let's use Amazon S3
  s3 = boto3.resource('s3')

  buckets = []

  # Print out bucket names
  for bucket in s3.buckets.all():
    buckets.append(bucket.name)

  #Upload a new file
  #data = open('s3-test-img-1.jpeg', 'rb')
  #s3.Bucket('349-food-fights').put_object(Key='s3-test-img-2.jpeg', Body=data)

  app.logger.info(buckets)

  return render_template('index.html', name='home')

@app.route('/post')
def samplePost():
  return render_template('post.html', name='post')


@app.route('/photos/grilled_cheese')
def getGrilledCheese():

  s3 = boto3.resource('s3')
  KEY = 'test_album/s3-test-img-3.jpeg'

  try:
    s3.Bucket('349-food-fights').download_file(KEY, 'grilled_cheese.jpg')
  except botocore.exceptions.ClientError as e:
    if e.response['Error']['Code'] == "404":
        print("The object does not exist.")
    else:
        raise

  return 'did it work?'