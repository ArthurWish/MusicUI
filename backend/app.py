# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
import pandas as pd
import uuid
from PIL import Image
from pathlib import Path
app = Flask(__name__)
CORS(app)
result = []
exp_foler = "/media/sda1/cyn-workspace/Music_UI/backend/assets/exp"
def generate_table(result_list, user_id):
    """
    result_list = [A, A, B, B] len=20
    """
    if result_list is None:
        return None
    df = pd.DataFrame()
    df['题号'] = range(1, int(len(result_list)/2)+1)
    df['题目1'] = ''
    df['题目2'] = ''
    # 进行处理和操作，例如将数据存储到数据库或执行其他任务
    for i in range(int(len(result_list)/2)):
        df.loc[i, '题目1'] = result_list[i*2]
        df.loc[i, '题目2'] = result_list[i*2+1]

    df.to_excel(f'/media/sda1/cyn-workspace/Music_UI/backend/results/{user_id}.xlsx', index=False)

@app.route("/api/getPreAudios", methods=["POST"])
def get_preaudios():
    audio_list = []
    with open("/media/sda1/cyn-workspace/Music_UI/backend/assets/exp/试听片段-节奏变化大.mp3", 'rb') as file:
        audio_data = file.read()
        base64_audio = base64.b64encode(audio_data).decode('utf-8')
        audio_list.append(base64_audio)
    with open("/media/sda1/cyn-workspace/Music_UI/backend/assets/exp/试听片段-节奏变化小.mp3", 'rb') as file:
        audio_data = file.read()
        base64_audio = base64.b64encode(audio_data).decode('utf-8')
        audio_list.append(base64_audio)
    return jsonify({"audio": audio_list})
    
@app.route("/api/getImages", methods=["POST"])
def get_images():
    image_pathes = Path(exp_foler).glob("*.png")
    index = request.form.get('index')
    print("index", index)
    image1, image2 = None, None
    for image_path in image_pathes:
        print(str(image_path))
        if f"T{int(index)+1}" in str(image_path):
            print(f"T{int(index)+1}")
            if image1 is None:
                image1 = str(image_path)
            elif image1 is not None:
                image2 = str(image_path)
    # assert image1 is not None and image2 is not None
    print(image1)
    image1 = Image.open(str(image1))
    image2 = Image.open(str(image2))
    resized_image1 = image1.resize((239, 412))
    resized_image2 = image2.resize((239, 412))
    resized_image1.save(f'./{index}-A.png')
    resized_image2.save(f'./{index}-B.png')
    image_list = []
    with open(f'./{index}-A.png', 'rb') as file:
        image_data = file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        image_list.append(base64_image)
    with open(f'./{index}-B.png', 'rb') as file:
        image_data = file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        image_list.append(base64_image)
    return jsonify({"images": image_list})


@app.route("/api/getAudio", methods=["POST"])
def get_audio():
    audio_pathes = Path(exp_foler).glob("*.mp3")
    index = request.form.get('index')
    for audio_path in audio_pathes:
        if f"T{int(index)+1}" in str(audio_path):
            audio = str(audio_path)
    with open(audio, 'rb') as file:
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
