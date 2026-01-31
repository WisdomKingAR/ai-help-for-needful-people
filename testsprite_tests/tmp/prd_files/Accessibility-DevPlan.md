# 🚀 ACCESSIBILITY COMPANION - 18-HOUR DEVELOPMENT PLAN & TASK DISTRIBUTION

**Hackathon:** Cyber Cypher 5.0 | NMIMS MPSTME Taqneeq 18.0  
**Date:** January 31 - February 1, 2026 (18 Hours)  
**Team:** 3 Members (You + 2 Friends)  
**Platform:** Google Antigravity ADE (Free Plan)  
**Deployment:** Vercel (Frontend) + Ngrok/Localhost (Demo)  

---

## 📊 TEAM STRUCTURE & ROLE ASSIGNMENT

```
Person 1 (You - AI/ML + Backend Lead)
├─ Feature: Hand Gesture Recognition + Voice Commands Backend
├─ Role: MediaPipe integration, gesture classification, command parsing
├─ Tech: Python, MediaPipe, TensorFlow Lite, Flask API
└─ Hours: 18 hours (continuous)

Person 2 (Friend A - Frontend/UI Lead)
├─ Feature: React UI + Accessibility Toolbar
├─ Role: Component design, settings panel, real-time displays
├─ Tech: React.js, Tailwind CSS, Web APIs, Zustand
└─ Hours: 18 hours (continuous)

Person 3 (Friend B - Speech & Text Services)
├─ Feature: Speech-to-Text + Text-to-Speech + Text Formatting
├─ Role: Google APIs integration, voice synthesis, font management
├─ Tech: React, Web Audio API, gTTS/Google APIs, TTS
└─ Hours: 18 hours (continuous)
```

---

## 🎯 MVP SCOPE FOR 18 HOURS (STRICT)

### What WILL Be Done ✅
1. **Text-to-Speech** - Read any selected text aloud (Web Speech API + gTTS)
2. **Speech-to-Text** - Real-time transcription display (Google Speech-to-Text API)
3. **Hand Gesture Recognition** - Detect 5 gestures for website control (MediaPipe)
4. **Text Formatting & Fonts** - Dyslexia-friendly fonts + color themes (CSS-based)
5. **Accessibility Toolbar** - Toggle features, adjust settings
6. **Responsive UI** - Works on desktop (phone as secondary)
7. **Live Demo Ready** - All features demoed on sample webpage

### What WON'T Be Done ❌
1. Video captioning (too complex)
2. Full Chrome extension (web app only)
3. Text simplification AI (Phase 2)
4. Multi-language support (English only)
5. Advanced voice command recognition (simple keyword matching)
6. Mobile app (web responsive only)
7. Database persistence (session-only settings)

---

## ⏰ DETAILED TASK BREAKDOWN BY PERSON

---

# PERSON 1: YOU (AI/ML + Backend Lead)

## 🤖 Your Role
- **Primary:** Hand gesture recognition system, voice command backend
- **Secondary:** MediaPipe pipeline, gesture-to-action mapping
- **Critical Path:** Real-time ML model is most complex - start immediately

## Timeline Breakdown (18 Hours)

### Hours 0-2: Setup & Architecture Planning

**Tasks:**
- [ ] Setup Python virtual environment
  ```bash
  python3 -m venv accessibility-venv
  source accessibility-venv/bin/activate
  ```

- [ ] Install dependencies
  ```bash
  pip install mediapipe opencv-python numpy flask flask-cors python-dotenv
  pip install google-cloud-speech google-cloud-texttospeech
  ```

- [ ] Create folder structure
  ```
  accessibility-backend/
  ├── gesture_recognition/
  │   ├── hand_detector.py
  │   ├── gesture_classifier.py
  │   └── gesture_mapper.py
  ├── voice_commands/
  │   ├── command_parser.py
  │   └── intent_recognizer.py
  ├── api/
  │   └── app.py (Flask)
  ├── models/
  │   └── gesture_mappings.json
  ├── requirements.txt
  ├── .env.example
  └── README.md
  ```

- [ ] Design gesture recognition pipeline
  ```
  Video Input → Hand Detection (MediaPipe)
             → Hand Skeleton Extraction
             → Gesture Classification (Rule-based)
             → Confidence Check (>80%?)
             → Action Trigger
             → Visual Feedback
  ```

- [ ] Design voice command pipeline
  ```
  Audio Input → Speech Recognition (Web Speech API from frontend)
             → Text Command
             → Intent Parsing (Keyword matching)
             → Action Mapping
             → Execution via Frontend
  ```

**Git Commit:**
```bash
git add .
git commit -m "setup: Python project scaffold, dependencies, folder structure"
```

---

### Hours 2-6: Hand Gesture Recognition Implementation

**CRITICAL:** This is your core feature. Spend quality time here.

**Tasks:**
- [ ] **Create Hand Detector Module**
  ```python
  # gesture_recognition/hand_detector.py
  import mediapipe as mp
  import cv2
  import numpy as np

  class HandDetector:
      def __init__(self):
          self.mp_hands = mp.solutions.hands
          self.hands = self.mp_hands.Hands(
              static_image_mode=False,
              max_num_hands=2,
              min_detection_confidence=0.7,
              min_tracking_confidence=0.5
          )
          self.mp_drawing = mp.solutions.drawing_utils
      
      def detect_hands(self, frame):
          """
          Input: Video frame (BGR)
          Output: Hand landmarks, handedness (left/right), confidence
          """
          rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
          results = self.hands.process(rgb_frame)
          
          hand_data = []
          if results.multi_hand_landmarks:
              for hand_landmarks, handedness in zip(
                  results.multi_hand_landmarks,
                  results.multi_handedness
              ):
                  landmarks = []
                  for lm in hand_landmarks.landmark:
                      landmarks.append([lm.x, lm.y, lm.z])
                  
                  hand_data.append({
                      'landmarks': np.array(landmarks),
                      'handedness': handedness.classification[0].label,
                      'confidence': handedness.classification[0].score
                  })
          
          return hand_data
      
      def draw_hand_skeleton(self, frame, hand_data):
          """Draw detected hand skeleton on frame"""
          if hand_data:
              for hand in hand_data:
                  # Draw landmarks and connections
                  landmarks = hand['landmarks']
                  # (drawing code here)
          
          return frame
  ```

