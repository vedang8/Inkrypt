const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

exports.fetchDescriptionFromAI = async(prompt) => {
    try{
        const completion = await groq.chat.completions.create({
            model: "mixtral-8x7b-32768",
            messages:[
                {role: "system", content: "You are an assistant who generates concise descriptions."},
                {role: "user", content: prompt}            
            ],
        });
        const aiResponse = completion.choices[0]?.message?.content.trim();
        return aiResponse;
    }catch(error){
        console.error('Failed to fetch Description form AI', error);
    }
};