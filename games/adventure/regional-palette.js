// Colors interpreted from the user's Panama Regional Field Guide photographs.
// Reference photos stay outside the distributed game; see regional-sources.md.
export const REGIONAL_PALETTES={
 mainland:{green:'#438444',sand:'#e0cc9e'},
 gorgona:{green:'#408547',sand:'#b8afa0'},
 wilds:{green:'#287243',sand:'#e3d4a9'},
 colon:{green:'#347d45',sand:'#cfc4a2'},
 sunset:{green:'#42844b',sand:'#a6a18e'},
 islet:{green:'#508a48',sand:'#e8d5ab'},
 coconutCoast:{green:'#4a8e4c',sand:'#f2dfb5'},
 crystalCove:{green:'#468c50',sand:'#fff0cf'},
 guna:{green:'#468c50',sand:'#fff0cf'},
 coiba:{green:'#267344',sand:'#dfd4ad'},
 delRey:{green:'#3d8045',sand:'#e1d1ad'},
 escudo:{green:'#236b43',sand:'#e8dcbb'},
 cebaco:{green:'#458748',sand:'#d8c6a0'}
};
export const regionalPalette=region=>REGIONAL_PALETTES[region]||REGIONAL_PALETTES.mainland;
