import React from 'react';
import { Activity } from 'lucide-react';

interface ClinicalExpectationsProps {
  data: {
    procedureTime: string;
    downtime: string;
    comfortLevel: string;
    recommendedSessions: string;
    anesthesia?: string;
    longevity?: string;
  };
}

function HourglassIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17.122 24.983"
      className="w-[17px] h-[25px] lg:w-[26px] lg:h-[38px] shrink-0"
    >
      <path
        className="hourglass"
        fill="none"
        stroke="#d30100"
        strokeLinejoin="round"
        d="M0 .5h17.122M15.076 24.483v-6.09c0-2.616-2.822-4.871-4.694-5.9 1.872-1.031 4.694-3.286 4.694-5.9V.5M2.077.5v6.09c0 2.616 2.822 4.871 4.694 5.9-1.872 1.031-4.694 3.286-4.694 5.9v6.09M0 24.483h17.122M10.966 7.926a8.585 8.585 0 01-2.409 1.95 8.615 8.615 0 01-2.4-1.948M8.561 14.202v1.544M4.814 22.292a3.75 3.75 0 017.493 0"
      />
    </svg>
  );
}

function RecoveryTreadmillIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 27.46 23.169"
      className="w-[27px] h-[23px] lg:w-[40px] lg:h-[34px] shrink-0"
    >
      <path
        className="treadmill"
        fill="#d30100"
        d="M23.43 23.169H1.943a1.942 1.942 0 110-3.885h10.638a1.3 1.3 0 01-.175-.665l.026-3.47-3.852-1.987.334-.648 3.86 1.992a.7.7 0 01.387.628l-.027 3.491a.578.578 0 00.576.583.581.581 0 00.579-.575l.033-4.245a.736.736 0 00-.32-.614l-.013-.009-3.538-2.657 2.529-4.933a.565.565 0 00-.229-.754l-1.73-.965a.579.579 0 00-.253-.046l-4.123.2a1.335 1.335 0 00-1.007.537L3.922 7.461a.445.445 0 00.714.531l1.59-2.137a.909.909 0 01.683-.367l2.273-.127.041.727-2.273.128a.186.186 0 00-.139.075L5.22 8.427a1.175 1.175 0 01-1.641.241 1.173 1.173 0 01-.24-1.641l1.719-2.311a2.06 2.06 0 011.555-.831l4.123-.2a1.3 1.3 0 01.605.118l.025.013 1.744.972a1.29 1.29 0 01.522 1.723L11.383 10.9l3.041 2.284a1.465 1.465 0 01.629 1.216l-.033 4.245a1.3 1.3 0 01-.174.642A2.971 2.971 0 0017 18.2a3.7 3.7 0 011.85-1.212l.44-.125 2.061-7.123.7.2-1.934 6.684 1.964-.56a1.656 1.656 0 01.584-.064L24.7 9.073a3.069 3.069 0 01-1.484.379h-3.858a.978.978 0 01-.977-.977 2.011 2.011 0 012.009-2.011h1.7a2.343 2.343 0 001.668-.691l1.04-1.04a1.559 1.559 0 012.2 2.2L25.69 8.252h.006l-2.336 7.969.012.007a1.636 1.636 0 01.769 1.049l.9 3.87a1.649 1.649 0 01-1.607 2.022zM.729 21.228a1.215 1.215 0 001.214 1.214h21.488a.922.922 0 00.9-1.128l-.3-1.287h-5.286V19.3h5.116l-.429-1.855a.921.921 0 00-1.149-.679l-3.23.921a2.963 2.963 0 00-1.486.975 3.7 3.7 0 01-2.867 1.352H1.943a1.215 1.215 0 00-1.214 1.214zM20.391 7.192a1.282 1.282 0 00-1.28 1.28.249.249 0 00.249.249h3.855a2.345 2.345 0 001.668-.691l1.608-1.61a.83.83 0 00-1.175-1.174l-1.04 1.04a3.069 3.069 0 01-2.183.9h-1.7zM3.428 17.229a1.307 1.307 0 01.46-2.371l3.26-.664.752-1.808.673.279-.791 1.908a.525.525 0 01-.383.313l-3.364.686a.58.58 0 00.231 1.135l3.366-.686a1.686 1.686 0 001.219-1l.231-.557.673.279-.231.557a2.413 2.413 0 01-1.746 1.438l-3.367.686a1.3 1.3 0 01-.263.026 1.3 1.3 0 01-.72-.221zm3.827-3.058zm9.553-3.635a1.178 1.178 0 01-.327-.047l-3.325-.969.2-.7 3.325.97a.441.441 0 00.4-.075.444.444 0 00-.147-.778l-2.722-.8a.965.965 0 01-.628-.564l.674-.277a.238.238 0 00.157.141l2.723.8a1.173 1.173 0 01-.33 2.3zM11.4 2.106a2.106 2.106 0 112.107 2.106A2.109 2.109 0 0111.4 2.106zm.729 0A1.378 1.378 0 1013.511.728a1.38 1.38 0 00-1.378 1.378z"
      />
      <path
        className="treadmill"
        fill="#d30100"
        d="M8.595 13.17a2.935 2.935 0 01-1.433-3.89l1.711-3.707.661.305-1.711 3.707a2.206 2.206 0 001.081 2.923l-.305.661z"
      />
    </svg>
  );
}

function FollowUpCalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 27.936 25.627"
      className="w-[28px] h-[25px] lg:w-[40px] lg:h-[36px] shrink-0"
    >
      <path
        d="M0 18.089a7.454 7.454 0 017.352-7.537 7.54 7.54 0 010 15.075A7.455 7.455 0 010 18.089zm.98 0a6.46 6.46 0 006.371 6.532 6.534 6.534 0 000-13.065A6.462 6.462 0 00.98 18.089zm14.213 4.02V21.1h10.293a1.491 1.491 0 001.47-1.508V5.025h-3.431V4.02h3.431v-.5a1.49 1.49 0 00-1.47-1.506h-.98v1h-.98V0h.98v1h.98a2.485 2.485 0 012.451 2.512V19.6a2.485 2.485 0 01-2.451 2.513zM6.862 18.3v-5.737h.98v5.319l3.089 3.166-.694.711zm8.822.8v-1.011h2.941v-4.522h-3.432v-1h3.431V8.04h-4.411v3.517h-.98V8.04H8.822v1.508h-.98V7.035H25v12.06zm8.332-1.005v-4.528H19.6v4.523zm0-5.527V8.04H19.6v4.523zM4.9 9.547V3.516A2.485 2.485 0 017.352 1v1.01a1.49 1.49 0 00-1.47 1.506v.5h14.7v1.009H5.881v4.522zm16.665-4.522V4.02h.98v1.005zM8.332 3.015V0h.98v1h13.233v1.01H9.312v1z"
        fill="#d30100"
      />
    </svg>
  );
}

function ComfortFeatherIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-[24px] h-[24px] lg:w-[36px] lg:h-[36px] shrink-0"
      fill="none"
      stroke="#d30100"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

