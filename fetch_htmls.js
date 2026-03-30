import fs from 'fs';
import https from 'https';

const screens = [
  { name: 'import', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI3NjNjMTZlZjQ3YjRlZTlhZTgzNzJiMTIxZjU1MWQ4EgsSBxCot6-F3hsYAZIBIwoKcHJvamVjdF9pZBIVQhM3MTI0ODM1MzM0NTEzMjQ3NDEw&filename=&opi=89354086' },
  { name: 'executive', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE0YjgyOWM4NDkwZTQxNTc4OWFjY2ExNzg4ZTQ2YzdkEgsSBxCot6-F3hsYAZIBIwoKcHJvamVjdF9pZBIVQhM3MTI0ODM1MzM0NTEzMjQ3NDEw&filename=&opi=89354086' },
  { name: 'brand', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2I4MTM1Njc1NjU5YjQ3NmU5ODhmN2YzMDkxY2EyM2I3EgsSBxCot6-F3hsYAZIBIwoKcHJvamVjdF9pZBIVQhM3MTI0ODM1MzM0NTEzMjQ3NDEw&filename=&opi=89354086' },
  { name: 'cep', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZmMWM1NGM5ZTZjYjQyZDNhYmRhZDQ0YjQ5MWYxOTJhEgsSBxCot6-F3hsYAZIBIwoKcHJvamVjdF9pZBIVQhM3MTI0ODM1MzM0NTEzMjQ3NDEw&filename=&opi=89354086' }
];

if (!fs.existsSync('raw_html')) {
  fs.mkdirSync('raw_html');
}

screens.forEach(s => {
  https.get(s.url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync(`raw_html/${s.name}.html`, data);
      console.log(`Saved ${s.name}.html`);
    })
  });
});
