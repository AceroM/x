import type {
  AnimationProps,
  TransformProperties
} from 'framer-motion/types/motion/types';
import type { MotionProps, TargetAndTransition } from 'framer-motion';
import type { WindowMotionSettings } from '@/types/utils/motion';

import {
  TASKBAR_ENTRY_WIDTH,
  TASKBAR_HEIGHT,
  MAXIMIZE_ANIMATION_SPEED_IN_SECONDS
} from '@/utils/constants';

export const desktopIconDragSettings = {
  dragElastic: 0.25,
  dragTransition: { bounceStiffness: 500, bounceDamping: 15 },
  dragMomentum: false
};

export const desktopIconMotionSettings: MotionProps = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  transition: { y: { type: 'spring' } }
};

export const taskbarEntriesMotionSettings: MotionProps = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: { x: { type: 'spring' } },
  exit: {
    opacity: 0,
    width: 0,
    transition: { duration: 0.3 },
    x: -100
  }
};

export const windowMotionSettings = ({
  initialX = 0,
  initialY = 0,
  startX = 0,
  startY = 0,
  animation = 'start',
  startIndex = 0,
  height,
  width,
  x,
  y
}: WindowMotionSettings): MotionProps => {
  const widthOffset = -Math.floor(width / 2);
  const heightOffset = -Math.floor(height / 2);
  const animationVariants: {
    [key: string]: AnimationProps & TargetAndTransition;
  } = {
    start: {
      scale: 1,
      x: initialX,
      y: initialY,
      height,
      width
    },
    maximized: {
      x: initialX === x ? 0 : -x,
      y: initialY === y ? 0 : -y,
      height: window.innerHeight - TASKBAR_HEIGHT,
      width: '100vw'
    },
    minimized: {
      scale: 0,
      x:
        widthOffset +
        TASKBAR_ENTRY_WIDTH * startIndex -
        TASKBAR_ENTRY_WIDTH / 2,
      y: heightOffset + -(TASKBAR_HEIGHT / 2) + window.innerHeight
    }
  };
  const initialExitTransform: TransformProperties = {
    scale: 0,
    x: widthOffset + startX,
    y: heightOffset + startY
  };

  return {
    initial: {
      ...initialExitTransform
    },
    exit: {
      ...initialExitTransform
    },
    animate: animationVariants[animation],
    transition: {
      duration: MAXIMIZE_ANIMATION_SPEED_IN_SECONDS
    }
  };
};
