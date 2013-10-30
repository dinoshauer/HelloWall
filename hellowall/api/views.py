from flask import Blueprint, jsonify, request
from forms import WallMessage

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/post', methods=['POST'])
def post():
	message = request.form['message']
	if message is not None:
		msg = WallMessage().post(message)
		if msg[0]['result']:
			return jsonify({'result': 'Message posted.', 'message': message}), 200
		else:
			return jsonify(msg[0]), msg[1]
	else:
		return jsonify({'error': 'Missing message parameter'}), 400

@api.route('/delete', methods=['POST'])
def delete():
	key = request.form['key']
	if key is not None:
		msg = WallMessage().delete(key)
		if msg[0]['result']:
			return jsonify(msg[0]), msg[1]
		else:
			return jsonify(msg[0]), msg[1]
	else:
		return jsonify({'error': 'Missing key parameter'}), 400

@api.route('/sticky', methods=['POST'])
def sticky():
	key = request.form['key']
	if key is not None:
		msg = WallMessage().sticky(key)
		if msg[0]['result']:
			return jsonify(msg[0]), msg[1]
		else:
			return jsonify(msg[0]), msg[1]
	else:
		return jsonify({'error': 'Missing key parameter'}), 400

@api.route('/read', methods=['GET'])
def get():
	msg = WallMessage().read()
	return jsonify(msg[0]), msg[1]

@api.route('/read/simple', methods=['GET'])
def getSimple():
	msg = WallMessage().read(simple=True)
	return jsonify(msg[0]), msg[1]
