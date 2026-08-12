// Edit this list to add or update available Syncthing ignore blocks.
export const IGNORE_BLOCKS = [
  {
    id: "windows",
    name: "Windows Temp Files",
    title: "//---Windows-Specific---//",
    patterns:
`(?d)desktop.ini
(?d)Thumbs.db
(?d)ehthumbs.db
(?d)$RECYCLE.BIN
(?d)System Volume Information`,
  },
  {
    id: "macos",
    name: "macOS Metadata Files",
    title: "//---macOS-Specific---//",
    patterns:
`// Finder and resource metadata
(?d).DS_Store
(?d).AppleDouble
(?d)._*
(?d).LSOverride
(?d).localized
(?d)__MACOSX
// Volume metadata
(?d).VolumeIcon.icns
(?d).com.apple.timemachine.donotpresent
(?d).com.apple.timemachine.supported
(?d).DocumentRevisions-V100
(?d).Spotlight-V100
(?d).TemporaryItems
(?d).Trashes
(?d).fseventsd`,
  },
  {
    id: "linux",
    name: "Linux Temp Files",
    title: "//---Linux-Specific---//",
    patterns:
`(?d)*~
(?d).directory
(?d).Trash-*`,
  },
  {
    id: "qnap",
    name: "QNAP Temp Files",
    title: "//---QNAP-Specific---//",
    patterns:
`(?d).@__thumb
(?d).AppleDB`,
  },
  {
    id: "synology",
    name: "Synology Temp Files",
    title: "//---Synology-Specific---//",
    patterns:
`(?d)@eaDir`,
  },
  {
    id: "unity",
    name: "Unity Generated Files",
    title: "//---Unity-Generated---//",
    patterns:
`(?d)[Ll]ibrary
(?d)[Tt]emp
(?d)[Oo]bj
// Local editor state; omit if settings should sync
(?d)[Uu]ser[Ss]ettings
// Disposable diagnostics; omit if logs matter
(?d)[Ll]ogs
// Uncomment when build artifacts and captures should not sync
//(?d)/[Bb]uild
//(?d)/[Bb]uilds
//(?d)/[Mm]emoryCaptures
//(?d)/[Rr]ecordings`,
  },
  {
    id: "unrealengine",
    name: "Unreal Engine Generated Files",
    title: "//---Unreal-Engine-Generated---//",
    patterns:
`(?d).vs
(?d)[Dd]erived[Dd]ata[Cc]ache
(?d)[Ii]ntermediate
(?d)*.VC.db
(?d)*.opensdf
(?d)*.suo
// Uncomment when build artifacts and logs should not sync
//[Bb]inaries
//[Ss]aved`,
  },
];
