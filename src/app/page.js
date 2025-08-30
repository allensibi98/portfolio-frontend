import PortfolioTable from "../components/PortFolioTable";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Dynamic Portfolio Dashboard
        </h1>
        <PortfolioTable />
      </div>
    </main>
  );
}