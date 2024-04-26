from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import cv2
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import io
import base64
from scipy import spatial

app = Flask(__name__)
CORS(app)

# Define the upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the TensorFlow Hub model only once
hub_model = hub.load('https://kaggle.com/models/google/arbitrary-image-stylization-v1/TensorFlow1/256/2')


folder_path = "uploads/skystylerepupload/tempimg"

if not os.path.exists(folder_path):
    try:
        os.makedirs(folder_path)
        print("Folder created successfully.")
    except OSError as e:
        print(f"Failed to create directory: {e}")
else:
    print("Folder already exists.")


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
    
    # Get the style number from the request
    style_number = int(request.form.get('styleNumber')) if 'styleNumber' in request.form else 1
    
    # Determine the style image path based on the style number
    style_image_path = f"styles/styleimage{style_number}.png"
    
    stylized_image_data = stylereplicationimage(img_path, style_image_path, 1, 1024)
    
    # remove image after processing
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    
    return stylized_image_data, 200

def stylereplicationimage(input_path, style_path, mode, dims):
    def load_img(path_to_img, dims):
        max_dim = dims
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

    content_image = load_img(input_path, dims)
    style_image = load_img(style_path, dims)

    print("here 1")

    # Use the loaded TensorFlow Hub model
    stylized_images = hub_model(tf.constant(content_image), tf.constant(style_image))
    stylized_image = tf.squeeze(stylized_images[0], axis=0) 

    print("here 3")
    stylized_image_np = tf.cast(stylized_image * 255, tf.uint8).numpy()
    encoded_image = cv2.imencode('.jpg', cv2.cvtColor(stylized_image_np, cv2.COLOR_RGB2BGR))[1].tobytes()
    if mode == 1:
        print('here 7')
    # Encode the image data to base64
        encoded_image_base64 = base64.b64encode(encoded_image).decode('utf-8')
        print(encoded_image_base64)
        return encoded_image_base64
    
    elif mode == 2:
        print('here 4')
        cv2.imwrite(os.path.join('uploads/skystylerepupload/tempimg',"stylized_img_for_sky.png"),stylized_image_np)
        print('here 5')








def make_mask(b, image):
    mask = np.zeros((image.shape[0], image.shape[1], 1), dtype=np.uint8)
    for xx, yy in enumerate(b):
        mask[yy:, xx] = 255

    return mask

def display_mask(b, image, color=[0, 0, 255]):
    result = image.copy()
    overlay = np.full(image.shape, color, image.dtype)
    
    overlay = cv2.addWeighted(
        cv2.bitwise_and(overlay, overlay, mask=make_mask(b, image)),
        1,
        image,
        1,
        0,
        result
    )
    cv2.imwrite(os.path.join('uploads/skystylerepupload/tempimg',"result.png"), overlay)
    res_path = os.path.join('uploads/skystylerepupload/tempimg',"result.png")
    denoiseplusbw(res_path)