- [ ] **Create Gesture Classifier**
  ```python
  # gesture_recognition/gesture_classifier.py
  import numpy as np
  from enum import Enum

  class Gesture(Enum):
      POINT = "point_at_target"
      THUMBS_UP = "thumbs_up"
      PEACE = "peace_sign"
      OPEN_HAND = "open_hand"
      CLOSED_FIST = "closed_fist"
      NONE = "no_gesture"

  class GestureClassifier:
      def __init__(self):
          self.gesture_threshold = 0.85
      
      def classify_gesture(self, hand_landmarks):
          """
          Input: 21-point hand skeleton (x, y, z coords)
          Output: Gesture label + confidence
          """
          # Finger extension detection
          fingers_extended = self._detect_extended_fingers(hand_landmarks)
          hand_openness = self._calculate_hand_openness(hand_landmarks)
          
          # Gesture classification logic
          if self._is_pointing(hand_landmarks, fingers_extended):
              return (Gesture.POINT, 0.92)
          
          elif self._is_thumbs_up(hand_landmarks, fingers_extended):
              return (Gesture.THUMBS_UP, 0.88)
          
          elif self._is_peace_sign(hand_landmarks, fingers_extended):
              return (Gesture.PEACE, 0.90)
          
          elif hand_openness > 0.8 and len(fingers_extended) >= 4:
              return (Gesture.OPEN_HAND, 0.85)
          
          elif hand_openness < 0.3:
              return (Gesture.CLOSED_FIST, 0.87)
          
          else:
              return (Gesture.NONE, 0.0)
      
      def _detect_extended_fingers(self, landmarks):
          """Detect which fingers are extended"""
          # Thumb, Index, Middle, Ring, Pinky
          finger_tips = [4, 8, 12, 16, 20]
          finger_pips = [3, 6, 10, 14, 18]
          
          extended = []
          for tip, pip in zip(finger_tips, finger_pips):
              # If fingertip is above PIP joint, finger is extended
              if landmarks[tip][1] < landmarks[pip][1]:
                  extended.append(True)
              else:
                  extended.append(False)
          
          return extended
      
      def _calculate_hand_openness(self, landmarks):
          """0 = closed fist, 1 = fully open hand"""
          # Distance from palm center to fingertips
          palm_center = landmarks[9]  # Wrist
          distances = []
          
          for tip_idx in [4, 8, 12, 16, 20]:
              dist = np.linalg.norm(landmarks[tip_idx][:2] - palm_center[:2])
              distances.append(dist)
          
          openness = np.mean(distances)
          return min(openness, 1.0)
      
      def _is_pointing(self, landmarks, fingers_extended):
          """Index finger extended, others folded"""
          return (fingers_extended[1] and  # Index extended
                  not fingers_extended[2] and  # Middle folded
                  not fingers_extended[3] and  # Ring folded
                  not fingers_extended[4])  # Pinky folded
      
      def _is_thumbs_up(self, landmarks, fingers_extended):
          """Thumb up, other fingers folded, palm facing camera"""
          thumb_y = landmarks[4][1]
          palm_y = landmarks[9][1]
          
          return (thumb_y < palm_y and  # Thumb is above palm
                  not any(fingers_extended[1:]))  # Other fingers folded
      
      def _is_peace_sign(self, landmarks, fingers_extended):
          """Index and middle extended, others folded"""
          return (fingers_extended[1] and  # Index extended
                  fingers_extended[2] and  # Middle extended
                  not fingers_extended[3] and  # Ring folded
                  not fingers_extended[4])  # Pinky folded
  ```

- [ ] **Create Gesture-to-Action Mapper**
  ```python
  # gesture_recognition/gesture_mapper.py
  import json

  class GestureActionMapper:
      def __init__(self, mapping_file='models/gesture_mappings.json'):
          with open(mapping_file, 'r') as f:
              self.mappings = json.load(f)
      
      def get_action(self, gesture):
          """Map gesture to website action"""
          return self.mappings.get(gesture, None)
  
  # models/gesture_mappings.json
  {
    "point_at_target": "click",
    "thumbs_up": "scroll_down",
    "peace_sign": "scroll_up",
    "open_hand": "pause",
    "closed_fist": "play"
  }
  ```

- [ ] **Create Flask API for Gesture Detection**
  ```python
  # api/app.py
  from flask import Flask, request, jsonify
  from flask_cors import CORS
  import cv2
  import base64
  import numpy as np
  from gesture_recognition.hand_detector import HandDetector
  from gesture_recognition.gesture_classifier import GestureClassifier
  from gesture_recognition.gesture_mapper import GestureActionMapper

  app = Flask(__name__)
  CORS(app)

  detector = HandDetector()
  classifier = GestureClassifier()
  mapper = GestureActionMapper()

  @app.route('/api/accessibility/detect-gesture', methods=['POST'])
  def detect_gesture():
      try:
          # Receive video frame as base64
          data = request.json
          frame_data = data.get('frame')
          
          # Decode frame
          nparr = np.frombuffer(base64.b64decode(frame_data), np.uint8)
          frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
          
          # Detect hands
          hand_data = detector.detect_hands(frame)
          
          if not hand_data:
              return jsonify({
                  'gesture': 'none',
                  'confidence': 0.0,
                  'action': None
              })
          
          # Classify gesture for first hand
          primary_hand = hand_data[0]
          gesture, confidence = classifier.classify_gesture(
              primary_hand['landmarks']
          )
          
          # Get action mapping
          action = mapper.get_action(gesture.value) if confidence > 0.85 else None
          
          # Draw skeleton on frame
          annotated_frame = detector.draw_hand_skeleton(frame, hand_data)
          _, buffer = cv2.imencode('.jpg', annotated_frame)
          annotated_b64 = base64.b64encode(buffer).decode()
          
          return jsonify({
              'gesture': gesture.value,
              'confidence': float(confidence),
              'action': action,
              'frame_annotated': annotated_b64
          })
      
      except Exception as e:
          return jsonify({'error': str(e)}), 500

  @app.route('/api/health', methods=['GET'])
  def health():
      return jsonify({'status': 'healthy'})

  if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5001, debug=True)
  ```

**Testing Checklist:**
- [ ] Hand detection works with webcam
- [ ] Gestures detected with >80% confidence
- [ ] API endpoint returns correct gesture labels
- [ ] Annotated frames show skeleton overlay
- [ ] No crashes with edge cases (no hands, poor lighting)

**Git Commit:**
```bash
git add .
git commit -m "feat: hand detection, gesture classification, action mapping"
```

---

### Hours 6-10: Voice Command Implementation + Integration Prep

**Tasks:**
- [ ] **Create Voice Command Parser**
  ```python
  # voice_commands/command_parser.py
  class VoiceCommandParser:
      def __init__(self):
          self.commands = {
              'click': ['click', 'tap', 'activate', 'press'],
              'scroll_down': ['scroll down', 'go down', 'next', 'page down'],
              'scroll_up': ['scroll up', 'go up', 'back', 'page up'],
              'read_this': ['read this', 'read', 'speak'],
              'stop': ['stop', 'pause', 'quit', 'exit']
          }
      
      def parse_command(self, voice_text):
          """
          Input: Spoken text from user
          Output: Command name + confidence
          """
          voice_text = voice_text.lower().strip()
          
          for command, keywords in self.commands.items():
              for keyword in keywords:
                  if keyword in voice_text:
                      confidence = len(keyword) / len(voice_text)
                      return (command, min(confidence, 1.0))
          
          return (None, 0.0)
  ```

