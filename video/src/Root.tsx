import {Composition} from 'remotion';
import {Demo, totalFrames} from './Demo';
import {FPS, H, W} from './manifest';
import {Launch, LAUNCH_FRAMES} from './launch/Launch';
import {Explainer, EXPLAINER_FRAMES} from './explainer/Explainer';
import {ExplainerV2, EXPLAINER_V2_FRAMES} from './explainer-v2/ExplainerV2';
import {ExplainerV3, EXPLAINER_V3_FRAMES} from './explainer-v3/ExplainerV3';

export const Root = () => (
  <>
    <Composition id="ExplainerV3" component={ExplainerV3} durationInFrames={EXPLAINER_V3_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="ExplainerV2" component={ExplainerV2} durationInFrames={EXPLAINER_V2_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Explainer" component={Explainer} durationInFrames={EXPLAINER_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Launch" component={Launch} durationInFrames={LAUNCH_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Demo" component={Demo} durationInFrames={totalFrames()} fps={FPS} width={W} height={H} />
  </>
);
