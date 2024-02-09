
build:
  tsc

clean:
  rm -rf dist.zip dist

pack: build
  zip -r dist.zip package-lock.json package.json node_modules
  cd dist && zip -r ../dist.zip *
