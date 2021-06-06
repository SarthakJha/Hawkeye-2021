import React, { ReactElement } from 'react';
import Lottie from 'react-lottie';
//@ts-ignore
import loading from '../assets/animations/loading.mp4';

interface Props {
  height?: number;
  width?: number;
}

export default function Loading({
  height = 1920,
  width = 1080,
}: Props): ReactElement {
  return (
    <div className="loading-page">
      <video
        width={'100%'}
        height={'100%'}
        playsInline
        autoPlay
        muted
        loop
        onPlay={() => console.log('test')}
      >
        <source src={loading} type="video/mp4" />
        Loading...
      </video>
    </div>
  );
}
