from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

admin = Blueprint('admin', __name__,
				url_prefix='/admin',
				template_folder='templates',
				static_folder='static')

@admin.route('/', methods=['GET'])
def view():
	try:
		return render_template('admin/view.html')
	except TemplateNotFound:
		abort(404)
