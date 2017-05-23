import shutil


'''remote_server'''
remote_dir = 'E:/git-store/tinylepard-majiang/client-cdn/zlt-tdk/develop-assets/'
shutil.copyfile('./assets/project.manifest', remote_dir + 'project.manifest')
shutil.copyfile('./assets/version.manifest', remote_dir + 'version.manifest')

shutil.rmtree(remote_dir + 'src') 
shutil.copytree('./build/jsb-default/src', remote_dir + 'src')

shutil.rmtree(remote_dir + 'res') 
shutil.copytree('./build/jsb-default/res', remote_dir + 'res')