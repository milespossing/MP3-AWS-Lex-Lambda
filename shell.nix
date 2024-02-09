{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    nodejs
    zip
    just
    aws-sam-cli
    nodePackages.typescript
    nodePackages.ts-node
  ];
}
