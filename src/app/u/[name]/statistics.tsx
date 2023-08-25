import { Icons } from "@/components/icons";
import { getStats } from "@/lib/anilist";
import { GeneralStats } from "@/types/anilist/general-stats";
import { ListStats } from "@/types/anilist/list-stats";
import { AreaChart } from "@tremor/react";

interface Props {
  username: string;
}
export async function AreaChartYear({ username }: Props) {
  const { data: anilistData }: ListStats = await getStats(username, "lists");
  const yearData = {
    watchYear: anilistData?.User.statistics.anime.startYears
      .reverse()
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
  return (
    <>
      {yearData.watchYear && (
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Watch Year</h2>
          <AreaChart
            className="mt-6"
            data={yearData.watchYear}
            index="year"
            categories={["Hours Watched", "Mean Score", "Titles Watched"]}
            colors={["emerald", "gray", "blue"]}
            yAxisWidth={40}
          />
        </div>
      )}
      {yearData.releaseYear && (
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Release Year
          </h2>
          <AreaChart
            className="mt-6"
            data={yearData.releaseYear}
            index="year"
            categories={["Hours Watched", "Mean Score", "Titles Watched"]}
            colors={["emerald", "gray", "blue"]}
            yAxisWidth={40}
          />
        </div>
      )}
    </>
  );
}

export async function GeneralStats({ username }: Props) {
  const data: GeneralStats = await getStats(username, "general");

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">General Stats</h2>
    </>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: keyof typeof Icons;
}) {
  const IconComponent = Icons[icon];
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <IconComponent className="h-20 w-20" />
      <div className="flex flex-col gap-2">
        <div className="font-bold text-md">{title}</div>
        <div>{value}</div>
      </div>
    </div>
  );
}
