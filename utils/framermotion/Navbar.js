// connectModal

export const backdrop = {
  init: { opacity: 0 },
  final: { opacity: 1 },
  exit:{opacity:0}
};

export const modal = {
  init: {
    // x: -100,
    scale:.3,
    opacity: .5,
  },
  final: {
    scale:1,
    opacity: 1,
    transition: { duration: .4 }
  },
  exit:{opacity:0, scale:0, transition:{duration:.4}}
};

  //disconnect modal
  export const disconnect_Backdrop = {
    init: { opacity: 0 },
    final: { opacity: 1 },
    exit:{opacity:0}
  };
  export const disconnect_modal = {
    init: {
     x:"100vw"
    },
    final: {
      x:0,
      opacity: 1,
      transition: { duration: .4 }
    },
    exit:{x: "-100vw", transition:{duration:.4}}
  };
