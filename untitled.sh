
#!/bin/bash  
echo "进入目标目录"
cd ./client-cdn/zlt-tdk/publish-assets
echo "删除旧版本文件"
rm -rf ./project.mainfest
rm -rf ./res
rm -rf ./src
rm -rf version.mainfest
echo "删除旧版本成功"

echo "开始解压更新文件"
unzip update.zip
mv ./update/project.manifest ./
mv ./update/project.manifest ./
mv ./update/res ./
mv ./update/src ./
echo "解压成功"
echo "删除更新文件包"
rm -rf update
rm -rf update.zip



