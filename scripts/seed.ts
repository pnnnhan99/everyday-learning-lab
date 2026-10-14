import { promises as fs } from 'node:fs';
import path from 'node:path';
import { elements, reactions } from '../src/data/mockReactions';

async function main() {
  const dir = path.join(process.cwd(), '.data');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'db.json'), JSON.stringify({ elements, reactions }, null, 2), 'utf-8');
  console.log(`Seeded ${elements.length} elements and ${reactions.length} reactions to .data/db.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
