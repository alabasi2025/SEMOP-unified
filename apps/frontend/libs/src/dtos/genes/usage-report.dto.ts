
export class UsageReportDto {
  totalGenes: number;

  activeGenes: number;

  inactiveGenes: number;

  genesBySector: Record<string, number>;
}
