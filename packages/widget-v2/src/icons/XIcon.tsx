type IconProps = {
  color?: string;
};

export const XIcon = ({ color = 'gray' }: IconProps) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.29234 0.740229L8.27336 0.721238L5.83563 3.15897C5.31942 3.67517 4.4821 3.67517 3.96589 3.15897L1.52643 0.719513L0.61056 1.63539L0.591572 1.65524L3.0293 4.09297C3.54551 4.60918 3.54551 5.4465 3.0293 5.9627L0.589844 8.40216L1.50572 9.31804L1.52471 9.33616L3.96244 6.89843C4.47865 6.38223 5.31597 6.38223 5.83217 6.89843L8.27163 9.33789L9.1875 8.42201L9.20649 8.40216L6.76877 5.96443C6.25256 5.44823 6.25256 4.6109 6.76877 4.0947L9.20822 1.65524L8.29234 0.739367V0.740229Z"
      fill={color}
    />
  </svg>
);