# 🔐 ACCESSIBILITY COMPANION - PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** Accessibility Companion - AI for Everyone  
**Hackathon:** Cyber Cypher 5.0 | NMIMS MPSTME Taqneeq 18.0  
**Duration:** 18 Hours | January 31 - February 1, 2026  
**Team Size:** 3 Members  
**Development Platform:** Google Antigravity ADE (Free Plan)  
**Tagline:** "Technology for All - No One Left Behind"

---

## 1. PRODUCT OVERVIEW

### 1.1 Vision
Make the internet accessible to everyone. Break down barriers for 1B+ people with disabilities by adding an intelligent AI layer that adapts any web app for vision, hearing, motor, and cognitive disabilities.

### 1.2 Problem Statement
- **1 billion+ people worldwide** have disabilities (WHO)
- **Only 2% of websites** are WCAG 2.1 compliant (accessible)
- **No easy solution** for making existing websites accessible without rebuilding them
- **Accessibility is an afterthought**, not a built-in feature
- **Technology excludes vulnerable populations** when it should include them

### 1.3 Solution
An AI-powered accessibility companion that adds an "accessibility layer" to any website, providing:
- **For Blind/Low Vision Users:** Real-time image descriptions + intelligent text-to-speech
- **For Deaf/Hard of Hearing:** Real-time speech-to-text + automatic captions
- **For Motor Disabilities:** Voice commands + hand gesture recognition
- **For Dyslexic Users:** Text simplification + highlighting + dyslexia-friendly fonts
- **For Elderly/Cognitive:** Larger fonts + simplified interface + high contrast modes

**Key Innovation:** One plugin works across multiple websites (universal solution)

### 1.4 Target Users
- **Primary:** People with permanent disabilities (blind, deaf, motor disabilities)
- **Secondary:** Elderly users, people with temporary disabilities (broken arm, eye surgery recovery)
- **Tertiary:** Neurodivergent users (dyslexia, ADHD, autism)
- **Tertiary:** Non-native speakers needing simplified text

---

## 2. CORE FEATURES & REQUIREMENTS

### 2.1 Feature 1: Real-Time Speech-to-Text (For Deaf/HoH Users)
**Objective:** Convert spoken audio to readable text in real-time

**Requirements:**
- [ ] **Audio Capture:** Detect microphone input from webpage
- [ ] **Transcription:** Convert speech to text using Google Speech-to-Text API
- [ ] **Display:** Show transcript in real-time floating panel
- [ ] **Accuracy:** Handle different accents, background noise (gracefully degrade)
- [ ] **Language Support:** English primary, optional Spanish/Hindi
- [ ] **Copy/Save:** Allow user to copy or save transcript
- [ ] **Speaker Identification:** If possible, identify who is speaking (optional)

**MVP Scope:**
- Real-time transcription display
- English only
- Simple floating text box
- No speaker identification (Phase 2)

**Tech Stack:**
- Frontend: React component with audio stream
- API: Google Speech-to-Text (free tier: 60 min/month, $0.006/15 sec after)
- Browser Audio API: Web Audio API for microphone access

**Complexity:** Medium (browser audio APIs + API integration)

---

### 2.2 Feature 2: Text-to-Speech (For Blind/Low Vision Users)
**Objective:** Read any text content aloud intelligently

**Requirements:**
- [ ] **Text Detection:** Identify and extract text from webpage
- [ ] **Selection Support:** Allow user to select text and read it
- [ ] **Auto-Read:** Option to read full page or specific sections
- [ ] **Voice Control:** Speed, pitch, volume adjustments
- [ ] **Multiple Voices:** Male/female voice options
- [ ] **Highlight During Reading:** Visually highlight text being read
- [ ] **Pause/Resume:** Full playback control
- [ ] **Language Support:** English primary, optional multi-language

**MVP Scope:**
- Read selected text aloud
- English only
- 2-3 voice options
- Simple volume control

**Tech Stack:**
- Frontend: React + selection API
- TTS Engine: Web Speech API (built-in) OR gTTS API (Google)
- Web Speech API: Native browser implementation (free, offline capable)

**Complexity:** Low (browser APIs + simple controls)

---

### 2.3 Feature 3: Hand Gesture Recognition (For Motor Disabilities)
**Objective:** Allow users to control interface with hand gestures instead of mouse/keyboard

