export const renderTemplateA = (data) => {
  const {
    personalInfo = {},
    summary = "",
    education = [],
    skills = {},
    projects = [],
    certifications = [],
    interests = []
  } = data;

  const list = (items) =>
    Array.isArray(items) ? items.map(i => `<li>${i}</li>`).join("") : "";

  const linkIcon = (url) =>
    url
      ? `<a class="icon-link" href="${url}" target="_blank">
           <i class="fa-solid fa-arrow-up-right-from-square"></i>
         </a>`
      : "";

  const contactLinks = [
    personalInfo.phone ? `<a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>` : null,
    personalInfo.email ? `<a href="mailto:${personalInfo.email}">${personalInfo.email}</a>` : null,
    personalInfo.github ? `<a href="${personalInfo.github}" target="_blank">GitHub</a>` : null,
    personalInfo.leetcode ? `<a href="${personalInfo.leetcode}" target="_blank">LeetCode</a>` : null,
    personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank">LinkedIn</a>` : null,
    personalInfo.portfolio ? `<a href="${personalInfo.portfolio}" target="_blank">Portfolio</a>` : null
  ].filter(Boolean).join(" | ");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume Preview</title>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>

<style>
body {
  font-family: "Times New Roman", Times, serif;
  font-size: 12.5px;
  line-height: 1.32;
  color: #000;
  margin: 15px 40px 40px 15px;
}

.header {
  text-align: center;
  margin-bottom: 10px;
}

.header h1 {
  font-size: 26px;
  margin: 0;
  font-weight: bold;
}

.contact {
  font-size: 12px;
  margin-top: 4px;
}

.contact a {
  color: #000;
  text-decoration: none;
  margin: 0 4px;
}

.section {
  margin-top: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #000;
  margin-bottom: 4px;
}

p {
  margin: 2px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 1px 0;
  vertical-align: top;
}

.right {
  text-align: right;
  font-weight: bold;
}

.columns {
  display: flex;
  justify-content: space-between;
}

.column {
  width: 48%;
}

ul {
  margin: 4px 0 4px 16px;
  padding: 0;
}

li {
  margin-bottom: 2px;
}

.project-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.project-title {
  font-weight: bold;
}

.project-meta {
  font-weight: bold;
}

.icon-link {
  margin-left: 6px;
  color: #000;
  font-size: 12px;
  text-decoration: none;
}

.icon-link i {
  display: inline-block;
}
</style>
</head>

<body>

<div class="header">
  <h1>${personalInfo.name || ""}</h1>
  <div class="contact">
    ${contactLinks}
  </div>
</div>

${summary ? `
<div class="section">
  <div class="section-title">Summary</div>
  <p>${summary}</p>
</div>` : ""}

${education.length ? `
<div class="section">
  <div class="section-title">Education</div>
  <table>
    ${education.map(edu => `
    <tr>
      <td><strong>${edu.institution || ""}</strong></td>
      <td></td>
      <td class="right">${edu.duration || ""}</td>
    </tr>
    <tr>
      <td>${edu.degree || ""}</td>
      <td>${edu.score ? `CGPA: ${edu.score.replace(/CGPA:\\s*/i, "")}` : ""}</td>
      <td></td>
    </tr>
    `).join("")}
  </table>
</div>` : ""}

${Object.keys(skills).length ? `
<div class="section">
  <div class="section-title">Skills</div>

  <div class="columns">
    <div class="column">
      <strong>Technical Skills</strong>
      <ul>
        ${skills.languages?.length ? `<li><strong>Languages:</strong> ${skills.languages.join(", ")}</li>` : ""}
        ${skills.frontend?.length ? `<li><strong>Frontend:</strong> ${skills.frontend.join(", ")}</li>` : ""}
        ${skills.backend?.length ? `<li><strong>Backend:</strong> ${skills.backend.join(", ")}</li>` : ""}
        ${skills.databases?.length ? `<li><strong>Databases:</strong> ${skills.databases.join(", ")}</li>` : ""}
        ${skills.ai?.length ? `<li><strong>AI / GenAI:</strong> ${skills.ai.join(", ")}</li>` : ""}
        ${skills.tools?.length ? `<li><strong>Tools:</strong> ${skills.tools.join(", ")}</li>` : ""}
      </ul>
    </div>

    <div class="column">
      <strong>Problem Solving</strong>
      <ul>
        ${list(skills.problemSolving)}
      </ul>

      ${interests.length ? `
      <br />
      <strong>Interests</strong>
      <ul>
        ${list(interests)}
      </ul>` : ""}
    </div>
  </div>
</div>` : ""}

${projects.length ? `
<div class="section">
  <div class="section-title">Projects</div>
  ${projects.map(proj => `
  <div class="project-item">
    <p class="project-title project-row">
      <span>
        ${proj.title || ""}
        ${linkIcon(proj.link)}
      </span>
      <span class="project-meta">${proj.duration || ""}</span>
    </p>
    <ul>
      ${list(proj.details)}
    </ul>
  </div>
  `).join("")}
</div>` : ""}

${certifications.length ? `
<div class="section">
  <div class="section-title">Certifications</div>
  <ul>
    ${certifications.map(cert => `
    <li>
      <strong>${cert.name || cert}</strong>${cert.platform ? ` — ${cert.platform}` : ""}
      ${linkIcon(cert.link)}
    </li>
    `).join("")}
  </ul>
</div>` : ""}

</body>
</html>
`;
};
