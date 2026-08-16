// Edit this list to add or update available Syncthing ignore blocks.
export const IGNORE_BLOCKS = [
  {
    id: "windows",
    name: "Windows Temp Files",
    title: "//---Windows System/Temporary Files---//",
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
    title: "//---Linux Temporary Files---//",
    patterns:
`(?d)*~
(?d).directory
(?d).Trash-*`,
  },
  {
    id: "qnap",
    name: "QNAP Temp Files",
    title: "//---QNAP Temporary Files---//",
    patterns:
`(?d).@__thumb
(?d).AppleDB`,
  },
  {
    id: "synology",
    name: "Synology Temp Files",
    title: "//---Synology Temporary Files---//",
    patterns:
`(?d)@eaDir`,
  },
  {
    id: "sync-select",
    name: "Select Items Only Template",
    title: "//---Sync Select Items Only---//",
    patterns:
`// NOTE: You want to have this at the end of your ignore list, else the other
// blocks will not be checked (because of the wildcard ignore)
// Sync only selected parts of a folder (a reverse ignore-list)
// Edit and add the exceptions (beginning with !) to include what you want to sync
!some.file
!folderYouWantToSync
!/rootFolderYouWantToSync
*`,
  },
  {
    id: "sync-ignore",
    name: "Sync Your .stignore",
    title: "//---Sync .stignore---//",
    patterns:
`// Create a stignore-sync.txt in the root of your folder and move the content of your .stignore to it
// You then need to set this ignore pattern on all your devices for the synced pattern to take effect
#include stignore-sync.txt`,
  },
  {
    id: "obsidian",
    name: "Obsidian Config",
    title: "//---Obsidian---//",
    patterns:
`// appearance controls theme, font settings, etc. - differs on mobile vs. PC
// keep ignored if you want to have a custom setup on each machine
.obsidian/appearance.json
// workspace saves window layout and open tabs - often generates conflicts
.obsidian/workspace.json
.obsidian/workspace-mobile.json
// these files control which plugins are enabled. If you want to have the same
// setup on all machines, sync them, else don't (e.g. if you do not want certain
// plugins only enabled on mobile)
.obsidian/core-plugins.json
.obsidian/community-plugins.json
// if you ignored community-plugins.json, plugin state is not shared, but plugins
// are still installed on all machines. You might also want to ignore them:
.obsidian/plugins`,
  },
  {
    id: "microsoft-office",
    name: "MS Office Temp Files",
    title: "//---Microsoft-Office Temporary Files---//",
    patterns:
`(?d)~$*`,
  },
  {
    id: "libreoffice",
    name: "LibreOffice Temp Files",
    title: "//---LibreOffice Temporary Files---//",
    patterns:
`(?d).~lock.*#`,
  },
  {
    id: "adobe",
    name: "Adobe Application Temp Files",
    title: "//---Adobe Application Temporary Files---//",
    patterns:
`(?d)*.idlk
// Optional: project-local Premiere caches; regeneration may be expensive
//(?d)*.{cfa,pek}`,
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
// Optional: Uncomment when build artifacts and captures should not sync
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
// Optional: Uncomment when build artifacts and logs should not sync
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
    title: "//---Python Temporary Files---//",
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
    title: "//---Meson Temporary Files---//",
    patterns:
`(?d)meson-private
(?d)meson-logs
(?d)meson-info`,
  },
  {
    id: "ninja",
    name: "Ninja Temp Files",
    title: "//---Ninja Temporary Files---//",
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
    id: "jetbrains",
    name: "JetBrains IDE Caches",
    title: "//---JetBrains IDE Caches---//",
    patterns:
`(?d)**/.idea/caches`,
  },
  {
    id: "xcode",
    name: "Xcode and Swift Generated Files",
    title: "//---Xcode and Swift Generated Files---//",
    patterns:
`(?d)DerivedData
// Optional: SwiftPM output; rebuilding large projects may be expensive
//(?d).build`,
  },
  {
    id: "gradle",
    name: "Gradle and Android Build Artifacts",
    title: "//---Gradle and Android Build Artifacts---//",
    patterns:
`(?d).gradle
(?d).cxx
(?d).externalNativeBuild
(?d).kotlin
// Optional: compiled output; may contain intentional artifacts
//(?d)build`,
  },
  {
    id: "maven",
    name: "Maven Build Artifacts",
    title: "//---Maven Build Artifacts---//",
    patterns:
`(?d)**/target/maven-archiver
(?d)**/target/maven-status
// Optional: all Maven output; may contain intentional packages
//(?d)target`,
  },
  {
    id: "dotnet",
    name: ".NET and MSBuild Generated Files",
    title: "//---.NET and MSBuild Generated Files---//",
    patterns:
`(?d)[Oo]bj
// Optional: compiled and published output
//(?d)[Bb]in
//(?d)artifacts`,
  },
  {
    id: "rust",
    name: "Rust and Cargo Build Artifacts",
    title: "//---Rust and Cargo Build Artifacts---//",
    patterns:
`(?d)**/target/**/incremental
(?d)**/target/.rustc_info.json
// Optional: all Cargo output; includes final binaries, packages, and reports
//(?d)target`,
  },
  {
    id: "go",
    name: "Go Build and Test Artifacts",
    title: "//---Go Build and Test Artifacts---//",
    patterns:
`(?d).gocache
(?d)go-build[0-9]*`,
  },
  {
    id: "flutter",
    name: "Flutter and Dart Generated Files",
    title: "//---Flutter and Dart Generated Files---//",
    patterns:
`(?d).dart_tool
(?d).flutter-plugins
(?d).flutter-plugins-dependencies
(?d).packages
(?d).last_build_id
// Optional: compiled output; may contain intentional release artifacts
//(?d)build`,
  },
  {
    id: "php",
    name: "PHP Tool Caches",
    title: "//---PHP Tool Caches---//",
    patterns:
`(?d).phpunit.cache
(?d).phpunit.result.cache
(?d).php-cs-fixer.cache`,
  },
  {
    id: "ruby",
    name: "Ruby Tool Caches",
    title: "//---Ruby Tool Caches---//",
    patterns:
`(?d).yardoc
(?d).ruby-lsp
(?d).solargraph
// Optional: RSpec result history used for reruns
//(?d).rspec_status`,
  },
  {
    id: "latex",
    name: "LaTeX Auxiliary Files",
    title: "//---LaTeX Auxiliary Files---//",
    patterns:
`// Cross-reference and table data
(?d)*.aux
(?d)*.toc
(?d)*.lof
(?d)*.lot
(?d)*.nav
(?d)*.snm
(?d)*.vrb
// Build recorder and synchronization data
(?d)*.fdb_latexmk
(?d)*.fls
(?d)*.synctex.gz
(?d)*.xdv
// Bibliography and index intermediates
(?d)*.bcf
(?d)*.run.xml
(?d)*.acn
(?d)*.alg
(?d)*.glg
(?d)*.glo`,
  },
  {
    id: "bazel",
    name: "Bazel Generated Files",
    title: "//---Bazel Generated Files---//",
    patterns:
`(?d)bazel-bin
(?d)bazel-out
// Optional: test output; uncomment when diagnostics do not matter
//(?d)bazel-testlogs
// Optional: workspace convenience symlink; may match unrelated names
//(?d)bazel-*`,
  },
  {
    id: "scons",
    name: "SCons Generated Files",
    title: "//---SCons Generated Files---//",
    patterns:
`(?d).sconsign
(?d).sconsign.dblite`,
  },
  {
    id: "arduino",
    name: "Arduino Generated Files",
    title: "//---Arduino Generated Files---//",
    patterns:
`(?d).arduino-cache`,
  },
  {
    id: "esp-idf",
    name: "ESP-IDF Generated Files",
    title: "//---ESP-IDF Generated Files---//",
    patterns:
`// Default build-directory caches
(?d)**/build/CMakeFiles
(?d)**/build/CMakeCache.txt
(?d)**/build/.ninja_deps
(?d)**/build/.ninja_log
// Optional: all firmware output; may include intentional binaries
//(?d)build`,
  },
  {
    id: "zephyr",
    name: "Zephyr Build Artifacts",
    title: "//---Zephyr Build Artifacts---//",
    patterns:
`// Default build-directory caches
(?d)**/build/CMakeFiles
(?d)**/build/CMakeCache.txt
(?d)**/build/.ninja_deps
(?d)**/build/.ninja_log
// Optional: all firmware output; may include intentional binaries
//(?d)build
// Optional: Twister results; keep when diagnostics matter
//(?d)twister-out`,
  },
  {
    id: "docker",
    name: "Docker Development Caches",
    title: "//---Docker Development Caches---//",
    patterns:
`(?d).docker-cache`,
  },
  {
    id: "terraform",
    name: "Terraform Provider Cache",
    title: "//---Terraform Provider Cache---//",
    patterns:
`(?d)**/.terraform/providers
// Keep .terraform.lock.hcl, state, plans, and module sources synced.`,
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
