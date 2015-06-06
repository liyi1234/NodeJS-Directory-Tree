var fs = require('fs')
var args = process.argv.slice(2)
var help = function(command) {
  switch(command) {
    case '-d':
    case '-dirs':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-dirs.txt').toString()
    case '-nod':
    case '-no-of-dirs':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-no-of-dirs.txt').toString()
    case '-td':
    case '-total-dirs':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-total-dirs.txt').toString()
    case '-notd':
    case '-no-total-of-dirs':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-no-of-total-dirs.txt').toString()
    case '-f':
    case '-files':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-files.txt').toString()
    case '-nof':
    case '-no-of-files':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-no-of-files.txt').toString()
    case '-tf':
    case '-total-files':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-total-files.txt').toString()
    case '-notf':
    case '-no-of-total-files':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-no-of-total-files.txt').toString()
    case '-dco':
    case '-dirs-creation-order':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-dirs-creation-order.txt').toString()
    case '-ft':
    case '-fileless-tree':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-fileless-tree.txt').toString()
    case '-s':
    case '-size':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-size.txt').toString()
    case '-sof':
    case '-size-of-files':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-size-of-files.txt').toString()
    case '-up':
    case '-unread-paths':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-unread-paths.txt').toString()
    case '-noup':
    case '-no-of-unread-paths':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-no-of-unread-paths.txt').toString()
    case '-tup':
    case '-total-unread-paths':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-total-unread-paths.txt').toString()
    case '-notup':
    case '-no-of-total-unread-paths':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-no-of-total-unread-paths.txt').toString()
    case '-fd':
    case '-find-dirs':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-find-dirs.txt').toString()
    case '-ff':
    case '-find-files':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-find-files.txt').toString()
    case '-h':
      return fs.readFileSync(__dirname + '/dir_tree_cli_help_files/-h.txt').toString()
    default:
      args = null
      return '\n  Invalid arguments.\n\n  For assistance, execute:\n\n    dtree  -h  [command]\n'
   }
}
switch (args.length) {
  case 0:
    console.log(help('-h'))
    args = null
    break
  case 1:
    switch (args[0].toLowerCase()) {
      case '-h':
      case '-help':
        console.log(help('-h'))
        args = null
    }
    break
  default:
    switch (args[0].toLowerCase()) {
      case '-h':
      case '-help':
        console.log(help(args[1]))
        args = null
    }
    break
}
module.exports = args