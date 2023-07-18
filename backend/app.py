import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
import pandas as pd
import uuid
from PIL import Image
app = Flask(__name__)
CORS(app)
os.makedirs("/media/sda1/cyn-workspace/Music_UI/backend/results", exist_ok=True)
result = []
login_state = True
gender,age,id = 0,0,0
def generate_table(result_list, user_id, gender, age):
    def split_list(lst, size):
        return [sort_list(lst[i:i+size]) for i in range(0, len(lst), size)]
    def sort_list(lst):
        sorted_lst = sorted(lst, key=lambda x: int(x[1:]))
        return sorted_lst
    """
    result_list = [A, A, B, B] len=20
    """
    if result_list is None:
        return None
    df = pd.DataFrame()
    df['性别'] = [gender] * int(len(result_list) / 3)
    df['年龄'] = [age] * int(len(result_list) / 3)
    df['题号'] = range(1, int(len(result_list)/3)+1)
    df['题目1'] = ''
    df['题目2'] = ''
    df['题目3'] = ''
    result_list = split_list(result_list, 3)
    # 进行处理和操作，例如将数据存储到数据库或执行其他任务
    for i, result in enumerate(result_list):
        df.loc[i, '题目1'] = result[0]
        df.loc[i, '题目2'] = result[1]
        df.loc[i, '题目3'] = result[2]

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
    global login_state
    login_state = False
    
    index = request.form.get('index')
    print("index", index)
    exp_folder = f"/media/sda1/cyn-workspace/Music_UI/backend/assets/exp2/task{int(index)+1}"
    # image_pathes = Path(exp_foler).glob("*.png")
    
    # image1, image2 = None, None
    # for image_path in image_pathes:
    #     print(str(image_path))
    #     if f"T{int(index)+1}" in str(image_path):
    #         print(f"T{int(index)+1}")
    #         if image1 is None:
    #             image1 = str(image_path)
    #         elif image1 is not None:
    #             image2 = str(image_path)
    # # assert image1 is not None and image2 is not None
    # print(image1)
    image1 = Image.open(os.path.join(exp_folder, "A.png"))
    image2 = Image.open(os.path.join(exp_folder, "B.png"))
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
    audio_list = []
    index = request.form.get('index')
    print("index", index)
    exp_folder = f"/media/sda1/cyn-workspace/Music_UI/backend/assets/exp2/task{int(index)+1}"
    # audio_pathes = Path(exp_foler).glob("*.mp3")
    index = request.form.get('index')
    # for audio_path in audio_pathes:
    #     if f"T{int(index)+1}" in str(audio_path):
    #         audio = str(audio_path)
    with open(os.path.join(exp_folder, "A.mp3"), 'rb') as file:
        audio_data = file.read()
        audio_list.append(base64.b64encode(audio_data).decode('utf-8'))
    with open(os.path.join(exp_folder, "B.mp3"), 'rb') as file:
        audio_data = file.read()
        audio_list.append(base64.b64encode(audio_data).decode('utf-8'))
    return jsonify({"audio": audio_list})


@app.route('/api/finish', methods=['GET'])
def finish():
    # data = json.loads()
    id = str(uuid.uuid4())
    global result,gender,age,login_state
    generate_table(result, id, gender, age)
    result = []
    login_state = True
    return "Finish"


@app.route('/api/sendSelections', methods=['POST'])
def receive_selection():
    data = json.loads(request.form.get('selections'))
    for sel in data:
        result.append(sel)
        print(sel)
    return 'Data received'  # 返回响应，表示数据已接收


@app.route('/api/login', methods=['POST'])
def login():
    global result,gender,age,login_state
    data = request.get_json()
    gender, age = data['gender'], data['age']
    # result = []
    # generate_table(result, id, gender, age)
    try:
        return jsonify({'login_state': login_state})
    except Exception as e:
        # 返回错误响应
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False, port=5500, host="0.0.0.0")
