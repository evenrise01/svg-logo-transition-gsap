//To reuse this component for some other logo:
//Replace the path data by exporting the path data from a design tool (figma) as an svg
//Open it in a code editor and copy the data attribute and paste the path here
//Recommended to Export the icon in 125px x 125px and canvas centered

import { forwardRef } from "react";

const Signature = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function Signature(props, ref, strokeColor = '#e3e4d8') {
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 279 187" fill="none" {...props}>
        <path
          d="M104.451 100.545C109.016 96.249 113.581 91.9527 127.882 74.9707C142.183 57.9886 166.081 28.4512 177.856 13.5034C189.63 -1.44435 188.556 -0.907307 183.169 6.08242C177.783 13.0721 168.116 26.4983 146.756 52.6141C125.396 78.73 92.6365 117.129 72.538 141.878C52.4395 166.626 45.9949 176.562 42.2722 182.083C38.5495 187.604 37.744 188.409 51.8292 169.088C65.9144 149.766 94.9148 110.294 104.484 98.149C107.204 94.6974 91.4403 120.872 92.368 121.03C94.5969 121.412 98.3975 115.013 106.787 107.425C115.176 99.8375 127.528 89.3651 132.146 86.5212C134.295 85.1978 129.408 94.8413 131.552 92.9739C134.267 90.6089 139.066 84.1248 148.542 74.9015C158.018 65.6782 171.712 53.5946 166.415 66.3006C161.118 79.0066 136.414 116.868 123.15 138.655C109.887 160.442 108.813 165.007 134.709 142.52C160.605 120.034 213.504 70.357 242.635 43.5576C271.765 16.7582 275.525 14.3415 276.924 12.9623C278.324 11.5831 277.25 11.3145 231.45 24.4681C185.651 37.6216 95.159 64.2053 1.11096 91.5947"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            strokeDashoffset: 0,
            strokeDasharray: 1227
          }}
        />
      </svg>
    );
  }
);

export default Signature;