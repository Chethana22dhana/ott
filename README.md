# EROS Now TV Application

## Folder structure

```text
images                : App related icons that will be shown in launcher/preview/app store
static/script         : Javascript source
static/fonts          : Application fonts
static/img            : Imags used inside the application
static/style          : CSS source
static/script-tests   : Jasmine unit-tests
```

## IDEs

IDE's below are Eclipse based but the source can be developed on any IDE. We require the specific IDE of the platform only for the installation and running of it on the Smart TV.

* [Tizen](https://developer.tizen.org/development/tizen-studio/download)

## Installing dependencies &  Running application

```text
npm install
npm start
```

**NOTE:**

1. UX is to be viewed in either HD (720x1280) or Full HD (1080x1920) resolutions using developer tools

## Code format

<https://github.com/standard/standard> tool will be used to format js files.
No files need to be minimized as this is done during the build process for each TV.
