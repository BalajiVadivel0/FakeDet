from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
from dotenv import load_dotenv
from src.model_handler import ModelHandler
from src.custom_model_handler import CustomModelHandler
from src.utils import load_image_from_bytes, preprocess_image

load_dotenv()

app = Flask(__name__)
CORS(app)

# Global model handler
model_handler = None

def get_model():
    global model_handler
    if model_handler is None:
        model_path = os.getenv('MODEL_PATH', 'models/deepfake_detector.pth')
        model_type = os.getenv('MODEL_TYPE', 'huggingface')  # 'huggingface' or 'custom'
        
        if model_type == 'custom' and os.path.exists(model_path):
            # Use custom trained model
            custom_model_type = os.getenv('CUSTOM_MODEL_TYPE', 'custom_cnn')
            model_handler = CustomModelHandler(model_path=model_path, model_type=custom_model_type)
            print(f"Loaded custom model: {model_path}")
        else:
            # Use Hugging Face model (default)
            model_handler = ModelHandler(model_path=model_path)
            print(f"Loaded Hugging Face model: {model_path}")
    
    return model_handler

@app.before_request
def initialize():
    # Ensure model is loaded on startup (or lazy load)
    get_model()

@app.route('/health', methods=['GET'])
def health_check():
    handler = get_model()
    return jsonify({
        'status': 'healthy',
        'service': 'ai-inference',
        'model_loaded': handler.model is not None,
        'device': str(handler.device),
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'version': '1.0.0'
    })

@app.route('/inference/analyze-frame', methods=['POST'])
def analyze_frame():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
            
        file = request.files['image']
        image_bytes = file.read()
        
        # Process
        start_time = time.time()
        
        image = load_image_from_bytes(image_bytes)
        
        # Model handler uses its own processor now
        handler = get_model()
        result = handler.predict(image)
        
        processing_time = (time.time() - start_time) * 1000  # ms
        
        return jsonify({
            'frameNumber': request.form.get('frameNumber', 0),
            'confidence': result['confidence'],
            'distribution': result['distribution'],
            'is_fake': result['is_fake'],
            'processingTime': processing_time,
            'modelVersion': '1.0.0'
        })

    except Exception as e:
        print(f"Error processing frame: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/inference/analyze-video', methods=['POST'])
def analyze_video():
    temp_path = None
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
            
        file = request.files['video']
        
        # Save temp file
        temp_dir = os.path.join(os.getcwd(), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, f"temp_{int(time.time())}.mp4")
        file.save(temp_path)
        
        # Open video
        import cv2
        import numpy as np
        import base64
        from io import BytesIO
        
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            return jsonify({'error': 'Could not open video file'}), 400
            
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = total_frames / fps if fps > 0 else 0
        
        if total_frames <= 0:
             return jsonify({'error': 'Empty video file'}), 400
             
        # Extract keyframes (e.g., 5 frames evenly spaced)
        num_samples = 5
        step = max(1, total_frames // num_samples)
        
        frames_results = []
        frames_base64 = []
        handler = get_model()
        
        for i in range(0, total_frames, step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert BGR (OpenCV) to RGB (PIL/Torch)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            from PIL import Image
            pil_image = Image.fromarray(frame_rgb)
            
            # Predict
            result = handler.predict(pil_image)
            frames_results.append(result)

            # Convert to base64 for backend
            buffered = BytesIO()
            pil_image.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            frames_base64.append(f"data:image/jpeg;base64,{img_str}")
            
            if len(frames_results) >= num_samples:
                break
                
        cap.release()
        
        # Aggregate results
        if not frames_results:
             return jsonify({'error': 'Could not extract frames'}), 500
             
        avg_confidence = np.mean([r['confidence'] for r in frames_results])
        avg_real = np.mean([r['distribution']['real'] for r in frames_results])
        avg_fake = np.mean([r['distribution']['fake'] for r in frames_results])
        
        is_fake = avg_fake > avg_real
        
        return jsonify({
            'type': 'video',
            'framesAnalyzed': len(frames_results),
            'confidence': float(avg_confidence),
            'distribution': {
                'real': float(avg_real),
                'fake': float(avg_fake)
            },
            'is_fake': bool(is_fake),
            'modelVersion': '1.0.0',
            # New Metadata
            'duration': float(duration),
            'fps': float(fps),
            'resolution': {'width': width, 'height': height},
            'frames': frames_base64 # Return frames for forensic analysis
        })

    except Exception as e:
        print(f"Error processing video: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        # Cleanup
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
