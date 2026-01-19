import { getGeminiModel } from "../config/gemini.js";

export const optimizeResumeWithJD = async (resumeData, jd, userProfile = null) => {
   const isRawText = typeof resumeData === "string";

   let profileContext = "";
   if (userProfile) {
      profileContext = `
========================
MANDATORY DATA FROM USER PROFILE
========================
The following data MUST be included in the final resume exactly as provided.
Do NOT change links or titles. You may generate descriptions if they are missing, but keep the core details.

PROJECTS:
${JSON.stringify(userProfile.projects || [], null, 2)}

CERTIFICATIONS:
${JSON.stringify(userProfile.certifications || [], null, 2)}
`;
   }

   const prompt = `
You are a senior ATS Resume Optimizer and Career Consultant used by recruiters to evaluate role-transition candidates.

The candidate may be applying for a role DIFFERENT from their current background
(e.g., Software Developer → Data Scientist).

Your goal is to ALIGN the resume with the Job Description while remaining 100% truthful.

========================
JOB DESCRIPTION (JD)
========================
<<<
${jd}
>>>

========================
CANDIDATE RESUME (${isRawText ? "RAW TEXT" : "JSON FORMAT"})
========================
<<<
${isRawText ? resumeData : JSON.stringify(resumeData)}
>>>

${profileContext}

========================
NON-NEGOTIABLE RULES
========================
1. DO NOT invent tools, skills, experience, certifications, metrics, or job titles.
2. DO NOT exaggerate seniority or claim industry experience if not present.
3. DO NOT remove any existing skills or projects.
4. DO NOT rename or add resume sections outside the allowed schema.
5. DO NOT fabricate quantitative metrics.
   - If numbers are not present, use qualitative impact only.
6. Maintain a natural, human-written tone. Avoid keyword stuffing.
7. [CRITICAL] If "MANDATORY DATA" is provided above, you MUST include it in the respective sections (Projects, Certifications).
   - Merge it with existing data if necessary, but prioritize the mandatory items.
   - Ensure links are preserved exactly.

========================
ROLE TRANSITION RULE (CRITICAL)
========================
You ARE ALLOWED to reinterpret and reframe existing skills, tools, and projects using
Job Description terminology IF they are semantically equivalent.

Examples (DO NOT output these examples):
- REST APIs → Data ingestion pipelines
- JSON / API responses → Raw datasets
- MongoDB / MySQL → Structured datasets
- Backend logic → Data preprocessing workflows
- CRUD operations → Data transformation pipelines
- Algorithms / DSA → Analytical and problem-solving capability

You are NOT allowed to introduce:
- New ML models
- New libraries or platforms
- New certifications (unless provided in MANDATORY DATA)
- New datasets

========================
TASKS
========================
${isRawText ? `
A. Parse the unstructured resume into structured data strictly matching the schema.
` : `
A. Analyze the provided structured resume.
`}

B. Analyze the Job Description and identify the TOP required skills and competencies.
C. Rewrite the Professional Summary (2–3 sentences) to align with the JD and target role.
D. Skills Optimization:
   - Reorder skills to prioritize JD relevance.
   - Rephrase skills using JD terminology ONLY if semantically equivalent.
   - Preserve ALL original skills.
E. Projects Optimization:
   - Rewrite bullets using Action + Context + Result format.
   - Frame projects from a DATA / ANALYTICS / INSIGHTS perspective where applicable.
   - Emphasize data handling, preprocessing, analysis, scalability, or insights IF truthful.
   - INCLUDE MANDATORY PROJECTS.
F. Certifications:
   - INCLUDE MANDATORY CERTIFICATIONS.

========================
OUTPUT FORMAT (STRICT)
========================
- Return ONLY valid JSON
- No markdown
- No explanations
- No comments
- No extra keys

========================
SCHEMA (IMMUTABLE)
========================
{
  "personalInfo": {
    "name": "",
    "phone": "",
    "email": "",
    "github": "",
    "linkedin": "",
    "leetcode": "",
    "portfolio": ""
  },
  "summary": "",
  "education": [
    { "institution": "", "degree": "", "score": "", "duration": "" }
  ],
  "skills": {
    "languages": [],
    "databases": [],
    "frontend": [],
    "backend": [],
    "tools": [],
    "ai": [],
    "problemSolving": []
  },
  "projects": [
    {
      "title": "",
      "details": []
    }
  ],
  "certifications": [],
  "interests": []
}

RETURN ONLY THE JSON OBJECT.
`;

   const result = await getGeminiModel().generateContent(prompt);
   const text = result.response.text();

   try {
      // Remove markdown fences if Gemini adds them
      const jsonContent = text.replace(/```json\\n?|\\n?```/g, "").trim();
      const parsedData = JSON.parse(jsonContent);

      console.log("============ AI GENERATED RESUME DATA ============");
      console.log(JSON.stringify(parsedData, null, 2));
      console.log("==================================================");

      return parsedData;
   } catch (err) {
      console.error("Gemini JSON Parse Error:", text);
      throw new Error("Gemini returned invalid JSON");
   }
};
