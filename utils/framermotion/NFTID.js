//attributes
export const Attribute = {
  init: {
    x: "-10vw",
  },
  final: {
    x: 0,
    transition: { duration: 1 },
  },
};

export const attributesBody = {
  init: {
    opacity:0,
  },
  final: {
    opacity:1,
    transition: {
      staggerChildren: .3,
    },
  },
};
export const _attributes = {
  init: {
    opacity: 0,
    y: -50,
  },
  final: {
    opacity: 1,
    y: 0,
    transition: {
      duration: .6,
    },
  },
};

//make pop in modals modal

export const modal_backdrop = {
  init: { opacity: 0 },
  final: { opacity: 1 },
  exit:{opacity:0}
};
export const _modal = {
  init: {
   scale:0,
   opacity:.5
  },
  final: {
    scale:1,
    opacity: 1,
    transition: { duration: .4 }
  },
  exit:{scale: 0, opacity:0, transition:{duration:.4}}
};


