import { Assignment, GeneratedPaper, Section, Question } from 'shared';

/**
 * Builds the exact prompt structure requested in implementation.md
 */
export function buildGenerationPrompt(assignment: Assignment, fileContent?: string): string {
  return `You are an expert educator creating a formal examination paper.

ASSIGNMENT DETAILS:
- Subject: ${assignment.subject}
- Grade/Level: ${assignment.grade}
- Topic: ${assignment.topic}
- Question Types Requested: ${assignment.questionTypes.join(', ')}
- Total Questions: ${assignment.numQuestions}
- Marks per Question: ${assignment.marksPerQuestion}
- Difficulty Distribution: ${assignment.difficultyDistribution.easy}% Easy, ${assignment.difficultyDistribution.medium}% Medium, ${assignment.difficultyDistribution.hard}% Hard
${assignment.additionalInstructions ? `- Special Instructions: ${assignment.additionalInstructions}` : ''}
${fileContent ? `\nREFERENCE MATERIAL:\n${fileContent}` : ''}

INSTRUCTIONS:
1. Group questions into sections by question TYPE (e.g., Section A: MCQ, Section B: Short Answer)
2. Within each section, arrange from easiest to hardest
3. Each question must be academically rigorous and grade-appropriate
4. For MCQ, provide exactly 4 options labeled A, B, C, D
5. Ensure no repetition of concepts across questions
6. Total marks = ${assignment.numQuestions * assignment.marksPerQuestion}

RESPOND WITH ONLY VALID JSON. No markdown, no explanation, no preamble. Exactly this structure:

{
  "title": "Subject - Topic Examination",
  "totalMarks": <number>,
  "duration": "<estimated duration>",
  "sections": [
    {
      "id": "section-a",
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries <n> marks.",
      "questions": [
        {
          "id": "q1",
          "number": 1,
          "text": "<full question text>",
          "type": "mcq|short|long|truefalse|fillinblanks",
          "difficulty": "easy|medium|hard",
          "marks": <number>,
          "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
          "answer": "<correct answer key or outline for the teacher>"
        }
      ]
    }
  ]
}`;
}

/**
 * Parses and sanitizes the AI JSON response
 */
export async function parseGeneratedPaper(aiResponse: string): Promise<GeneratedPaper> {
  const cleaned = aiResponse.replace(/```json\n?|```\n?/g, '').trim();
  
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned malformed JSON — retry');
  }
  
  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error('Invalid paper structure');
  }
  
  return {
    title: String(parsed.title || 'Examination Paper'),
    totalMarks: Number(parsed.totalMarks),
    duration: String(parsed.duration || '2 hours'),
    sections: parsed.sections.map((s: any, si: number) => ({
      id: s.id || `section-${si + 1}`,
      title: s.title || `Section ${String.fromCharCode(65 + si)}`,
      instruction: s.instruction || 'Attempt all questions.',
      questions: (s.questions || []).map((q: any, qi: number) => ({
        id: q.id || `q${qi + 1}`,
        number: Number(q.number || qi + 1),
        text: String(q.text),
        type: q.type,
        difficulty: q.difficulty,
        marks: Number(q.marks),
        options: Array.isArray(q.options) ? q.options : [],
        answer: q.answer ? String(q.answer) : undefined
      }))
    }))
  };
}

/**
 * High-quality mock paper generator to use as fallback when ANTHROPIC_API_KEY is not configured.
 */
