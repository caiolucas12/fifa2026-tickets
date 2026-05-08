const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

// GET /api/standings
// Retorna a classificação por grupo, calculada a partir de matches finalizados.
//
// Pontuação: vitória = 3, empate = 1, derrota = 0
// Ordenação: pontos DESC → saldo DESC → gols pró DESC → nome ASC (pt-BR)
router.get('/', async (req, res) => {
  try {
    // Buscar todos os teams em grupos (exclui Italy legacy com group_name=NULL)
    const teamsResult = await query(`
      SELECT id, name, code, flag, group_name
      FROM teams
      WHERE group_name IS NOT NULL
      ORDER BY group_name, name
    `);

    // Buscar matches finalizados com placar
    const matchesResult = await query(`
      SELECT id, home_team_id, away_team_id, group_name, home_score, away_score
      FROM matches
      WHERE status = 'finished'
        AND home_score IS NOT NULL
        AND away_score IS NOT NULL
        AND group_name IS NOT NULL
    `);

    const teams = teamsResult.recordset;
    const matches = matchesResult.recordset;

    // Inicializa stats por team
    const teamStats = new Map();
    for (const t of teams) {
      teamStats.set(t.id, {
        team_id: t.id,
        team_name: t.name,
        team_code: t.code,
        team_flag: t.flag,
        group_name: t.group_name,
        played: 0, won: 0, drawn: 0, lost: 0,
        gf: 0, ga: 0, gd: 0, points: 0,
      });
    }

    // Aplica resultados
    for (const m of matches) {
      const home = teamStats.get(m.home_team_id);
      const away = teamStats.get(m.away_team_id);
      if (!home || !away) continue; // skip se algum team não está em grupo

      home.played++;
      away.played++;
      home.gf += m.home_score;
      home.ga += m.away_score;
      away.gf += m.away_score;
      away.ga += m.home_score;

      if (m.home_score > m.away_score) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (m.home_score < m.away_score) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        home.points += 1;
        away.drawn++;
        away.points += 1;
      }
    }

    // Calcula saldo de gols
    for (const s of teamStats.values()) {
      s.gd = s.gf - s.ga;
    }

    // Agrupa por group_name
    const standings = {};
    for (const s of teamStats.values()) {
      if (!standings[s.group_name]) standings[s.group_name] = [];
      standings[s.group_name].push(s);
    }

    // Ordena cada grupo
    for (const g of Object.keys(standings)) {
      standings[g].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.team_name.localeCompare(b.team_name, 'pt-BR');
      });
      // Remove group_name de cada entry (já é a chave do dict)
      standings[g] = standings[g].map(({ group_name, ...rest }) => rest);
    }

    res.json({ standings });
  } catch (err) {
    console.error('Erro ao calcular tabela:', err);
    res.status(500).json({ error: 'Erro ao calcular tabela' });
  }
});

module.exports = router;
