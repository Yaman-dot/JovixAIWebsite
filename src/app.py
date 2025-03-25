from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import torch
from ultralytics import YOLO

app = Flask(__name__, static_folder='uploads')
CORS(app)

# Use absolute paths for file storage
UPLOAD_FOLDER = os.path.abspath("uploads")
PROCESSED_FOLDER = os.path.abspath("processed")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

print(f"Upload folder: {UPLOAD_FOLDER}")
print(f"Processed folder: {PROCESSED_FOLDER}")

# Dictionary of available models
MODELS = {
    "yolov12n": {
        "path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "yolo12n.pt"),
        "description": "YOLOv12 Nano - Fast, lightweight model"
    },
    "yolov12s": {
        "path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "yolo12s.pt"),
        "description": "YOLOv12 Small - Balanced speed and accuracy"
    },
    "yolov12M": {
        "path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "yolo12m.pt"),
        "description": "YOLOv12 Medium - Balanced speed and accuracy"
    },
    "best": {
        "path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "best.pt"),
        "description": "Custom trained model - Best for specific use cases"
    },
    "nigger":{
        "path": os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "best.pt"),
        "description": "Custom trained model - Best for specific use cases"
    }
}


# Default model
current_model_key = "best"
model = None

def load_model(model_key):
    """Load a model by its key in the MODELS dictionary"""
    global model, current_model_key
    
    if model_key not in MODELS:
        print(f"Model {model_key} not found, using default")
        model_key = "best"
    
    model_path = MODELS[model_key]["path"]

    # Check if model exists at the specified path
    if not os.path.exists(model_path) or not model_path.endswith(".pt"):
        print(f"Model file not found or invalid at: {model_path}")
        return False

    try:
        print(f"Loading model: {model_key} from {model_path}")
        model = YOLO(model_path)  # Ensure path points to a .pt file
        current_model_key = model_key
        print(f"Model loaded successfully")
        return True
    except Exception as e:
        print(f"Failed to load model: {e}")
        return False


# Initialize the default model
load_model(current_model_key)

@app.route("/")
def home():
    """Simple home route to verify the server is running"""
    return jsonify({
        "status": "running",
        "message": "Object Detection API is running. Upload files to /upload endpoint."
    })

@app.route("/models", methods=["GET"])
def get_models():
    """Return the list of available models"""
    models_info = {}
    for key, value in MODELS.items():
        models_info[key] = {
            "description": value["description"],
            "current": key == current_model_key
        }
    return jsonify({
        "models": models_info,
        "current_model": current_model_key
    })

@app.route("/models/switch", methods=["POST"])
def switch_model():
    """Switch to a different model"""
    data = request.json
    model_key = data.get("model")
    
    if not model_key:
        return jsonify({"error": "No model specified"}), 400
    
    if model_key not in MODELS:
        return jsonify({"error": f"Model {model_key} not found"}), 404
    
    success = load_model(model_key)
    if success:
        return jsonify({
            "success": True,
            "current_model": current_model_key
        })
    else:
        return jsonify({
            "error": f"Failed to load model {model_key}"
        }), 500

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    # Save the uploaded file
    try:
        file.save(filepath)
        print(f"File saved: {filepath}")
        
        # Return the original file URL for preview
        original_url = f"/uploads/{filename}"
    except Exception as e:
        print(f"Error saving file: {e}")
        return jsonify({"error": "Failed to save file"}), 500

    # Check if YOLO model is loaded
    if model is None:
        return jsonify({"error": "YOLO model not available"}), 500

    # Process image
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".gif")):
        result = process_image(filepath, filename)
        # Add the original file URL to the response
        if result[1] == 200:  # If processing was successful
            result_data = result[0].get_json()
            result_data["original_file"] = original_url
            return jsonify(result_data), 200
        return result

    # Process video
    elif filename.lower().endswith((".mp4", ".avi", ".mov", ".mkv")):
        result = process_video(filepath, filename)
        # Add the original file URL to the response
        if result[1] == 200:  # If processing was successful
            result_data = result[0].get_json()
            result_data["original_file"] = original_url
            return jsonify(result_data), 200
        return result

    else:
        print("Unsupported file type:", filename)
        return jsonify({"error": "Unsupported file type"}), 400

