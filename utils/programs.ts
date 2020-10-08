import type { AppFile, AppLoader, AppLoaders } from '@/types/utils/programs';

import dynamic from 'next/dynamic';
import { extname } from 'path';
import { isValidUrl } from '@/utils/url';

import { loaderOptions as dosLoaderOptions } from '@/components/Programs/Dos';
import { loaderOptions as explorerLoaderOptions } from '@/components/Programs/Explorer';
import { loaderOptions as winampLoaderOptions } from '@/components/Programs/Winamp';
import { ROOT_DIRECTORY } from '@/utils/constants';

const Dos = dynamic(import('@/components/Programs/Dos'));
const Explorer = dynamic(import('@/components/Programs/Explorer'));
const Winamp = dynamic(import('@/components/Programs/Winamp'));

const appLoaders: AppLoaders = {
  dos: {
    loader: Dos,
    loaderOptions: dosLoaderOptions
  },
  explorer: {
    loader: Explorer,
    loaderOptions: explorerLoaderOptions
  },
  winamp: {
    loader: Winamp,
    loaderOptions: winampLoaderOptions
  }
};

const appLoaderByName = (name: string): AppLoader | undefined =>
  appLoaders[name];

const appLoaderByFileType = (
  appFile: AppFile,
  ext?: string,
  searchParams?: URLSearchParams
): AppLoader | undefined => {
  switch (ext || extname(appFile.url)) {
    case '.jsdos':
    case '.zip':
      return {
        ...appLoaders.dos,
        loadedAppOptions: {
          file: appFile,
          args: searchParams ? [...searchParams.entries()].flat() : []
        }
      };
    case '.mp3':
    case '.m3u':
    case '.wsz':
      return {
        ...appLoaders.winamp,
        loadedAppOptions: {
          file: appFile
        }
      };
    default:
      return undefined;
  }
};

export const appLoader = (appFile: AppFile): AppLoader | undefined => {
  const { ext, url } = appFile;

  if (isValidUrl(url)) {
    const { pathname, searchParams } = new URL(url);

    return pathname === ROOT_DIRECTORY
      ? appLoaderByName(searchParams.get('app') || '')
      : appLoaderByFileType(appFile, ext || extname(pathname), searchParams);
  }

  return appLoaderByFileType(appFile);
};
