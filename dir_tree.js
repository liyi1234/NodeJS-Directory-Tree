var fs = require('fs')
var p = require('path')
var func = module.exports = function(path, cb) {
  function DirTreeNode(dtn) {
    this.name
    this.path
    this.path_from_root
    this.is_a_dir
    this.size
    this.size_of_files
    this.files
    this.dirs
    this.no_of_total_files
    this.no_of_total_dirs
    this.created_on
    this.modified_on
    this.parent
    this.unread_paths
    this.no_of_total_unread_paths
    if (dtn instanceof DirTreeNode) {
      this.name = dtn.name
      this.path = dtn.path
      this.path_from_root = dtn.path_from_root
      this.created_on = dtn.created_on
      this.modified_on = dtn.modified_on
      if (this.is_a_dir = dtn.is_a_dir) {
        this.size = 0
        this.size_of_files = 0
        this.files = []
        this.dirs = []
        this.no_of_total_files = 0
        this.no_of_total_dirs = 0
        this.unread_paths = dtn.unread_paths
        this.no_of_total_unread_paths = dtn.no_of_total_unread_paths
      } else
        this.size = dtn.size
    }
  }
  DirTreeNode.alphabetic_comparator = function(e1, e2) {
    var n1 = e1.name.toLowerCase()
    var n2 = e2.name.toLowerCase()
    return n1 > n2 ? 1 : n1 < n2 ? -1 : 0
  }
  DirTreeNode.prototype.dirs_creation_order = function() {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    var root_path = this.path_from_root
    const func = function(dir) {
      return Array.prototype.concat.apply([p.relative(root_path, dir.path_from_root)], dir.dirs.map(func))
    }
    var arr = func(this)
    arr.shift()
    return arr
  }
  DirTreeNode.prototype.total_files = function(arr) {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    return this.total_files_(arr === undefined ? [] : arr).sort(DirTreeNode.alphabetic_comparator)
  }
  DirTreeNode.prototype.total_files_ = function(arr) {
    Array.prototype.push.apply(arr, this.files.map(function(file) {
      return {
        path_from_root: file.path_from_root,
        path: file.path,
        name: file.name,
        size: file.size,
        created_on: file.created_on,
        modified_on: file.modified_on
      }
    }))
    this.dirs.forEach(function(dir) {
      dir.total_files_(arr)
    })
    return arr
  }
  DirTreeNode.prototype.serial = function() {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    return this.serial_()
  }
  DirTreeNode.prototype.serial_ = function() {
    return {
      path_from_root: this.path_from_root,
      path: this.path,
      name: this.name,
      size: this.size,
      size_of_files: this.size_of_files,
      no_of_total_files: this.no_of_total_files,
      no_of_total_dirs: this.no_of_total_dirs,
      created_on: this.created_on,
      modified_on: this.modified_on,
      unread_paths: this.unread_paths,
      no_of_total_unread_paths: this.no_of_total_unread_paths,
      files: this.files.map(function(file) {
        return {
          path_from_root: file.path_from_root,
          path: file.path,
          name: file.name,
          size: file.size,
          created_on: file.created_on,
          modified_on: file.modified_on
        }
      }),
      dirs: this.dirs.map(function(dir) {
        return dir.serial_()
      })
    }
  }
  DirTreeNode.prototype.tree = function(indent) {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    return indent == undefined ? this.tree_('\n') : indent + this.tree_('\n' + indent)
  }
  DirTreeNode.prototype.tree_ = function(prefix) {
    var nf = this.files.length
    var nd = this.dirs.length
    if (nf + nd == 0)
      return this.name
    if (nd == 0) {
      var filenames = this.files.map(function(f) { return f.name })
      var lastfilename = filenames.pop()
      if (nf > 1)
        return this.name + prefix + '├──' + filenames.join(prefix + '├──') + prefix + '└──' + lastfilename
      return this.name + prefix + '└──' + lastfilename
    }
    if (nd == 1) {
      return this.name + this.files.map(function(f) { return prefix + '├──' + f.name }).join('') +
        prefix + '└⌂─' + this.dirs[0].tree_(prefix + '   ')
    }
    return this.name + this.files.map(function(f) { return prefix + '├──' + f.name }).join('') +
      this.dirs.slice(0, -1).map(function(d) { return prefix + '├⌂─' + d.tree_(prefix + '│  ') }).join('') +
      prefix + '└⌂─' + this.dirs.slice(-1)[0].tree_(prefix + '   ')
  }
  DirTreeNode.prototype.sort = function(dir_comparator_func, file_comparator_func) {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    if (dir_comparator_func == undefined || dir_comparator_func == null)
      dir_comparator_func = DirTreeNode.alphabetic_comparator
    if (file_comparator_func == undefined || file_comparator_func == null)
      file_comparator_func = DirTreeNode.alphabetic_comparator
    this.sort_(dir_comparator_func, file_comparator_func)
  }
  DirTreeNode.prototype.sort_ = function(dir_comparator_func, file_comparator_func) {
    if (file_comparator_func)
      this.files.sort(file_comparator_func)
    if (dir_comparator_func)
      this.dirs.sort(dir_comparator_func)
    this.dirs.forEach(function(dir) {
      dir.sort_(dir_comparator_func, file_comparator_func)
    })
  }
  DirTreeNode.prototype.search = function(idr, edr, ifr, efr) {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    switch (idr) {
      case undefined:
      case null:
        idr = /.*/
        break
      default:
        if (!(idr instanceof RegExp))
          throw new Error('Invalid 1st argument: idr should be either undefined or null or a RegExp Object!')
    }
    switch (edr) {
      case undefined:
      case null:
        edr = /^$/
        break
      default:
        if (!(idr instanceof RegExp))
          throw new Error('Invalid 2nd argument: edr should be either undefined or null or a RegExp Object!')
    }
    switch (ifr) {
      case undefined:
      case null:
        ifr = /.*/
        break
      default:
        if (!(idr instanceof RegExp))
          throw new Error('Invalid 3rd argument: ifr should be either undefined or null or a RegExp Object!')
    }
    switch (efr) {
      case undefined:
      case null:
        efr = /^$/
        break
      default:
        if (!(idr instanceof RegExp))
          throw new Error('Invalid 4th argument: efr should be either undefined or null or a RegExp Object!')
    }
    var temp_parent = {
      dirs: [],
      files: [],
      unread_paths: [],
      path_from_root: '',
      no_of_total_files: 0,
      no_of_total_dirs: 0,
      no_of_total_unread_paths: 0,
      size: 0,
      match_found: false
    }
    this.search_(idr, edr, ifr, efr, temp_parent)
    if (temp_parent.match_found) {
      temp_parent.dirs[0].parent = null
      return temp_parent.dirs[0]
    } else
      return null
  }
  DirTreeNode.prototype.search_ = function(idr, edr, ifr, efr, parent_obj) {
    edr.lastIndex = 0
    if (edr.test(this.path_from_root))
      return
    var dir_obj = new DirTreeNode(this)
    idr.lastIndex = 0
    if (idr.test(this.path_from_root)) {
      this.files.forEach(function(file) {
        efr.lastIndex = ifr.lastIndex = 0
        if (efr.test(file.path_from_root) || !ifr.test(file.path_from_root))
          return
        var file_obj = new DirTreeNode(file)
        dir_obj.files.push(file_obj)
        file_obj.parent = dir_obj
        dir_obj.size += file.size
        dir_obj.match_found = true
      })
    }
    dir_obj.size_of_files = dir_obj.size
    this.dirs.forEach(function(dir) {
      dir.search_(idr, edr, ifr, efr, dir_obj)
    })
    if (dir_obj.match_found) {
      parent_obj.dirs.push(dir_obj)
      dir_obj.parent = parent_obj
      parent_obj.match_found = true
      parent_obj.no_of_total_dirs += 1 + dir_obj.no_of_total_dirs
      dir_obj.no_of_total_files += dir_obj.files.length
      parent_obj.no_of_total_files += dir_obj.no_of_total_files
      parent_obj.size += dir_obj.size
    }
  }
  DirTreeNode.prototype.fileless_tree = function(indent) {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    return indent == undefined ? this.fileless_tree_('\n') : indent + this.fileless_tree_('\n' + indent)
  }
  DirTreeNode.prototype.fileless_tree_ = function(prefix) {
    switch (this.dirs.length) {
      case 0:
        return this.name
      case 1:
        return this.name + prefix + '└──' + this.dirs[0].fileless_tree_(prefix + '   ')
      default:
        return this.name +
          this.dirs.slice(0, -1).map(function(d) { return prefix + '├──' + d.fileless_tree_(prefix + '│  ') }).join('') +
          prefix + '└──' + this.dirs.slice(-1)[0].fileless_tree_(prefix + '   ')
    }
  }
  DirTreeNode.prototype.dir_search = function(idr, edr) {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    switch (idr) {
      case undefined:
      case null:
        idr = /.*/
        break
      default:
        if (!(idr instanceof RegExp))
          throw new Error('Invalid 1st argument: idr should be either undefined or null or a RegExp Object!')
    }
    switch (edr) {
      case undefined:
      case null:
        edr = /^$/
        break
      default:
        if (!(idr instanceof RegExp))
          throw new Error('Invalid 2nd argument: edr should be either undefined or null or a RegExp Object!')
    }
    var ret_obj = {dirs:[], size: 0}
    var hits = []
    var func = function(e) {
      edr.lastIndex = 0
      if (edr.test(e.path_from_root))
        return
      idr.lastIndex = 0
      if (idr.test(e.path_from_root))
        hits.push(e)
      e.dirs.forEach(func)
    }
    func(this)
    return hits
  }
  DirTreeNode.prototype.total_unread_paths = function(arr) {
    if (!this.is_a_dir) throw new Error('Not a Directory!')
    var arr = []
    this.total_unread_paths_(arr)
    return arr
  }
  DirTreeNode.prototype.total_unread_paths_ = function(arr) {
    Array.prototype.push.apply(arr, this.unread_paths)
    this.dirs.forEach(function(dir) {
      dir.total_unread_paths_(arr)
    })
  }
  var barrier = 0
  var counter = 0
  var start_returning = false
  var root_dtn = new DirTreeNode()
  function done() {
    if (++counter == barrier) {
      root_dtn.parent = null
      if (!root_dtn.is_a_dir)
        cb(new Error('Not a Directory!'), null)
      else {
        root_dtn.sort()
        cb(null, root_dtn)
      }
    }
  }
  function process_path(dtn, path, basename, parent) {
    if (start_returning)
      return
    ++barrier
    dtn.parent = parent
    dtn.path = path
    dtn.name = basename
    dtn.path_from_root = p.join(parent.path_from_root, basename + '/').replace(/[\\/]$/, '')
    fs.stat(path, function(err, stats) {
      if (err) {
        parent.unread_paths.push(dtn.path_from_root)
        var temp_parent = parent
        do {
          ++temp_parent.no_of_total_unread_paths
        } while (temp_parent = temp_parent.parent)
        done()
        return
      }
      dtn.created_on = stats.birthtime
      dtn.modified_on = stats.mtime
      if (dtn.is_a_dir = stats.isDirectory()) {
        dtn.size = 0
        dtn.size_of_files = 0
        dtn.files = []
        dtn.dirs = []
        dtn.unread_paths = []
        dtn.no_of_total_files = 0
        dtn.no_of_total_dirs = 0
        dtn.no_of_total_unread_paths = 0
        parent.dirs.push(dtn)
        var temp = dtn.parent
        do {
          ++temp.no_of_total_dirs
        } while (temp = temp.parent)
        fs.readdir(path, function(err, basenames) {
          if (err) {
            parent.unread_paths.push(dtn.path_from_root)
            var temp_parent = parent
            do {
              ++temp_parent.no_of_total_unread_paths
            } while (temp_parent = temp_parent.parent)
            done()
            return
          }
          basenames.forEach(function(basename) {
            process_path(new DirTreeNode(), p.join(path, basename), basename, dtn)
          })
          done()
        })
      } else if (stats.isFile()) {
        dtn.size = stats.size
        parent.files.push(dtn)
        var temp = dtn.parent
        temp.size_of_files += dtn.size
        do {
          ++temp.no_of_total_files
          temp.size += dtn.size
        } while (temp = temp.parent)
        done()
      } else
        done()
    })
  }
  try {
    process_path(root_dtn, p.resolve(path), p.basename('/' + path), {
      dirs: [],
      files: [],
      unread_paths: [],
      path_from_root: '',
      no_of_total_files: 0,
      no_of_total_dirs: 0,
      no_of_total_unread_paths: 0,
    })
  } catch (error) {
    start_returning = true
    cb(error, null)
  }
}