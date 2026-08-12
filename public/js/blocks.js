// Edit this list to add or update available Syncthing ignore blocks.
export const IGNORE_BLOCKS = [
  {
    id: "windows",
    name: "Windows Temp Files",
    title: "//---Windows-Specific---//",
    patterns: `(?d)desktop.ini
(?d)Thumbs.db
(?d)ehthumbs.db
(?d)$RECYCLE.BIN
(?d)System Volume Information`,
  },
  {
    id: "macos",
    name: "macOS Metadata Files",
    title: "//---macOS-Specific---//",
    patterns: `(?d).DS_Store
(?d).AppleDouble
(?d)._*
(?d).LSOverride
(?d).Spotlight-V100
(?d).TemporaryItems
(?d).Trashes
(?d).fseventsd
(?d).com.apple.timemachine.donotpresent`,
  },
  {
    id: "linux",
    name: "Linux Temp Files",
    title: "//---Linux-Specific---//",
    patterns: `(?d)*~
(?d).directory
(?d).Trash-*`,
  },
  {
    id: "unity",
    name: "Unity Generated Files",
    title: "//---Unity-Generated---//",
    patterns: `/[Ll]ibrary
/[Tt]emp
/[Oo]bj
/[Bb]uild
/[Bb]uilds
/[Ll]ogs
/[Uu]ser[Ss]ettings
/[Mm]emoryCaptures
/[Rr]ecordings`,
  },
  {
    id: "unrealengine",
    name: "Unreal Engine Generated Files",
    title: "//---Unreal-Engine-Generated---//",
    patterns: `/.vs
/Binaries
/DerivedDataCache
/Intermediate
/Saved
/*.VC.db
/*.opensdf
/*.sdf
/*.sln
/*.suo`,
  },
];
