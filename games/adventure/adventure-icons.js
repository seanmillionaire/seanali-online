const paths={
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
 map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z"/><path d="M9 3v16M15 5v16"/>',
 bag:'<path d="M8 7V5a4 4 0 0 1 8 0v2M6 7h12l2 14H4Z"/><path d="M8 13h8v5H8ZM8 7v3m8-3v3"/>',
 people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4M17 4a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5v2"/>',
 jump:'<path d="M5 21h14M12 17V3m-5 5 5-5 5 5"/>',
 vehicle:'<path d="m4 9 2-5h12l2 5v10H4Z"/><path d="M4 10h16M7 14h2m6 0h2M6 19v2m12-2v2"/>',
 boat:'<path d="M12 2v12H3l4 7h10l4-7H12m0-12L4 11h8m2-6 6 6h-6"/>',
 home:'<path d="m3 10 9-7 9 7M5 9v12h14V9m-10 12v-8h6v8"/>',
 tool:'<path d="m14 3-3 5 5 5 5-3a7 7 0 0 1-8 8l-5 4-4-4 5-5a7 7 0 0 1 5-10Z"/>',
 food:'<path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18M19 3c-4 3-4 8 0 10V3Zm0 10v8"/>',
 leaf:'<path d="M20 3C7 2 2 8 5 15c4 8 17 3 15-12ZM4 21 16 8"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4M10 5h4"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M14 7h-4v10h4m-4-5h3"/>',
 book:'<path d="M12 5C8 2 5 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-6-2-10 1Zm0 0v16"/>',
 interact:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
 close:'<path d="m6 6 12 12M18 6 6 18"/>'};
export function adventureIcon(symbol){
 const key=({'🌋':'compass','🐬':'leaf','🗺️':'map','📍':'compass','🎒':'bag','🛠️':'tool','🫶':'people','🐢':'people','👮':'people','🏡':'home','🚪':'home','🚙':'vehicle','🏙️':'vehicle','⛵':'boat','🍕':'food','🥥':'food','🥭':'food','🔥':'food','🦘':'jump','⬆️':'jump','⬇️':'jump','🪙':'coin','📖':'book','📱':'phone','☰':'menu','✕':'close','🧭':'compass','🦋':'leaf','🔎':'compass','👣':'compass'})[symbol]||'interact';
 return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key]}</svg>`;
}
