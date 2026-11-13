const fs = require('fs');
const path = require('path');
const { exampleOptions } = require('../src/examples/index.ts');

// Use the engine prepared by `pnpm run build-ergogen` (patch/patch_ergogen.sh),
// which includes the bundled footprint libraries, not the raw installed package.
const engineDir = path.join(process.cwd(), 'node_modules', '.ergogen-engine');
if (!fs.existsSync(path.join(engineDir, 'package.json'))) {
  console.error(
    `Ergogen engine not found in ${engineDir}. Run 'pnpm run build-ergogen' first.`
  );
  process.exit(1);
}
const ergogen = require(engineDir);

const previewsDir = path.join(process.cwd(), 'public', 'images', 'previews');
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

/**
 * Renders the preview of one example. Returns false when it failed.
 */
async function generatePreview(example) {
  if (example.label === 'Empty YAML configuration') {
    return true;
  }

  console.log(`Generating preview for ${example.label}...`);

  try {
    const output = await ergogen.process(example.value, {
      svg: true,
      debug: true,
    });

    const svgContent = output.outlines?.preview?.svg || output.demo.svg;

    if (svgContent) {
      let content = Array.isArray(svgContent)
        ? svgContent.join('')
        : svgContent;
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
    return false;
  }
  return true;
}

async function main() {
  const failures = [];
  for (const group of exampleOptions) {
    for (const example of group.options) {
      if (!(await generatePreview(example))) {
        failures.push(example.label);
      }
    }
  }

  console.log('Generated previews:');
  const files = fs.readdirSync(previewsDir);
  files.forEach((file) => {
    console.log(file);
  });

  if (failures.length > 0) {
    console.error(`Failed to generate previews for: ${failures.join(', ')}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
