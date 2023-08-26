import { Icons } from "@/components/icons";
import { getStats } from "@/lib/anilist";
import { GeneralStats } from "@/types/anilist/general-stats";
import { ListStats } from "@/types/anilist/list-stats";
import {
  AreaChart,
  BarList,
  Card,
  DonutChart,
  DonutChartProps,
  Subtitle,
  Title,
} from "@tremor/react";

interface Props {
  username: string;
}

const colors: DonutChartProps["colors"] = [
  "slate",
  "violet",
  "emerald",
  "rose",
  "cyan",
  "amber",
  "blue",
];

export async function Charts({ username }: Props) {
  const { data: anilistData }: ListStats = await getStats(username, "lists");
  const yearData = {
    watchYear: anilistData?.User.statistics.anime.startYears
      .sort((a, b) => a.startYear - b.startYear)
      .map(({ startYear, count, meanScore, minutesWatched }) => ({
        year: startYear,
        "Hours Watched": minutesWatched / 60,
        "Mean Score": meanScore,
        "Titles Watched": count,
      })),
    releaseYear: anilistData?.User.statistics.anime.releaseYears
      .reverse()
      .map(({ releaseYear, count, meanScore, minutesWatched }) => ({
        year: releaseYear,
        "Hours Watched": minutesWatched / 60,
        "Mean Score": meanScore,
        "Titles Watched": count,
      })),
  };
  const distribution = {
    format: anilistData.User.statistics.anime.formats.map((f, i) => ({
      name: f.format,
      value: f.count,
    })),
    status: anilistData.User.statistics.anime.statuses.map((f, i) => ({
      name: f.status,
      value: f.count,
    })),
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {yearData.watchYear && (
          <Card>
            <Title>Watch Year</Title>
            <AreaChart
              className="mt-6"
              data={yearData.watchYear}
              index="year"
              categories={["Hours Watched", "Mean Score", "Titles Watched"]}
              colors={["emerald", "gray", "blue"]}
              yAxisWidth={40}
            />
          </Card>
        )}
        {yearData.releaseYear && (
          <Card>
            <Title>Release Year</Title>
            <AreaChart
              className="mt-6"
              data={yearData.releaseYear}
              index="year"
              categories={["Hours Watched", "Mean Score", "Titles Watched"]}
              colors={["emerald", "gray", "blue"]}
              yAxisWidth={40}
            />
          </Card>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Title>Format Distribution</Title>
          <DonutChart
            className="mt-6"
            data={distribution.format}
            category="value"
            index="name"
            variant="donut"
            colors={colors}
          />
          <BarList data={distribution.format} className="mt-2" />
        </Card>
        <Card>
          <Title>Status Distribution</Title>
          <DonutChart
            className="mt-6"
            data={distribution.status}
            category="value"
            index="name"
            variant="donut"
            colors={colors}
          />
          <BarList data={distribution.status} className="mt-2" />
        </Card>
      </div>
    </>
  );
}

interface CardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Icons;
}

export async function GeneralStats({ username }: Props) {
  const data: GeneralStats = await getStats(username, "general");
  const animeStat = data.data.User.statistics.anime;

  const stats: CardProps[] = [
    {
      icon: "television",
      title: "Total Anime",
      value: animeStat.count,
    },
    {
      icon: "play2",
      title: "Episodes Watched",
      value: animeStat.episodesWatched,
    },
    {
      icon: "hourglass",
      title: "Hours Watched",
      value: Intl.NumberFormat("en-US").format(animeStat.minutesWatched / 60),
    },
    {
      icon: "percentage",
      title: "Mean Score",
      value: animeStat.meanScore,
    },
    {
      icon: "division",
      title: "Standard Deviation",
      value: animeStat.standardDeviation,
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">General Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard {...stat} key={index} />
        ))}
      </div>
    </>
  );
}

function StatCard({ title, value, icon }: CardProps) {
  const IconComponent = Icons[icon];
  return (
    <Card className="max-w-lg">
      <div className="flex items-center justify-around">
        <IconComponent className="w-6 h-6 mr-2" />
        <div className="flex flex-col">
          <Title>{title}</Title>
          <Subtitle>{value}</Subtitle>
        </div>
      </div>
    </Card>
  );
}