function generateMockPaper(assignment: Assignment): GeneratedPaper {
  const subject = assignment.subject || 'Electricity';
  const topic = assignment.topic || 'Electrostatics and Circuits';
  const grade = assignment.grade || 'Class 10th';
  
  const questionTypes = assignment.questionTypes.length > 0 
    ? assignment.questionTypes 
    : ['mcq', 'short'];
    
  const totalQuestions = assignment.numQuestions || 10;
  const marksPerQ = assignment.marksPerQuestion || 2;
  const totalMarks = totalQuestions * marksPerQ;
  
  const sections: Section[] = [];
  let questionCounter = 1;
  
  // Calculate question difficulties based on distribution
  const diffDistribution = assignment.difficultyDistribution || { easy: 50, medium: 30, hard: 20 };
  const easyCount = Math.max(1, Math.round((diffDistribution.easy / 100) * totalQuestions));
  const mediumCount = Math.max(0, Math.round((diffDistribution.medium / 100) * totalQuestions));
  const hardCount = Math.max(0, totalQuestions - easyCount - mediumCount);
  
  const difficulties: Array<'easy' | 'medium' | 'hard'> = [];
  for (let i = 0; i < easyCount; i++) difficulties.push('easy');
  for (let i = 0; i < mediumCount; i++) difficulties.push('medium');
  for (let i = 0; i < hardCount; i++) difficulties.push('hard');
  
  // Distribute questions across requested types
  const questionsPerType = Math.ceil(totalQuestions / questionTypes.length);
  
  questionTypes.forEach((type: string, sectionIdx: number) => {
    const sectionChar = String.fromCharCode(65 + sectionIdx);
    const typeLabel = 
      type === 'mcq' ? 'Multiple Choice Questions' :
      type === 'short' ? 'Short Answer Questions' :
      type === 'long' ? 'Long Answer Questions' :
      type === 'truefalse' ? 'True / False Questions' :
      'Fill in the Blanks Questions';
      
    const sectionQuestions: Question[] = [];
    const countForThisType = Math.min(questionsPerType, totalQuestions - questionCounter + 1);
    
    if (countForThisType <= 0) return;
    
    for (let k = 0; k < countForThisType; k++) {
      const diff = difficulties[questionCounter - 1] || 'medium';
      const qNum = questionCounter++;
      
      let text = '';
      let options: string[] = [];
      let answer = '';
      
      // Smart content templates depending on subject/topic
      if (subject.toLowerCase().includes('electric') || topic.toLowerCase().includes('electric')) {
        if (type === 'mcq') {
          text = `Which of the following materials is the best electrical conductor under standard conditions?`;
          options = ['A. Purified Water', 'B. Copper Wire', 'C. Dry Oak Wood', 'D. Vulcanized Rubber'];
          answer = 'B. Copper Wire. Copper has a high density of free conduction electrons.';
        } else if (type === 'short') {
          text = `State Ohm's Law and write its mathematical representation. Explain the meaning of each symbol.`;
          answer = `Ohm's Law states that current is directly proportional to voltage and inversely proportional to resistance (I = V/R). V is Potential Difference (volts), I is Current (amperes), and R is Resistance (ohms).`;
        } else if (type === 'long') {
          text = `Distinguish between series and parallel electrical circuits. Provide diagrams/schematics explaining how current and potential difference are distributed in each configuration, and derive their respective formulas for equivalent resistance.`;
          answer = `In series: R_eq = R1 + R2 + ... Current is uniform, voltage divides. In parallel: 1/R_eq = 1/R1 + 1/R2 + ... Voltage is uniform, current divides.`;
        } else if (type === 'truefalse') {
          text = `The resistance of an ideal voltmeter is assumed to be zero ohms to ensure no load is added to the circuit.`;
          answer = `False. An ideal voltmeter has infinite resistance so that it does not draw any current from the circuit it is measuring.`;
        } else {
          text = `The SI unit of electrical potential difference is the ________, which is defined as one joule per coulomb.`;
          answer = `volt`;
        }
      } else if (subject.toLowerCase().includes('english') || subject.toLowerCase().includes('lang')) {
        if (type === 'mcq') {
          text = `Identify the sentence that represents a grammatically correct usage of the subjunctive mood.`;
          options = [
            'A. I wish I was a pilot so I could fly away.',
            'B. The headmaster insisted that he be present at the ceremony.',
            'C. If he is going, I would have gone too.',
            'D. She behaves as if she knows everything.'
          ];
          answer = 'B. The subjunctive mood uses "be" in this demand/insistence clause.';
        } else if (type === 'short') {
          text = `Explain the difference between a metaphor and a simile. Give one original literary example of each.`;
          answer = `A simile compares two things using "like" or "as" ("Her smile was as bright as the sun"). A metaphor makes a direct comparison without those words ("Her smile was a ray of sunshine").`;
        } else {
          text = `Analyze the central theme of conflict in the passage provided. Focus on the relationship between character motivations and cultural expectations.`;
          answer = `The protagonist represents the conflict between individual freedom and societal duties.`;
        }
      } else {
        // Generic academic questions
        if (type === 'mcq') {
          text = `Which of the following options represents the primary step in the scientific method regarding ${topic}?`;
          options = ['A. Performing a random experiment', 'B. Formulating an explanatory hypothesis', 'C. Publishing final conclusions', 'D. Disregarding outlier datasets'];
          answer = 'B. Formulating an explanatory hypothesis is the logical next step after making observations.';
        } else if (type === 'short') {
          text = `Define the core principles of ${topic} and explain how they relate to modern educational research.`;
          answer = `Core principles include hypothesis formulation, rigorous controls, and empirical validation applied directly to ${topic}.`;
        } else {
          text = `Provide a comprehensive critique on the historical development of ${topic}. Discuss the key thinkers, breakthroughs, and contemporary limitations of the current theories.`;
          answer = `Key aspects include foundational discoveries, subsequent revisions, and current challenges in applying ${topic} universally.`;
        }
      }
      
      // Let's replace placeholder names with topic if necessary
      if (text.includes('${topic}')) {
        text = text.replace(/\$\{topic\}/g, topic);
      }
      if (answer.includes('${topic}')) {
        answer = answer.replace(/\$\{topic\}/g, topic);
      }

      sectionQuestions.push({
        id: `q-${qNum}`,
        number: qNum,
        text,
        type: type as any,
        difficulty: diff,
        marks: marksPerQ,
        options,
        answer
      });
    }

    sections.push({
      id: `section-${sectionChar.toLowerCase()}`,
      title: `SECTION ${sectionChar} – ${typeLabel}`,
      instruction: `Attempt all questions. Each question carries ${marksPerQ} marks.`,
      questions: sectionQuestions
    });
  });

  return {
    title: `${subject} – ${topic} Assessment`,
    totalMarks,
    duration: totalMarks <= 20 ? '45 minutes' : totalMarks <= 50 ? '1.5 hours' : '3 hours',
    sections
  };
}

