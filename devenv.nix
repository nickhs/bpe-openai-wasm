{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [ 
    pkgs.git 
    pkgs.lld
    pkgs.llvm
    pkgs.nodejs_23
  ];

  # https://devenv.sh/languages/
  languages.rust.enable = true;
  languages.rust.channel = "stable";
  languages.rust.targets = [ "wasm32-unknown-unknown" ];
  
  # JavaScript/TypeScript configuration
  languages.javascript.enable = true;
  languages.javascript.yarn.install.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  enterShell = ''
    hello
  '';

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
