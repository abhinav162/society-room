import {Composition} from 'remotion';
import {Demo, totalFrames} from './Demo';
import {FPS, H, W} from './manifest';

export const Root = () => (
  <Composition id="Demo" component={Demo} durationInFrames={totalFrames()} fps={FPS} width={W} height={H} />
);
