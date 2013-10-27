from flask import Flask, redirect, url_for
from api.views import api
from wall.views import wall

app = Flask(__name__)
app.register_blueprint(api)
app.register_blueprint(wall)

print app.url_map

if __name__ == '__main__':
	app.run(debug=True)
