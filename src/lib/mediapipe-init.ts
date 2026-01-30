import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';

let gestureRecognizer: GestureRecognizer | null = null;

export const createGestureRecognizer = async () => {
    if (gestureRecognizer) {
        return gestureRecognizer;
    }

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.7,
        minHandPresenceConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    return gestureRecognizer;
};

export const getGestureRecognizer = () => gestureRecognizer;
