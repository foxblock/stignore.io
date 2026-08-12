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
  {
    id: "version-control",
    name: "Version Control",
    title: "//---Version-control internals---//",
    patterns:
`// No (?d): repositories may contain unique, unpushed history.
.git
.svn
.hg
.jj
.bzr
_darcs
.pijul
.fslckout
_FOSSIL_`,
  },
  {
    id: "python",
    name: "Python Temp Files",
    title: "//---Python---//",
    patterns:
`(?d)__pycache__
(?d).pytest_cache
(?d).mypy_cache
(?d).ruff_cache
(?d).tox
(?d).nox
(?d).venv`,
  },
  {
    id: "web",
    name: "JavaScript and web tooling",
    title: "//---JavaScript and web---//",
    patterns:
`(?d)node_modules
(?d).pnpm-store
(?d).parcel-cache
(?d).turbo
(?d).next
(?d).nuxt
(?d).svelte-kit
(?d).vite`,
  },
  {
    id: "node",
    name: "Node and npm generated files",
    title: "//---Node-Generated---//",
    patterns:
`(?d)node_modules
package-lock.json`,
  },
  {
    id: "cmake",
    name: "CMake Cache",
    title: "//---CMake Cache---//",
    patterns:
`(?d)CMakeFiles
(?d)CMakeCache.txt
(?d)cmake_install.cmake`,
  },
  {
    id: "meson",
    name: "Meson Temp Files",
    title: "//---Meson-Specific---//",
    patterns:
`(?d)meson-private
(?d)meson-logs
(?d)meson-info`,
  },
  {
    id: "ninja",
    name: "Ninja Temp Files",
    title: "//---Ninja-Specific---//",
    patterns:
`(?d).ninja_deps
(?d).ninja_log`,
  },
  {
    id: "pio",
    name: "PlatformIO Generated Files",
    title: "//---Ninja-Specific---//",
    patterns:
`(?d).pio
(?d).pioenvs
(?d).piolibdeps`,
  },
  {
    id: "vs",
    name: "VisualStudio Generated Files",
    title: "//---VisualStudio-Specific---//",
    patterns:
`(?d).vs`,
  },
  {
    id: "compiler",
    name: "Compiler intermediates",
    title: "//---Compiler-Generated-Files---//",
    patterns:
`(?d)(?i)*.{o,obj}
(?d)*.class
(?d)*.pyc
(?d)*.pyo
(?d)(?i)*.dSYM`,
  },
];
