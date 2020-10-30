import sqlite3
import boto3
from config import S3_KEY, S3_SECRET, S3_BUCKET
from flask import Flask, jsonify, request, redirect, render_template, g
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config.from_object('config')
app.config.from_envvar('APP_CONFIG')  
DATABASE = 'app.db'

#==================================#
#=======[ Helper Functions ]=======#

# funct: executed for every result returned from the database to convert the result
def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value)
                for idx, value in enumerate(row))

# funct: get the current open database connection
def get_db():
  db = getattr(g, '_database', None)
  if db is None:
      db = g._database = sqlite3.connect(app.config['DATABASE'])
      db.row_factory = make_dicts
  return db

# funct: combines getting the cursor, executing and fetching the results
def query_db(query, args=(), one=False):
  cur = get_db().execute(query, args)
  rv = cur.fetchall()
  cur.close()
  return (rv[0] if rv else None) if one else rv

# cli - creates the database based on provided schema 
@app.cli.command('init')
def init_db():
  with app.app_context():
    db = get_db()
  with app.open_resource('schema.sql', mode='r') as f:
    db.cursor().executescript(f.read())
  db.commit()

# whenever the context is destroyed the database connection will be terminated.
@app.teardown_appcontext
def close_connection(exception):
  db = getattr(g, '_database', None)
  if db is not None:
      db.close()

#==================================#
#=========[ Status Codes ]=========#

# status - ok
def status_200(data):
	response = jsonify(data)
	response.status_code = 200
	response.mimetype = "application/json"
	return response

# status - resource created successfully
def status_201(data):
  response = jsonify(data)
  response.status_code = 201
  response.mimetype = "application/json"
  return response

#==================================#
#========[ API Endpoints ]=========#

# routing for the home page
@app.route('/')
def getHomePage():
  return render_template('index.html', name='home')

# get all posts
@app.route('/posts/all', methods=['GET'])
def getAllPosts():

  query_string = "SELECT * FROM posts ORDER BY createDate DESC"
  results = []

  for post in query_db(query_string):
    data = {
      'id': post['id'],
      'author': post['author'],
      'title': post['title'],
      'caption': post['caption'],
      'imgPath': post['imgPath'],
      'createDate': post['createDate']
    }
    results.append(data)

  return status_200(results)

# get post by id
@app.route('/posts/<int:post_id>', methods=['GET'])
def getPostById(post_id):
  
  response = []

  post = query_db('SELECT * FROM posts WHERE id = ?;',
                [post_id], one=True)
  if post is None:
      response.append({'error':'post ' + post_id + ' DNE'})
  else:
      data = {
        'id': post['id'],
        'author': post['author'],
        'title': post['title'],
        'caption': post['caption'],
        'imgPath': post['imgPath'],
        'createDate': post['createDate']
      }
      response.append(data)
  
  return status_200(response)

# post a new comment
@app.route('/comments', methods=['POST'])
def postNewComment():

  if request.method == 'POST':

    # get the request data as json
    req_data = request.get_json()
    # get the parts we need
    parent_id = req_data.get('parent_id')
    author = req_data.get('author')
    content = req_data.get('content')

    # create data payload
    inputs = []
    # put the data in there
    inputs.append(parent_id)
    inputs.append(author)
    inputs.append(content)

    # create query string
    query = "INSERT INTO comments(id, parent_id, author, content, createDate) VALUES (null, ?, ?, ? , CURRENT_TIMESTAMP);"
    # connect to DB
    conn = sqlite3.connect(DATABASE)
    # execute the query with the data
    conn.execute(query, inputs)
    # complete the transaction
    conn.commit()
    conn.close()

    response = {
      'status': 201,
      'message': 'resource created'
    }

    return status_201(response)

# get all comments where post_id = ?
@app.route('/posts/<int:post_id>/comments', methods=['GET'])
def getCommentsById(post_id):

  query_string = "SELECT * FROM comments WHERE parent_id = ? ORDER BY createDate DESC;"
  results = []

  for comment in query_db(query_string, [post_id]):
    item = {
      'id': comment['id'],
      'parent_id': comment['parent_id'],
      'author': comment['author'],
      'content': comment['content'],
      'createDate': comment['createDate']
    }
    results.append(item)

  return jsonify(results)

#upload image
@app.route('/upload', methods=['POST'])
def upload_file():

  # vars available S3_KEY, S3_SECRET, S3_BUCKET
  s3 = boto3.client('s3', aws_access_key_id=S3_KEY, aws_secret_access_key= S3_SECRET)
 
  if request.method == 'POST':
    img = request.files['user_file']
    if img:
      filename = secure_filename(img.filename)
      img.save(filename)

      s3.upload_file(
          Bucket = S3_BUCKET,
          Filename=filename,
          Key = filename
      )
      
    postTitle = request.form['postTitle']
    postUrl = "/" + request.files['user_file'].filename
    postCaption = request.form['postCaption']  
    postAuthor = request.form['postAuthor']

    response = [{
      "post title": postTitle,
      "post url": postUrl,
      "post caption": postCaption,
      "post author": postAuthor
    }]

    return jsonify(response)

# handles any routes other than the ones specified above
@app.errorhandler(404)	
def route_not_found(error = None):
	message = { 
    'status: ': 404,
    'message: ': 'route not found: ' + request.url
	}
	response = jsonify(message)
	response.status_code = 404
	response.mimetype = "application/json"
	return response 





