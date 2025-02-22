import { useState } from "react";
import LessonForm from "../components/LessonForm";
import LessonDisplay from "../components/LessonDisplay";

export default function LessonPlanner() {
  const [lesson, setLesson] = useState("");

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <LessonForm setLesson={setLesson} />
      {lesson && <LessonDisplay lesson={lesson} />}
    </div>
  );
}
