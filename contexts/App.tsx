import type { RndDragCallback, RndResizeCallback } from 'react-rnd';
import type { AppLoader } from '@/utils/apps';

// TODO: How can I properly use this?
export type AppComponent = {
  onDoubleClick?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  updatePosition?: RndDragCallback;
  updateSize?: RndResizeCallback;
  zIndex?: number;
  args?: Array<string>;
  url?: string;
};

export type AppConstructor = {
  loader: AppLoader;
  icon: string;
  name: string;

  height?: number;
  width?: number;
  x?: number;
  y?: number;

  id?: string;
  windowed?: boolean;
  lockAspectRatio?: boolean;
  hideScrollbars?: boolean;
};

export default class {
  loader;
  icon;
  name;

  height;
  width;
  x;
  y;

  id;
  windowed;
  lockAspectRatio;
  hideScrollbars;

  component = undefined;
  foreground = false;
  maximized = false;
  minimized = false;
  lastRunning: Date = new Date(0);
  stackOrder: Array<string> = [];

  constructor({
    loader,
    icon,
    name,

    height = 0,
    width = 0,
    x = 0,
    y = 0,

    id = name.toLowerCase().replace(/ /g, '_'),
    windowed = true,
    lockAspectRatio = false,
    hideScrollbars = false
  }: AppConstructor) {
    this.loader = loader;
    this.icon = icon;
    this.name = name;
    this.id = id;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.windowed = windowed;
    this.lockAspectRatio = lockAspectRatio;
    this.hideScrollbars = hideScrollbars;
  }
}
