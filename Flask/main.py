from flask import Flask, request, jsonify, make_response
import cv2
import utils

# runner microservice starts on port 5000
app = Flask(__name__)


@app.route('/api/process_img', methods=['POST'])
def process_img():
    data = request.json
    img = data['ImgSrc']
    left_shoulder = data['leftShoulder']
    right_shoulder = data['rightShoulder']
    left_hip = data['leftHip']
    right_hip = data['rightHip']

    ratio = utils.process_img(img)
    response = {'shoulderWidth': utils.get_shoulder_width(ratio, left_shoulder, right_shoulder),
                'hipWidth': utils.get_hip_width(ratio, left_hip, right_hip)
                }
    return make_response(response, 200)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
