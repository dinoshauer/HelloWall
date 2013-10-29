from flask import Flask, redirect, url_for
from api.views import api
from wall.views import wall
from admin.views import admin

app = Flask(__name__)
app.register_blueprint(api)
app.register_blueprint(admin)
app.register_blueprint(wall)

@app.route('/')
def index():
	return redirect(url_for('wall.view'))

if __name__ == '__main__':
	app.run(debug=True)
