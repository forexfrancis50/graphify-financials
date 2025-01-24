import { Card } from "@/components/ui/card";

interface ResultsProps {
  projections: Array<{
    targetEV: number;
    acquirerEV: number;
    combinedRevenue: number;
    combinedEBITDA: number;
    combinedNetIncome: number;
    totalConsideration: number;
    newShares: number;
    proFormaShares: number;
    targetEPS: number;
    acquirerEPS: number;
    proFormaEPS: number;
    accretionDilution: number;
  }>;
}

export function Results({ projections }: ResultsProps) {
  if (projections.length === 0) {
    return (
      <div className="text-center p-12 text-gray-500">
        Enter inputs and calculate to see M&A analysis
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Deal Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Target EV</p>
            <p className="text-lg font-semibold">
              ${projections[0].targetEV.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Acquirer EV</p>
            <p className="text-lg font-semibold">
              ${projections[0].acquirerEV.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Consideration</p>
            <p className="text-lg font-semibold">
              ${projections[0].totalConsideration.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">New Shares Issued</p>
            <p className="text-lg font-semibold">
              {projections[0].newShares.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pro Forma Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Combined Revenue</p>
            <p className="text-lg font-semibold">
              ${projections[0].combinedRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Combined EBITDA</p>
            <p className="text-lg font-semibold">
              ${projections[0].combinedEBITDA.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Combined Net Income</p>
            <p className="text-lg font-semibold">
              ${projections[0].combinedNetIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Accretion/Dilution Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Target EPS</p>
            <p className="text-lg font-semibold">
              ${projections[0].targetEPS.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Acquirer EPS</p>
            <p className="text-lg font-semibold">
              ${projections[0].acquirerEPS.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pro Forma EPS</p>
            <p className="text-lg font-semibold">
              ${projections[0].proFormaEPS.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Accretion/(Dilution)</p>
            <p
              className={`text-lg font-semibold ${
                projections[0].accretionDilution >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {projections[0].accretionDilution.toFixed(2)}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}