export default function ClinicalExpectations({ data }: ClinicalExpectationsProps) {
  return (
    <div
      id="clinical-expectations"
      className="max-w-5xl lg:max-w-6xl mx-auto w-full relative"
    >
      <div id="at-a-glance" className="intersect relative">
        <div className="flex items-center justify-between pb-3 mb-6 lg:mb-8 gap-4">
          <h3 className="text-xs lg:text-sm font-black tracking-widest uppercase text-silver-950 flex items-center space-x-2">
            <Activity className="h-4 w-4 lg:h-5 lg:w-5 text-[#D40000]" />
            <span>Clinical Expectations</span>
          </h3>

          <svg
            className="glance intersect w-36 sm:w-48 lg:w-60 h-auto shrink-0 pointer-events-none select-none"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 445.481 110.855"
          >
            <clipPath id="clip-path-glance">
              <path
                fill="#000"
                d="M445.481,0C434.517,5.806,423.4,10.771,412.237,15.444c-57.254,23.606-116.016,37.744-175.016,40.8-3.155.169-7.661.313-10.8.4-3.325.095-7.454.036-10.758.376a17.946,17.946,0,0,0-4.167.815,2.706,2.706,0,0,0-1.169.716c-.02.028-.016.036,0-.016a.746.746,0,0,0,.025-.235c-.005-.07-.014-.078,0-.047a4.756,4.756,0,0,0,1.2,1.423,28.242,28.242,0,0,0,3.876,2.716c9.488,5.554,19.261,9.7,28.761,15.237a57.379,57.379,0,0,1,10.06,7.015,17.138,17.138,0,0,1,1.9,2.073,7.985,7.985,0,0,1,1.754,5.7c-.544,5.165-6.449,6.774-9.047,7.59a85.714,85.714,0,0,1-17.3,2.41c-20.157,1.012-40.327-.2-60.47-1.227-34.509-1.886-69.01-4.627-103.541-4.791-14.375.018-28.78.317-43.091,2.709-5.707,1.041-11.439,2.311-16.944,5.086A23.346,23.346,0,0,0,3.5,106.765a13.743,13.743,0,0,0-3.5,4.09,14.109,14.109,0,0,1,3.471-4.183c3.886-3.17,8.166-4.714,12.4-6.048A109.108,109.108,0,0,1,33.02,97.194c34.481-3.9,69.086-1.558,103.6-.052,30.394,1.309,64.709,4.213,94.888,2.74a85.021,85.021,0,0,0,17.088-2.419,23.239,23.239,0,0,0,4.108-1.552,11.03,11.03,0,0,0,1.9-1.2c1.972-1.574,2.49-3.494.575-5.974a20.5,20.5,0,0,0-3.569-3.438c-7.828-5.867-16.168-9.633-24.35-13.927a143,143,0,0,1-14.382-8.007,21.054,21.054,0,0,1-2.019-1.567c-.9-.822-2.385-2.255-1.824-4.331a3.109,3.109,0,0,1,2.149-1.951,18.2,18.2,0,0,1,4.4-.818c4.335-.345,8.661-.174,12.977-.337C278.888,53.111,329.1,43.423,378.447,27.214,401,19.679,423.463,11.066,445.481,0"
              />
            </clipPath>
            <path
              clipPath="url(#clip-path-glance)"
              className="squiggle"
              fill="none"
              stroke="#D40000"
              strokeMiterlimit="10"
              strokeWidth="18"
              d="M445.481,0C434.517,5.806,423.4,10.771,412.237,15.444c-57.254,23.606-116.016,37.744-175.016,40.8-3.155.169-7.661.313-10.8.4-3.325.095-7.454.036-10.758.376a17.946,17.946,0,0,0-4.167.815,2.706,2.706,0,0,0-1.169.716c-.02.028-.016.036,0-.016a.746.746,0,0,0,.025-.235c-.005-.07-.014-.078,0-.047a4.756,4.756,0,0,0,1.2,1.423,28.242,28.242,0,0,0,3.876,2.716c9.488,5.554,19.261,9.7,28.761,15.237a57.379,57.379,0,0,1,10.06,7.015,17.138,17.138,0,0,1,1.9,2.073,7.985,7.985,0,0,1,1.754,5.7c-.544,5.165-6.449,6.774-9.047,7.59a85.714,85.714,0,0,1-17.3,2.41c-20.157,1.012-40.327-.2-60.47-1.227-34.509-1.886-69.01-4.627-103.541-4.791-14.375.018-28.78.317-43.091,2.709-5.707,1.041-11.439,2.311-16.944,5.086A23.346,23.346,0,0,0,3.5,106.765a13.743,13.743,0,0,0-3.5,4.09,14.109,14.109,0,0,1,3.471-4.183c3.886-3.17,8.166-4.714,12.4-6.048A109.108,109.108,0,0,1,33.02,97.194c34.481-3.9,69.086-1.558,103.6-.052,30.394,1.309,64.709,4.213,94.888,2.74a85.021,85.021,0,0,0,17.088-2.419,23.239,23.239,0,0,0,4.108-1.552,11.03,11.03,0,0,0,1.9-1.2c1.972-1.574,2.49-3.494.575-5.974a20.5,20.5,0,0,0-3.569-3.438c-7.828-5.867-16.168-9.633-24.35-13.927a143,143,0,0,1-14.382-8.007,21.054,21.054,0,0,1-2.019-1.567c-.9-.822-2.385-2.255-1.824-4.331a3.109,3.109,0,0,1,2.149-1.951,18.2,18.2,0,0,1,4.4-.818c4.335-.345,8.661-.174,12.977-.337C278.888,53.111,329.1,43.423,378.447,27.214,401,19.679,423.463,11.066,445.481,0"
            />
          </svg>
        </div>

        <div className="label-data-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* Procedure Time */}
          <div className="label-data flex flex-row lg:flex-col items-center lg:items-start space-x-3.5 lg:space-x-0">
            <div className="background-circle w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white border border-[#d30100]/15 shadow-[0_6px_18px_rgba(211,1,0,0.06)] flex items-center justify-center shrink-0 lg:mb-4">
              <HourglassIcon />
            </div>
            <div className="eii-flex">
              <div className="label text-[11px] lg:text-xs xl:text-[13px] font-extrabold uppercase tracking-wider text-silver-950 mb-0.5 lg:mb-1">
                Length of Procedure:
              </div>
              <div className="data text-sm lg:text-base font-medium text-silver-700 leading-snug">
                {data.procedureTime}
              </div>
            </div>
          </div>

          {/* Recovery & Downtime */}
          <div className="label-data flex flex-row lg:flex-col items-center lg:items-start space-x-3.5 lg:space-x-0">
            <div className="background-circle w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white border border-[#d30100]/15 shadow-[0_6px_18px_rgba(211,1,0,0.06)] flex items-center justify-center shrink-0 lg:mb-4">
              <RecoveryTreadmillIcon />
            </div>
            <div className="eii-flex">
              <div className="label text-[11px] lg:text-xs xl:text-[13px] font-extrabold uppercase tracking-wider text-silver-950 mb-0.5 lg:mb-1">
                Recovery Time:
              </div>
              <div className="data text-sm lg:text-base font-medium text-silver-700 leading-snug">
                {data.downtime}
              </div>
            </div>
          </div>

          {/* Comfort Level */}
          <div className="label-data flex flex-row lg:flex-col items-center lg:items-start space-x-3.5 lg:space-x-0">
            <div className="background-circle w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white border border-[#d30100]/15 shadow-[0_6px_18px_rgba(211,1,0,0.06)] flex items-center justify-center shrink-0 lg:mb-4">
              <ComfortFeatherIcon />
            </div>
            <div className="eii-flex">
              <div className="label text-[11px] lg:text-xs xl:text-[13px] font-extrabold uppercase tracking-wider text-silver-950 mb-0.5 lg:mb-1">
                Comfort Level:
              </div>
              <div className="data text-sm lg:text-base font-medium text-silver-700 leading-snug">
                {data.comfortLevel}
              </div>
            </div>
          </div>

          {/* Recommended Plan / Follow Up */}
          <div className="label-data flex flex-row lg:flex-col items-center lg:items-start space-x-3.5 lg:space-x-0">
            <div className="background-circle w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white border border-[#d30100]/15 shadow-[0_6px_18px_rgba(211,1,0,0.06)] flex items-center justify-center shrink-0 lg:mb-4">
              <FollowUpCalendarIcon />
            </div>
            <div className="eii-flex">
              <div className="label text-[11px] lg:text-xs xl:text-[13px] font-extrabold uppercase tracking-wider text-silver-950 mb-0.5 lg:mb-1">
                Follow Up &amp; Plan:
              </div>
              <div className="data text-sm lg:text-base font-medium text-silver-700 leading-snug">
                {data.recommendedSessions}
              </div>
            </div>
          </div>

          {/* Anesthesia / Numbing (if specified) */}
          {data.anesthesia && (
            <div className="label-data flex flex-row lg:flex-col items-center lg:items-start space-x-3.5 lg:space-x-0">
              <div className="background-circle w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white border border-[#d30100]/15 shadow-[0_6px_18px_rgba(211,1,0,0.06)] flex items-center justify-center shrink-0 lg:mb-4">
                <ComfortFeatherIcon />
              </div>
              <div className="eii-flex">
                <div className="label text-[11px] lg:text-xs xl:text-[13px] font-extrabold uppercase tracking-wider text-silver-950 mb-0.5 lg:mb-1">
                  Anesthesia / Numbing:
                </div>
                <div className="data text-sm lg:text-base font-medium text-silver-700 leading-snug">
                  {data.anesthesia}
                </div>
              </div>
            </div>
          )}

          {/* Longevity / Duration of Results (if specified) */}
          {data.longevity && (
            <div className="label-data flex flex-row lg:flex-col items-center lg:items-start space-x-3.5 lg:space-x-0">
              <div className="background-circle w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-white border border-[#d30100]/15 shadow-[0_6px_18px_rgba(211,1,0,0.06)] flex items-center justify-center shrink-0 lg:mb-4">
                <FollowUpCalendarIcon />
              </div>
              <div className="eii-flex">
                <div className="label text-[11px] lg:text-xs xl:text-[13px] font-extrabold uppercase tracking-wider text-silver-950 mb-0.5 lg:mb-1">
                  Expected Longevity:
                </div>
                <div className="data text-sm lg:text-base font-medium text-silver-700 leading-snug">
                  {data.longevity}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