- [ ] **Create Flask endpoint for command execution**
  ```python
  # In api/app.py, add:
  @app.route('/api/accessibility/execute-command', methods=['POST'])
  def execute_command():
      try:
          data = request.json
          command_text = data.get('command')
          
          parser = VoiceCommandParser()
          command, confidence = parser.parse_command(command_text)
          
          if confidence < 0.6:
              return jsonify({
                  'status': 'not_confident',
                  'command': None,
                  'confidence': confidence
              })
          
          return jsonify({
              'status': 'success',
              'command': command,
              'confidence': float(confidence)
          })
      
      except Exception as e:
          return jsonify({'error': str(e)}), 500
  ```

- [ ] **Optimize MediaPipe for real-time performance**
  - Use lightweight model (`lite` version)
  - Process every 2nd frame (skip frames for speed)
  - Set lower detection confidence threshold for speed

- [ ] **Create requirements.txt**
  ```
  mediapipe==0.8.11
  opencv-python==4.8.1
  numpy==1.24.3
  flask==3.0.0
  flask-cors==4.0.0
  python-dotenv==1.0.0
  google-cloud-speech==2.21.0
  google-cloud-texttospeech==2.14.1
  ```

- [ ] **Deploy backend to local/ngrok**
  ```bash
  # For demo, run locally:
  python api/app.py
  
  # Share with team via ngrok:
  ngrok http 5001
  # Share ngrok URL with Person 2 for frontend integration
  ```

**Testing:**
- [ ] Flask server starts without errors
- [ ] Health endpoint responds
- [ ] Gesture detection API works
- [ ] Voice command parsing works
- [ ] No latency > 500ms per frame

**Git Commit:**
```bash
git add .
git commit -m "feat: voice command parser, Flask endpoints, performance optimization"
```

---

### Hours 10-14: Integration with Frontend + Error Handling

**Tasks:**
- [ ] **Create API client module for frontend communication**
  ```python
  # api/client_config.py
  import os
  from dotenv import load_dotenv

  load_dotenv()

  API_CONFIG = {
      'gesture_detection': {
          'endpoint': os.getenv('GESTURE_API_URL', 'http://localhost:5001'),
          'timeout': 5
      },
      'google_apis': {
          'speech_to_text': os.getenv('GOOGLE_CREDENTIALS'),
          'text_to_speech': os.getenv('GOOGLE_CREDENTIALS')
      }
  }
  ```

- [ ] **Add comprehensive error handling**
  ```python
  # In api/app.py, add error handler:
  @app.errorhandler(Exception)
  def handle_error(e):
      return jsonify({
          'error': str(e),
          'type': type(e).__name__,
          'fallback': 'Use demo mode'
      }), 500
  ```

- [ ] **Create demo/fallback responses** (for when APIs are down)
  ```python
  # api/demo_data.py
  DEMO_GESTURES = {
      'point_at_target': {
          'gesture': 'point_at_target',
          'confidence': 0.92,
          'action': 'click'
      },
      'thumbs_up': {
          'gesture': 'thumbs_up',
          'confidence': 0.88,
          'action': 'scroll_down'
      }
  }
  
  # Use in API when real detection fails:
  # return DEMO_GESTURES['point_at_target']
  ```

- [ ] **Coordinate with Person 2**
  - Share API endpoint URLs
  - Document expected request/response formats
  - Create integration test script

- [ ] **Performance optimization**
  - Profile code to find bottlenecks
  - Use threading for gesture detection
  - Cache model loading

**Git Commit:**
```bash
git add .
git commit -m "feat: error handling, fallback modes, Person 2 integration prep"
```

---

### Hours 14-17: Testing, Documentation, Deployment Prep

**Tasks:**
- [ ] **Write unit tests**
  ```bash
  pip install pytest
  
  # tests/test_gesture_classifier.py
  def test_point_gesture():
      classifier = GestureClassifier()
      # Test with known point gesture landmarks
      gesture, conf = classifier.classify_gesture(point_landmarks)
      assert gesture == Gesture.POINT
      assert conf > 0.85
  ```

- [ ] **Create comprehensive README**
  ```markdown
  # Accessibility Companion - Backend

  ## Setup
  1. python3 -m venv venv
  2. source venv/bin/activate
  3. pip install -r requirements.txt
  4. python api/app.py

  ## API Endpoints
  - POST /api/accessibility/detect-gesture
  - POST /api/accessibility/execute-command
  - GET /api/health

  ## Gesture Mappings
  [List all gestures and mappings]
  ```

- [ ] **Performance benchmarks**
  - Hand detection: < 100ms per frame
  - Gesture classification: < 50ms
  - API response: < 200ms total

- [ ] **Prepare deployment**
  - Backend ready on local or ngrok
  - Environment variables documented
  - Error messages user-friendly

**Final Checklist:**
- [ ] All endpoints tested with Postman
- [ ] README complete
- [ ] Code commented and clean
- [ ] No hardcoded values
- [ ] Error handling for all paths
- [ ] Tests passing

**Git Commit:**
```bash
git add .
git commit -m "chore: testing, documentation, deployment prep"
```

---

### Hours 17-18: Final Integration + Demo Prep

**Tasks:**
- [ ] **End-to-end testing with Person 2's frontend**
  - Frontend sends video frames → Backend detects gestures
  - Voice commands flow: Speech recognition → Backend parsing → Action

- [ ] **Record demo video** (backup if live demo fails)
  - Hand gestures controlling website
  - Voice commands working
  - Real-time responsiveness

- [ ] **Create demo script**
  ```
  "Here's our hand gesture recognition system:
   1. I point at a button → it clicks
   2. Thumbs up → scrolls down
   3. All in real-time using MediaPipe
   
   And voice commands:
   1. Say 'scroll down' → page scrolls
   2. Say 'click submit' → form submits"
  ```

- [ ] **Troubleshoot any integration issues**
  - Latency problems
  - API connection issues
  - Demo failures

**Git Commit:**
```bash
git add .
git commit -m "chore: final integration testing, demo video, demo script"
```

---

## 📌 PERSON 1 CRITICAL NOTES

### What to Remember
1. **MediaPipe is CPU-intensive** - Test on target hardware
2. **Real-time = streaming** - Frame processing must be fast (<100ms)
3. **Gesture confidence matters** - Only trigger actions > 0.85 confidence
4. **Fallback to demo** - If performance is bad, show pre-recorded demo
5. **Test with friends** - Hand shapes vary by person

### Success Metrics
- ✅ 5+ hand gestures working
- ✅ API endpoints responding < 200ms
- ✅ Hand skeleton visualization clear
- ✅ Fallback demo data ready
- ✅ Zero crashes during 18-hour period

---

# PERSON 2: FRONTEND/UI LEAD

## 🎨 Your Role
- **Primary:** React UI, accessibility toolbar, settings panel, real-time displays
- **Secondary:** State management, integration with APIs
- **Critical Path:** UI is what judges see - polish matters

## Timeline Breakdown (18 Hours)

### Hours 0-2: Setup & Component Architecture

**Tasks:**
- [ ] Create React project
  ```bash
  npm create vite@latest accessibility-frontend -- --template react
  cd accessibility-frontend
  npm install
  ```

