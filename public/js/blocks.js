// Edit this list to add or update available Syncthing ignore blocks.
export const IGNORE_BLOCKS = [
  {
    id: "windows",
    name: "Windows Temp Files",
    title: "//---Windows System/Temp Files---//",
    patterns:
`(?d)desktop.ini
(?d)Thumbs.db
(?d)ehthumbs.db
(?d)$RECYCLE.BIN
(?d)System Volume Information`,
  },
  {
    id: "microsoft-office",
    name: "MS Office Temp Files",
    title: "//---Microsoft-Office Temp Files---//",
    patterns:
`(?d)~$*`,
  },
  {
    id: "macos",
    name: "macOS Metadata Files",
    title: "//---macOS System Files---//",
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
    title: "//---Linux Temp Files---//",
    patterns:
`(?d)*~
(?d).directory
(?d).Trash-*`,
  },
  {
    id: "qnap",
    name: "QNAP Temp Files",
    title: "//---QNAP Temp Files---//",
    patterns:
`(?d).@__thumb
(?d).AppleDB`,
  },
  {
    id: "synology",
    name: "Synology Temp Files",
    title: "//---Synology Temp Files---//",
    patterns:
`(?d)@eaDir`,
  },
  {
    id: "unity",
    name: "Unity-Generated Files",
    title: "//---Unity-Generated Files---//",
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
    id: "godot",
    name: "Godot Engine-Generated Files",
    title: "//---Godot Engine-Generated Files---//",
    patterns:
`(?d).godot
// Godot 3.x generated data
(?d).import
(?d).mono
// Optional: generated translations; enable only when source CSV files sync
//(?d)*.translation`,
  },
  {
    id: "unrealengine",
    name: "Unreal Engine-Generated Files",
    title: "//---Unreal Engine-Generated Files---//",
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
    name: "Version Control (git, svn, etc.)",
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
    title: "//---Python Temp Files---//",
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
    name: "JavaScript and Web Tooling",
    title: "//---JavaScript and Web Tooling---//",
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
    name: "Node and npm Generated Files",
    title: "//---Node-Generated Files---//",
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
    title: "//---Meson Temp Files---//",
    patterns:
`(?d)meson-private
(?d)meson-logs
(?d)meson-info`,
  },
  {
    id: "ninja",
    name: "Ninja Temp Files",
    title: "//---Ninja Temp Files---//",
    patterns:
`(?d).ninja_deps
(?d).ninja_log`,
  },
  {
    id: "pio",
    name: "PlatformIO-Generated Files",
    title: "//---PIO-Generated Files---//",
    patterns:
`(?d).pio
(?d).pioenvs
(?d).piolibdeps`,
  },
  {
    id: "vs",
    name: "VisualStudio Generated Files",
    title: "//---VisualStudio-Generated Files---//",
    patterns:
`(?d).vs`,
  },
  {
    id: "compiler",
    name: "Compiler intermediates",
    title: "//---Compiler-Generated Files---//",
    patterns:
`(?d)(?i)*.{o,obj}
(?d)*.class
(?d)*.pyc
(?d)*.pyo
(?d)(?i)*.dSYM`,
  },
];
