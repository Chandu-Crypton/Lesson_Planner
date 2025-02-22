import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export async function getAIContent(topic) {
    try {
        if (!topic) {
            throw new Error("Topic is required to generate a lesson plan.");
        }


        const model = genAI.getGenerativeModel({ model: "gemini-pro" });


        const prompt = `Create a structured lesson plan for the topic: "${topic}". 
    The plan should include:
    1. Summary
    2. Subject
    3. Grade Level
    4. Main Topic & Subtopics
    5. Materials Needed
    6. Learning Objectives
    7. Lesson Outline with time duration for each step
    8. Assessment
    9. Notes`;


        const result = await model.generateContent(prompt);
        const response = await result.response;

        if (!response) throw new Error("Invalid response from AI API");


        const text = response.text();
        console.log("Raw API Response:", text);
        return text || "No lesson content generated.";
    } catch (error) {
        console.error("Error fetching AI content:", error);
        return "Failed to generate lesson plan.";
    }
}