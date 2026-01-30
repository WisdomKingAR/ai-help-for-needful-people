import cv2
import numpy as np
import os

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

class HandDetector:
    def __init__(self):
        """Initialize MediaPipe Hand Landmarker (Tasks API)"""
        try:
            # Path to the hand landmarker model
            model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'hand_landmarker.task')
            
            if not os.path.exists(model_path):
                print(f"Model not found at: {model_path}")
                self.detector = None
                return
            
            # Create options for the hand landmarker
            base_options = python.BaseOptions(model_asset_path=model_path)
            options = vision.HandLandmarkerOptions(
                base_options=base_options,
                num_hands=2,
                min_hand_detection_confidence=0.5,
                min_hand_presence_confidence=0.5,
                min_tracking_confidence=0.5
            )
            
            self.detector = vision.HandLandmarker.create_from_options(options)
            print("HandDetector initialized (Tasks API)")
            
        except Exception as e:
            print(f"HandDetector init error: {e}")
            self.detector = None

    def detect_hands(self, frame):
        """
        Detect hands in frame
        
        Args:
            frame: BGR image (numpy array)
            
        Returns:
            List of hand data dictionaries
        """
        if self.detector is None:
            return []
            
        try:
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Create MediaPipe Image
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            
            # Detect hands
            results = self.detector.detect(mp_image)
            
            hand_data = []
            
            if results.hand_landmarks:
                for idx, hand_landmarks in enumerate(results.hand_landmarks):
                    # Extract landmarks
                    landmarks = []
                    for lm in hand_landmarks:
                        landmarks.append([lm.x, lm.y, lm.z])
                    
                    # Get handedness if available
                    handedness = "Unknown"
                    if results.handedness and idx < len(results.handedness):
                        handedness = results.handedness[idx][0].category_name
                    
                    hand_data.append({
                        'landmarks': np.array(landmarks),
                        'handedness': handedness,
                        'confidence': 0.9  # Default confidence
                    })
                    
            return hand_data
            
        except Exception as e:
            print(f"Error in detect_hands: {str(e)}")
            return []
