import { DetailedHTMLProps, VideoHTMLAttributes } from "react";

export default function Video(
  props: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
) {
  return (
    <>
      <link rel="preload" as="image" href={props.poster} fetchPriority="high" />
      <link rel="preload" as="video" href={props.src} fetchPriority="high" />
      <video {...props}>
        <source src={props.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
}
