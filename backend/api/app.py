from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import base64
import numpy as np
import sys
import os
import traceback

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from gesture_recognition.hand_detector import HandDetector
from gesture_recognition.gesture_classifier import GestureClassifier
from gesture_recognition.gesture_mapper import GestureActionMapper

app = Flask(__name__)

# CORS - allow all localhost origins
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:*", "http://127.0.0.1:*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize gesture components
print("Initializing gesture detection system...")
try:
    detector = HandDetector()
    classifier = GestureClassifier()
    mapper = GestureActionMapper()
    print("All systems initialized")
except Exception as e:
    print(f"Initialization failed: {str(e)}")
    detector = None
    classifier = None
    mapper = None

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'name': 'Accessibility Companion Backend',
        'status': 'running',
        'endpoints': {
            'health': '/api/health',
            'gesture': '/api/accessibility/detect-gesture'
        }
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running',
        'gesture_system': 'ready' if detector else 'error'
    })

@app.route('/api/accessibility/detect-gesture', methods=['POST', 'OPTIONS'])
def detect_gesture():
    """Detect gesture from video frame"""
    
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        # Get frame data
        data = request.json
        frame_data = data.get('frame')
        
        if not frame_data:
            return jsonify({'error': 'No frame data'}), 400

        # Decode base64 image
        try:
            # Remove data URL prefix if present
            if ',' in frame_data:
                frame_data = frame_data.split(',')[1]
            
            nparr = np.frombuffer(base64.b64decode(frame_data), np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return jsonify({'error': 'Failed to decode frame'}), 400
                
        except Exception as e:
            print(f"Frame decode error: {str(e)}")
            return jsonify({'error': f'Decode failed: {str(e)}'}), 400

        # Detect hands
        if detector is None:
            return jsonify({'error': 'Detector not initialized'}), 500
            
        hand_data = detector.detect_hands(frame)
        
        if not hand_data:
            return jsonify({
                'gesture': 'none',
                'confidence': 0.0,
                'action': None,
                'hands_detected': 0
            })

        # Classify gesture
        primary_hand = hand_data[0]
        gesture, confidence = classifier.classify_gesture(primary_hand['landmarks'])
        
        # Get action
        action = mapper.get_action(gesture.value) if confidence > 0.75 else None
        
        # Debug output
        print(f"Detected: {gesture.value} ({confidence:.0%}) - Hands: {len(hand_data)}")

        return jsonify({
            'gesture': gesture.value,
            'confidence': float(confidence),
            'action': action,
            'hands_detected': len(hand_data),
            'handedness': primary_hand['handedness']
        })

    except Exception as e:
        print(f"Error in detect_gesture: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("ACCESSIBILITY COMPANION BACKEND - FULL VERSION")
    print("=" * 60)
    print("Health Check: http://localhost:5001/api/health")
    print("Gesture API:  http://localhost:5001/api/accessibility/detect-gesture")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5001, debug=True)