**Requirements:**
- [ ] **Hand Detection:** Detect hand position in video (webcam input)
- [ ] **Gesture Recognition:** Identify common gestures (point, thumb up, peace sign, etc.)
- [ ] **Gesture Mapping:** Map gestures to common actions:
  - Point at button → Click
  - Thumbs up → Scroll down / Next
  - Peace sign → Scroll up / Back
  - Open hand → Pause
  - Closed fist → Continue
- [ ] **Real-time Display:** Show detected hand skeleton on screen
- [ ] **Confidence Threshold:** Only trigger action if confidence > 80%
- [ ] **Customization:** Allow remapping gestures
- [ ] **Visual Feedback:** User knows when gesture is detected

**MVP Scope:**
- Detect 5 common hand gestures
- Map to 5 common website actions
- Show hand skeleton overlay
- English instructions

**Tech Stack:**
- Frontend: React
- Hand Detection: MediaPipe (Google's open-source, free, runs locally)
- Video: Webcam using Web API
- Deployment: Client-side (no server needed for detection)

**Complexity:** Medium-High (ML model integration, real-time processing)

---

### 2.4 Feature 4: Voice Commands (For Motor Disabilities)
**Objective:** Control website entirely through voice

**Requirements:**
- [ ] **Command Recognition:** Understand common voice commands
  - "Click [button name]"
  - "Read this"
  - "Go back"
  - "Scroll down"
  - "Submit form"
- [ ] **Context Awareness:** Identify clickable elements on page
- [ ] **Natural Language:** Handle variations ("click submit", "press submit", "activate submit")
- [ ] **Feedback:** Confirm commands were understood
- [ ] **Customization:** Users can define custom commands

**MVP Scope:**
- 10-15 basic voice commands
- English only
- Simple confirmation feedback

**Tech Stack:**
- Speech Recognition: Web Speech API (built-in browser)
- NLP: Simple keyword matching (no heavy ML needed)
- Frontend: React with voice handlers

**Complexity:** Low (browser APIs + keyword matching)

---

### 2.5 Feature 5: Text Simplification & Formatting (For Dyslexic/Cognitive Users)
**Objective:** Make text easier to read

**Requirements:**
- [ ] **Font Selection:** Offer dyslexia-friendly fonts (OpenDyslexic, Lexie Readable)
- [ ] **Text Highlighting:** Highlight current line being read/important words
- [ ] **Font Size:** Adjustable text size (100%-300%)
- [ ] **Line Spacing:** Increase line spacing (comfort for reading)
- [ ] **Letter Spacing:** Increase letter spacing (easier character distinction)
- [ ] **Background Color:** High contrast options (dark mode, sepia, etc.)
- [ ] **Text Simplification:** Optional: Simplify complex words (Phase 2)
- [ ] **Reading Mode:** Toggle distraction-free reading view

**MVP Scope:**
- 2-3 dyslexia-friendly fonts
- Font size adjustment
- 3-4 color themes
- Line/letter spacing controls

**Tech Stack:**
- Frontend: React with CSS variables
- Fonts: Google Fonts (free, open-source)
- Styling: Tailwind CSS + custom CSS

**Complexity:** Low (CSS-based, no APIs needed)

---

## 3. FEATURE PRIORITIZATION (18-Hour Sprint)

### MVP (Must Have - These 4 Features)
1. ✅ **Text-to-Speech** (Feature 2) - Easy, high value
2. ✅ **Speech-to-Text** (Feature 1) - Medium complexity, high value
3. ✅ **Hand Gesture Recognition** (Feature 3) - Complex but core for motor disabilities
4. ✅ **Text Formatting & Fonts** (Feature 5) - Easy, cognitive accessibility

### V1.1 (If time permits)
- Voice commands with keyword matching
- Advanced gesture detection (more gestures)
- Text simplification AI (using Gemini)

### V2.0 (Post-hackathon)
- Video captioning (complex, skip for now)
- Multi-language support
- Full Chrome extension for all websites
- Mobile app version
- Advanced NLP for commands
- Deepfake voice detection (detect synthetic speech)

---

## 4. TECHNICAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│                    USER INTERFACE                    │
│         (React Web App / Chrome Extension)           │
│  - Accessibility toolbar/sidebar                     │
│  - Feature toggles (TTS, STT, Gestures, etc.)       │
│  - Settings panel (fonts, colors, speed, etc.)      │
│  - Real-time feedback displays                       │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼────────────┐
         │           │            │
    ┌────▼────┐  ┌───▼────┐  ┌───▼────┐
    │ Client- │  │ Google │  │ Browser│
    │ Side ML │  │  APIs  │  │ APIs   │
    │ Models  │  │        │  │        │
    │         │  │        │  │        │
    └────┬────┘  └───┬────┘  └───┬────┘
         │           │            │
    ┌────▼───────────▼────────────▼────────┐
    │    CORE ACCESSIBILITY SERVICES       │
    │                                      │
    │  ┌──────────────────────────────┐   │
    │  │ Speech-to-Text Service       │   │
    │  │ - Audio capture              │   │
    │  │ - Transcription              │   │
    │  │ - Display manager            │   │
    │  └──────────────────────────────┘   │
    │                                      │
    │  ┌──────────────────────────────┐   │
    │  │ Text-to-Speech Service       │   │
    │  │ - Text extraction            │   │
    │  │ - Voice synthesis            │   │
    │  │ - Playback control           │   │
    │  └──────────────────────────────┘   │
    │                                      │
    │  ┌──────────────────────────────┐   │
    │  │ Hand Gesture Service         │   │
    │  │ - Hand detection (MediaPipe) │   │
    │  │ - Gesture classification     │   │
    │  │ - Action mapping             │   │
    │  └──────────────────────────────┘   │
    │                                      │
    │  ┌──────────────────────────────┐   │
    │  │ Voice Command Service        │   │
    │  │ - Speech recognition         │   │
    │  │ - Intent parsing             │   │
    │  │ - Command execution          │   │
    │  └──────────────────────────────┘   │
    │                                      │
    │  ┌──────────────────────────────┐   │
    │  │ Formatting Service           │   │
    │  │ - Font application           │   │
    │  │ - Color themes               │   │
    │  │ - Layout adjustment          │   │
    │  └──────────────────────────────┘   │
    └────────────────────────────────────┘

External Services:
├─ Google Speech-to-Text API (for STT accuracy)
├─ Google Text-to-Speech API (gTTS)
├─ MediaPipe (hand detection - client-side)
├─ Web Audio API (browser native)
├─ Web Speech API (browser native)
└─ Gemini 3 Pro (via Antigravity - for text simplification/summaries)
```

---

## 5. TECHNOLOGY STACK

| Layer | Technology | Why | Free? |
|-------|-----------|-----|-------|
| **Frontend** | React 18 + Vite | Fast builds, modern, hooks-based | ✅ Yes |
| **Styling** | Tailwind CSS | Rapid UI development, utility-first | ✅ Yes |
| **State Mgmt** | Zustand (lightweight) | Simple, minimal boilerplate | ✅ Yes |
| **Audio I/O** | Web Audio API | Browser-native, no server needed | ✅ Yes |
| **Hand Detection** | MediaPipe | Free, open-source, runs client-side | ✅ Yes |
| **TTS - Local** | Web Speech API | Browser-native, offline-capable | ✅ Yes |
| **TTS - Cloud** | gTTS or Google TTS | Better quality, free tier available | ✅ Free tier |
| **STT - Cloud** | Google Speech-to-Text | Accurate, free tier 60 min/month | ✅ Free tier |
| **Voice Commands** | Web Speech API | Browser-native, no API key needed | ✅ Yes |
| **Text Simplification** | Gemini 3 Pro (Antigravity) | AI-powered, via free plan | ✅ Free plan |
| **Video Playback** | HTML5 Video API | Browser-native | ✅ Yes |
| **Deployment** | Vercel | Fast, free tier, GitHub integration | ✅ Free |

---

## 6. DATA MODELS (Key Entities)

### User Preferences
```json
{
  "id": "user_001",
  "preferences": {
    "speech_to_text": {
      "enabled": true,
      "language": "en-US",
      "display_position": "bottom"
    },
    "text_to_speech": {
      "enabled": true,
      "voice": "female",
      "speed": 1.0,
      "pitch": 1.0,
      "volume": 0.8
    },
    "hand_gestures": {
      "enabled": true,
      "gestures_mapped": {
        "point": "click",
        "thumbs_up": "scroll_down",
        "peace_sign": "scroll_up"
      }
    },
    "text_formatting": {
      "font": "OpenDyslexic",
      "font_size": 120,
      "line_spacing": 1.5,
      "letter_spacing": 2,
      "color_theme": "high_contrast_dark"
    }
  }
}
```

### Gesture Recognition Data
```json
{
  "gesture_id": "gesture_001",
  "name": "point_at_target",
  "hand_positions": {
    "index_finger": "extended",
    "other_fingers": "curled",
    "palm": "open"
  },
  "confidence_threshold": 0.85,
  "action": "click"
}
```

### Accessibility Event Log (for demo purposes)
```json
{
  "event_id": "evt_001",
  "timestamp": "2026-01-31T10:30:00Z",
  "event_type": "gesture_detected",
  "details": {
    "gesture": "thumbs_up",
    "confidence": 0.92,
    "action_triggered": "scroll_down",
    "success": true
  }
}
```

---

## 7. API ENDPOINTS (For Backend Services)

### Speech-to-Text
- `POST /api/accessibility/transcribe` - Send audio blob, get transcript
- `GET /api/accessibility/transcript-history` - Get past transcripts

### Text-to-Speech  
- `POST /api/accessibility/synthesize` - Send text, get audio stream
- `GET /api/accessibility/voices` - Get available voices

### Gesture Recognition
- `POST /api/accessibility/detect-gesture` - Send video frame, get gesture label
- `POST /api/accessibility/map-gesture` - Map gesture to action

### Text Formatting
- `GET /api/accessibility/fonts` - Get available dyslexia-friendly fonts
- `GET /api/accessibility/color-themes` - Get color theme options

### Preferences
- `POST /api/user/preferences` - Save user accessibility preferences
- `GET /api/user/preferences` - Retrieve user preferences

---

## 8. SUCCESS METRICS & KPIs

### Hackathon Judging Criteria
- ✅ **Functionality:** All 4 MVP features working
- ✅ **Innovation:** Real-time AI accessibility (unique)
- ✅ **UI/UX:** Clear, intuitive accessibility controls
- ✅ **Code Quality:** Clean, documented, modular code
- ✅ **Presentation:** Passionate, impactful pitch about accessibility

### Post-Hackathon Metrics
- **User Adoption:** Number of users with disabilities adopting tool
- **Feature Engagement:** % of users enabling each accessibility feature
- **Accessibility Impact:** Number of websites made accessible via plugin
- **User Satisfaction:** NPS score from users with disabilities

---

## 9. CONSTRAINTS & ASSUMPTIONS

### Constraints
- ⏱️ **18-hour sprint** - MVP only, polish later
- 🎬 **No video captioning initially** - Too complex for timeline
- 📱 **Web app first** - Chrome extension is Phase 2
- 🗣️ **English only** - Multi-language in Phase 2
- 📊 **No persistence** - Demo doesn't require database
- 💻 **Client-side preference** - Minimize server load

### Assumptions
- ✅ Users have modern browsers (Chrome, Firefox, Safari)
- ✅ Users have microphones (for STT and voice commands)
- ✅ Users have webcams (for hand gesture recognition - optional)
- ✅ Users have stable internet (for Google APIs)
- ✅ Team has basic knowledge of React, TensorFlow.js, Web APIs

---

## 10. RISK MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Hand detection too slow** | HIGH | HIGH | Use pre-trained MediaPipe, optimize for real-time, show skeleton only |
| **Google API quota exceeded** | MEDIUM | MEDIUM | Cache results, use demo data, Web Speech API as fallback |
| **Browser compatibility issues** | MEDIUM | MEDIUM | Test on Chrome, Firefox, Safari; provide fallbacks |
| **Audio quality poor** | MEDIUM | MEDIUM | Add noise detection, prompt user to move closer to mic |
| **Time overruns on hand detection** | HIGH | HIGH | Pre-build MediaPipe integration, focus on 3 gestures only |
| **Accessibility testing difficulty** | MEDIUM | LOW | Use OS built-in screen readers, record demo videos |
| **Scope creep (too many features)** | HIGH | HIGH | **STRICT MVP:** Only 4 features, cut others ruthlessly |

---

## 11. DEFINITION OF DONE

Each feature is "done" when:
- ✅ Working in isolation (tested locally)
- ✅ Integrated into main UI
- ✅ User controls visible and functional
- ✅ No console errors
- ✅ Responsive on mobile (if applicable)
- ✅ Accessible (WCAG basics - contrast, keyboard nav)
- ✅ Documented (comments, README section)
- ✅ Ready to demo without explaining/apologizing

---

## 12. NEXT STEPS (Post-Hackathon)

1. **Chrome Extension:** Convert to full browser extension
2. **Video Captioning:** Add real-time video caption support
3. **Multi-language:** Support 10+ languages
4. **Mobile App:** iOS/Android native support
5. **Advanced AI:** Text simplification, entity extraction
6. **Analytics:** Track accessibility feature usage
7. **Partner Integration:** Work with disability organizations
8. **Monetization:** Freemium model for accessibility features

---

**Document Version:** 1.0  
**Last Updated:** January 29, 2026  
**Author:** Team Accessibility Companion  
**Status:** READY FOR DEVELOPMENT