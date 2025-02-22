import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getAIContent } from "../utils/geminiAPI";
import DarkModeToggle from "./DarkModeToggle";
export default function LessonForm({ setLesson }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLesson = async () => {
    if (!topic) {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);
    try {
      const lessonContent = await getAIContent(topic);
      setLesson(lessonContent);
    } catch (error) {
      console.error("Error generating lesson:", error);
      setLesson("Error generating lesson plan.");
    }
    setLoading(false);
  };

  return (
    <>
    <div className="flex justify-end p-4">
            <DarkModeToggle />
    </div>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold">Create Lesson Plan</h2>
      <Input placeholder="Lesson Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <Button className="mt-4 mx-2" onClick={generateLesson} disabled={loading}>
        {loading ? "Generating..." : "Generate Lesson Plan"}
      </Button>
    </div>
    </>
  );
}
