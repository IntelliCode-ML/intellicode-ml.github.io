const container = document.getElementById("projects-container");

// Function to fetch README content
async function fetchReadme(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch README: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error fetching README:', error);
        return '## Error Loading README\n\nUnable to load the README content. Please visit the GitHub repository to view the documentation.';
    }
}

// Function to convert markdown to HTML (simple version)
function markdownToHtml(markdown) {
    if (!markdown) return '<p>No README content available.</p>';
    
    // Convert headers
    markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert links
    markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Convert code blocks
    markdown = markdown.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert lists
    markdown = markdown.replace(/^\s*[-*+]\s+(.*$)/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Convert paragraphs
    markdown = markdown.replace(/^(?!<[a-z])(.*$)/gm, '<p>$1</p>');
    
    return markdown;
}

projectCategories.forEach(category => {
    category.projects.forEach(async project => {
        const projectCard = document.createElement("div");
        projectCard.className = "project-card";

        // // Project Image
        // const imageContainer = document.createElement("div");
        // imageContainer.className = "project-image";
        // const image = document.createElement("img");
        // image.src = project.image || "images/default-project.jpg";
        // image.alt = project.title;
        // imageContainer.appendChild(image);
        // projectCard.appendChild(imageContainer);

        // Project Title
        const title = document.createElement("h3");
        title.className = "project-title";
        title.textContent = project.title;
        projectCard.appendChild(title);

        // Project Description
        const description = document.createElement("p");
        description.className = "project-description";
        description.textContent = project.description;
        projectCard.appendChild(description);

        // Tech Stack
        if (project.technologies && project.technologies.length > 0) {
            const techContainer = document.createElement("div");
            techContainer.className = "project-tech";
            
            project.technologies.forEach(tech => {
                const techTag = document.createElement("span");
                techTag.className = "tech-tag";
                techTag.textContent = tech;
                techContainer.appendChild(techTag);
            });
            
            projectCard.appendChild(techContainer);
        }

        // README Content
        const readmeContainer = document.createElement("div");
        readmeContainer.className = "readme-container";
        readmeContainer.style.display = "none";
        
        if (project.readmeUrl) {
            // Add loading state
            const loadingDiv = document.createElement("div");
            loadingDiv.className = "readme-loading";
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading README...';
            readmeContainer.appendChild(loadingDiv);
            projectCard.appendChild(readmeContainer);

            try {
                const readmeContent = await fetchReadme(project.readmeUrl);
                const readmeHtml = markdownToHtml(readmeContent);
                readmeContainer.innerHTML = readmeHtml;
            } catch (error) {
                readmeContainer.innerHTML = '<p class="readme-error">Error loading README. Please visit the GitHub repository to view the documentation.</p>';
            }
        }

        // Project Links
        const linksContainer = document.createElement("div");
        linksContainer.className = "project-links";

        // Demo Link
        if (project.demoLink) {
            const demoLink = document.createElement("a");
            demoLink.href = project.demoLink;
            demoLink.className = "project-link";
            demoLink.target = "_blank";
            demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Live Demo';
            linksContainer.appendChild(demoLink);
        }

        // GitHub Link
        if (project.githubLink) {
            const githubLink = document.createElement("a");
            githubLink.href = project.githubLink;
            githubLink.className = "project-link";
            githubLink.target = "_blank";
            githubLink.innerHTML = '<i class="fab fa-github"></i> Source Code';
            linksContainer.appendChild(githubLink);
        }

        // README Toggle Button
        if (project.readmeUrl) {
            const readmeButton = document.createElement("button");
            readmeButton.className = "project-link readme-toggle";
            readmeButton.innerHTML = '<i class="fas fa-book"></i> View README';
            readmeButton.onclick = () => {
                const isVisible = readmeContainer.style.display !== "none";
                readmeContainer.style.display = isVisible ? "none" : "block";
                readmeButton.innerHTML = isVisible ? 
                    '<i class="fas fa-book"></i> View README' : 
                    '<i class="fas fa-times"></i> Hide README';
            };
            linksContainer.appendChild(readmeButton);
        }

        projectCard.appendChild(linksContainer);
        container.appendChild(projectCard);
    });
}); 