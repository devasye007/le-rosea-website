// LE ROSÈA - shared line-art icons (no external image dependencies)
const ICONS = {
  rose: `<svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.4">
    <path d="M24 21c3.5 0 6.5-2.7 6.5-6.5S27.5 8 24 8s-6.5 2.8-6.5 6.5S20.5 21 24 21z"/>
    <path d="M24 21c-3.8 1-6 3.6-6 6.8 0 3.6 3 6.7 6.8 6.4"/>
    <path d="M24 21c3.8 1 6 3.6 6 6.8 0 3.6-3 6.7-6.8 6.4"/>
    <path d="M18.6 16.4c-2.4-1.6-5.6-1.3-7.6.9-2 2.3-1.9 5.7.3 7.8"/>
    <path d="M29.4 16.4c2.4-1.6 5.6-1.3 7.6.9 2 2.3 1.9 5.7-.3 7.8"/>
    <path d="M24 34v8"/>
    <path d="M24 38c-2.6 0-4.7 1.5-5.6 3.6"/>
    <path d="M24 38c2.6 0 4.7 1.5 5.6 3.6"/>
    <path d="M20 40.5c1-.6 2.4-1 4-1s3 .4 4 1"/>
  </svg>`,
  cart: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 4h2l1.6 10.2A2 2 0 0 0 8.6 16h8a2 2 0 0 0 2-1.6L20 7H6"/><circle cx="9.5" cy="20" r="1.3" fill="currentColor" stroke="none"/><circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none"/></svg>`,
  search: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="10.8" cy="10.8" r="6.8"/><path d="M20 20l-4.4-4.4"/></svg>`,
  user: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.4-3.8 4.3-5.8 7.5-5.8s6.1 2 7.5 5.8"/></svg>`,
  menu: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  close: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 5l14 14M19 5L5 19"/></svg>`,
  plus: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12h14"/></svg>`,
  chevron: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 6l6 6-6 6"/></svg>`,
  diamond: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4.5 9h15L12 20 4.5 9Z"/><path d="M7.5 4.5h9L19.5 9h-15l3-4.5Z"/></svg>`,
  dress: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M10 4.5c.5 1.5 1.2 2.2 2 2.2s1.5-.7 2-2.2"/><path d="M9 7l-2 3 2 2.4V20h6v-7.6L17 10l-2-3.5"/><path d="M8 7.5h8"/></svg>`,
  truck: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8h10v8H3z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>`,
  support: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4.5 12a7.5 7.5 0 0 1 15 0"/><path d="M4.5 12v4"/><path d="M19.5 12v4"/><path d="M6.5 16.5c0 1.3 1 2.3 2.3 2.3h1.2"/></svg>`,
  whatsapp: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 3.5a8.43 8.43 0 0 0-7.25 12.73L3.9 20.5l4.37-1.03A8.42 8.42 0 1 0 12.04 3.5Zm0 1.55a6.87 6.87 0 1 1-3.33 12.88l-.26-.15-2.55.6.53-2.5-.17-.27a6.87 6.87 0 0 1 5.78-10.56Zm-3.18 3.6c-.14 0-.36.05-.55.27-.19.22-.72.7-.72 1.72 0 1.01.74 1.99.84 2.13.1.14 1.43 2.29 3.55 3.12 1.76.69 2.12.55 2.5.52.38-.04 1.24-.51 1.41-1 .17-.49.17-.91.12-1-.05-.09-.19-.14-.39-.24-.2-.1-1.24-.61-1.43-.68-.19-.07-.33-.1-.47.1-.14.2-.54.68-.66.82-.12.14-.24.15-.44.05-.2-.1-.86-.32-1.64-1.01-.61-.54-1.02-1.21-1.14-1.41-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.14-.2.2-.34.07-.14.03-.26-.02-.36-.05-.1-.45-1.12-.64-1.53-.17-.39-.34-.4-.47-.41h-.45Z"/></svg>`,
  play: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 19 12 7 20"/></svg>`,
};
