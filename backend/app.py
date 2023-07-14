# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
import pandas as pd
import uuid

app = Flask(__name__)
CORS(app)
result = []


def generate_table(result_list, user_id):
    """
    result_list = [A, A, B, B] len=20
    """
    if result_list is None:
        return None
    df = pd.DataFrame()
    df['题号'] = range(1, 11)
    df['题目1'] = ''
    df['题目2'] = ''
    # 进行处理和操作，例如将数据存储到数据库或执行其他任务
    for i in range(int(len(result_list)/2)):
        df.loc[i, '题目1'] = result_list[i*2]
        df.loc[i, '题目2'] = result_list[i*2+1]

    df.to_excel(f'{user_id}.xlsx', index=False)

@app.route("/api/getImages", methods=["GET"])
def get_images():
    image_list = []
    with open(r'/media/sda1/cyn-workspace/Music_UI/backend/assets/1.png', 'rb') as file:
        image_data = file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        image_list.append(base64_image)
    with open(r'/media/sda1/cyn-workspace/Music_UI/backend/assets/2.png', 'rb') as file:
        image_data = file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        image_list.append(base64_image)
    return jsonify({"images": image_list})


@app.route("/api/getAudio", methods=["GET"])
def get_audio():
    with open(r'/media/sda1/cyn-workspace/Music_UI/backend/assets/agent-reply-1.mp3', 'rb') as file:
        audio_data = file.read()
    base64_audio = base64.b64encode(audio_data).decode('utf-8')
    return jsonify({"audio": base64_audio})


@app.route('/api/finish', methods=['GET'])
def finish():
    global result
    id = str(uuid.uuid4())
    generate_table(result, id)
    result = []
    return "Finish"


@app.route('/api/sendSelection', methods=['POST'])
def receive_selection():
    data = request.form.get('data')
    result.append(data)
    print(data)
    return 'Data received'  # 返回响应，表示数据已接收


@app.route('/api/login', methods=['POST'])
def login():
    global result
    result = []
    try:
        return jsonify({'message': 'Login successful'})
    except Exception as e:
        # 返回错误响应
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False, port=5500, host="0.0.0.0")
