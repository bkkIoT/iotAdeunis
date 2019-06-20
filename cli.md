# Adeunis codecs CLI

Usage: `codec <command> [<args> ...] [-- <options>]`

Available commands:
* __decode__: Decode frame
* __encode__: Encode frame
* __help__: Show help

Available options:
* __-v, --version__: Print version
* __...__: Command specific options


# Decoder

Usage: `codec decode <frame1> [<frame2> ...] [--deviceType <device_type>] [--network lora868|sigfox] [--csv] [--json]`


# Encoder

Usage: `codec encode <device_type> <frame_code> [--network lora868|sigfox] [-- <encode_options>]`

