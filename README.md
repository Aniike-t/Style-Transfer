# **Run Locally**

#   Description
Leveraging advanced computer vision techniques, including the powerful VGG19 and CartoonGAN models. This project enables users to seamlessly blend the content of images/videos with the artistic style of another.


## Client Side

1. Open the terminal and navigate to the client directory:
   ```bash
   cd client
   cd stylerepfrontend
   ```

2. Install Node Package Manager dependencies:
   ```bash
   npm install
   ```

3. Install required packages:
   ```bash
   npm install axios
   npm install react-router-dom
   npm install hamburger-react
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Server Side

1. In another terminal window, navigate to the server directory:
   ```bash
   cd server
   ```

2. Install TensorFlow for Python by running the following command inside `app.py`:
   ```bash
   pip install flask flask_cors opencv-python-headless tensorflow tensorflow_hub numpy scipy
   ```
3. To download the model tar file, please visit the following link: [Arbitrary Image Stylization Model](https://www.kaggle.com/models/google/arbitrary-image-stylization-v1/TensorFlow1/256/2)

    After downloading the file, extract its contents and paste them into the `server\models\modelStyleTransfer` folder. If there are existing files in this folder, you can replace them with the extracted files.       This will ensure that the model files are available for the style transfer functionality in your server code.
   
4. Start the server:
   ```bash
   python app.py
   ```

# Outputs

- ### **Style Transfer:**

  ![Style Transfer](https://github.com/Aniike-t/ImgStyleReplication/assets/114077388/840d720f-3286-4d28-a205-3274525f7993)


- ### **Video :**


  [View Output](https://github.com/Aniike-t/ImgStyleReplication/assets/114077388/0753e6c0-6794-4383-9798-af31a7fcd03a)
```
```
