import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'agents');

// Load API key from discord automation .env
const envPath = path.join(__dirname, '..', '..', 'farmine-discord-automation', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKey = envContent.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!apiKey) throw new Error('OPENAI_API_KEY not found in .env');

const openai = new OpenAI({ apiKey });

const agents = [
  {
    id: 'alpha',
    name: 'Ironforge Stonebeard',
    role: 'Core Architecture',
    desc: 'A stout, wise dwarf master builder with a long braided stone-grey beard, wearing brass goggles on his forehead, heavy leather apron with blueprint scrolls tucked in pockets, surrounded by glowing architectural schematics and copper pipes'
  },
  {
    id: 'beta',
    name: 'Deepdelver Caveborn',
    role: 'World Generation',
    desc: 'A weathered dwarf explorer with dark earth-toned skin, carrying a glowing crystal lantern, wearing a reinforced mining helmet with a headlamp, leather map case on his belt, cave crystals and geological formations in the background'
  },
  {
    id: 'gamma',
    name: 'Battlehammer Ironshield',
    role: 'Combat Systems',
    desc: 'A fierce muscular dwarf warrior with a fiery red beard in war braids, wearing steam-powered mechanical arm armor, carrying a massive warhammer with gears embedded in the head, sparks flying, battle-scarred shield on his back'
  },
  {
    id: 'delta',
    name: 'Gearwright Steamforge',
    role: 'Technology & Tools',
    desc: 'A clever tinkerer dwarf with wild copper-colored hair, wearing multi-lensed goggles, mechanical prosthetic hand with articulated brass fingers, surrounded by clockwork mechanisms, gears, and steam valves, oil-stained leather vest'
  },
  {
    id: 'epsilon',
    name: 'Lorekeeper Runebeard',
    role: 'Narrative & Lore',
    desc: 'An ancient scholarly female dwarf with long flowing white hair braided with glowing rune beads, wearing ornate robes with embroidered mine symbols, holding an open leather-bound tome that emanates magical light, quill tucked behind her ear, wise and piercing eyes, intricate runic tattoos along her jawline'
  },
  {
    id: 'zeta',
    name: 'Echoheart Bellowsong',
    role: 'Audio & Atmosphere',
    desc: 'A charismatic dwarf bard with a warm smile, holding a steampunk mechanical hurdy-gurdy with brass pipes and bellows, wearing a fine velvet vest with sound-wave engravings, musical notes made of steam floating in the air'
  },
  {
    id: 'eta',
    name: 'Brightforge Crystalsmith',
    role: 'Visual & UI',
    desc: 'An artistic dwarf with vibrant purple-streaked hair, wearing a crystal monocle that refracts rainbow light, paint-stained hands holding a glowing crystal palette, surrounded by floating holographic UI wireframes made of light, steampunk easel'
  },
  {
    id: 'theta',
    name: 'Brewmaster Alehart',
    role: 'The Tavern Keeper',
    desc: 'A jovial rotund dwarf with a magnificent golden-brown beard with foam flecks, wearing a stained apron over fine clothes, holding an enormous steaming copper stein, surrounded by brass brewing apparatus, kegs, and a warm tavern glow'
  },
  {
    id: 'dev_master',
    name: 'DevMaster',
    role: 'Project Overseer',
    desc: 'An imposing dwarf foreman with a dark iron crown, piercing glowing blue eyes, wearing a long dark coat with brass buttons and gear epaulets, holding a master control panel with levers and gauges, overlooking a vast underground mine operation from a command platform'
  }
];

const BASE_PROMPT = `Steampunk fantasy portrait of a dwarven character, digital painting style, warm copper and amber lighting, dark underground mine background with steam and glowing crystals, highly detailed, painterly style with rich textures, portrait composition from chest up, dramatic lighting from forge-fire below. Character: `;

async function generatePortrait(agent) {
  console.log(`Generating portrait for ${agent.name} (${agent.id})...`);
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1.5',
      prompt: BASE_PROMPT + agent.desc,
      n: 1,
      size: '1024x1024',
      quality: 'medium'
    });

    const imageData = response.data[0].b64_json;
    const outputPath = path.join(OUTPUT_DIR, `${agent.id}.png`);
    fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
    console.log(`  ✓ Saved ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`  ✗ Failed for ${agent.name}:`, err.message);
    return false;
  }
}

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Optional CLI filter: node generate-portraits.mjs epsilon
  const filterId = process.argv[2];
  const targets = filterId
    ? agents.filter(a => a.id === filterId)
    : agents;

  if (filterId && targets.length === 0) {
    console.error(`No agent found with id "${filterId}". Available: ${agents.map(a => a.id).join(', ')}`);
    process.exit(1);
  }

  console.log(`\nGenerating ${targets.length} steampunk dwarf portrait(s)...\n`);

  let success = 0;
  // Generate sequentially to respect rate limits
  for (const agent of targets) {
    const ok = await generatePortrait(agent);
    if (ok) success++;
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone: ${success}/${targets.length} portraits generated.`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main();