def process_image(filepath, filename):
    try:
        results = model(filepath)[0]  # Get first result
        processed_filepath = os.path.join(PROCESSED_FOLDER, filename)

        # Debugging: check if results contain detections
        print(f"Processing image: {filename}")
        
        # Extract detection results
        detections = []
        for box in results.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            label = results.names[class_id]
            
            # Add to detections list
            detections.append({
                "label": label,
                "confidence": round(confidence * 100, 2),
                "bbox": box.xyxy[0].tolist()  # Convert tensor to list
            })
        
        print(f"Number of detections: {len(detections)}")

        img = results.plot()  # Draw bounding boxes

        if img is None:
            print("Error: Processed image is None")
            return jsonify({"error": "Image processing failed"}), 500

        # Save processed image
        success = cv2.imwrite(processed_filepath, img)
        if not success:
            print("Error saving processed image")
            return jsonify({"error": "Failed to save processed image"}), 500

        print(f"Processed image saved: {processed_filepath}")
        # Return the full URL to access the processed file
        processed_url = f"/processed/{filename}"
        return jsonify({
            "processed_file": processed_url, 
            "type": "image",
            "full_url": f"http://localhost:5000{processed_url}",
            "detections": detections,
            "model_used": current_model_key
        }), 200

    except Exception as e:
        print(f"YOLO image processing error: {e}")
        return jsonify({"error": "Image processing failed"}), 500

def process_video(filepath, filename):
    try:
        cap = cv2.VideoCapture(filepath)
        if not cap.isOpened():
            print("Error: Cannot open video file")
            return jsonify({"error": "Failed to open video file"}), 500

        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        codec = cv2.VideoWriter_fourcc(*"mp4v")

        processed_filepath = os.path.join(PROCESSED_FOLDER, filename)
        out = cv2.VideoWriter(processed_filepath, codec, fps, (frame_width, frame_height))

        print(f"Processing video: {filename}")
        
        # For videos, we'll collect detections from the first frame only
        first_frame_detections = []
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)[0]
            
            # Collect detections from first frame
            if frame_count == 0:
                for box in results.boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    label = results.names[class_id]
                    
                    # Add to detections list
                    first_frame_detections.append({
                        "label": label,
                        "confidence": round(confidence * 100, 2),
                        "bbox": box.xyxy[0].tolist()  # Convert tensor to list
                    })
            
            frame = results.plot()  # Draw bounding boxes
            out.write(frame)
            frame_count += 1

        cap.release()
        out.release()

        print(f"Processed video saved: {processed_filepath}")
        # Return the full URL to access the processed file
        processed_url = f"/processed/{filename}"
        return jsonify({
            "processed_file": processed_url, 
            "type": "video",
            "full_url": f"http://localhost:5000{processed_url}",
            "detections": first_frame_detections,
            "model_used": current_model_key
        }), 200

    except Exception as e:
        print(f"YOLO video processing error: {e}")
        return jsonify({"error": "Video processing failed"}), 500

@app.route("/processed/<filename>")
def processed_file(filename):
    """Serve the processed file for preview"""
    file_path = os.path.join(PROCESSED_FOLDER, filename)
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return jsonify({"error": "File not found"}), 404

    print(f"Serving processed file: {filename}")
    return send_from_directory(PROCESSED_FOLDER, filename)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    """Serve the original uploaded file for preview"""
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        print(f"Original file not found: {file_path}")
        return jsonify({"error": "File not found"}), 404

    print(f"Serving original file: {filename}")
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/test")
def test_connection():
    """Test endpoint to verify API is accessible"""
    return jsonify({
        "status": "success",
        "message": "API is accessible",
        "upload_folder": UPLOAD_FOLDER,
        "processed_folder": PROCESSED_FOLDER,
        "current_model": current_model_key,
        "available_models": list(MODELS.keys())
    })

if __name__ == "__main__":
    # Explicitly use "localhost" instead of the default "127.0.0.1"
    print("Starting server on http://localhost:5000")
    app.run(debug=True, host="localhost", port=5000)