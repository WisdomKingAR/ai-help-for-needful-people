const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

const getModel = () => genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const aiService = {
    async processAccessibilityRequest(feature, action) {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("[AI Service] No GEMINI_API_KEY found. Using mock response.");
            return this.getMockResponse(feature, action);
        }

        try {
            const model = getModel();
            const prompt = `You are an Accessibility AI assistant. The user is interacting with the feature: "${feature}". 
            The current action is: "${action}". 
            Provide a short, helpful, and concise response (max 2 sentences) as if you are performing this action in real-time.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("[AI Service] Error generating content:", error);
            return this.getMockResponse(feature, action);
        }
    },

    getMockResponse(feature, action) {
        const mockResponses = {
            "Voice Navigation": "I'm listening for your voice commands. Just say 'Navigate to dashboard'.",
            "Screen Reader AI": "I've analyzed the screen. There are 3 buttons and 2 images with alt text.",
            "Real-time Captions": "Captions are being generated with 99% accuracy.",
            "Sign Trans": "I've detected a 'Thank You' gesture in sign language.",
            "Smart Contrast": "I've adjusted the color contrast to meet WCAG AA standards.",
            "Secure Auth": "Biometric data verified. Access granted."
        };
        return mockResponses[feature] || `Action "${action}" for feature "${feature}" is complete.`;
    }
};

module.exports = aiService;
