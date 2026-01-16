import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

console.log("Fetching models with key ending in...", apiKey.slice(-4));

try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (data.error) {
        console.error("API Error:", data.error);
        fs.writeFileSync('models_list.txt', JSON.stringify(data.error, null, 2));
    } else {
        const models = data.models.filter(m => m.name.includes('gemini')).map(m => m.name);
        fs.writeFileSync('models_list.txt', models.join('\n'));
        console.log("Models written to models_list.txt");
    }
} catch (error) {
    console.error("Fetch error:", error);
}