def color_to_gradient(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return np.hypot(
        cv2.Sobel(gray, cv2.CV_64F, 1, 0),
        cv2.Sobel(gray, cv2.CV_64F, 0, 1)
    )

def energy(b_tmp, image):
    sky_mask = make_mask(b_tmp, image)

    ground = np.ma.array(
        image,
        mask=cv2.cvtColor(cv2.bitwise_not(sky_mask), cv2.COLOR_GRAY2BGR)
    ).compressed()
    sky = np.ma.array(
        image,
        mask=cv2.cvtColor(sky_mask, cv2.COLOR_GRAY2BGR)
    ).compressed()
    ground.shape = (ground.size//3, 3)
    sky.shape = (sky.size//3, 3)

    sigma_g, mu_g = cv2.calcCovarMatrix(
        ground,
        None,
        cv2.COVAR_NORMAL | cv2.COVAR_ROWS | cv2.COVAR_SCALE
    )
    sigma_s, mu_s = cv2.calcCovarMatrix(
        sky,
        None,
        cv2.COVAR_NORMAL | cv2.COVAR_ROWS | cv2.COVAR_SCALE
    )

    y = 2

    return 1 / (
        (y * np.linalg.det(sigma_s) + np.linalg.det(sigma_g)) +
        (y * np.linalg.det(np.linalg.eig(sigma_s)[1]) +
            np.linalg.det(np.linalg.eig(sigma_g)[1]))
    )

def calculate_border(grad, t):
    sky = np.full(grad.shape[1], grad.shape[0])

    for x in range(grad.shape[1]):
        border_pos = np.argmax(grad[:, x] > t)

        # argmax hax return 0 if nothing is > t
        if border_pos > 0:
            sky[x] = border_pos

    return sky

def calculate_border_optimal(image, thresh_min=5, thresh_max=600, search_step=5):
    grad = color_to_gradient(image)

    n = ((thresh_max - thresh_min) // search_step) + 1

    b_opt = None
    jn_max = 0

    for k in range(1, n + 1):
        t = thresh_min + ((thresh_max - thresh_min) // n - 1) * (k - 1)

        b_tmp = calculate_border(grad, t)
        jn = energy(b_tmp, image)

        if jn > jn_max:
            jn_max = jn
            b_opt = b_tmp

    return b_opt

def no_sky_region(bopt, thresh1, thresh2, thresh3):
    border_ave = np.average(bopt)
    asadsbp = np.average(np.absolute(np.diff(bopt)))

    return border_ave < thresh1 or (border_ave < thresh2 and asadsbp > thresh3)

def partial_sky_region(bopt, thresh4):
    return np.any(np.diff(bopt) > thresh4)

def refine_sky(bopt, image):
    sky_mask = make_mask(bopt, image)

    ground = np.ma.array(
        image,
        mask=cv2.cvtColor(cv2.bitwise_not(sky_mask), cv2.COLOR_GRAY2BGR)
    ).compressed()
    sky = np.ma.array(
        image,
        mask=cv2.cvtColor(sky_mask, cv2.COLOR_GRAY2BGR)
    ).compressed()
    ground.shape = (ground.size//3, 3)
    sky.shape = (sky.size//3, 3)

    ret, label, center = cv2.kmeans(
        np.float32(sky),
        2,
        None,
        (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0),
        10,
        cv2.KMEANS_RANDOM_CENTERS
    )

    sigma_s1, mu_s1 = cv2.calcCovarMatrix(
        sky[label.ravel() == 0],
        None,
        cv2.COVAR_NORMAL | cv2.COVAR_ROWS | cv2.COVAR_SCALE
    )
    ic_s1 = cv2.invert(sigma_s1, cv2.DECOMP_SVD)[1]

    sigma_s2, mu_s2 = cv2.calcCovarMatrix(
        sky[label.ravel() == 1],
        None,
        cv2.COVAR_NORMAL | cv2.COVAR_ROWS | cv2.COVAR_SCALE
    )
    ic_s2 = cv2.invert(sigma_s2, cv2.DECOMP_SVD)[1]

    sigma_g, mu_g = cv2.calcCovarMatrix(
        ground,
        None,
        cv2.COVAR_NORMAL | cv2.COVAR_ROWS | cv2.COVAR_SCALE
    )
    icg = cv2.invert(sigma_g, cv2.DECOMP_SVD)[1]

    if cv2.Mahalanobis(mu_s1, mu_g, ic_s1) > cv2.Mahalanobis(mu_s2, mu_g, ic_s2):
        mu_s = mu_s1
        sigma_s = sigma_s1
        ics = ic_s1
    else:
        mu_s = mu_s2
        sigma_s = sigma_s2
        ics = ic_s2

    for x in range(image.shape[1]):
        cnt = np.sum(np.less(
            spatial.distance.cdist(
                image[0:bopt[x], x],
                mu_s,
                'mahalanobis',
                VI=ics
            ),
            spatial.distance.cdist(
                image[0:bopt[x], x],
                mu_g,
                'mahalanobis',
                VI=icg
            )
        ))

        if cnt < (bopt[x] / 2):
            bopt[x] = 0

    return bopt

def detect_sky(input_image):
    image = cv2.imread(input_image)
    bopt = calculate_border_optimal(image)
    if no_sky_region(bopt, image.shape[0]/30, image.shape[0]/4, 5):
        return
    
    display_mask(bopt, image)
    if partial_sky_region(bopt, image.shape[1]/3):
        bnew = refine_sky(bopt, image)
        display_mask(bnew, image)

@app.route('/uploadforskyreplacement', methods=['POST'])
def sky_replacement():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    
    # Save the file to the upload folder
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    og_img = img_path
    print(img_path)
    
    style_number = int(request.form.get('styleNumber')) if 'styleNumber' in request.form else 1
    
    style_path = f"styles/styleimage{style_number}.png"  # Determine the style image path based on the style number
    detect_sky(img_path)
    
    mask_img = os.path.join('uploads/skystylerepupload/tempimg', "denoised.png")
    
    denoiseplusbw(og_img)
    # Invert the color profile of og_img from RGB to BGR
    inverted_img = cv2.imread(og_img)
    inverted_img = cv2.cvtColor(inverted_img, cv2.COLOR_RGB2BGR)
    cv2.imwrite(os.path.join('uploads/skystylerepupload/tempimg', "inverted_img.png"), inverted_img)
    
    height, width = inverted_img.shape[:2]
    
    stylereplicationimage('uploads/skystylerepupload/tempimg/inverted_img.png', style_path, 2, 1024)
    stylized_sky = os.path.join('uploads/skystylerepupload/tempimg', "stylized_img_for_sky.png")
    encoded_image_data = mask_transfer('uploads/skystylerepupload/tempimg/inverted_img.png', stylized_sky, mask_img, width, height)
    encoded_image_data_base64 = base64.b64encode(encoded_image_data).decode('utf-8')
    print("this is the image : "+encoded_image_data_base64)
    
    # Delete the temporary files
    os.remove(os.path.join('uploads/skystylerepupload/tempimg', "denoised.png"))
    os.remove(os.path.join('uploads/skystylerepupload/tempimg', "inverted_img.png"))
    os.remove(os.path.join('uploads/skystylerepupload/tempimg', "result.png"))
    os.remove(os.path.join('uploads/skystylerepupload/tempimg', "stylized_img_for_sky.png"))
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    
    return encoded_image_data_base64

def mask_transfer(og_img, stylized_image, mask_img, width, height):
    og_img = cv2.imread(og_img)
    stylized_image = cv2.imread(stylized_image, cv2.IMREAD_COLOR)
    mask_img = cv2.imread(mask_img, cv2.IMREAD_GRAYSCALE)

    if stylized_image is None:
        print("Error: Stylized image not loaded correctly")
        print("Stylized image path:", stylized_image)
        return None

    print("Stylized image shape:", stylized_image.shape)


    stylized_image_resized = cv2.resize(stylized_image, (width, height))
    mask_img_resized = cv2.resize(mask_img, (width, height))

    _, mask_binary = cv2.threshold(mask_img_resized, 127, 255, cv2.THRESH_BINARY)
    mask_inv = cv2.bitwise_not(mask_binary)
    result = og_img.copy()
    result[mask_binary == 0] = stylized_image_resized[mask_binary == 0]

    # Encode the result as JPEG image data
    _, encoded_image_data = cv2.imencode('.jpg', cv2.cvtColor(result, cv2.COLOR_RGB2BGR))

    return encoded_image_data.tobytes()

def denoiseplusbw(img_path):
    img_path = None
    def blue_shade_to_white(img):
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        lower_blue = np.array([90, 50, 50])
        upper_blue = np.array([130, 255, 255])
        
        mask = cv2.inRange(hsv, lower_blue, upper_blue)
        mask = cv2.bitwise_not(mask)
        
        return mask

    image = cv2.imread(os.path.join('uploads/skystylerepupload/tempimg',"result.png"))
    mask = blue_shade_to_white(image)
    denoised_mask = cv2.fastNlMeansDenoising(mask, None, 10, 7, 21)
    cv2.imwrite(os.path.join('uploads/skystylerepupload/tempimg',"denoised.png"), denoised_mask)

        

@app.route('/uploadvideoforstylerep', methods=['POST'])
def uploadvideoforstylerep():
    # Define paths and parameters
    style_number = int(request.form.get('styleNumber')) if 'styleNumber' in request.form else 1
    user_defined_fps = 1
    # Save the uploaded video file
    if 'file' in request.files:
        video_file = request.files['file']
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_video.mp4')
        video_file.save(video_path)
    else:
        return jsonify({'error': 'No file part in the request'}), 400

    def load_img(path_to_img):
        max_dim = 512
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
    
    # Define output folders
    output_folder = 'output_frames'
    stylized_output_folder = 'stylized_frames'
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(stylized_output_folder, exist_ok=True)

    # Load style image
    style_img_path = f'styles/styleimage{style_number}.png'  # Assuming style images are stored in 'styles' folder
    style_image = load_img(style_img_path)

    # Load TensorFlow Hub model for style transfer
    # hub_model = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

    # Open the video
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    # Process video frames
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1

        # Stylize every frame
        cv2.imwrite(os.path.join(output_folder, f"frame_{frame_count}.jpg"), frame)
        content_image = load_img(os.path.join(output_folder, f"frame_{frame_count}.jpg"))

        # Perform stylization
        stylized_image = hub_model(tf.constant(content_image), tf.constant(style_image))[0]

        # Convert to numpy array
        stylized_image = tf.image.convert_image_dtype(stylized_image, tf.uint8)
        stylized_image_np = tf.image.encode_jpeg(tf.cast(stylized_image[0] * 255, tf.uint8))

        # Save stylized frame
        with open(os.path.join(stylized_output_folder, f"stylized_frame_{frame_count}.jpg"), 'wb') as f:
            f.write(stylized_image_np.numpy())

    # Release resources
    cap.release()

    # Create the final stylized video
    stylized_images_dir = stylized_output_folder
    image_files = sorted(
        [os.path.join(stylized_images_dir, file) for file in os.listdir(stylized_images_dir)],
        key=lambda x: os.path.getmtime(x)
    )

    first_image = cv2.imread(image_files[0])
    height, width, _ = first_image.shape

    output_video_path = "output_stylized_video.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'h264')  # Use H.264 format
    output_video = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

    for image_file in image_files:
        image = cv2.imread(image_file)
        output_video.write(image)

    output_video.release()

    # Encode the stylized video as base64
    with open(output_video_path, 'rb') as f:
        encoded_video = base64.b64encode(f.read()).decode('utf-8')

    # Return the encoded video as response
    return jsonify({'encoded_video': encoded_video})



if __name__ == '__main__':
    app.run(debug=True)
