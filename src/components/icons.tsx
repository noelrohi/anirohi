import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  GearIcon,
  GitHubLogoIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PaperPlaneIcon,
  PlayIcon,
  SunIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

export const Icons = {
  gitHub: GitHubLogoIcon,
  user: (props: IconProps) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
      />
    </svg>
  ),
  dashboard: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="currentColor"
          d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Zm2-10h4V5H5v6Zm10 8h4v-6h-4v6Zm0-12h4V5h-4v2ZM5 19h4v-2H5v2Zm4-8Zm6-4Zm0 6Zm-6 4Z"
        />
      </svg>
    );
  },
  settings: GearIcon,
  logout: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="currentColor"
          d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z"
        />
      </svg>
    );
  },
  search: MagnifyingGlassIcon,
  close: (props: IconProps) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
      />
    </svg>
  ),
  logo: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g fill="currentColor">
          <path
            fillRule="evenodd"
            d="M22 16v-4c0-2.828 0-4.243-.879-5.121c-.825-.826-2.123-.876-4.621-.879v16c2.498-.003 3.796-.053 4.621-.879c.879-.878.879-2.293.879-5.12Zm-3-5a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm0 4a1 1 0 1 1 0 2a1 1 0 0 1 0-2Z"
            clipRule="evenodd"
          />
          <path d="M15.57 3.488L13.415 6H15v16H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16.001v-4c0-2.83 0-4.244.879-5.122C3.757 6 5.172 6 8 6h2.584L8.43 3.488a.75.75 0 0 1 1.138-.976L12 5.348l2.43-2.836a.75.75 0 0 1 1.14.976Z" />
        </g>
      </svg>
    );
  },
  sun: SunIcon,
  moon: MoonIcon,
  play: PlayIcon,
  left: ArrowLeftIcon,
  right: ArrowRightIcon,
  check: CheckIcon,
  anilist: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="currentColor"
          d="M6.361 2.943L0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422c-.71 0-1.101.392-1.101 1.102v1.064l-.758-2.166zm2.324 5.948l1.688 5.018H7.144z"
        />
      </svg>
    );
  },
  loader: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6V3m-6 9H3m4.75-4.25L5.6 5.6"
        />
      </svg>
    );
  },
  goBack: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="m2.87 7.75l1.97 1.97a.75.75 0 1 1-1.06 1.06L.53 7.53L0 7l.53-.53l3.25-3.25a.75.75 0 0 1 1.06 1.06L2.87 6.25h9.88a3.25 3.25 0 0 1 0 6.5h-2a.75.75 0 0 1 0-1.5h2a1.75 1.75 0 1 0 0-3.5H2.87Z"
          clipRule="evenodd"
        />
      </svg>
    );
  },
  view: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="16" cy="16" r="4" fill="currentColor" />
        <path
          fill="currentColor"
          d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68ZM16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5Z"
        />
      </svg>
    );
  },
  television: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="currentColor"
          d="M21 17H3V5h18m0-2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5v2h8v-2h5a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
        />
      </svg>
    );
  },
  calendar: CalendarIcon,
  hourglass: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 15 15"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M12 1h2V0H1v1h2v3.672a2.5 2.5 0 0 0 .732 1.767l.707.707a.5.5 0 0 1 0 .708l-1 1A1.5 1.5 0 0 0 3 9.914V14H1v1h13v-1h-2V9.914a1.5 1.5 0 0 0-.44-1.06l-1-1a.5.5 0 0 1 0-.708l1-1a1.5 1.5 0 0 0 .44-1.06V1ZM4.25 5.5h6.543l.06-.06A.5.5 0 0 0 11 5.085V1H4v3.672c0 .296.088.584.25.828Z"
          clipRule="evenodd"
        />
      </svg>
    );
  },
  percentage: (props: IconProps) => {
    return (
      <svg
        width="0.75em"
        height="1em"
        viewBox="0 0 384 512"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fill="currentColor"
          d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128a64 64 0 1 0-128 0a64 64 0 1 0 128 0zm256 256a64 64 0 1 0-128 0a64 64 0 1 0 128 0z"
        />
      </svg>
    );
  },
  division: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        >
          <circle cx="24" cy="11" r="5" />
          <circle cx="24" cy="37" r="5" />
          <path d="M44 24H4" />
        </g>
      </svg>
    );
  },
  play2: (props: IconProps) => {
    return (
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path fill="currentColor" d="M8 5.14v14l11-7l-11-7Z" />
      </svg>
    );
  },
  send: PaperPlaneIcon,
  arrow: ArrowDownIcon,
  trash: TrashIcon,
  bell: BellIcon,
};
