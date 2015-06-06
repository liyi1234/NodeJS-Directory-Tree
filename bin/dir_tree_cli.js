#!/usr/bin/env node
var dir_tree = require('dir_tree')
var args = require('./dir_tree_cli_help.js')
if (args == null)
  return 0
var err = function(msg) {
  console.log(msg)
  return -1
}
var sep_at_thousands = function(number) {
  return number.toLocaleString('en-US')
}
dir_tree(args.shift(), function(error, dtn) {
  if (error)
    return err('\n  Oops!\n\n  Please ensure the path points to a valid dir.\n')
  var describe_dtn = function(e, i) {
    console.log('\n#' + (i + 1))
    console.log('Name         : ' + e.name)
    console.log('Path         : ' + e.path_from_root)
    console.log('Size         : ' + sep_at_thousands(e.size) + ' bytes')
    console.log('Created on   : ' + e.created_on)
    console.log('Modified on  : ' + e.modified_on)
  }
  var arg = args.shift()
  if (arg != undefined)
    arg = arg.toLowerCase()
  for (var loop_counter = 0; loop_counter < 1; ++loop_counter)
  switch (arg) {
    case '-d':
    case '-dirs': {
      console.log('\nThe no of the direct descendant dirs to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.dirs.length))
      dtn.dirs.forEach(describe_dtn)
      return 0
    }
    case '-nod':
    case '-no-of-dirs': {
      console.log('\nThe no of the direct descendant dirs to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.dirs.length))
      return 0
    }
    case '-td':
    case '-total-dirs': {
      console.log('\nThe no of both the direct & the indirect descendant dirs to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.no_of_total_dirs))
      var i = 0
      var func = function(e) {
        describe_dtn(e, i++)
        e.dirs.forEach(func)
      }
      dtn.dirs.forEach(func)
      return 0
    }
    case '-notd':
    case '-no-of-total-dirs': {
      console.log('\nThe no of both the direct & the indirect descendant dirs to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.no_of_total_dirs))
      return 0
    }
    case '-f':
    case '-files': {
      console.log('\nThe no of the direct descendant files to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.files.length))
      dtn.files.forEach(describe_dtn)
      return 0
    }
    case '-nof':
    case '-no-of-files': {
      console.log('\nThe no of the direct descendant files to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.files.length))
      return 0
    }
    case '-tf':
    case '-total-files': {
      console.log('\nThe no of both the direct & the indirect descendant files to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.no_of_total_files))
      dtn.total_files().forEach(describe_dtn)
      return 0
    }
    case '-notf':
    case '-no-of-total-files': {
      console.log('\nThe no of both the direct & the indirect descendant files to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.no_of_total_files))
      return 0
    }
    case '-dco':
    case '-dirs-creation-order': {
      console.log('\nThe order of creating dirs inside "' + dtn.name + '" is:\n\n  ' + dtn.dirs_creation_order().join('\n\n  '))
      return 0
    }
    case '-ft':
    case '-fileless-tree': {
      console.log('\n' + dtn.fileless_tree('  '))
      break
    }
    case '-s':
    case '-size': {
      console.log('\nThe sum of the sizes of both the direct & the indirect descendant files to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.size) + ' bytes')
      return 0
    }
    case '-sof':
    case '-size-of-files': {
      console.log('\nThe sum of the sizes of the direct descendant files to the "' + dtn.name + '" dir is:\n\n  ' + sep_at_thousands(dtn.size_of_files) + ' bytes')
      return 0
    }
    case '-fd':
    case '-find-dirs': {
      var idr
      var edr
      var i = 0
      loop_: for (; i < 2; ++i) {
        arg = args.shift()
        if (arg == undefined)
          break loop_
        var groups = arg.split(/^-([ei])dr(?:-(i|ig|g|gi))?$/i)
        switch (groups[1].toLowerCase()) {
          case 'i':
            idr = new RegExp(args.shift(), typeof groups[2] == 'string' ? groups[2].toLowerCase() : undefined)
            break
          case 'e':
            edr = new RegExp(args.shift(), typeof groups[2] == 'string' ? groups[2].toLowerCase() : undefined)
            break
          default:
            break loop_
        }
      }
      if (i == 0 && idr == undefined && edr == undefined)
        return err('\n  Invalid arguments.\n\n  For assistance, execute:\n\n    dtree  -h  [command]\n')
      else {
        dtn_array = dtn.dir_search(idr, edr)
        console.log('\n' + dtn_array.length + ' dirs found.')
        dtn_array.forEach(describe_dtn)
        return 0
      }
    }
    case '-ff':
    case '-find-files': {
      var idr
      var edr
      var ifr
      var efr
      var i = 0
      loop_: for (; i < 4; ++i) {
        arg = args.shift()
        if (arg == undefined)
          break loop_
        var groups = arg.split(/^-([ei][fd])r(?:-(i|ig|g|gi))?$/i)
        if (groups.length != 4)
          break loop_
        switch (groups[1].toLowerCase()) {
          case 'id':
            idr = new RegExp(args.shift(), typeof groups[2] == 'string' ? groups[2].toLowerCase() : undefined)
            break
          case 'ed':
            edr = new RegExp(args.shift(), typeof groups[2] == 'string' ? groups[2].toLowerCase() : undefined)
            break
          case 'if':
            ifr = new RegExp(args.shift(), typeof groups[2] == 'string' ? groups[2].toLowerCase() : undefined)
            break
          case 'ef':
            efr = new RegExp(args.shift(), typeof groups[2] == 'string' ? groups[2].toLowerCase() : undefined)
            break
          default:
            break loop_
        }
      }
      if (i == 0 && idr == undefined && edr == undefined && ifr == undefined && efr == undefined)
        return err('\n  Invalid arguments.\n\n  For assistance, execute:\n\n    dtree  -h  [command]\n')
      else {
        dtn = dtn.search(idr, edr, ifr, efr)
        if (dtn == null)
          return err('\n  Nothing found!\n')
        --loop_counter
        break
      }
    }
    case '-up':
    case '-unread-paths': {
      var arr = dtn.unread_paths
      console.log('\nThe no of the direct descendant paths to the "' + dtn.name + '" dir that couldn\'t be read is:\n\n  ' + arr.length)
      if (arr.length > 0)
        console.log('\nUnread paths:\n\n  ' + arr.join('\n\n  '))
      break
    }
    case '-noup':
    case '-no-of-unread-paths': {
      var arr = dtn.unread_paths
      console.log('\nThe no of the direct descendant paths to the "' + dtn.name + '" dir that couldn\'t be read is:\n\n  ' + arr.length)
      break
    }
    case '-tup':
    case '-total-unread-paths': {
      console.log('\nThe no of both the direct & the indirect descendant paths to the "' + dtn.name + '" dir that couldn\'t be read is:\n\n  ' + dtn.no_of_total_unread_paths)
      if (dtn.no_of_total_unread_paths > 0) {
        var arr = dtn.total_unread_paths()
        console.log('\nUnread paths:\n\n  ' + arr.join('\n\n  '))
      }
      break
    }
    case '-notup':
    case '-no-of-total-unread-paths': {
      console.log('\nThe no of both the direct & the indirect descendant paths to the "' + dtn.name + '" dir that couldn\'t be read is:\n\n  ' + dtn.no_of_total_unread_paths)
      break
    }
    case undefined: {
      if (dtn == null)
        return err('\n  Nothing found!\n')
      console.log('\n' + dtn.tree('  '))
      break
    }
    default: {
      return err('\n  Invalid arguments.\n\n  For assistance, execute:\n\n    dtree  -h  [command]\n')
    }
  }
})
