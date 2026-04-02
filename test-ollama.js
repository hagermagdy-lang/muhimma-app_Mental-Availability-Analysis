
try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (response.ok) {
        const data = await response.json();
        console.log('Ollama is reachable. Available models:', data.models.map(m => m.name));
    } else {
        console.log('Ollama returned an error status:', response.status);
    }
} catch (error) {
    console.log('Could not connect to Ollama. Make sure it is running and OLLAMA_ORIGINS is set to "*".');
}
