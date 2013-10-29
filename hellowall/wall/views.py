from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

wall = Blueprint('wall', __name__,
				url_prefix='/wall',
				template_folder='templates',
				static_folder='static')

@wall.route('/', methods=['GET'])
@wall.route('/view', methods=['GET'])
def view():
	try:
		return render_template('wall/view.html')
	except TemplateNotFound:
		abort(404)

@wall.route('/post', methods=['GET'])
def post():
	try:
		return render_template('wall/post.html')
	except TemplateNotFound:
		abort(404)
