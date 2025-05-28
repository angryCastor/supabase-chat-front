export default {
  dialog: {
    root: `max-h-[90%] max-w-screen
     
      bg-surface-0 
      text-surface-700  shadow-lg
      p-maximized:w-screen p-maximized:h-screen p-maximized:top-0 p-maximized:start-0p-maximized: max-h-full p-maximized:rounded-none`,
    header: `flex items-center justify-between shrink-0 p-5`,
    title: `font-semibold text-xl`,
    headerActions: `flex items-center gap-2`,
    content: `overflow-y-auto p-5 p-maximized:grow`,
    footer: `shrink-0 pt-0 px-5 pb-5 flex justify-end gap-2`,
    mask: `p-modal:bg-black/50 p-modal:fixed p-modal:top-0 p-modal:start-0 p-modal:w-full p-modal:h-full bg-surface-300/50`,
    transition: {
      enterFromClass: 'opacity-0 scale-75',
      enterActiveClass: 'transition-all duration-150 ease-[cubic-bezier(0,0,0.2,1)]',
      leaveActiveClass: 'transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]',
      leaveToClass: 'opacity-0 scale-75',
    },
  },
}
