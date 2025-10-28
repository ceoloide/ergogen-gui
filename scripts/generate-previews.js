
const fs = require('fs');
const path = require('path');
const ergogen = require('ergogen');
const { exampleOptions } = require('../src/examples/index.ts');

const previewsDir = path.join(process.cwd(), 'public', 'images', 'previews');
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

async function generatePreview(example) {
  if (example.label === 'Empty YAML configuration') {
    return;
  }

  console.log(`Generating preview for ${example.label}...`);

  try {
    const output = await ergogen.process(example.value, {
      svg: true,
      debug: true
    });

    const svgContent = output.outlines?.preview?.svg || output.demo.svg;

    if (svgContent) {
      let content = Array.isArray(svgContent) ? svgContent.join('') : svgContent;
      if (typeof content === 'string') {
        content = content
          .replace(/width="[^"]+"/, 'width="284px"')
          .replace(/height="[^"]+"/, 'height="134px"');
        content = content.replace(
          /<svg/,
          '<svg style="background-color: rgb(51,51,51);"'
        );
        content = content.replaceAll(/stroke="#000"/g, 'stroke="#AAA"');
        content = content.replaceAll(/stroke:#000/g, 'stroke:#AAA');

        const filename = `${example.label.toLowerCase().replace(/[\s()]/g, '_')}.svg`;
        const filepath = path.join(previewsDir, filename);
        fs.writeFileSync(filepath, content);
        console.log(`  -> Saved to ${filepath}`);
      }
    }
  } catch (err) {
    console.error(`Error generating preview for ${example.label}:`, err);
  }
}

async function main() {
  for (const group of exampleOptions) {
    for (const example of group.options) {
      await generatePreview(example);
    }
  }

  console.log('Generated previews:');
  const files = fs.readdirSync(previewsDir);
  files.forEach(file => {
    console.log(file);
  });
}

main();
