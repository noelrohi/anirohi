import { Close } from "@radix-ui/react-dialog";
import {
  GitHubLogoIcon,
  GearIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  PlayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

export const Icons = {
  gitHub: GitHubLogoIcon,
  user: function (props: IconProps) {
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
          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
        ></path>
      </svg>
    );
  },
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
        ></path>
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
        ></path>
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
      ></path>
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
          ></path>
          <path d="M15.57 3.488L13.415 6H15v16H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16.001v-4c0-2.83 0-4.244.879-5.122C3.757 6 5.172 6 8 6h2.584L8.43 3.488a.75.75 0 0 1 1.138-.976L12 5.348l2.43-2.836a.75.75 0 0 1 1.14.976Z"></path>
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
        ></path>
      </svg>
    );
  },
};
