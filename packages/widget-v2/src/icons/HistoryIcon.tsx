type IconProps = {
  color?: string;
};

export const HistoryIcon = ({
  color = "currentColor",
  ...props
}: IconProps & React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.10134 0.511659C5.13657 0.540327 2.7685 3.00041 2.7685 5.96584V8.51992C2.7685 8.90927 2.29781 9.10394 2.02247 8.8286L0.92977 7.73589L0.222412 8.44325L3.26918 11.4893L6.31461 8.44392L5.60726 7.73656L4.51455 8.82926C4.23921 9.10461 3.76853 8.90927 3.76853 8.52059V5.96317C3.76853 3.55642 5.67992 1.54836 8.086 1.51169C10.5354 1.47436 12.5395 3.45575 12.5395 5.8965C12.5395 8.33725 10.5721 10.282 8.154 10.282V11.282C11.1234 11.282 13.5395 8.86593 13.5395 5.8965C13.5395 2.92707 11.0948 0.482324 8.10067 0.510992"
      fill={color}
    />
    <path
      d="M9.46906 8.01673L7.62567 6.17334V2.53589H8.6257V3.56659C8.6257 4.97063 9.18305 6.31668 10.1758 7.30938L9.4684 8.01673H9.46906Z"
      fill={color}
    />
  </svg>
);
