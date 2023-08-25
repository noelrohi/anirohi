import React from "react";

interface DashboardPageProps {
  params: {
    name: string;
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  return <main className="container">DashboardPage = {params.name}</main>;
}
