import styles from '@/styles/System/Taskbar/Taskbar.module.scss';

import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { ProcessContext } from '@/contexts/ProcessManager';
import { SessionContext } from '@/contexts/SessionManager';
import { cycleWindowState } from '@/utils/taskbar';
import Clock from '@/components/System/Taskbar/Clock';

const TaskbarEntry = dynamic(
  import('@/components/System/Taskbar/TaskbarEntry')
);

const Taskbar: React.FC = () => {
  const { processes, minimize, restore } = useContext(ProcessContext);
  const { session, foreground } = useContext(SessionContext);

  return (
    <nav className={styles.taskbar}>
      <ol className={styles.entries}>
        <AnimatePresence>
          {processes.map(({ id, icon, minimized, name }) => (
            <TaskbarEntry
              key={id}
              icon={icon}
              id={id}
              name={name}
              onBlur={() => foreground('')}
              onClick={() =>
                cycleWindowState({
                  id,
                  session,
                  minimized,
                  foreground,
                  minimize,
                  restore
                })
              }
            />
          ))}
        </AnimatePresence>
      </ol>
      <Clock />
    </nav>
  );
};

export default Taskbar;