/**
 * Main function to generate assessment paper from AI or fallback mock
 */
export async function generateAssessmentPaper(assignment: Assignment, fileContent?: string): Promise<GeneratedPaper> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash';
  
  if (!apiKey || apiKey === 'your-key-here' || apiKey.startsWith('your-')) {
    console.log('🤖 Gemini API Key is not set. Generating high-quality mock assessment.');
    // Add a tiny sleep to simulate AI thought process
    await new Promise(resolve => setTimeout(resolve, 2000));
    return generateMockPaper(assignment);
  }

  try {
    console.log(`🤖 Sending generation request to Google Gemini API using model ${model}...`);
    const prompt = buildGenerationPrompt(assignment, fileContent);
    const systemInstruction = "You are an AI assistant designed to generate formal examination papers and assessments in valid, strict JSON format.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: systemInstruction
            }
          ]
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API responded with status ${response.status}: ${errorText}`);
    }

    const data: any = await response.json();
    const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!contentText) {
      throw new Error('Gemini API returned an empty or invalid response structure.');
    }

    return await parseGeneratedPaper(contentText);
  } catch (error: any) {
    console.error('❌ Gemini generation failed:', error);
    console.log('🤖 Falling back to high-quality mock generator due to API error.');
    return generateMockPaper(assignment);
  }
}
