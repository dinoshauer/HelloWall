from flask import Blueprint, jsonify, request
from forms import WallMessage

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/post', methods=['POST'])
def post():
	message = request.form['message']
	if message is not None:
		msg = WallMessage()
		if msg.post(message):
			return jsonify({'result': 'Message posted.', 'message': message}), 200
		else:
			return jsonify({'result': 'An unknown error occurred.'}), 500
	else:
		return jsonify({'error': 'Missing message parameter'}), 400

@api.route('/read', methods=['GET'])
def get():
	msg = WallMessage().read()
	return jsonify(msg[0]), msg[1]
