from flask import Blueprint, render_template, abort, request, redirect, url_for
from jinja2 import TemplateNotFound

admin = Blueprint('admin', __name__,
				url_prefix='/admin',
				template_folder='templates',
				static_folder='static')

@admin.route('/', methods=['GET'])
def view():
	try:
		if request.args.get('key') == 'l5w5':
			return render_template('admin/view.html')
		else:
			return redirect(url_for('admin.error'))
	except TemplateNotFound:
		abort(404)

@admin.route('/error', methods=['GET'])
def error():
	try:
		return render_template('admin/error.html')
	except TemplateNotFound:
		abort(404)
