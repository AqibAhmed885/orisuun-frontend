export const NODE_HEIGHT = 96;
export const NODE_WIDTH = 160;
export const NODE_WIDTH_05 = NODE_WIDTH / 2;
export const NODE_BOTTOM_WIDTH = 736;

export const NODES_BORDER_RADIUS_STYLE = {
  borderRadius: 12,
};

export const NODES_FONT_STYLE = {
  fontSize: 16,
  fontWeight: 600,
  lineHeight: '22px',
  color: '#001E5F',
};
export const NODES_CENTER_FONT_STYLE = {
  ...NODES_FONT_STYLE,
  fontSize: 20,
  fontWeight: 600,
  lineHeight: '24px',
  color: '#fff',
};
export const NODES_DROP_SHADOW_STYLE = {
  boxShadow: '-8px 8px 42px -1px #00000014',
};

export const ANIMATION_INITIAL_DURATION = 1;

export const DEFAULT_VARIANTS = {
  offscreen: {
    opacity: 0,
    x: -200,
    scale: 0.6,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  },
  onscreen: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 2,
      delay: 1,
    }
  },
};