- [ ] Install dependencies
  ```bash
  npm install tailwindcss postcss autoprefixer
  npm install zustand axios react-icons
  npm install clsx
  ```

- [ ] Setup Tailwind
  ```bash
  npx tailwindcss init -p
  ```

- [ ] Create folder structure
  ```
  src/
  ├── components/
  │   ├── AccessibilityToolbar.jsx
  │   ├── STTPanel.jsx (Speech-to-Text)
  │   ├── TTSPanel.jsx (Text-to-Speech)
  │   ├── GesturePanel.jsx
  │   ├── SettingsPanel.jsx
  │   └── TextFormattingPanel.jsx
  ├── hooks/
  │   ├── useSpeechToText.js
  │   ├── useTextToSpeech.js
  │   ├── useGestureDetection.js
  │   └── usePreferences.js
  ├── services/
  │   ├── api.js
  │   └── accessibility.js
  ├── stores/
  │   └── preferences.js (Zustand)
  ├── pages/
  │   └── Demo.jsx
  ├── App.jsx
  └── index.css
  ```

- [ ] **Design accessibility toolbar layout**
  ```
  ┌─────────────────────────────────────────────────┐
  │ 🔊 TTS | 🎤 STT | 👆 Gestures | 📝 Format | ⚙️ Settings
  └─────────────────────────────────────────────────┘
  ```

- [ ] **Create color scheme**
  - Primary: Blue (accessible color)
  - Secondary: Green (for enabled features)
  - Error: Red
  - High contrast for accessibility

**Git Commit:**
```bash
git add .
git commit -m "setup: React project, Tailwind, component structure"
```

---

### Hours 2-6: Core UI Components

