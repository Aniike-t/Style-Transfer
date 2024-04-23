from flask import Flask, request, send_file
from flask_cors import CORS
import os
import cv2
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import io
import base64

app = Flask(__name__)
CORS(app)

# Define the upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the TensorFlow Hub model only once
hub_model = hub.load('https://www.kaggle.com/models/google/arbitrary-image-stylization-v1/frameworks/TensorFlow1/variations/256/versions/2')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    
    # Save the file to the upload folder
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    print(img_path)
    style_path = "styles/styleimage1.png"
    
    # Call the stylereplicationimage function
    stylized_image_data = stylereplicationimage(img_path, 'styles/styleimage1.png')
    
    # Return the encoded image data
    return stylized_image_data, 200


def stylereplicationimage(input_path, style_path):
    def load_img(path_to_img):
        max_dim = 2048
        img = tf.io.read_file(path_to_img)
        img = tf.image.decode_image(img, channels=3)
        img = tf.image.convert_image_dtype(img, tf.float32)

        shape = tf.cast(tf.shape(img)[:-1], tf.float32)
        long_dim = max(shape)
        scale = max_dim / long_dim

        new_shape = tf.cast(shape * scale, tf.int32)

        img = tf.image.resize(img, new_shape)
        img = img[tf.newaxis, :]
        return img

    content_image = load_img(input_path)
    style_image = load_img(style_path)

    print("here 1")

    # Use the loaded TensorFlow Hub model
    stylized_images = hub_model(tf.constant(content_image), tf.constant(style_image))
    stylized_image = tf.squeeze(stylized_images[0], axis=0) 

    print("here 3")
    stylized_image_np = tf.cast(stylized_image * 255, tf.uint8).numpy()
    encoded_image = cv2.imencode('.jpg', cv2.cvtColor(stylized_image_np, cv2.COLOR_RGB2BGR))[1].tobytes()
    
    # Encode the image data to base64
    encoded_image_base64 = base64.b64encode(encoded_image).decode('utf-8')
    
    return encoded_image_base64

if __name__ == '__main__':
    app.run(debug=True)
