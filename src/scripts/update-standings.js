import fs from 'node:fs';
import path from 'node:path';

async function update() {
  const API_KEY = process.env.API_KEY;
  const URL = 'https://api.football-data.org/v4/competitions/PL/standings';

  try {
    const response = await fetch(URL, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const data = await response.json();

    // 必要なデータだけ抽出（前回のモックデータと同じ形式にする）
    const standings = data.standings[0].table.map(item => ({
      rank: item.position,
      name: item.team.name,
      shortname: item.team.shortname,
      logo: item.team.crest,
      played: item.playedGames,
      wins: item.won,
      draws: item.draw,
      losses: item.lost,
      points: item.points
    }));

    // ファイルを保存
    const filePath = path.join(process.cwd(), 'src/data/standings.json');
    fs.writeFileSync(filePath, JSON.stringify(standings, null, 2));
    
    console.log('Successfully updated standings.json');
  } catch (error) {
    console.error('Failed to update data:', error);
    process.exit(1);
  }
}

update();
