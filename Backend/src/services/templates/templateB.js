export const renderTemplateB = (data) => {
    const {
        personalInfo,
        summary,
        experience,
        education,
        skills,
        projects,
        certifications
    } = data;

    const listItems = (items) =>
        Array.isArray(items) ? items.map(i => `<li>${i}</li>`).join('') : '';

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeCertifications = Array.isArray(certifications) ? certifications : [];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #222;
            line-height: 1.6;
            margin: 15px 40px 40px 15px;
        }
        header {
            margin-bottom: 25px;
        }
        h1 {
            margin: 0;
            font-size: 26px;
            font-weight: bold;
        }
        .contact {
            font-size: 0.9em;
            color: #555;
            margin-top: 4px;
        }
        section {
            margin-bottom: 22px;
        }
        h2 {
            font-size: 14px;
            letter-spacing: 1px;
            text-transform: uppercase;
            border-bottom: 2px solid #000;
            padding-bottom: 4px;
            margin-bottom: 10px;
        }
        .item {
            margin-bottom: 12px;
        }
        .item h3 {
            margin: 0;
            font-size: 14px;
            font-weight: bold;
        }
        .meta {
            font-size: 0.85em;
            color: #666;
            margin-bottom: 4px;
        }
        ul {
            margin: 6px 0 0 18px;
            padding: 0;
        }
        li {
            margin-bottom: 4px;
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            list-style: none;
            padding: 0;
        }
        .skills li {
            border: 1px solid #ccc;
            padding: 3px 8px;
            font-size: 0.85em;
            border-radius: 3px;
        }
    </style>
</head>
<body>

<header>
    <h1>${personalInfo?.name || ''}</h1>
    <div class="contact">
        ${personalInfo?.email || ''}
        ${personalInfo?.phone ? ` | ${personalInfo.phone}` : ''}
        ${personalInfo?.linkedin ? ` | ${personalInfo.linkedin}` : ''}
    </div>
</header>

${summary ? `
<section>
    <h2>Summary</h2>
    <p>${summary}</p>
</section>` : ''}

${safeExperience.length > 0 ? `
<section>
    <h2>Experience</h2>
    ${safeExperience.map(exp => `
        <div class="item">
            <h3>${exp.role || ''} ${exp.company ? `– ${exp.company}` : ''}</h3>
            <div class="meta">${exp.duration || ''}</div>
            ${Array.isArray(exp.details) ? `<ul>${listItems(exp.details)}</ul>` : ''}
        </div>
    `).join('')}
</section>` : ''}

${safeProjects.length > 0 ? `
<section>
    <h2>Projects</h2>
    ${safeProjects.map(proj => `
        <div class="item">
            <h3>${proj.name || ''}</h3>
            <p>${proj.description || ''}</p>
        </div>
    `).join('')}
</section>` : ''}

${safeSkills.length > 0 ? `
<section>
    <h2>Skills</h2>
    <ul class="skills">
        ${listItems(safeSkills)}
    </ul>
</section>` : ''}

${safeEducation.length > 0 ? `
<section>
    <h2>Education</h2>
    ${safeEducation.map(edu => `
        <div class="item">
            <h3>${edu.degree || ''}</h3>
            <div class="meta">
                ${edu.institution || ''} ${edu.year ? `| ${edu.year}` : ''}
            </div>
        </div>
    `).join('')}
</section>` : ''}

${safeCertifications.length > 0 ? `
<section>
    <h2>Certifications</h2>
    <ul>
        ${listItems(safeCertifications)}
    </ul>
</section>` : ''}

</body>
</html>
`;
};
