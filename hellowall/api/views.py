from flask import Blueprint, jsonify
from forms import WallMessage

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/post/<message>', methods=['POST'])
def post(message):
	msg = WallMessage()
	if msg.post(message):
		return jsonify({'result': 'Message posted.', 'message': message}), 200
	else:
		return jsonify({'result': 'An unknown error occurred.'}), 500

@api.route('/read', methods=['GET'])
def get():
	msg = WallMessage().read()
	return jsonify(msg[0]), msg[1]