**Tasks:**
- [ ] **Create AccessibilityToolbar component**
  ```jsx
  // components/AccessibilityToolbar.jsx
  import { useState } from 'react';
  import { FiVolume2, FiMic, FiHand, FiSettings } from 'react-icons/fi';
  
  export default function AccessibilityToolbar() {
    const [activeTab, setActiveTab] = useState(null);
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-lg p-4">
        <div className="flex gap-4 justify-center flex-wrap">
          {/* Text-to-Speech Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'tts' ? null : 'tts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'tts'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Text-to-Speech: Read selected text aloud"
          >
            <FiVolume2 size={20} />
            <span>🔊 Read Text</span>
          </button>

          {/* Speech-to-Text Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'stt' ? null : 'stt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'stt'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Speech-to-Text: See what you're saying"
          >
            <FiMic size={20} />
            <span>🎤 Listen & Type</span>
          </button>

          {/* Gesture Recognition Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'gesture' ? null : 'gesture')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'gesture'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Hand Gestures: Control with your hands"
          >
            <FiHand size={20} />
            <span>👆 Hand Control</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'settings' ? null : 'settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Accessibility Settings"
          >
            <FiSettings size={20} />
            <span>⚙️ Settings</span>
          </button>
        </div>

        {/* Panel content */}
        {activeTab && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {activeTab === 'tts' && <TTSPanel />}
            {activeTab === 'stt' && <STTPanel />}
            {activeTab === 'gesture' && <GesturePanel />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Create STTPanel (Speech-to-Text)**
  ```jsx
  // components/STTPanel.jsx
  import { useState, useEffect } from 'react';
  
  export default function STTPanel() {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [apiUrl] = useState('http://localhost:5001');
    
    const startListening = async () => {
      setIsListening(true);
      
      // Using Web Speech API (browser native)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => {
        setTranscript('Listening...');
      };
      
      recognition.onresult = (event) => {
        let final_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript(final_transcript || transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    };
    
    const stopListening = () => {
      setIsListening(false);
    };
    
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">🎤 Speech-to-Text</h3>
        
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
        </button>
        
        <div className="p-4 bg-white rounded-lg border-2 border-gray-300 min-h-24">
          <p className="text-gray-700 leading-relaxed">{transcript}</p>
        </div>
        
        <button
          onClick={() => {
            navigator.clipboard.writeText(transcript);
            alert('Copied to clipboard!');
          }}
          className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
        >
          📋 Copy Text
        </button>
      </div>
    );
  }
  ```

- [ ] **Create TTSPanel (Text-to-Speech)**
  ```jsx
  // components/TTSPanel.jsx
  import { useState } from 'react';
  
  export default function TTSPanel() {
    const [selectedText, setSelectedText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voice, setVoice] = useState('female');
    const [speed, setSpeed] = useState(1.0);
    
    const readText = () => {
      if (!selectedText) {
        alert('Please enter or select text to read');
        return;
      }
      
      // Using Web Speech API
      const utterance = new SpeechSynthesisUtterance(selectedText);
      utterance.rate = speed;
      utterance.voice = speechSynthesis.getVoices().find(v => 
        voice === 'female' ? v.name.includes('Female') : v.name.includes('Male')
      ) || speechSynthesis.getVoices()[0];
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    };
    
    const stopReading = () => {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    };
    
    // Get text from current selection
    const grabSelectedText = () => {
      const text = window.getSelection().toString();
      if (text) {
        setSelectedText(text);
      } else {
        alert('Please select some text on the page first');
      }
    };
    
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">🔊 Text-to-Speech</h3>
        
        <button
          onClick={grabSelectedText}
          className="w-full py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
        >
          📍 Grab Selected Text
        </button>
        
        <textarea
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Paste text here or use 'Grab Selected Text' button"
          rows={4}
        />
        
        <div className="space-y-2">
          <label className="block font-semibold">Voice:</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded-lg"
          >
            <option value="female">👩 Female</option>
            <option value="male">👨 Male</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block font-semibold">Speed: {speed.toFixed(1)}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <button
          onClick={isSpeaking ? stopReading : readText}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSpeaking ? '⏹️ Stop Reading' : '▶️ Read Text'}
        </button>
      </div>
    );
  }
  ```

- [ ] **Create TextFormattingPanel**
  ```jsx
  // components/TextFormattingPanel.jsx
  import { usePreferencesStore } from '../stores/preferences';
  
  export default function TextFormattingPanel() {
    const { preferences, updatePreferences } = usePreferencesStore();
    
    const fonts = [
      { name: 'Default', value: 'sans-serif' },
      { name: 'OpenDyslexic', value: 'OpenDyslexic' },
      { name: 'Lexie Readable', value: 'Lexie Readable' },
      { name: 'Arial', value: 'Arial' }
    ];
    
    const colorThemes = [
      { name: 'Normal', bg: '#ffffff', text: '#000000' },
      { name: 'Dark Mode', bg: '#1a1a1a', text: '#ffffff' },
      { name: 'High Contrast', bg: '#000000', text: '#ffff00' },
      { name: 'Sepia', bg: '#f4ecd8', text: '#654321' }
    ];
    
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">📝 Text Formatting</h3>
        
        <div className="space-y-2">
          <label className="block font-semibold">Font:</label>
          <select
            value={preferences.font}
            onChange={(e) => updatePreferences({ font: e.target.value })}
            className="w-full p-2 border-2 border-gray-300 rounded-lg"
          >
            {fonts.map(f => (
              <option key={f.value} value={f.value}>{f.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block font-semibold">Font Size: {preferences.fontSize}%</label>
          <input
            type="range"
            min="100"
            max="300"
            step="10"
            value={preferences.fontSize}
            onChange={(e) => updatePreferences({ fontSize: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block font-semibold">Line Spacing: {preferences.lineSpacing}</label>
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={preferences.lineSpacing}
            onChange={(e) => updatePreferences({ lineSpacing: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block font-semibold">Color Theme:</label>
          <div className="grid grid-cols-2 gap-2">
            {colorThemes.map(theme => (
              <button
                key={theme.name}
                onClick={() => updatePreferences({
                  bgColor: theme.bg,
                  textColor: theme.text
                })}
                style={{ backgroundColor: theme.bg, color: theme.text }}
                className="p-3 rounded-lg border-2 font-semibold"
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  ```

**Git Commit:**
```bash
git add .
git commit -m "feat: core accessibility panels (TTS, STT, text formatting)"
```

---

### Hours 6-10: Gesture Recognition UI + Settings

**Tasks:**
- [ ] **Create GesturePanel**
  ```jsx
  // components/GesturePanel.jsx
  import { useEffect, useState, useRef } from 'react';
  
  export default function GesturePanel() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectedGesture, setDetectedGesture] = useState('none');
    const [confidence, setConfidence] = useState(0);
    const [apiUrl] = useState('http://localhost:5001');
    
    const startGestureDetection = async () => {
      setIsDetecting(true);
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        
        // Process video frames
        const processFrame = async () => {
          if (!videoRef.current || !canvasRef.current) return;
          
          const context = canvasRef.current.getContext('2d');
          context.drawImage(videoRef.current, 0, 0, 480, 360);
          
          const frameData = canvasRef.current.toDataURL('image/jpeg');
          
          try {
            const response = await fetch(`${apiUrl}/api/accessibility/detect-gesture`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ frame: frameData })
            });
            
            const result = await response.json();
            setDetectedGesture(result.gesture);
            setConfidence((result.confidence * 100).toFixed(1));
            
            // Draw annotated frame if available
            if (result.frame_annotated) {
              const img = new Image();
              img.src = `data:image/jpeg;base64,${result.frame_annotated}`;
              img.onload = () => context.drawImage(img, 0, 0);
            }
          } catch (err) {
            console.error('Gesture detection error:', err);
          }
          
          if (isDetecting) {
            requestAnimationFrame(processFrame);
          }
        };
        
        processFrame();
      } catch (err) {
        console.error('Camera access error:', err);
        alert('Please allow camera access');
        setIsDetecting(false);
      }
    };
    
    const stopGestureDetection = () => {
      setIsDetecting(false);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
    
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">👆 Hand Gesture Control</h3>
        
        <p className="text-sm text-gray-600">
          ✋ Show your hand to the camera and use these gestures:
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-blue-50 rounded">👉 Point → Click</div>
          <div className="p-2 bg-blue-50 rounded">👍 Thumbs Up → Scroll Down</div>
          <div className="p-2 bg-blue-50 rounded">✌️ Peace Sign → Scroll Up</div>
          <div className="p-2 bg-blue-50 rounded">✋ Open Hand → Pause</div>
        </div>
        
        <button
          onClick={isDetecting ? stopGestureDetection : startGestureDetection}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            isDetecting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isDetecting ? '⏹️ Stop Detection' : '📷 Start Camera'}
        </button>
        
        {isDetecting && (
          <>
            <video
              ref={videoRef}
              className="w-full rounded-lg border-2 border-gray-300"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" width={480} height={360} />
            
            <div className="p-4 bg-white rounded-lg border-2 border-blue-300">
              <p className="font-semibold">Detected Gesture:</p>
              <p className="text-lg text-blue-600">{detectedGesture}</p>
              <p className="text-sm text-gray-600">Confidence: {confidence}%</p>
            </div>
          </>
        )}
      </div>
    );
  }
  ```

- [ ] **Create Zustand store for preferences**
  ```javascript
  // stores/preferences.js
  import { create } from 'zustand';

  export const usePreferencesStore = create((set) => ({
    preferences: {
      font: 'sans-serif',
      fontSize: 100,
      lineSpacing: 1.5,
      letterSpacing: 0,
      bgColor: '#ffffff',
      textColor: '#000000',
      ttsSpeed: 1.0,
      ttsVoice: 'female',
      sttEnabled: false,
      gesturesEnabled: false
    },
    
    updatePreferences: (newPrefs) => 
      set((state) => ({
        preferences: { ...state.preferences, ...newPrefs }
      })),
    
    // Save to localStorage
    saveToLocalStorage: function() {
      localStorage.setItem('a11y_prefs', JSON.stringify(this.preferences));
    },
    
    // Load from localStorage
    loadFromLocalStorage: function() {
      const saved = localStorage.getItem('a11y_prefs');
      if (saved) {
        set({ preferences: JSON.parse(saved) });
      }
    }
  }));
  ```

- [ ] **Create SettingsPanel**
  ```jsx
  // components/SettingsPanel.jsx
  import { usePreferencesStore } from '../stores/preferences';
  
  export default function SettingsPanel() {
    const { preferences, saveToLocalStorage } = usePreferencesStore();
    
    const handleSave = () => {
      saveToLocalStorage();
      alert('✅ Accessibility preferences saved!');
    };
    
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">⚙️ Settings</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
            <span>TTS Speed: {preferences.ttsSpeed}x</span>
            <input type="range" min="0.5" max="2" step="0.1" defaultValue={preferences.ttsSpeed} className="w-24" />
          </div>
          
          <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
            <span>Font Size: {preferences.fontSize}%</span>
            <input type="range" min="100" max="300" step="10" defaultValue={preferences.fontSize} className="w-24" />
          </div>
          
          <div className="p-3 bg-blue-50 rounded">
            <p className="font-semibold">✋ Keyboard Shortcuts</p>
            <p className="text-xs mt-2">Ctrl+R: Read selected text</p>
            <p className="text-xs">Ctrl+L: Listen mode</p>
            <p className="text-xs">Ctrl+G: Gesture detection</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
        >
          💾 Save Preferences
        </button>
      </div>
    );
  }
  ```

**Git Commit:**
```bash
git add .
git commit -m "feat: gesture panel, settings, preference store"
```

---

### Hours 10-14: Integration with Backend + Demo Page

**Tasks:**
- [ ] **Create API service module**
  ```javascript
  // services/api.js
  import axios from 'axios';

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  export const api = {
    async detectGesture(frameData) {
      try {
        const response = await axios.post(
          `${API_BASE}/api/accessibility/detect-gesture`,
          { frame: frameData }
        );
        return response.data;
      } catch (error) {
        console.error('Gesture detection failed:', error);
        return { gesture: 'none', confidence: 0, error: true };
      }
    },

    async executeCommand(commandText) {
      try {
        const response = await axios.post(
          `${API_BASE}/api/accessibility/execute-command`,
          { command: commandText }
        );
        return response.data;
      } catch (error) {
        console.error('Command execution failed:', error);
        return { status: 'error', error: true };
      }
    },

    async getHealth() {
      try {
        const response = await axios.get(`${API_BASE}/api/health`);
        return response.data;
      } catch (error) {
        return { status: 'unhealthy' };
      }
    }
  };
  ```

- [ ] **Create Demo page with sample content**
  ```jsx
  // pages/Demo.jsx
  import AccessibilityToolbar from '../components/AccessibilityToolbar';
  
  export default function Demo() {
    return (
      <div className="max-w-4xl mx-auto p-6 pb-32">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ♿ Accessibility Companion Demo
        </h1>
        
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Welcome to our accessibility demonstration. This page showcases how our AI-powered
          companion makes the web accessible to everyone with disabilities.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">🎯 Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-bold text-lg">🔊 Text-to-Speech</h3>
            <p>Select any text and click "Read Text" to hear it spoken aloud.</p>
          </div>
          
          <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h3 className="font-bold text-lg">🎤 Speech-to-Text</h3>
            <p>Click "Listen & Type" and speak - your words appear in real-time.</p>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-bold text-lg">👆 Hand Gestures</h3>
            <p>Show your hand to the camera and use gestures to control the page.</p>
          </div>
          
          <div className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <h3 className="font-bold text-lg">📝 Text Formatting</h3>
            <p>Adjust fonts, colors, and spacing for better readability.</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">💡 Try It Out</h2>
        <p className="mb-4">
          👉 Select this text and click "Read Text" in the toolbar to hear it spoken.
        </p>
        
        <p className="mb-4">
          🎤 Click "Listen & Type" and say something like "Hello, this is a test" to see
          speech recognition in action.
        </p>
        
        <p className="mb-4">
          👆 Click "Hand Control" and show your hand to the camera. Try pointing, thumbs up,
          or peace sign gestures!
        </p>
        
        <AccessibilityToolbar />
      </div>
    );
  }
  ```

- [ ] **Create App.jsx with routing**
  ```jsx
  // App.jsx
  import { useEffect } from 'react';
  import { usePreferencesStore } from './stores/preferences';
  import Demo from './pages/Demo';
  import './App.css';

  function App() {
    const { preferences, loadFromLocalStorage } = usePreferencesStore();

    useEffect(() => {
      // Load preferences on mount
      loadFromLocalStorage();
      
      // Apply text formatting
      document.documentElement.style.fontFamily = preferences.font;
      document.documentElement.style.fontSize = `${preferences.fontSize}%`;
      document.documentElement.style.lineHeight = preferences.lineSpacing;
      document.documentElement.style.backgroundColor = preferences.bgColor;
      document.documentElement.style.color = preferences.textColor;
    }, [preferences, loadFromLocalStorage]);

    return <Demo />;
  }

  export default App;
  ```

- [ ] **Deploy to Vercel**
  ```bash
  npm run build
  
  # Connect to Vercel:
  # 1. Push to GitHub
  # 2. Go to vercel.com
  # 3. Import GitHub repo
  # 4. Set environment variable: REACT_APP_API_URL=<your_backend_url>
  # 5. Deploy
  ```

**Testing:**
- [ ] All panels render without errors
- [ ] Toolbar toggles work
- [ ] Settings persist across refresh
- [ ] API calls go to correct backend
- [ ] Frontend responsive on mobile

**Git Commit:**
```bash
git add .
git commit -m "feat: API integration, demo page, deployment ready"
```

---

### Hours 14-17: Polish + Testing

**Tasks:**
- [ ] **Mobile responsiveness testing**
  - Test on phone using Vercel preview
  - Toolbar should stack on mobile
  - Panels should be full-width

- [ ] **Accessibility QA**
  - Test with keyboard navigation
  - Test contrast ratios (WCAG AA minimum)
  - Test with screen reader (NVDA free tool)

- [ ] **Performance optimization**
  - Minimize bundle size
  - Lazy load video elements
  - Cache API responses

- [ ] **Create README for team**
  ```markdown
  # Accessibility Companion - Frontend

  ## Setup
  npm install
  npm run dev

  ## Environment Variables
  REACT_APP_API_URL=http://localhost:5001

  ## Features
  - Text-to-Speech
  - Speech-to-Text
  - Hand Gesture Recognition
  - Text Formatting

  ## Deployment
  npm run build
  (Deploy to Vercel)
  ```

**Git Commit:**
```bash
git add .
git commit -m "chore: mobile testing, accessibility QA, performance optimization"
```

---

### Hours 17-18: Final Demo Prep

**Tasks:**
- [ ] **Create demo script**
  ```
  "Our accessibility companion makes the web work for everyone.
   
   Feature 1 - Text-to-Speech:
   [Select text on page, click 'Read Text', listen as it speaks]
   
   Feature 2 - Speech-to-Text:
   [Click 'Listen & Type', say 'scroll down', see words appear]
   
   Feature 3 - Hand Gestures:
   [Click 'Hand Control', show hand, make thumbs up gesture]
   
   Feature 4 - Text Formatting:
   [Show dyslexia-friendly font + dark mode]
   
   Impact: 1 billion+ people with disabilities can now use the web."
  ```

- [ ] **Record backup demo video** (in case live demo fails)
  - Screen record all features
  - Show smooth performance
  - Highlight the difference it makes

- [ ] **Final testing with team**
  - End-to-end from frontend to backend
  - All features working
  - No crashes

**Git Commit:**
```bash
git add .
git commit -m "chore: final demo prep, demo script, backup video"
```

---

## 📌 PERSON 2 CRITICAL NOTES

### What to Remember
1. **Accessibility is recursive** - Your UI must be accessible too
2. **Color contrast matters** - Minimum 4.5:1 ratio for text
3. **Keyboard navigation** - All features should work without mouse
4. **Mobile first** - Toolbar must work on phone
5. **Clear feedback** - Users must know when features are active

### Success Metrics
- ✅ All 4 panels rendered and functional
- ✅ Mobile responsive
- ✅ Settings persist
- ✅ API integration working
- ✅ Passes accessibility checks (WAVE, Axe)

---

# PERSON 3: SPEECH & TEXT SERVICES

## 🗣️ Your Role
- **Primary:** Speech-to-Text, Text-to-Speech, Text Formatting
- **Secondary:** Google APIs integration, font loading
- **Critical Path:** Speech features are heavily used - stability matters

## Timeline Breakdown (18 Hours)

### Hours 0-2: Setup & Audio API Learning

**Tasks:**
- [ ] Understand Web Audio API & Web Speech API
  ```javascript
  // Demo: Simple TTS
  const utterance = new SpeechSynthesisUtterance("Hello World");
  speechSynthesis.speak(utterance);
  
  // Demo: Simple STT
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.start();
  ```

- [ ] Setup Google APIs (if using Cloud versions)
  - Google Cloud Text-to-Speech (free tier: 1 million characters/month)
  - Google Cloud Speech-to-Text (free tier: 60 minutes/month)
  - Create service account, download credentials

- [ ] Create React hooks for speech services
  ```javascript
  // hooks/useSpeechToText.js
  import { useState, useRef } from 'react';

  export function useSpeechToText() {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const startListening = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onresult = (event) => {
        let final_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript(final_transcript);
      };
      
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.start();
    };

    const stopListening = () => {
      recognitionRef.current?.stop();
    };

    return { transcript, isListening, startListening, stopListening };
  }
  ```

- [ ] Create React hooks for TTS
  ```javascript
  // hooks/useTextToSpeech.js
  import { useState } from 'react';

  export function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = (text, options = {}) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.speed || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      // Select voice
      const voices = speechSynthesis.getVoices();
      if (options.voice && voices.length > 0) {
        utterance.voice = voices.find(v => v.name === options.voice) || voices[0];
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    };

    const stop = () => {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    };

    return { speak, stop, isSpeaking };
  }
  ```

**Git Commit:**
```bash
git add .
git commit -m "setup: audio APIs, speech hooks, Google Cloud setup"
```

---

### Hours 2-6: Text-to-Speech Implementation

**Tasks:**
- [ ] **Enhance useTextToSpeech hook**
  ```javascript
  // Complete implementation
  export function useTextToSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const utteranceRef = useRef(null);

    const speak = (text, options = {}) => {
      // Cancel any previous speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.speed || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Select voice
      const voices = speechSynthesis.getVoices();
      if (options.voiceIndex !== undefined && voices[options.voiceIndex]) {
        utterance.voice = voices[options.voiceIndex];
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setHighlightedIndex(-1);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    };

    const pause = () => {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        speechSynthesis.pause();
      }
    };

    const stop = () => {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setHighlightedIndex(-1);
    };

    return { speak, stop, pause, isSpeaking, highlightedIndex };
  }
  ```

- [ ] **Create TTS component with word highlighting**
  ```jsx
  // components/AdvancedTTS.jsx
  import { useState, useEffect } from 'react';
  import { useTextToSpeech } from '../hooks/useTextToSpeech';

  export default function AdvancedTTS() {
    const [text, setText] = useState('');
    const [speed, setSpeed] = useState(1.0);
    const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
    const { speak, stop, isSpeaking } = useTextToSpeech();
    const [voices, setVoices] = useState([]);

    useEffect(() => {
      // Load available voices
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handleSpeak = () => {
      speak(text, {
        speed,
        voiceIndex: selectedVoiceIndex
      });
    };

    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">🔊 Advanced Text-to-Speech</h3>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg"
          placeholder="Enter text to read aloud"
          rows={6}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Voice:</label>
            <select
              value={selectedVoiceIndex}
              onChange={(e) => setSelectedVoiceIndex(parseInt(e.target.value))}
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
            >
              {voices.map((voice, idx) => (
                <option key={idx} value={idx}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Speed: {speed}x</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <button
          onClick={isSpeaking ? stop : handleSpeak}
          className={`w-full py-3 rounded-lg font-bold text-white ${
            isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSpeaking ? '⏹️ Stop' : '▶️ Speak'}
        </button>
      </div>
    );
  }
  ```

**Testing:**
- [ ] TTS works on multiple browsers
- [ ] Speed adjustment works
- [ ] Voice selection works
- [ ] Pause/resume works

**Git Commit:**
```bash
git add .
git commit -m "feat: text-to-speech with voice selection and speed control"
```

---

### Hours 6-10: Speech-to-Text Implementation

**Tasks:**
- [ ] **Enhanced useSpeechToText hook**
  ```javascript
  // hooks/useSpeechToText.js - Enhanced
  import { useState, useRef, useEffect } from 'react';

  export function useSpeechToText() {
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Speech Recognition API not supported in this browser');
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            final += transcriptSegment + ' ';
          } else {
            interim += transcriptSegment;
          }
        }

        setInterimTranscript(interim);
        if (final) {
          setTranscript((prev) => prev + final);
        }
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      return () => {
        recognition.abort();
      };
    }, []);

    const startListening = () => {
      setTranscript('');
      recognitionRef.current?.start();
    };

    const stopListening = () => {
      recognitionRef.current?.stop();
    };

    const clearTranscript = () => {
      setTranscript('');
      setInterimTranscript('');
    };

    return {
      transcript,
      interimTranscript,
      isListening,
      error,
      startListening,
      stopListening,
      clearTranscript
    };
  }
  ```

- [ ] **Create STT component with real-time display**
  ```jsx
  // components/AdvancedSTT.jsx
  import { useSpeechToText } from '../hooks/useSpeechToText';

  export default function AdvancedSTT() {
    const {
      transcript,
      interimTranscript,
      isListening,
      error,
      startListening,
      stopListening,
      clearTranscript
    } = useSpeechToText();

    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">🎤 Speech-to-Text (Real-time)</h3>

        <div className="flex gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
          </button>

          <button
            onClick={clearTranscript}
            className="px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
          >
            🗑️ Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border-2 border-red-500 rounded-lg">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          {transcript && (
            <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
              <p className="font-semibold text-green-700">Final Transcript:</p>
              <p className="text-gray-800 leading-relaxed">{transcript}</p>
            </div>
          )}

          {interimTranscript && (
            <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
              <p className="font-semibold text-blue-700">Currently Listening:</p>
              <p className="text-gray-800 italic">{interimTranscript}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(transcript);
            alert('✅ Copied to clipboard!');
          }}
          className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
        >
          📋 Copy Text
        </button>
      </div>
    );
  }
  ```

**Testing:**
- [ ] Real-time transcript updates
- [ ] Interim results display
- [ ] Error handling for microphone issues
- [ ] Copy to clipboard works

**Git Commit:**
```bash
git add .
git commit -m "feat: speech-to-text with real-time transcription"
```

---

### Hours 10-14: Text Formatting & Dyslexia Support

**Tasks:**
- [ ] **Load dyslexia-friendly fonts**
  ```javascript
  // services/fonts.js
  export const DYSLEXIA_FONTS = [
    {
      name: 'OpenDyslexic',
      url: 'https://cdn.jsdelivr.net/npm/opendyslexic@latest/fonts/OpenDyslexic-Regular.woff',
      fallback: 'sans-serif'
    },
    {
      name: 'Lexie Readable',
      url: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap',
      fallback: 'sans-serif'
    },
    {
      name: 'Comic Sans MS',
      fallback: 'cursive'
    },
    {
      name: 'Arial',
      fallback: 'sans-serif'
    }
  ];

  export async function loadFont(fontName) {
    const font = DYSLEXIA_FONTS.find(f => f.name === fontName);
    if (font && font.url) {
      const link = document.createElement('link');
      link.href = font.url;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }
  ```

- [ ] **Create text formatting service**
  ```javascript
  // services/formatting.js
  export const COLOR_THEMES = {
    normal: { bg: '#ffffff', text: '#000000', name: 'Normal' },
    dark: { bg: '#1a1a1a', text: '#ffffff', name: 'Dark Mode' },
    highContrast: { bg: '#000000', text: '#ffff00', name: 'High Contrast' },
    sepia: { bg: '#f4ecd8', text: '#654321', name: 'Sepia' },
    dyslexia: { bg: '#e8d4f1', text: '#4a0080', name: 'Dyslexia Friendly' }
  };

  export function applyFormatting(preferences) {
    const root = document.documentElement;

    // Apply font
    root.style.fontFamily = preferences.font;
    root.style.fontSize = `${preferences.fontSize}%`;

    // Apply spacing
    root.style.lineHeight = preferences.lineSpacing;
    root.style.letterSpacing = `${preferences.letterSpacing}px`;

    // Apply colors
    root.style.backgroundColor = preferences.bgColor;
    root.style.color = preferences.textColor;

    // Additional dyslexia-friendly adjustments
    if (preferences.isDyslexiaMode) {
      document.body.style.fontSize = `${preferences.fontSize}%`;
      // Increase word spacing
      const style = document.createElement('style');
      style.innerHTML = `
        body { word-spacing: 0.2em !important; }
        p { margin-bottom: 1.5em !important; }
        a { text-decoration: underline !important; }
      `;
      document.head.appendChild(style);
    }
  }
  ```

- [ ] **Create TextFormatting hook**
  ```javascript
  // hooks/useTextFormatting.js
  import { useEffect } from 'react';
  import { usePreferencesStore } from '../stores/preferences';
  import { applyFormatting, loadFont } from '../services/formatting';

  export function useTextFormatting() {
    const { preferences } = usePreferencesStore();

    useEffect(() => {
      // Load selected font
      loadFont(preferences.font);

      // Apply all formatting
      applyFormatting(preferences);
    }, [preferences]);

    return null; // This hook just applies side effects
  }
  ```

**Testing:**
- [ ] Fonts load and apply
- [ ] Color themes switch correctly
- [ ] Spacing adjustments work
- [ ] Dyslexia mode enhances readability

**Git Commit:**
```bash
git add .
git commit -m "feat: text formatting, dyslexia-friendly fonts, color themes"
```

---

### Hours 14-17: Integration + Optimization

**Tasks:**
- [ ] **Integrate all hooks into main components**
  - STT, TTS, Formatting all working together
  - Settings persist and apply immediately

- [ ] **Performance optimization**
  ```javascript
  // Lazy load speech features
  import { lazy, Suspense } from 'react';

  const AdvancedTTS = lazy(() => import('./AdvancedTTS'));
  const AdvancedSTT = lazy(() => import('./AdvancedSTT'));

  export function AccessibilityToolbar() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AdvancedTTS />
        <AdvancedSTT />
      </Suspense>
    );
  }
  ```

- [ ] **Create comprehensive tests**
  ```javascript
  // tests/hooks.test.js
  import { renderHook, act } from '@testing-library/react';
  import { useTextToSpeech } from '../hooks/useTextToSpeech';

  test('TTS should speak text', () => {
    const { result } = renderHook(() => useTextToSpeech());

    act(() => {
      result.current.speak('Hello World');
    });

    expect(result.current.isSpeaking).toBe(true);
  });
  ```

- [ ] **Document API for Person 1**
  - How to integrate voice commands
  - Expected response formats
  - Error handling strategies

**Git Commit:**
```bash
git add .
git commit -m "feat: full integration, performance optimization, comprehensive tests"
```

---

### Hours 17-18: Final Polish + Demo

**Tasks:**
- [ ] **Record audio of speech features** (backup demo)
- [ ] **Create troubleshooting guide**
  ```markdown
  # Troubleshooting Audio Features

  ## TTS Not Working
  - Check browser speakers are unmuted
  - Try a different voice from dropdown
  - Reload page and try again

  ## STT Not Working
  - Allow microphone access when prompted
  - Check microphone is not muted
  - Try using Chrome (best support)

  ## Font Not Loading
  - Check internet connection
  - Clear browser cache
  - Try different font
  ```

- [ ] **Final QA**
  - Test all audio features
  - Test on different browsers
  - Test with different devices

**Git Commit:**
```bash
git add .
git commit -m "chore: final polish, troubleshooting guide, QA pass"
```

---

## 📌 PERSON 3 CRITICAL NOTES

### What to Remember
1. **Audio APIs vary by browser** - Chrome has best support, have fallbacks
2. **Microphone permissions** - Users must allow access
3. **Real-time = stateful** - Manage interim vs final transcripts
4. **Fonts are slow to load** - Use web-safe fallbacks
5. **Test with real audio** - Don't just test in silence

### Success Metrics
- ✅ TTS working in all panels
- ✅ STT real-time display
- ✅ Fonts apply correctly
- ✅ All settings persist
- ✅ No console errors

---

## 🤝 TEAM COORDINATION (CRITICAL)

### Daily Standups (3x during 18 hours)

**Hour 0 Standup:**
- Person 1: "Setting up MediaPipe, gesture detection pipeline"
- Person 2: "Creating React components, toolbar structure"
- Person 3: "Learning Web Audio APIs, TTS hooks"

**Hour 9 Standup:**
- Person 1: "Gesture detection working, Flask API ready"
- Person 2: "All UI panels built, connecting to APIs"
- Person 3: "STT + TTS functional, integrating into main app"

**Hour 17 Standup:**
- Person 1: "Backend tested, ready for demo"
- Person 2: "Frontend deployed to Vercel"
- Person 3: "All audio features polished, backup videos ready"

### Git Workflow
```
main (protected - only merge working code)
│
├── feature/gesture-recognition (Person 1)
├── feature/accessibility-ui (Person 2)
└── feature/speech-services (Person 3)
```

### Integration Points
- **Person 1 → Person 2:** Gesture API endpoint
- **Person 2 → Person 3:** Audio input/output UI
- **All:** Demo page with all features

---

## ✅ FINAL CHECKLIST (Before Submission)

### Code
- [ ] All features working without crashes
- [ ] No console errors or warnings
- [ ] Code well-commented and documented
- [ ] Environment variables properly configured
- [ ] Fallback strategies in place

### Accessibility
- [ ] WCAG AA contrast ratios
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Mobile responsive
- [ ] No flashing/seizure triggers

### Deployment
- [ ] Frontend on Vercel with live URL
- [ ] Backend accessible (local/ngrok)
- [ ] All APIs connected
- [ ] Demo data loaded
- [ ] Backup video recorded

### Team
- [ ] All members understand full demo
- [ ] Demo script practiced (5 min)
- [ ] Troubleshooting plans ready
- [ ] Backup presentation ready
- [ ] Everyone knows their role

---

**Document Version:** 1.0  
**Created:** January 29, 2026  
**Status:** READY FOR DEVELOPMENT 🚀