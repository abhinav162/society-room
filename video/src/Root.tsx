import {Composition} from 'remotion';
import {ExplainerV3, EXPLAINER_V3_FRAMES} from './explainer-v3/ExplainerV3';

export const Root = () => (
  <Composition id="ExplainerV3" component={ExplainerV3} durationInFrames={EXPLAINER_V3_FRAMES} fps={30} width={1920} height={1080} />
);
