/**
 * Heuristic-based ASL Gesture Detection
 * Uses MediaPipe Hand Landmarks to identify specific signs.
 * 
 * Hand Landmark indices:
 * 0: WRIST
 * 1-4: THUMB (CMC, MCP, IP, TIP)
 * 5-8: INDEX (MCP, PIP, DIP, TIP)
 * 9-12: MIDDLE (MCP, PIP, DIP, TIP)
 * 13-16: RING (MCP, PIP, DIP, TIP)
 * 17-20: PINKY (MCP, PIP, DIP, TIP)
 */

export interface Landmark {
    x: number;
    y: number;
    z: number;
}

export function detectASLGesture(landmarks: Landmark[]): { gesture: string; confidence: number } | null {
    if (!landmarks || landmarks.length < 21) return null;

    // Helper: Calculate distance between two landmarks
    const getDist = (p1: number, p2: number) => {
        return Math.sqrt(
            Math.pow(landmarks[p1].x - landmarks[p2].x, 2) +
            Math.pow(landmarks[p1].y - landmarks[p2].y, 2)
        );
    };

    // Distance-based check for finger extension (more robust than simple Y-comparison)
    const isFingerUp = (tip: number, mcp: number) => {
        const distTip = getDist(tip, 0);
        const distMcp = getDist(mcp, 0);
        return distTip > distMcp * 1.35; // 35% further than base joint
    };

    // Check if finger is curled (tip close to palm/base)
    const isFingerCurled = (tip: number, mcp: number) => {
        const distTip = getDist(tip, 0);
        const distMcp = getDist(mcp, 0);
        return distTip < distMcp * 1.1; // Tip closer to wrist than the base
    };

    // Check if fingertip is touching or very close to thumb tip
    const isTouchingThumb = (fingerTip: number) => {
        return getDist(fingerTip, 4) < 0.06; // Close proximity
    };

    const indexUp = isFingerUp(8, 5);
    const middleUp = isFingerUp(12, 9);
    const ringUp = isFingerUp(16, 13);
    const pinkyUp = isFingerUp(20, 17);

    const indexCurled = isFingerCurled(8, 5);
    const middleCurled = isFingerCurled(12, 9);
    const ringCurled = isFingerCurled(16, 13);
    const pinkyCurled = isFingerCurled(20, 17);

    // Thumb checks
    const thumbUp = getDist(4, 17) > getDist(3, 17) * 1.3;
    const thumbSide = landmarks[4].x > landmarks[3].x && !thumbUp; // Thumb to the side (for A)
    const thumbExtendedOut = getDist(4, 3) > 0.04; // Simple check if thumb is not tucked

    // ============================================
    // ASL ALPHABET LETTERS
    // ============================================

    // --- A: Fist with thumb on the side ---
    // All fingers curled, thumb beside the fist (not across)
    if (!indexUp && !middleUp && !ringUp && !pinkyUp &&
        indexCurled && middleCurled && ringCurled && pinkyCurled) {
        // Check thumb is on side, not across fingers
        const thumbBesideFist = getDist(4, 8) > 0.08 && getDist(4, 5) < 0.12;
        if (thumbBesideFist || thumbSide) {
            return { gesture: 'A', confidence: 0.88 };
        }
    }

    // --- B: Four fingers up straight, thumb in palm ---
    if (indexUp && middleUp && ringUp && pinkyUp && !thumbUp) {
        const spread = Math.abs(landmarks[8].x - landmarks[20].x);
        if (spread < 0.1) return { gesture: 'B', confidence: 0.90 };
    }

    // --- C: Curved shape (like holding a cup) ---
    // Key: Thumb and Index tips are close but not touching, other fingers aligned
    const distThumbIndex = getDist(4, 8);
    // Range: 0.10 to 0.35 (relaxed)
    if (distThumbIndex > 0.10 && distThumbIndex < 0.35) {
        // Check if fingers are somewhat curved (not fully extended, not fully curled)
        // Or at least aligned in a C-shape.
        // Simplified: Palm facing side, fingers somewhat parallel
        // For robustness, just check that fingers aren't fully tucked into palm
        const notFullyCurled = !indexCurled && !middleCurled && !ringCurled && !pinkyCurled;
        // And not fully extended straight up (optional, but C usually has some curve)
        // Just rely on the thumb-index gap and general openness
        if (notFullyCurled) {
            // Fingers should be close to each other
            const fingersClose = getDist(8, 12) < 0.08 && getDist(12, 16) < 0.08;
            if (fingersClose) {
                return { gesture: 'C', confidence: 0.85 };
            }
        }
    }

    // --- D: Index up, other fingers touch thumb forming circle ---
    if (indexUp && !middleUp && !ringUp && !pinkyUp) {
        // Check if middle, ring, pinky tips are near thumb tip
        const middleTouchesThumb = isTouchingThumb(12);
        const ringTouchesThumb = isTouchingThumb(16) || getDist(16, 4) < 0.08;
        if (middleTouchesThumb || ringTouchesThumb) {
            return { gesture: 'D', confidence: 0.85 };
        }
    }

    // --- E: All fingertips curled down touching thumb ---
    if (!indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp) {
        // Check if fingertips are close to thumb or near palm
        const tipsNearThumb = getDist(8, 4) < 0.08 && getDist(12, 4) < 0.10;
        const allCurled = indexCurled && middleCurled && ringCurled && pinkyCurled;
        if (allCurled && tipsNearThumb) {
            return { gesture: 'E', confidence: 0.80 };
        }
    }

    // --- F: Thumb and Index form circle, other fingers up ---
    if (middleUp && ringUp && pinkyUp && isTouchingThumb(8)) {
        return { gesture: 'F', confidence: 0.85 };
    }

    // --- G: Index pointing sideways, thumb parallel ---
    // Horizontal pointing gesture
    const indexHorizontal = Math.abs(landmarks[8].y - landmarks[5].y) < 0.05;
    if (indexUp && !middleUp && !ringUp && !pinkyUp && indexHorizontal) {
        return { gesture: 'G', confidence: 0.75 };
    }

    // --- I: Pinky up only ---
    if (pinkyUp && !indexUp && !middleUp && !ringUp && !thumbUp) {
        return { gesture: 'I', confidence: 0.90 };
    }

    // --- K: Index and Middle up, spread apart like scissors ---
    if (indexUp && middleUp && !ringUp && !pinkyUp && thumbUp) {
        const spread = getDist(8, 12);
        if (spread > 0.08) {
            return { gesture: 'K', confidence: 0.80 };
        }
    }

    // --- L: Thumb and Index up in L-shape ---
    if (thumbUp && indexUp && !middleUp && !ringUp && !pinkyUp) {
        return { gesture: 'L', confidence: 0.92 };
    }

    // --- O: All fingers curved to form O with thumb ---
    const allTouchThumb = getDist(8, 4) < 0.06 && getDist(12, 4) < 0.08 &&
        getDist(16, 4) < 0.10 && getDist(20, 4) < 0.12;
    if (allTouchThumb && !thumbUp) {
        return { gesture: 'O', confidence: 0.78 };
    }

    // --- U: Index and Middle up, close together ---
    if (indexUp && middleUp && !ringUp && !pinkyUp && !thumbUp) {
        const close = getDist(8, 12) < 0.05;
        if (close) {
            return { gesture: 'U', confidence: 0.85 };
        }
    }

    // --- V: Index and Middle up, spread (Peace sign) ---
    if (indexUp && middleUp && !ringUp && !pinkyUp && !thumbUp) {
        const spread = getDist(8, 12);
        if (spread >= 0.05) {
            return { gesture: 'V', confidence: 0.90 };
        }
    }

    // --- W: Index, Middle, Ring up ---
    if (indexUp && middleUp && ringUp && !pinkyUp && !thumbUp) {
        return { gesture: 'W', confidence: 0.88 };
    }

    // --- X: Index bent/hooked ---
    if (!indexUp && !middleUp && !ringUp && !pinkyUp) {
        // Index is somewhat extended but tip is curled down
        const indexPartial = getDist(8, 0) > getDist(5, 0) * 1.1 &&
            getDist(8, 0) < getDist(5, 0) * 1.3;
        if (indexPartial && middleCurled && ringCurled && pinkyCurled) {
            return { gesture: 'X', confidence: 0.72 };
        }
    }

    // --- Y: Thumb and Pinky up (like shaka/hang loose) ---
    if (thumbUp && pinkyUp && !indexUp && !middleUp && !ringUp) {
        return { gesture: 'Y', confidence: 0.92 };
    }

    // ============================================
    // ASL NUMBERS
    // ============================================

    // --- 1: Index finger up only ---
    if (indexUp && !middleUp && !ringUp && !pinkyUp && !thumbUp) {
        return { gesture: '1', confidence: 0.95 };
    }

    // --- 2: Index and Middle up (Peace/Victory) ---
    if (indexUp && middleUp && !ringUp && !pinkyUp && !thumbUp) {
        return { gesture: '2', confidence: 0.93 };
    }

    // --- 3: Thumb, Index, Middle up ---
    if (thumbUp && indexUp && middleUp && !ringUp && !pinkyUp) {
        return { gesture: '3', confidence: 0.95 };
    }

    // --- 4: Four fingers up, thumb in ---
    if (indexUp && middleUp && ringUp && pinkyUp && !thumbUp) {
        return { gesture: '4', confidence: 0.88 };
    }

    // --- 5: All five fingers up (open hand) ---
    // --- 5: All five fingers up (open hand) ---
    // Relaxed 'thumbUp' check for 5
    if (indexUp && middleUp && ringUp && pinkyUp) {
        // Just check if thumb is relatively extended away from index base
        // or satisfies the standard thumbUp check
        const thumbOpen = thumbUp || thumbExtendedOut;
        if (thumbOpen) {
            return { gesture: '5', confidence: 0.95 };
        }
    }

    return null;
}
