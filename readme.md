```
---------------------------
   T E R M I N O L O G Y
---------------------------

  Dir,
    is used as the short form for the word Directory.

  Files of a dir,
    means the direct descendant files of the dir.

  Total files of a dir,
    means both the direct & the indirect descendant files of the dir.

  Dirs of a dir,
    means the direct descendant dirs of the dir.

  Total dirs of a dir,
    means both the direct & the indirect descendant dirs of the dir.

  DTN,
    is used as the acronym of the words Dir Tree Node.

-----------------------------
   I N T R O D U C T I O N
-----------------------------

  This is a NodeJS module.
  It can create a 'tree' out of the stated dir path,
  which will be searchable, sortable & printable.

  The module exports a function:
  │
  └─function(target_dir_path, our_callback_func)
    │
    ├─target_dir_path     --> a string: path of the target directory
    │
    └─our_callback_func   --> a Function
      │
      └─function(error, DTN)
        │
        ├─error           --> an Error
        │
        └─DTN             <-- This one is imp

---------------
   U S A G E
---------------

  var dir_tree = require('dir_tree')

  dir_tree(target_dir_path, function(error, DTN) {

    if (error) {
      console.log(error)
      return
    }

    // The DTN Object is the tree.
    // Its properties & methods are discussed below.

  }

-------------------------
   P R O P E R T I E S
-------------------------

[01] DTN.path_from_root
     ------------------

  A string.

  It is the path of the DTN starting from the root directory.

[02] DTN.path
     --------

  A string.

  It is the absolute path of the DTN.

[03] DTN.name
     --------

  A string.

  It is the name of the DTN.

[04] DTN.is_a_dir
     ------------

  A boolean.

  For a dir type DTN, it is true, otherwise it is false.

[05] DTN.files
     ---------

  An Array of file type DTNs.

  For a dir type DTN, they are the "files of the dir".

[06] DTN.dirs
     --------

  An Array of dir type DTNs.

  For a dir type DTN, they are the "dirs of the dir".

[07] DTN.size
     --------

  An integer >= 0.

  For a file type DTN, it is the size of the file, in bytes.

  For a dir type DTN, it is the sum of the sizes of the "total files of
  the dir", in bytes.

[08] DTN.size_of_files
     -----------------

  An integer >= 0.

  For a dir type DTN, it is the sum of the sizes of the "files of the dir",
  in bytes.

[09] DTN.no_of_total_files
     ---------------------

  An integer >= 0.

  For a dir type DTN, it is the no of the "total files of the dir".

[10] DTN.no_of_total_dirs
     --------------------

  An integer >= 0.

  For a dir type DTN, it is the no of the "total dirs of the dir".

[11] DTN.created_on
     ---------------

  A Date.

  It is the creation time of the DTN.

[12] DTN.modified_on
     ---------------

  A Date.

  It is the modification time of the DTN.

[13] DTN.parent
     ----------

  A DTN.

  Each DTN has a parent dir type DTN (as in each file/dir has a parent dir),
  except the root DTN.

[14] DTN.unread_paths
     ----------------

  An Array of strings.

  For a dir type DTN, these are the direct descendant paths to the dir
  that resulted in error when attempted to read.

  These paths start from the root.

[15] DTN.no_of_total_unread_paths
     ----------------------------

  An integer >= 0.

  For a dir type DTN, this is the no of both the direct and the indirect
  descendant paths to the dir that resulted in error when attempted to read.

-------------------
   M E T H O D S
-------------------

  Note:
  ----

    The following methods are intended to be used only on the dir type DTNs.
    They will throw a 'Not a Directory!' Error if such is not the case.

[01] DTN.total_files()
     ---------------

  Used to find the "total files of the dir".

  Returns Array of Objects:

    FA_S: [
      // Let's call this structure the Files-Array Structure

      {
        path_from_root: string,
          // path of the file starting from the root
        path: string,
          // absolute path of the file
        name: string,
          // name of the file
        size: integer,
          // size of the file
        created_on: Date,
          // time the file was created
        modified_on: Date
          // time the file was modified
      },
      ...
    ]

[02] DTN.serial()
     -------------

  Used to get a JSON-serializable Object equivalent to the DTN.

  Returns an Object having the following structure:

    SDTN_S: {
      // Let's call this structure the Serialized-Dir-Tree-Node Structure

      path_from_root: string,
        // path of the dir staring from the root
      path: string,
        // absolute path of the dir
      name: string,
        // name of the dir
      size: integer,
        // sum of the sizes of the "total files of the dir"
      size_of_files: integer,
        // sum of the sizes of the "files of the dir"
      no_of_total_files: integer,
        // the no of the "files of the dir"
      no_of_total_dirs: integer,
        // the no of the "dirs of the dir"
      created_on: Date,
        // creation time of the dir
      modified_on: Date,
        // modification time of the dir
      no_of_total_unread_paths: integer,
        // the no of the direct & the indirect descendant paths to the
        // the dir that couldn't be read
      unread_paths: [ strings, ... ],
        // the direct descendant paths to the dir that couldn't be read
      files: FA_S,
        // the direct descendant files to the dir
      dirs: [ SDTN_S, ... ]
        // the direct descendant dirs to the dir, dubbed in SDTN_S
    }

[03] DTN.dirs_creation_order()
     -----------------------

  Used to find the valid creation order of the "total dirs of the dir".

  To replicate a dir hierarchy, we must create its dirs in a valid order,
  as in, the parent dir must exist before it can have any child dirs in it.

  Thus this command gives the direct & the indirect descendant dir paths
  arranged in a valid creation order.

  Returns an Array of strings.

[04] DTN.tree([indent])
     --------  ------

  Used to generate the 'print ready' tree of the DTN.
  The indent is a string that will be used to fill the left side of the tree.

  Returns a string - A printable dir tree.

[05] DTN.fileless_tree([indent])
     -----------------  ------

  Used to generate a 'hollow' tree of the DTN ie, one w/o any files.
  The indent is a string that will be used to fill the left side of the tree.

  Returns a string - A printable dir tree.

[06] DTN.search(idr, edr, ifr, efr)
     ---------- ---  ---  ---  ---

  Used to search the dir for files, using patterns.
  Please mind that the patterns test the DTN.path_from_root property.

  Let's call,
    idr - include dir regex
    edr - exclude dir regex
    ifr - include file regex
    efr - exclude file regex

  File searching logic:
  ---------------------

    A dir will be searched only if it's not excluded. (its path isnt like edr)
      An excluded dir will not be searched at all.

    After that, if the dir is not included (path isnt like idr),
      then the "files of this dir" will be skipped.
      Though the "dirs of this dir" will be considered for search.

    Whenever a compatible dir is found (path is idr-edr passed),
      each of the "files of this dir" is tested:
        to be not excluded (path isn't like efr) and
        to be included (path is like ifr).
      If so then the file is considered a successful match.

  If you do not want to utilize some argument, pass null or undefined instead.

  If no files match,

    Returns null.

  Otherwise,

    Returns a DTN, of the same dir path as of the DTN whose search()
    was invoked. Difference being, the returned DTN will have only
    the targeted files.

[07] DTN.dir_search(idr, edr)
     -------------- ---  ---

  Used to search the dir for dirs, using patterns.
  Please mind that the patterns test the DTN.path_from_root property.

  Let's call,
    idr - include dir regex
    edr - exclude dir regex

  Dir searching logic:
  --------------------

    A dir will be searched only if it's not excluded. (its path isn't like edr)
      An excluded dir will not be searched at all.

    After that, if the dir is included (path is like idr),
      it will be remembered.
      & then the "dirs of this dir" will be searched.

  If you do not want to utilize some argument, pass null or undefined instead.

  Returns an Array of dir type DTNs.

[08] DTN.sort(dir_comparator_func, file_comparator_func)
     -------- -------------------  --------------------

  Used to custom sort the dirs & the files.

  The dir_comparator_func will sort the "dirs of the DTN dir" & the "dirs of
  each of the total dirs of the DTN dir".

  The file_comparator_func will sort the "files of the DTN dir" & the "files
  of each of the total dirs of the DTN dir".

  If some comparator_func isn't specified, alphabetical sort will be performed
  instead.

  Please mind that this method does affect the DTN Objects because,
  the DTN.files & the DTN.dirs both Arrays will be shuffled internally
  for the DTN dir itself & each of the "total dirs of the DTN dir".

  Note:
  ----

    The first time when the root DTN is handed over via the callback,
    these both Arrays will have been sorted already in the alphabetical order.

  Returns nothing.

[09] DTN.total_unread_paths()
     ----------------------

  This method returns the direct & the indirect descendant paths to the dir
  that resulted in error when attempted to read.

  These paths start from the root.

  Returns an Array of strings.

----------------------------
   A  C.L.I.  T H I N G Y
----------------------------

  There's also a CLI tool in the package, named:

    dtree

  It can do a few things, such as:

    Printing a tree for the stated dir.

    Searching for files or dirs using patterns.

    Re-searching the file search results, which are again file searchable.

    Listing statistics such as:

      The direct and/or indirect descendant files & dirs.

      Their counts, sizes in bytes, creation & modification times.

    Finding a valid order of creating dirs inside the stated dir.

    Printing the hollow dir tree ie, one not showing any files.

    Etc.

  To know more on using the CLI tool, simply execute:

    dtree

  Finally, you may want to have a look at the demo example packaged inside.

```
