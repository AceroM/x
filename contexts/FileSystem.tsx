import index from 'public_index.json';

import type { FSModule } from 'browserfs/dist/node/core/FS';

import { createContext, useEffect, useState } from 'react';
import * as BrowserFS from 'browserfs';
import { writableJsonFs } from '@/utils/filesystem';
import { ROOT_DIRECTORY } from '@/utils/constants';

export const FileContext = createContext<FSModule>({} as FSModule);

const FileProvider: React.FC = ({ children }) => {
  const [fs, setFs] = useState<FSModule>({} as FSModule);

  useEffect(() => {
    BrowserFS.install(window);

    BrowserFS.configure(
      {
        fs: 'MountableFileSystem',
        options: {
          ...writableJsonFs(ROOT_DIRECTORY, index)
        }
      },
      () => {
        setFs(BrowserFS.BFSRequire('fs'));
      }
    );
  }, []);

  return <FileContext.Provider value={fs}>{children}</FileContext.Provider>;
};

export default FileProvider;
