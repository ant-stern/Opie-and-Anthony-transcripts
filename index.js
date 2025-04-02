const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

const transcriptsDir = './transcripts/';
const indexFile = './search_index.json';

const documents = [];

function processDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else if (file.endsWith('.txt')) {
      // Process .txt files
      const content = fs.readFileSync(filePath, 'utf8');
      documents.push({
        id: path.relative(transcriptsDir, filePath), // Use relative path as ID
        text: content
      });
    }
  });
}

processDirectory(transcriptsDir);

const idx = lunr(function () {
  this.ref('id');
  this.field('text');

  documents.forEach(function (doc) {
    this.add(doc);
  }, this);
});

fs.writeFileSync(indexFile, JSON.stringify(idx));
console.log('Search index created successfully.');