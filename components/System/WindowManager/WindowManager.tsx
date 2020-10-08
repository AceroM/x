import styles from '@/styles/System/WindowManager/WindowManager.module.scss';

import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import {
  baseZindex,
  windowsZindexLevel,
  zindexLevelSize,
  foregroundZindex
} from '@/utils/constants';
import { ProcessContext } from '@/contexts/ProcessManager';
import { SessionContext } from '@/contexts/SessionManager';
import { windowMotionSettings } from '@/utils/motions';
import {
  focusNextVisibleWindow,
  getMaxDimensions
} from '@/utils/windowmanager';

const Window = dynamic(import('@/components/System/WindowManager/Window'));

const WindowManager: React.FC = () => {
  const {
    foreground,
    getState,
    saveState,
    session: { foregroundId, stackOrder }
  } = useContext(SessionContext);
  const {
    processes,
    close,
    maximize,
    minimize,
    position,
    restore,
    size
  } = useContext(ProcessContext);

  return (
    <div className={styles.windows}>
      <AnimatePresence>
        {processes.map(
          ({
            loader: {
              loader: App,
              loadedAppOptions,
              loaderOptions: { width: defaultWidth, height: defaultHeight }
            },
            id,
            icon,
            name,
            bgColor,
            windowed,
            maximized,
            minimized,
            lockAspectRatio,
            height: initialHeight,
            width: initialWidth,
            x,
            y,
            startX,
            startY,
            startIndex
          }) => {
            const { x: previousX = 0, y: previousY = 0 } = getState({
              id
            });
            const windowZindex =
              baseZindex + windowsZindexLevel * zindexLevelSize;
            const { height, width } = getMaxDimensions(
              initialWidth,
              initialHeight,
              defaultWidth,
              defaultHeight,
              lockAspectRatio
            );
            const windowOptions = {
              onMinimize: () => {
                minimize(id);
                focusNextVisibleWindow(stackOrder, processes, foreground);
              },
              onMaximize: () =>
                maximized ? restore(id, 'maximized') : maximize(id),
              onClose: () => {
                // Q: Why are x, y 0's?
                saveState({
                  id,
                  height,
                  width,
                  x,
                  y
                });
                close(id);
                focusNextVisibleWindow(stackOrder, processes, foreground);
              },
              onFocus: () => foreground(id),
              onBlur: () => foreground(''),
              updatePosition: position(id),
              zIndex: windowZindex + stackOrder.slice().reverse().indexOf(id),
              maximized,
              minimized,
              id,
              height,
              width
            };

            return (
              <motion.div
                key={id}
                className={styles.animatedWindows}
                style={{
                  zIndex:
                    foregroundId === id
                      ? foregroundZindex
                      : windowOptions.zIndex,
                  height,
                  width
                }}
                {...windowMotionSettings({
                  initialX: previousX,
                  initialY: previousY,
                  startX,
                  startY,
                  animation:
                    (minimized && 'minimized') ||
                    (maximized && 'maximized') ||
                    'start',
                  startIndex,
                  height,
                  width,
                  x,
                  y
                })}
              >
                {windowed ? (
                  <Window
                    icon={icon}
                    name={name}
                    bgColor={bgColor}
                    lockAspectRatio={lockAspectRatio}
                    updateSize={size(id)}
                    {...windowOptions}
                  >
                    <App {...loadedAppOptions} {...windowOptions} />
                  </Window>
                ) : (
                  <App key={id} {...loadedAppOptions} {...windowOptions} />
                )}
              </motion.div>
            );
          }
        )}
      </AnimatePresence>
    </div>
  );
};

export default WindowManager;
