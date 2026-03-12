const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateMotivationLetter = async (talentSkills, jobDescription) => {
  const prompt = `Write a professional motivation letter for a candidate with these skills: ${talentSkills}. They are applying for this job: ${jobDescription}. Keep it under 200 words.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
