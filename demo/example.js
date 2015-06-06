var dir_tree = require('dir_tree')

dir_tree(__dirname + '/MOVIES', function(error, root_dtn) {

  if (error) {
    console.log(error)
    return
  }


  var a_file_dtn = root_dtn.files[0]
  console.log('\nLet\'s take a file,\n\n  ' + a_file_dtn.name + '\n\nThis file is at the path,\n\n  ' + a_file_dtn.path_from_root)


  console.log('\n--------------------\n')
  console.log('The name of the root dir is:\n\n  ' + root_dtn.name)


  console.log('\n--------------------\n')
  console.log('The no of the direct descendant files to the root dir is:\n\n  ' + root_dtn.files.length)
  console.log('\nCLI command:\n\n  dtree  MOVIES  -nof')
  console.log('\n  > -nof is short for -no-of-files')


  console.log('\n--------------------\n')
  console.log('The no of the direct descendant dirs to the root dir is:\n\n  ' + root_dtn.dirs.length)
  console.log('\nCLI command:\n\n  dtree  MOVIES  -nod')
  console.log('\n  > -nod is short for -no-of-dirs')


  console.log('\n--------------------\n')
  console.log('The no of both the direct & the indirect descendant files to the root dir is:\n\n  ' + root_dtn.no_of_total_files)
  console.log('\nCLI command:\n\n  dtree  MOVIES  -notf')
  console.log('\n  > -notf is short for -no-of-total-files')


  console.log('\n--------------------\n')
  console.log('The no of both the direct & the indirect descendant dirs to the root dir is:\n\n  ' + root_dtn.no_of_total_dirs)
  console.log('\nCLI command:\n\n  dtree  MOVIES  -notd')
  console.log('\n  > -notd is short for -no-of-total-dirs')


  console.log('\n--------------------\n')
  var valid_creation_order = root_dtn.dirs_creation_order()
  console.log('A Valid dirs creation order for the MOVIES dir:\n\n  ' + valid_creation_order.join('\n  '))
  console.log('\nCLI command:\n\n  dtree  MOVIES  -dco')
  console.log('\n  > -dco is short for -dirs-creation-order')


  console.log('\n--------------------\n')
  console.log('And, here is the dir tree:\n')
  console.log(root_dtn.tree('  '))
  console.log('\nCLI command:\n\n  dtree  MOVIES')


  console.log('\n--------------------\n')
  console.log('Let\'s put aside the tv shows & the subtitles:\n')
  var resultant_dtn = root_dtn.search(null, /(tv shows)|(subs)/gi, null, null)
  console.log(resultant_dtn.tree('  '))
  console.log('\nCLI command:\n\n  dtree  MOVIES  -ff  -edr-gi  "(tv shows)|(subs)"')
  console.log('\n  > -ff is short for -find-files.')
  console.log('\n  > -edr is acronym of exclude dir regex.')
  console.log('\n  > g & i suggest global match & ignore case.')


  console.log('\n--------------------\n')
  console.log('Now, let\'s arrange the movies yearwise:\n')

  resultant_dtn.sort(null, function(f1, f2) {
    return +f1.name.split(/\[(\d{4})\]/)[1] - +f2.name.split(/\[(\d{4})\]/)[1]
  })
  console.log(resultant_dtn.tree('  '))


  console.log('\n--------------------\n')
  console.log('Let\'s sort the movies back alphabetically!\n')
  resultant_dtn.sort()
  console.log(resultant_dtn.tree('  '))
  console.log('CLI:\n\n  The files & the dirs are always sorted alphabetically.')


  console.log('\n--------------------\n')
  console.log('From the above ones, let\'s find the movies of the 20th century:\n')
  resultant_dtn = resultant_dtn.search(null, null, /^.*\[19\d\d\].*$/, null)
  console.log(resultant_dtn.tree('  '))
  console.log('\nCLI command:\n\n  dtree  MOVIES  -ff  -edr-gi  "(tv shows)|(subs)"  -ifr  "^.*\\[19\\d\\d\\].*$')
  console.log('\n  > -ifr is acronym of include file regex.')


  console.log('\n--------------------\n')
  console.log('Let\'s get a JSON-serializable representation of the tree above:')
  console.log('\n  ' + JSON.stringify(resultant_dtn.serial(), null, 2).replace(/\n/g, '\n  '))


  console.log('\n--------------------\n')
  console.log('Of those 20th century movies, let\'s find the movies not having a "Lion" in it!:\n')
  resultant_dtn = resultant_dtn.search(null, null, null, /^.*LiON.*$/i)
  console.log(resultant_dtn.tree('  '))
  console.log('\nCLI command:\n\n  dtree  MOVIES  -ff  -edr-gi  "(tv shows)|(subs)"  -ff  -ifr-g  "19\\d\\d"  -ff  -efr-ig  "Lion"')
  console.log('\n  > -efr is acronym of exclude file regex.')
  console.log('\n  > See! We can reuse the search results on the CLI too!')


  console.log('\n--------------------\n')
  console.log('Alright! Let\'s just throw a last look at how the dirs were organized:\n')
  console.log(root_dtn.fileless_tree('  '))
  console.log('\nCLI command:\n\n  dtree  MOVIES  -ft')
  console.log('\n  > -ft is short for -fileless-tree.')


  console.log('\n--------------------\n')
  console.log('That\'s about it.\n\nTo know more on using the dir_tree module please refer the readme.\n\nTo know more on using the CLI tool, simply execute:\n\n  dtree\n')
})