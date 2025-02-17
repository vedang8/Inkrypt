// prompt for generating the description of the note
exports.generateDescriptionPrompt = (title, content) => {
    return `Generate a concise and engaging description for a note based on its title and content
            Provide the response containing Description of 1-2 lines. 
            Title: ${title}
            Content: ${content}
    `;
};