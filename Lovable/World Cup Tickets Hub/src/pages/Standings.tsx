import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trophy, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TeamFlag } from '@/components/TeamFlag';
import api, { type StandingRow } from '@/lib/api';

const Standings: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['standings'],
    queryFn: () => api.getStandings(),
  });

  useEffect(() => {
    if (isError) toast.error('Não foi possível carregar a tabela. Tente recarregar.');
  }, [isError]);

  const standings = data?.data?.standings || {};
  const groups = Object.keys(standings).sort();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header — pattern Groups.tsx */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Classificação por grupo</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl mb-4">
            <span className="gold-text">Tabela</span> da Copa 2026
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Os 2 primeiros de cada grupo avançam às oitavas. Atualizada conforme partidas são encerradas.
          </p>
        </div>

        {/* Grid de cards por grupo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)
            : groups.map((g) => (
                <Card
                  key={g}
                  className="rounded-2xl bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                  <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-display text-xl text-primary">{g}</span>
                      </div>
                      <CardTitle className="font-display text-lg">Grupo {g}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8 text-center">#</TableHead>
                          <TableHead>Seleção</TableHead>
                          <TableHead className="text-center w-8">J</TableHead>
                          <TableHead className="text-center w-8">V</TableHead>
                          <TableHead className="text-center w-8">E</TableHead>
                          <TableHead className="text-center w-8">D</TableHead>
                          <TableHead className="text-center w-10">GP</TableHead>
                          <TableHead className="text-center w-10">GC</TableHead>
                          <TableHead className="text-center w-10">SG</TableHead>
                          <TableHead className="text-center w-10 font-bold">P</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {standings[g].map((row: StandingRow, idx) => (
                          <TableRow
                            key={row.team_id}
                            className={idx < 2 ? 'bg-primary/5' : ''}
                          >
                            <TableCell className="text-center font-medium">
                              <div className="flex items-center justify-center gap-1">
                                {idx < 2 && <Trophy className="w-3 h-3 text-gold" />}
                                {idx + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <TeamFlag flag={row.team_flag} name={row.team_name} size="sm" />
                                <span className="text-sm font-medium">{row.team_code}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-sm">{row.played}</TableCell>
                            <TableCell className="text-center text-sm">{row.won}</TableCell>
                            <TableCell className="text-center text-sm">{row.drawn}</TableCell>
                            <TableCell className="text-center text-sm">{row.lost}</TableCell>
                            <TableCell className="text-center text-sm">{row.gf}</TableCell>
                            <TableCell className="text-center text-sm">{row.ga}</TableCell>
                            <TableCell className="text-center text-sm">
                              {row.gd >= 0 ? `+${row.gd}` : row.gd}
                            </TableCell>
                            <TableCell className="text-center font-bold">{row.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Legenda */}
        <div className="mt-8 p-6 rounded-xl glass-card text-center text-sm text-muted-foreground">
          <strong className="text-foreground">Legenda:</strong> J = Jogos · V = Vitórias · E = Empates · D = Derrotas · GP = Gols Pró · GC = Gols Contra · SG = Saldo de Gols · P = Pontos
        </div>
      </div>
    </div>
  );
};

export default Standings;
