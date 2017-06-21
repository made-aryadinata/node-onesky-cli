# node-onesky-cli

A command line interface to synchronize translation file in [OneSky](http://www.oneskyapp.com/) translation service with developer's source code.

## Usage
 `onesky [options] [command]`


  ### Commands:
    sync        Synchronize multilingual translations from OneSky

  ### Options:

    -h, --help  output usage information
    help [cmd]  display help for [cmd]

  ### sync Options:

    -h, --help                   output usage information
    -p, --path [path]            Directory path to save translation files
    -o, --optimistic             If missing in OneSky, use local translation files
    -c, --console                Write to standard output only
    -s, --secret <secret>        OneSky secret key
    -a, --apiKey <apiKey>        OneSky API key
    -i, --projectId <projectId>  OneSky project ID
    -n, --fileName <fileName>    OneSky file name
