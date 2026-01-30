import numpy as np
from enum import Enum

class Gesture(Enum):
    THUMBS_UP = "thumbs_up"
    PEACE = "peace_sign"
    POINTING = "pointing"
    OPEN_HAND = "open_hand"
    FIST = "fist"
    NONE = "none"

class GestureClassifier:
    def __init__(self):
        self.gesture_history = []
        self.history_size = 3  # Smoothing over 3 frames
        print("GestureClassifier initialized")

    def classify_gesture(self, landmarks):
        """
        Classify gesture from hand landmarks
        
        Args:
            landmarks: 21x3 numpy array (MediaPipe hand landmarks)
            
        Returns:
            (Gesture, confidence) tuple
        """
        try:
            if landmarks is None or len(landmarks) != 21:
                return (Gesture.NONE, 0.0)

            # Get finger states
            fingers = self._get_finger_states(landmarks)
            
            # Count extended fingers
            extended_count = sum([fingers['index'], fingers['middle'], 
                                  fingers['ring'], fingers['pinky']])
            
            gesture = Gesture.NONE
            confidence = 0.0
            
            # Thumbs up: thumb up, all other fingers closed
            if fingers['thumb_up'] and extended_count == 0:
                gesture = Gesture.THUMBS_UP
                confidence = 0.90
            
            # Peace sign: index + middle extended, others closed
            elif fingers['index'] and fingers['middle'] and not fingers['ring'] and not fingers['pinky']:
                gesture = Gesture.PEACE
                confidence = 0.85
            
            # Pointing: only index extended
            elif fingers['index'] and not fingers['middle'] and not fingers['ring'] and not fingers['pinky']:
                gesture = Gesture.POINTING
                confidence = 0.88
            
            # Open hand: all fingers extended
            elif extended_count >= 4:
                gesture = Gesture.OPEN_HAND
                confidence = 0.80
            
            # Fist: no fingers extended
            elif extended_count == 0 and not fingers['thumb_up']:
                gesture = Gesture.FIST
                confidence = 0.85
            
            # Apply smoothing
            self.gesture_history.append(gesture)
            if len(self.gesture_history) > self.history_size:
                self.gesture_history.pop(0)
            
            # Return most common gesture from history
            if len(self.gesture_history) >= 2:
                from collections import Counter
                most_common = Counter(self.gesture_history).most_common(1)[0][0]
                return (most_common, confidence if most_common == gesture else confidence * 0.8)
            
            return (gesture, confidence)
                
        except Exception as e:
            print(f"Classification error: {str(e)}")
            return (Gesture.NONE, 0.0)

    def _get_finger_states(self, landmarks):
        """
        Determine which fingers are extended using landmark positions
        
        MediaPipe hand landmarks:
        0: wrist
        1-4: thumb (1=CMC, 2=MCP, 3=IP, 4=TIP)
        5-8: index (5=MCP, 6=PIP, 7=DIP, 8=TIP)
        9-12: middle
        13-16: ring
        17-20: pinky
        """
        
        # Wrist position for reference
        wrist = landmarks[0]
        
        # For fingers (not thumb): tip should be above PIP joint
        # Using Y coordinate (lower Y = higher on screen in MediaPipe)
        
        # Index finger: tip (8) vs PIP (6)
        index_extended = landmarks[8][1] < landmarks[6][1]
        
        # Middle finger: tip (12) vs PIP (10)
        middle_extended = landmarks[12][1] < landmarks[10][1]
        
        # Ring finger: tip (16) vs PIP (14)
        ring_extended = landmarks[16][1] < landmarks[14][1]
        
        # Pinky finger: tip (20) vs PIP (18)
        pinky_extended = landmarks[20][1] < landmarks[18][1]
        
        # Thumb: check if thumb tip is away from palm (using X distance)
        # Also check if thumb is pointing up
        thumb_tip = landmarks[4]
        thumb_ip = landmarks[3]
        index_mcp = landmarks[5]
        
        # Thumb is "up" if tip Y is above IP joint and palm
        thumb_up = thumb_tip[1] < thumb_ip[1] and thumb_tip[1] < wrist[1]
        
        # Thumb is extended if tip is far from index MCP
        thumb_extended = abs(thumb_tip[0] - index_mcp[0]) > 0.1
        
        return {
            'thumb_up': thumb_up,
            'thumb_extended': thumb_extended,
            'index': index_extended,
            'middle': middle_extended,
            'ring': ring_extended,
            'pinky': pinky_extended
        }
