import { useRef, useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import jsPDF from "jspdf";

export default function LessonDisplay({ lesson }) {
  const printRef = useRef();

 
  const [editableLesson, setEditableLesson] = useState({
    summary: "",
    subject: "",
    grade: "",
    mainTopic: "",
    subtopics: "",
    materials: "",
    objectives: "",
    outline: "",
    outlineTable: [], 
    assessment: "",
    notes: "",
  });

 
  const parseLesson = (text) => {
    if (!text) return {};

    const parsedLesson = {};

   
    const regexPatterns = {
      summary: /\*\*1\. Summary\*\*\s*\n*([\s\S]+?)(?=\*\*2\.|$)/i,
      subject: /\*\*2\. Subject\*\*\s*\n*([\s\S]+?)(?=\*\*3\.|$)/i,
      grade: /\*\*3\. Grade Level\*\*\s*\n*([\s\S]+?)(?=\*\*4\.|$)/i,
      mainTopic: /\*\*4\. Main Topic & Subtopics\*\*\s*\n*([\s\S]+?)(?=\*\*5\.|$)/i,
      subtopics: /\*\*Subtopics:\*\*\s*\n*([\s\S]+?)(?=\*\*5\.|$)/i,
      materials: /\*\*5\. Materials Needed\*\*\s*\n*([\s\S]+?)(?=\*\*6\.|$)/i,
      objectives: /\*\*6\. Learning Objectives\*\*\s*\n*([\s\S]+?)(?=\*\*7\.|$)/i,
      outline: /\*\*7\. Lesson Outline\*\*\s*\n*([\s\S]+?)(?=\*\*8\.|$)/i, 
      assessment: /\*\*8\. Assessment\*\*\s*\n*([\s\S]+?)(?=\*\*9\.|$)/i,
      notes: /\*\*9\. Notes\*\*\s*\n*([\s\S]+?)(?=\n|$)/i,
    };

   
    Object.keys(regexPatterns).forEach((key) => {
      const match = text.match(regexPatterns[key]);
      parsedLesson[key] = match ? match[1].trim() : "No data available.";
    });

    
    if (parsedLesson.outline) {
      parsedLesson.outlineTable = parsedLesson.outline
        .split("\n")
        .map((line) => {
         
          const durationMatch = line.match(/\((\d+)\s*minutes?\)/i);
          const duration = durationMatch ? `${durationMatch[1]} minutes` : "";

         
          const description = line
            .replace(/^\*\s*/, "")
            .replace(/\s*\(.*?\)/, "") 
            .trim();

          return { duration, description };
        })
        .filter((row) => row.duration && row.description); 
    } else {
      parsedLesson.outlineTable = [];
    }

    return parsedLesson;
  };

 
  useEffect(() => {
    const parsedLesson = parseLesson(lesson);
    setEditableLesson(parsedLesson);
  }, [lesson]);

  
  const handleInputChange = (e, key) => {
    setEditableLesson({
      ...editableLesson,
      [key]: e.target.value,
    });
  };

  
  const handleTableChange = (index, field, value) => {
    const updatedTable = [...editableLesson.outlineTable];
    updatedTable[index][field] = value;
    setEditableLesson({
      ...editableLesson,
      outlineTable: updatedTable,
    });
  };

 
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4", 
    });

   
    doc.setFont("helvetica");
    doc.setFontSize(12);

  
    const stripMarkdown = (text) => {
      return text
        .replace(/\*\*/g, "") 
        .replace(/\*/g, "") 
        .replace(/- /g, "") 
        .replace(/=/g, "") 
        .replace(/</g, "") 
        .replace(/>/g, ""); 
    };

   
    const addTextWithPageBreak = (text, x, yOffset, lineHeight = 12, maxWidth = 280) => {
      const pageHeight = doc.internal.pageSize.height;
      if (yOffset > pageHeight - 20) {
        doc.addPage(); 
        yOffset = 20;
      }

     
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, yOffset);

    
      return yOffset + lines.length * lineHeight;
    };

    let yOffset = 10; 

   
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); 
    yOffset = addTextWithPageBreak(" Lesson Plan", 10, yOffset, 18);

  
    yOffset = addTextWithPageBreak(` Summary: ${stripMarkdown(editableLesson.summary)}`, 10, yOffset);

   
    yOffset = addTextWithPageBreak(` Subject: ${stripMarkdown(editableLesson.subject)}`, 10, yOffset);

   
    yOffset = addTextWithPageBreak(` Grade Level: ${stripMarkdown(editableLesson.grade)}`, 10, yOffset);

   
    yOffset = addTextWithPageBreak(` Main Topic: ${stripMarkdown(editableLesson.mainTopic)}`, 10, yOffset);

    
    yOffset = addTextWithPageBreak(` Materials Needed:`, 10, yOffset);
    editableLesson.materials.split("\n").forEach((line) => {
      yOffset = addTextWithPageBreak(`- ${stripMarkdown(line)}`, 15, yOffset);
    });

    
    yOffset = addTextWithPageBreak(` Learning Objectives:`, 10, yOffset);
    editableLesson.objectives.split("\n").forEach((line) => {
      yOffset = addTextWithPageBreak(`- ${stripMarkdown(line)}`, 15, yOffset);
    });

    
    yOffset = addTextWithPageBreak(` Lesson Outline:`, 10, yOffset);
    editableLesson.outlineTable.forEach((row) => {
      yOffset = addTextWithPageBreak(`- Duration: ${row.duration}`, 15, yOffset);
      yOffset = addTextWithPageBreak(`  Description: ${row.description}`, 15, yOffset);
    });

    
    yOffset = addTextWithPageBreak(` Assessment: ${stripMarkdown(editableLesson.assessment)}`, 10, yOffset);

   
    yOffset = addTextWithPageBreak(` Notes: ${stripMarkdown(editableLesson.notes)}`, 10, yOffset);

   
    doc.save("lesson-plan.pdf");
  };

  return (
    <Card className="p-8 bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-300 dark:border-gray-700 mt-6">
      <div ref={printRef} className="text-gray-900 dark:text-gray-200">
      
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          📚 Lesson Plan
        </h2>

       
        <div className="mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Lesson Overview</h3>
          <textarea
            className="w-full p-2 border rounded-md"
            value={editableLesson.summary}
            onChange={(e) => handleInputChange(e, "summary")}
            placeholder="Enter summary"
          />
        </div>

      
        <div className="mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Subject & Grade Level</h3>
          <input
            className="w-full p-2 border rounded-md mb-2"
            value={editableLesson.subject}
            onChange={(e) => handleInputChange(e, "subject")}
            placeholder="Enter subject"
          />
          <input
            className="w-full p-2 border rounded-md"
            value={editableLesson.grade}
            onChange={(e) => handleInputChange(e, "grade")}
            placeholder="Enter grade level"
          />
        </div>

       
        <div className="mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Main Topic & Subtopics</h3>
          <input
            className="w-full p-2 border rounded-md mb-2"
            value={editableLesson.mainTopic}
            onChange={(e) => handleInputChange(e, "mainTopic")}
            placeholder="Enter main topic"
          />
          <textarea
            className="w-full p-2 border rounded-md"
            value={editableLesson.subtopics}
            onChange={(e) => handleInputChange(e, "subtopics")}
            placeholder="Enter subtopics (one per line)"
            style={{ height: "100px" }}
          />
        </div>

       
        <div className="mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Materials Needed</h3>
          <textarea
            className="w-full p-2 border rounded-md"
            value={editableLesson.materials}
            onChange={(e) => handleInputChange(e, "materials")}
            placeholder="Enter materials needed (one per line)"
            style={{ height: "150px" }}
          />
        </div>

       
        <div className="mb-6 p-6 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Learning Objectives</h3>
          <textarea
            className="w-full p-2 border rounded-md"
            value={editableLesson.objectives}
            onChange={(e) => handleInputChange(e, "objectives")}
            placeholder="Enter learning objectives (one per line)"
            style={{ height: "150px" }}
          />
        </div>

       
        <div className="mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Lesson Outline</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {editableLesson.outlineTable.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded-md"
                      value={row.duration}
                      onChange={(e) => handleTableChange(index, "duration", e.target.value)}
                      placeholder="Duration"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      className="w-full p-1 border rounded-md"
                      value={row.description}
                      onChange={(e) => handleTableChange(index, "description", e.target.value)}
                      placeholder="Description"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
        <div className="mb-6 p-6 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Assessment</h3>
          <textarea
            className="w-full p-2 border rounded-md"
            value={editableLesson.assessment}
            onChange={(e) => handleInputChange(e, "assessment")}
            placeholder="Enter assessment details"
            style={{ height: "150px" }}
          />
        </div>

        
        <div className="mb-6 p-4 rounded-md bg-gray-100 dark:bg-gray-800 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Notes & Observations</h3>
          <textarea
            className="w-full p-2 border rounded-md"
            value={editableLesson.notes}
            onChange={(e) => handleInputChange(e, "notes")}
            placeholder="Enter notes"
          />
        </div>
      </div>

  
      <Button
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg font-semibold transition-all duration-300"
        onClick={handleDownloadPDF}
      >
        📄 Download as PDF
      </Button>
    </Card>
  );
}



